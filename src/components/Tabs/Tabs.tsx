import { FC } from 'react';
import classNames from 'classnames';

import styles from './Tabs.module.scss';
import { sendAmplitudeData } from '../../utils/amplitude';

export interface Tab {
  label: string;
  value: string;
  disabled?: boolean;
  event?: string;
}

export interface TabsProps {
  tabs: Tab[];
  value: string;
  setValue: (value: string) => void;
  className?: string;
  additionalClassNames?: {
    tabClassName?: string;
    tabActiveClassName?: string;
  };
  type?: 'primary' | 'secondary' | 'unset';
  renderTip?: {
    tabValue: string;
    value: string;
  };
}

export const Tabs: FC<TabsProps> = ({
  tabs,
  value,
  setValue,
  className,
  additionalClassNames,
  type = 'primary',
  renderTip,
}) => {
  return (
    <div className={classNames(styles.tabsWrapper, className)}>
      {tabs.map(({ label, event, value: tabValue, disabled }) => (
        <button
          key={tabValue}
          className={classNames([
            { [styles.tab]: !additionalClassNames?.tabClassName },
            additionalClassNames?.tabClassName,
            styles[type],
            {
              [additionalClassNames?.tabActiveClassName ?? styles.tabActive]:
                tabValue === value,
            },
          ])}
          name={tabValue}
          onClick={() => {
            setValue(tabValue);
            event && sendAmplitudeData(event);
          }}
          disabled={disabled}
        >
          {label}
          {renderTip && renderTip.tabValue === tabValue ? (
            <div className={styles.tip}>{renderTip.value}</div>
          ) : null}
        </button>
      ))}
    </div>
  );
};
