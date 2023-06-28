import { CSSProperties, FC, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import SidebarLayout from '@frakt/components/Sidebar';
import Button from '@frakt/components/Button';
import { PATHS } from '@frakt/constants';
import { Gamepad, StarAltFill, MoneyBill } from '@frakt/icons';
import { AdventuresInfo } from '@frakt/api/adventures';

import styles from './AdventuresSidebar.module.scss';
import { calcNftsPartnerPoints, isNftStaked } from '../../helpers';
import { useRaffleTicketsQuery } from '../../hooks';

const DOCS_LINK =
  'https://docs.frakt.xyz/frakt/holder-benefits/sustainable-passive-income-discounts-raffles-and-boosts';

interface AdventuresSidebarProps {
  adventuresInfo: AdventuresInfo;
  setNftsModalOpen: (nextValue: boolean) => void;
}

export const AdventuresSidebar: FC<AdventuresSidebarProps> = ({
  adventuresInfo,
  setNftsModalOpen,
}) => {
  const history = useHistory();
  const [minimizedOnMobile, setMinimizedOnMobile] = useState<boolean>(false);

  const { lotteryTickets } = useRaffleTicketsQuery();

  const createInAppRedirect = (url: string) => () => history.push(url);

  const { nfts } = adventuresInfo;

  const stakedNfts = useMemo(() => {
    return nfts.filter(isNftStaked);
  }, [nfts]);

  const partnerPoints = useMemo(
    () => calcNftsPartnerPoints(stakedNfts),
    [stakedNfts],
  );

  //TODO: Calc this values
  // const flipLoansDiscount = 0;
  const rewards = useMemo(() => {
    return 0;
  }, []);

  return (
    <>
      <SidebarLayout
        setVisible={() => setMinimizedOnMobile((prev) => !prev)}
        contentVisible={!minimizedOnMobile}
        isSidebarVisible={true}
        className={styles.layout}
      >
        <div className={styles.sidebar}>
          <div className={styles.section}>
            <Title text="My squad" icon={<Gamepad />} />

            <Info
              value={`${stakedNfts.length}/${nfts.length}`}
              text="Banx staked"
              button={{
                text: 'Manage',
                type: 'secondary',
                onClick: () => setNftsModalOpen(true),
              }}
            />

            <Info value={partnerPoints.toString()} text="partner points" />
          </div>

          <div className={styles.section}>
            <Title text="My benefits" icon={<StarAltFill />} />

            <Info
              value={`${lotteryTickets || ''}`}
              text="Raffle tickets"
              button={{
                text: 'Spend',
                onClick: createInAppRedirect(PATHS.LIQUIDATIONS),
              }}
            />

            {/* <Info
              value={`${flipLoansDiscount}%`}
              text="Discount on flip loans"
              button={{
                text: 'Borrow SOL',
                onClick: createInAppRedirect(PATHS.BORROW_LITE),
              }}
            /> */}
          </div>

          <div className={styles.section}>
            <Title text="My rewards" icon={<MoneyBill />} />

            <Info
              value={`${(rewards / 1e9).toFixed(2)}◎`}
              text="Total received"
              button={{
                text: 'Read the doc',
                onClick: () => window.open(DOCS_LINK),
              }}
            />
          </div>

          <div className={styles.section}>
            <div className={styles.warns}>
              <p>
                <ExclamationCircleOutlined />
                As your Banx stay in your wallet when used as collateral for a
                loan on Frakt they can be send in Adventures in parallel
              </p>
            </div>
          </div>
        </div>
      </SidebarLayout>
    </>
  );
};

interface TitleProps {
  text: string;
  icon?: JSX.Element;
}

const Title: FC<TitleProps> = ({ text, icon }) => (
  <h2 className={styles.title}>
    <div className={styles.titleIcon}>{icon}</div>
    <span>{text}</span>
  </h2>
);

interface InfoProps {
  value: string;
  text: string;
  textStyle?: CSSProperties;
  button?: {
    text: string;
    onClick: () => void;
    type?: 'primary' | 'secondary' | 'tertiary';
  };
}

const Info: FC<InfoProps> = ({ value, text, button, textStyle }) => (
  <div className={styles.infoWrapper}>
    <div className={styles.info}>
      <span>{value}</span>
      <span style={textStyle}>{text}</span>
    </div>
    {!!button && (
      <Button type={button?.type || 'tertiary'} onClick={button.onClick}>
        {button.text}
      </Button>
    )}
  </div>
);
