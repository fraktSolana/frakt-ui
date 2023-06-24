import RadioButtonField from '@frakt/pages/OfferPage/components/RadioButtonField';
import { LoadingModal } from '@frakt/components/LoadingModal';
import { StatInfo, VALUES_TYPES } from '@frakt/components/StatInfo';
import Button from '@frakt/components/Button';

import { DEFAULTS_OPTIONS } from './constants';
import OfferActionButtons from './components/OfferActionButtons';
import NumericInputField from '../NumericInput';
import { usePlaceOfferTab } from './hooks';

import styles from './PlaceOfferTab.module.scss';
import { BASE_POINTS } from '@frakt/utils/bonds';
import { DEFAULT_STANDART_INTEREST } from 'fbonds-core/lib/fbond-protocol/utils/cartManagerV2';

const PlaceOfferTab = ({ setSyntheticParams }) => {
  const {
    isEdit,
    bondFeature,
    onBondFeatureChange,
    loanValueInput,
    loansAmountInput,
    offerSize,
    interest,
    onCreateOffer,
    onEditOffer,
    onRemoveOffer,
    loadingModalVisible,
    goToPlaceOffer,
    isOfferHasChanged,
  } = usePlaceOfferTab(setSyntheticParams);

  return (
    <div className={styles.content}>
      <OfferHeader isEdit={isEdit} goToPlaceOffer={goToPlaceOffer} />
      <div className={styles.radiobuttonsWrapper}>
        <RadioButtonField
          tooltipText="When funding full loans, lenders have the option to get defaulted NFTs instead of the SOL recovered from the liquidation"
          label="Defaults"
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
        <NumericInputField {...loanValueInput} />
        <NumericInputField
          {...loansAmountInput}
          integerOnly={true}
          showIcon={false}
          placeholder="0"
        />
      </div>
      <OfferSummary offerSize={offerSize} interest={interest} />
      <OfferActionButtons
        isEdit={isEdit}
        onCreateOffer={onCreateOffer}
        onRemoveOffer={onRemoveOffer}
        onEditOffer={onEditOffer}
        offerSize={offerSize}
        isOfferHasChanged={isOfferHasChanged}
      />
      <LoadingModal visible={loadingModalVisible} />
    </div>
  );
};

export default PlaceOfferTab;

const OfferSummary = ({ offerSize, interest }) => (
  <div className={styles.offerSummary}>
    <StatInfo label="Offer size" value={offerSize || 0} flexType="row" />
    <StatInfo
      label="Duration"
      value="7 days"
      flexType="row"
      valueType={VALUES_TYPES.string}
    />
    <StatInfo
      label="Estimated interest"
      value={
        (offerSize * (BASE_POINTS - DEFAULT_STANDART_INTEREST)) / BASE_POINTS ||
        0
      }
      flexType="row"
    />
  </div>
);

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
