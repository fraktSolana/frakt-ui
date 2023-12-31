import { FC } from 'react';
import { DEFAULT_STANDART_INTEREST } from 'fbonds-core/lib/fbond-protocol/utils/cartManagerV2';

import RadioButtonField from '@frakt/pages/OfferPage/components/RadioButtonField';
import { StatInfo, VALUES_TYPES } from '@frakt/components/StatInfo';
import { LoadingModal } from '@frakt/components/LoadingModal';
import { InputErrorMessage } from '@frakt/components/Input';
import InputCounter from '@frakt/components/InputCounter';
import { BASE_POINTS } from '@frakt/utils/bonds';
import Button from '@frakt/components/Button';

import OfferActionButtons from './components/OfferActionButtons';
import { SyntheticParams } from '../OrderBookLite';
import { DEFAULTS_OPTIONS } from './constants';
import NumericInputField from '../NumericInput';
import { usePlaceOfferTab } from './hooks';

import styles from './PlaceOfferTab.module.scss';

const PlaceOfferTab = ({
  setSyntheticParams,
  pairPubkey,
  setPairPubkey,
  marketPubkey,
}: {
  marketPubkey: string;
  pairPubkey: string;
  setPairPubkey: (pubkey: string) => void;
  setSyntheticParams: (syntheticParams: SyntheticParams) => void;
}) => {
  const {
    isEdit,
    bondFeature,
    onBondFeatureChange,
    offerSize,
    onCreateOffer,
    onEditOffer,
    onRemoveOffer,
    loadingModalVisible,
    goToPlaceOffer,
    showDepositError,
    disablePlaceOffer,
    disableEditOffer,
    loanValueInputParams,
    loanAmountInputParams,
  } = usePlaceOfferTab(
    marketPubkey,
    setSyntheticParams,
    pairPubkey,
    setPairPubkey,
  );

  return (
    <div className={styles.content}>
      <OfferHeader isEdit={isEdit} goToPlaceOffer={goToPlaceOffer} />
      <div className={styles.radiobuttonsWrapper}>
        <RadioButtonField
          tooltipText="When funding full loans, lenders have the option to get defaulted NFTs instead of the SOL recovered from the liquidation"
          label="If full loan liquidated"
          currentOption={{
            label: `${bondFeature}`,
            value: bondFeature,
          }}
          className={styles.radio}
          onOptionChange={onBondFeatureChange}
          options={DEFAULTS_OPTIONS}
          disabled={isEdit}
          classNameInner={styles.radioButton}
        />
      </div>
      <div className={styles.fields}>
        <NumericInputField
          label="Offer"
          {...loanValueInputParams}
          hasError={showDepositError}
        />
        <InputCounter label="Number of loans" {...loanAmountInputParams} />
      </div>
      <InputErrorMessage hasError={showDepositError} message="Not enough SOL" />
      <OfferSummary offerSize={offerSize} />
      <OfferActionButtons
        isEdit={isEdit}
        onCreateOffer={onCreateOffer}
        onRemoveOffer={onRemoveOffer}
        onEditOffer={onEditOffer}
        disableEditOffer={disableEditOffer}
        disablePlaceOffer={disablePlaceOffer}
      />
      <LoadingModal visible={loadingModalVisible} />
    </div>
  );
};

export default PlaceOfferTab;

const OfferSummary: FC<{ offerSize: number }> = ({ offerSize }) => {
  const interest =
    (offerSize * (BASE_POINTS - DEFAULT_STANDART_INTEREST)) / BASE_POINTS || 0;

  return (
    <div className={styles.offerSummary}>
      <StatInfo label="Offer size" value={offerSize || 0} flexType="row" />
      <StatInfo
        label="Duration"
        value="7 days"
        flexType="row"
        valueType={VALUES_TYPES.string}
      />
      <StatInfo label="Estimated interest" value={interest} flexType="row" />
    </div>
  );
};

const OfferHeader = ({ isEdit, goToPlaceOffer }) => {
  const title = isEdit ? 'Offer editing' : 'Offer creation';

  return (
    <div className={styles.flexRow}>
      <h4 className={styles.title}>{title}</h4>
      {isEdit && (
        <Button onClick={goToPlaceOffer} type="tertiary">
          Exit edit mode
        </Button>
      )}
    </div>
  );
};
