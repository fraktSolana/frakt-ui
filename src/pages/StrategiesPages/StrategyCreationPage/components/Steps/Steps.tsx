import { FC, useState } from 'react';

import { Steps as AntSteps } from 'antd';
import Button from '@frakt/components/Button';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
import StepFour from './StepFour';
import { LoadingModal } from '@frakt/components/LoadingModal';
import { useSettingsPool } from '@frakt/pages/StrategiesPages/hooks/hooks';
// import { useStrategyCreation } from '@frakt/utils/strategies/transactions/useStrategyCreation';
import styles from './Steps.module.scss';

const { Step } = AntSteps;

const Steps: FC = () => {
  const [step, setStep] = useState(0);

  const handleNextStep = () => setStep((prev) => prev + 1);
  const handleBackStep = () => setStep((prev) => prev - 1);

  // const tradePool = useSettingsPool((state) => state.tradePool);

  // const {
  //   formValues,
  //   setFormValues,
  //   checkDisabled,
  //   onCreateStrategy,
  //   onUpdateStrategy,
  //   loadingModalVisible,
  //   closeLoadingModal,
  // } = useStrategyCreation(tradePool);

  return (
    <>
      {/* <AntSteps className={styles.stepsAnt} current={step}>
        <Step title="View parameters" />
        <Step title="Bonds parameters" />
        <Step title="Pricing parameters" />
        <Step title="Strategy parameters" />
      </AntSteps>

      <div className={styles.wrapper}>
        <div className={styles.container}>
          {step === 0 && (
            <StepOne
              className={styles.step}
              formValues={formValues}
              setFormValues={setFormValues}
            />
          )}
          {step === 1 && (
            <StepTwo
              className={styles.step}
              formValues={formValues}
              setFormValues={setFormValues}
            />
          )}
          {step === 2 && (
            <StepThree
              className={styles.step}
              formValues={formValues}
              setFormValues={setFormValues}
            />
          )}
          {step === 3 && (
            <StepFour
              className={styles.step}
              formValues={formValues}
              setFormValues={setFormValues}
            />
          )}
          <div className={styles.buttons}>
            {step !== 0 && (
              <Button
                className={styles.btn}
                type="primary"
                onClick={handleBackStep}
              >
                Previous
              </Button>
            )}

            {!!tradePool && (
              <Button
                className={styles.btn}
                type="secondary"
                onClick={onUpdateStrategy}
              >
                Update
              </Button>
            )}

            {!tradePool && step === 3 ? (
              <Button
                className={styles.btn}
                type="secondary"
                onClick={onCreateStrategy}
              >
                Create
              </Button>
            ) : null}

            {step !== 3 && (
              <Button
                className={styles.btn}
                type={!tradePool ? 'secondary' : 'primary'}
                onClick={handleNextStep}
                disabled={!checkDisabled[step]}
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
      <LoadingModal
        title="Please approve transaction"
        visible={loadingModalVisible}
        onCancel={closeLoadingModal}
      /> */}
    </>
  );
};

export default Steps;
