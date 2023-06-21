import classNames from 'classnames';

import { LoadingModal } from '@frakt/components/LoadingModal';
import Tooltip from '@frakt/components/Tooltip';

import { AppLayout } from '@frakt/components/Layout/AppLayout';
import TokenField from '@frakt/components/TokenField';
import Button from '@frakt/components/Button';
import { SOL_TOKEN } from '@frakt/utils';

import { colorByPercentOffers, getColorByPercent } from '@frakt/utils/bonds';
import { SliderGradient } from './components/SliderGradient/SliderGradient';
import CollectionGereralInfo from './components/CollectionGereralInfo';
import OrderBook from '../MarketsPage/components/OrderBook/OrderBook';
import RadioButtonField from './components/RadioButtonField';
import SizeField from './components/SizeField/SizeField';
import TotalOverview from './components/TotalOverview';
import { Header } from './components/Header';
import { useOfferPage } from './hooks';
import { OfferTypes } from './types';
import {
  EARNER_INTEREST_OPTIONS,
  OFFER_TYPE_OPTIONS,
  MAX_LIMIT_INTEREST,
  RECEIVE_OPTIONS,
} from './constants';

import styles from './OfferPage.module.scss';

export const OfferPage = () => {
  const {
    loadingModalVisible,
    closeLoadingModal,
    ltv,
    duration,
    offerSize,
    interest,
    onLtvChange,
    onOfferSizeChange,
    onInterestChange,
    onCreateOffer,
    isValid,
    isEdit,
    goBack,
    walletSolBalance,
    market,
    isLoading,
    onEditOffer,
    onRemoveOffer,
    autocompoundFeature,
    onChangeAutocompoundFeature,
    receiveNftFeature,
    onChangeReceiveNftFeature,
    onMaxLoanValueChange,
    maxLoanValue,
    onOfferTypeChange,
    offerType,
    isOfferHasChanged,
    notChangebleUserSize,
  } = useOfferPage();

  const isMaxLimitInterest = parseFloat(interest) > MAX_LIMIT_INTEREST;
  const apr = (parseFloat(interest) / duration) * 365;

  const availableMaxBalance = (
    parseFloat(notChangebleUserSize) +
    walletSolBalance / 1e9
  ).toFixed(3);

  const notEnoughDepositError =
    parseFloat(availableMaxBalance) < parseFloat(offerSize);

  return (
    <AppLayout>
      <div className={styles.poolsCreation}>
        <Header
          className={styles.headerWrapper}
          title={isEdit ? 'Offer editing' : 'Offer creation'}
          onBackBtnClick={goBack}
        />

        <div className={styles.block}>
          <CollectionGereralInfo market={market} loading={isLoading} />
          <RadioButtonField
            label="Offer type"
            currentOption={{
              label: offerType,
              value: offerType,
            }}
            onOptionChange={onOfferTypeChange}
            options={OFFER_TYPE_OPTIONS}
          />

          {offerType === OfferTypes.FIXED && (
            <TokenField
              label="Loan Value"
              value={maxLoanValue}
              onValueChange={onMaxLoanValueChange}
              labelRightNode={createLTVFieldRightLabel(ltv)}
              currentToken={SOL_TOKEN}
            />
          )}

          {offerType === OfferTypes.FLOOR && (
            <>
              <SliderGradient value={ltv} setValue={onLtvChange} />
              <TokenField
                value={maxLoanValue}
                onValueChange={onMaxLoanValueChange}
                label="Max limit"
                placeholder="0"
                currentToken={SOL_TOKEN}
              />
            </>
          )}

          <div className={styles.fieldWrapper}>
            <SizeField
              value={offerSize}
              onValueChange={onOfferSizeChange}
              label="SIZE"
              currentToken={SOL_TOKEN}
              lpBalance={parseFloat((walletSolBalance / 1e9).toFixed(3))}
              availableMaxBalance={availableMaxBalance}
              toolTipText="Amount of SOL you want to lend for a specific collection at the chosen LTV & APY"
            />
            <div className={styles.errors}>
              {notEnoughDepositError && <p>not enough SOL </p>}
            </div>
          </div>

          <div className={styles.fieldWrapper}>
            <>
              <TokenField
                value={interest}
                onValueChange={onInterestChange}
                label="Interest"
                labelRightNode={createIntrestFieldRihtLabel(apr)}
                error={isMaxLimitInterest}
                currentToken={{
                  ...SOL_TOKEN,
                  symbol: '%',
                  logoURI: null,
                  name: null,
                }}
                toolTipText="Interest (in %) for the duration of this loan"
              />
              <div className={styles.errors}>
                {isMaxLimitInterest && (
                  <p>max interest rate is {MAX_LIMIT_INTEREST}%</p>
                )}
              </div>
            </>

            <RadioButtonField
              label="Repayments"
              currentOption={{
                label: autocompoundFeature,
                value: autocompoundFeature,
              }}
              disabled={isEdit}
              onOptionChange={onChangeAutocompoundFeature}
              options={EARNER_INTEREST_OPTIONS}
              className={styles.radioWrapper}
              tooltipText="Lenders have an option to place same offer right after repayment together with earned interest"
            />
            <RadioButtonField
              label="Defaults"
              options={RECEIVE_OPTIONS}
              currentOption={{
                label: receiveNftFeature,
                value: receiveNftFeature,
              }}
              disabled={isEdit}
              onOptionChange={onChangeReceiveNftFeature}
              className={styles.radioWrapper}
              tooltipText="When funding full loans, lenders have the option to get defaulted NFTs instead of the SOL recovered from the liquidation"
            />
          </div>

          <TotalOverview
            size={parseFloat(offerSize)}
            interest={parseFloat(interest)}
            duration={duration}
          />
          <div className={styles.btnsWrapper}>
            {isEdit && (
              <>
                <Button
                  onClick={onRemoveOffer}
                  className={classNames(styles.btn, styles.btnDelete)}
                  type="primary"
                >
                  Delete offer
                </Button>
                <Button
                  disabled={isMaxLimitInterest || !isOfferHasChanged}
                  onClick={onEditOffer}
                  className={styles.btn}
                  type="secondary"
                >
                  Update offer
                </Button>
              </>
            )}
            {!isEdit && (
              <Button
                disabled={!isValid || isMaxLimitInterest}
                onClick={isEdit ? onEditOffer : onCreateOffer}
                className={styles.btn}
                type="secondary"
              >
                Place
              </Button>
            )}
          </div>
        </div>
      </div>
      {!isLoading && !!market && (
        <OrderBook
          market={market}
          syntheticParams={{
            ltv,
            offerSize: parseFloat(offerSize) * 1e9 || 0,
            interest: parseFloat(interest) || 0,
            durationDays: duration,
          }}
        />
      )}
      <LoadingModal
        title="Please approve transaction"
        visible={loadingModalVisible}
        onCancel={closeLoadingModal}
      />
    </AppLayout>
  );
};

const createLTVFieldRightLabel = (value = 0) => {
  const colorLTV =
    getColorByPercent(value, colorByPercentOffers) || colorByPercentOffers[100];

  return (
    <div className={styles.labelRow}>
      LTV: <span style={{ color: colorLTV }}>{(value || 0).toFixed(2)} %</span>
    </div>
  );
};

const createIntrestFieldRihtLabel = (value = 0) => (
  <div className={styles.labelRow}>
    APR: <span>{(value || 0).toFixed(2)} %</span>
    <Tooltip
      placement="bottom"
      overlay="Analyzed profit from repaying the loan"
    />
  </div>
);
