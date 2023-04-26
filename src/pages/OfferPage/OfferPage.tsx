import { FC } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import classNames from 'classnames';

import { LoadingModal } from '@frakt/components/LoadingModal';
import Tooltip from '@frakt/components/Tooltip';

import { AppLayout } from '@frakt/components/Layout/AppLayout';
import { RadioButton } from '@frakt/components/RadioButton';
import TokenField from '@frakt/components/TokenField';
import Button from '@frakt/components/Button';
import { SOL_TOKEN } from '@frakt/utils';

import { SliderGradient } from './components/SliderGradient/SliderGradient';
import CollectionGereralInfo from './components/CollectionGereralInfo';
import OrderBook from '../MarketsPage/components/OrderBook/OrderBook';
import SizeField from './components/SizeField/SizeField';
import { Header } from './components/Header';
import { useOfferPage } from './hooks';
import {
  DURATION_OPTIONS,
  EARNER_INTEREST_OPTIONS,
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
    onDurationChange,
    onOfferSizeChange,
    onInterestChange,
    handleInterestOnBlur,
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
  } = useOfferPage();

  const apr = (parseFloat(interest) / duration) * 365;

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
          <SliderGradient value={ltv} setValue={onLtvChange} />

          <TokenField
            value={maxLoanValue}
            onValueChange={onMaxLoanValueChange}
            label="Max limit"
            currentToken={SOL_TOKEN}
          />

          <div className={styles.radio}>
            <h6 className={styles.subtitle}>duration</h6>
            <RadioButton
              currentOption={{
                label: `${duration} days`,
                value: duration,
              }}
              onOptionChange={onDurationChange}
              options={DURATION_OPTIONS}
            />
          </div>
          <div className={styles.fieldWrapper}>
            <SizeField
              value={offerSize}
              onValueChange={onOfferSizeChange}
              label="SIZE"
              currentToken={SOL_TOKEN}
              lpBalance={parseFloat((walletSolBalance / 1e9).toFixed(3))}
              toolTipText="Amount of SOL you want to lend for a specific collection at the chosen LTV & APY"
            />
          </div>

          <div className={styles.fieldWrapper}>
            <TokenField
              value={interest}
              onValueChange={onInterestChange}
              onBlur={() => handleInterestOnBlur(interest)}
              label="Interest"
              labelRightNode={
                <div className={styles.labelRow}>
                  APR: <span>{(apr || 0).toFixed(2)} %</span>
                  <Tooltip
                    placement="bottom"
                    overlay={'Analyzed profit from repaying the loan'}
                  >
                    <QuestionCircleOutlined className={styles.questionIcon} />
                  </Tooltip>
                </div>
              }
              currentToken={{
                ...SOL_TOKEN,
                symbol: '%',
                logoURI: null,
                name: null,
              }}
              tokensList={[
                { ...SOL_TOKEN, symbol: '%', logoURI: null, name: null },
              ]}
              toolTipText="Interest (in %) for the duration of this loan"
            />
            <div className={classNames(styles.radio, styles.radioWrapper)}>
              <div className={styles.radioTitle}>
                <h6 className={styles.subtitle}>Repayments</h6>
                <Tooltip
                  placement="bottom"
                  overlay="Lenders have an option to place same offer right after repayment together with earned interest"
                >
                  <QuestionCircleOutlined className={styles.questionIcon} />
                </Tooltip>
              </div>
              <RadioButton
                currentOption={{
                  label: autocompoundFeature,
                  value: autocompoundFeature,
                }}
                disabled={isEdit}
                onOptionChange={onChangeAutocompoundFeature}
                options={EARNER_INTEREST_OPTIONS}
              />
            </div>
            <div className={classNames(styles.radio, styles.radioWrapper)}>
              <div className={styles.radioTitle}>
                <h6 className={styles.subtitle}>Defaults</h6>
                <Tooltip
                  placement="bottom"
                  overlay="When funding full loans, lenders have the option to get defaulted NFTs instead of the SOL recovered from the liquidation"
                >
                  <QuestionCircleOutlined className={styles.questionIcon} />
                </Tooltip>
              </div>
              <RadioButton
                currentOption={{
                  label: receiveNftFeature,
                  value: receiveNftFeature,
                }}
                disabled={isEdit}
                onOptionChange={onChangeReceiveNftFeature}
                options={RECEIVE_OPTIONS}
              />
            </div>
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
                disabled={!isValid}
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

interface TotalOverviewProps {
  size?: number;
  interest?: number;
  duration?: number;
}

const TotalOverview: FC<TotalOverviewProps> = ({
  size = 0,
  interest = 0,
  duration = 7,
}) => {
  const estProfit = size * (interest / 1e2);

  return (
    <div className={styles.total}>
      <h5 className={styles.blockTitle}>
        {(estProfit || 0).toFixed(2)} SOL in {duration} days
      </h5>
      <span className={styles.blockSubtitle}>estimated profit</span>
    </div>
  );
};
