import { FC, useState } from 'react';

import { Steps as AntSteps } from 'antd';
import Button from '@frakt/components/Button';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
import StepFour from './StepFour';
import styles from './Steps.module.scss';
import { BondingCurveType } from 'fbonds-core/lib/bonds_trade_pool/types';

const { Step } = AntSteps;

const Steps: FC = () => {
  const [step, setStep] = useState(0);

  const handleNextStep = () => setStep((prev) => prev + 1);
  const handleBackStep = () => setStep((prev) => prev - 1);

  const [strategyName, setStrategyName] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');

  const [duration, setDuration] = useState<string>('7');
  const [maxLTV, setMaxLTV] = useState<number>(10);

  const [bondingCurve, setBondingCurve] = useState<BondingCurveType>(
    BondingCurveType.Linear,
  );
  const [spotPrice, setSpotPrice] = useState<string>('');
  const [bidCap, setBidCap] = useState<string>('');
  const [delta, setDelta] = useState<string>('');

  const [maxTradeAmount, setMaxTradeAmount] = useState<string>('');
  ///reserveFundsRatio = utilizationRate
  const [utilizationRate, setUtilizationRate] = useState<string>('');
  const [tradeDuration, setTradeDuration] = useState<string>('');
  const [tradeAmountRatio, setTradeAmountRatio] = useState<string>('');
  const [minTimeBetweenTrades, setMinTimeBetweenTrades] = useState<string>('');

  const deltaType = bondingCurve === BondingCurveType.Exponential ? '%' : 'SOL';

  const checkDisabled = {
    0: strategyName && imageUrl,
    1: duration && maxLTV,
    2: bondingCurve && spotPrice && bidCap && delta,
    3:
      maxTradeAmount &&
      utilizationRate &&
      tradeDuration &&
      tradeAmountRatio &&
      minTimeBetweenTrades,
  };

  return (
    <>
      <AntSteps className={styles.stepsAnt} current={step}>
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
              imageUrl={imageUrl}
              setImageUrl={setImageUrl}
              setStrategyName={setStrategyName}
            />
          )}
          {step === 1 && (
            <StepTwo
              className={styles.step}
              duration={duration}
              setDuration={setDuration}
              maxLTV={maxLTV}
              setMaxLTV={setMaxLTV}
            />
          )}
          {step === 2 && (
            <StepThree
              className={styles.step}
              bondingCurve={bondingCurve}
              setBondingCurve={setBondingCurve}
              spotPrice={spotPrice}
              setSpotPrice={setSpotPrice}
              bidCap={bidCap}
              setBidCap={setBidCap}
              delta={delta}
              setDelta={setDelta}
              deltaType={deltaType}
            />
          )}
          {step === 3 && (
            <StepFour
              className={styles.step}
              spotPrice={spotPrice}
              maxLTV={maxLTV}
              duration={duration}
              delta={delta}
              deltaType={deltaType}
              bidCap={bidCap}
              maxTradeAmount={maxTradeAmount}
              setMaxTradeAmount={setMaxTradeAmount}
              utilizationRate={utilizationRate}
              setUtilizationRate={setUtilizationRate}
              tradeDuration={tradeDuration}
              setTradeDuration={setTradeDuration}
              tradeAmountRatio={tradeAmountRatio}
              setTradeAmountRatio={setTradeAmountRatio}
              minTimeBetweenTrades={minTimeBetweenTrades}
              setMinTimeBetweenTrades={setMinTimeBetweenTrades}
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

            <Button
              className={styles.btn}
              type="secondary"
              onClick={handleNextStep}
              // disabled={!checkDisabled[step]}
            >
              {step === 3 ? 'Create' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Steps;
