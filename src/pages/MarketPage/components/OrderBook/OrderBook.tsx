import { FC, useState } from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames/bind';
import { useWallet } from '@solana/wallet-adapter-react';
import { web3 } from 'fbonds-core';
import Button from '@frakt/components/Button';
import Offer from '../Offer/Offer';
import Toggle from '@frakt/components/Toggle';
import { Loader } from '@frakt/components/Loader';
import { makeRemoveOrderTransaction } from '@frakt/utils/bonds';
import { signAndConfirmTransaction } from '@frakt/utils/transactions';
import { useMarketOrders } from './hooks';
import { PATHS } from '@frakt/constants';
import { MarketOrder } from './types';
import { Chevron } from '@frakt/iconsNew/Chevron';
import styles from './OrderBook.module.scss';

interface OrderBookProps {
  marketPubkey: string;
  hideCreateBtn?: boolean;
  maxLTV: number;
  solFee: number;
  solDeposit: number;
}

const OrderBook: FC<OrderBookProps> = ({
  marketPubkey,
  hideCreateBtn = false,
  maxLTV,
  solFee,
  solDeposit,
}) => {
  const wallet = useWallet();

  const [openOffersMobile, setOpenOffersMobile] = useState<boolean>(false);
  const toggleOffers = () => setOpenOffersMobile(!openOffersMobile);

  const removeOrder = (order: MarketOrder) => async () => {
    try {
      //TODO: Replace to mainnet(hook) when contract appears on mainnet
      const connection = new web3.Connection('https://api.devnet.solana.com');

      const { transaction, signers } = await makeRemoveOrderTransaction({
        pairPubkey: new web3.PublicKey(order.rawData.publicKey),
        authorityAdapter: new web3.PublicKey(order.rawData.authorityAdapter),
        edgeSettlement: order.rawData.edgeSettlement,
        wallet,
        connection,
      });

      await signAndConfirmTransaction({
        connection,
        transaction,
        signers,
        wallet,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(error?.logs?.join('\n'));
      console.error(error);
    }
  };

  const isOwnOrder = (order: MarketOrder) =>
    order?.rawData?.assetReceiver === wallet?.publicKey?.toBase58();

  const [showOwnOrders, setShowOwnOrders] = useState(false);
  //TODO: Implement sorting
  const [sort, setSort] = useState<'asc' | 'desc'>('desc');

  const handleSort = () => {
    sort === 'desc' ? setSort('asc') : setSort('desc');
  };

  const { orders, isLoading } = useMarketOrders({
    marketPubkey: new web3.PublicKey(marketPubkey),
    sortDirection: sort,
    walletOwned: showOwnOrders,
    ltv: maxLTV,
    size: solDeposit,
    interest: solFee,
  });

  const bestOfferCheck = () => {
    if (sort === 'desc') {
      return !orders.at(0).rawData ? orders.at(1) : orders.at(0);
    }
    return !orders.at(-1).rawData ? orders.at(-2) : orders.at(-1);
  };

  const isBestOffer = bestOfferCheck();

  return (
    <div
      className={classNames(styles.orderBook, {
        [styles.active]: openOffersMobile,
        [styles.create]: hideCreateBtn,
      })}
    >
      <div
        className={classNames(styles.roundBtn, styles.btnChevron, {
          [styles.active]: openOffersMobile,
        })}
        onClick={toggleOffers}
      >
        <Chevron />
      </div>

      <div
        className={classNames(styles.header, {
          [styles.active]: openOffersMobile,
          [styles.create]: hideCreateBtn,
        })}
      >
        <h5 className={styles.title}>Offers</h5>
        <Toggle
          label="My pools only"
          className={classNames(styles.toggle, {
            [styles.active]: openOffersMobile,
          })}
          defaultChecked={showOwnOrders}
          onChange={(nextValue) => setShowOwnOrders(nextValue)}
        />
        <div
          className={classNames(styles.column, {
            [styles.active]: openOffersMobile,
            [styles.create]: hideCreateBtn,
          })}
        >
          <div className={styles.colName}>SIZE (fndSMB)</div>
          <div
            className={classNames(styles.colName, {
              [styles.sort]: sort === 'asc',
            })}
            onClick={handleSort}
          >
            INTEREST (SOL)
          </div>
        </div>
      </div>

      <div
        className={classNames(styles.content, {
          [styles.active]: openOffersMobile,
          [styles.create]: hideCreateBtn,
        })}
      >
        {isLoading ? (
          <Loader
            size="default"
            className={classNames(styles.loader, {
              [styles.active]: openOffersMobile,
              [styles.create]: hideCreateBtn,
            })}
          />
        ) : (
          <ul
            className={classNames(styles.list, {
              [styles.create]: hideCreateBtn,
              [styles.active]: openOffersMobile,
            })}
          >
            {orders.map((order, i) => (
              <Offer
                ltv={order.ltv}
                size={order.size}
                interest={order.interest}
                order={order}
                isBestOffer={isBestOffer}
                removeOrder={removeOrder}
                isOwnOrder={isOwnOrder}
                key={i + order.interest}
              />
            ))}
          </ul>
        )}
        {!hideCreateBtn && (
          <NavLink to={`${PATHS.BOND}/${marketPubkey}/create`}>
            <Button className={styles.btn} type="secondary">
              Place offers
            </Button>
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default OrderBook;
