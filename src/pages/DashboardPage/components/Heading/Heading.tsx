import { FC } from 'react';
import classNames from 'classnames';

import Tooltip from '@frakt/components/Tooltip';

import styles from './Heading.module.scss';

interface HeadingProps {
  title: string;
  tooltipText?: string;
  className?: string;
}

const Heading: FC<HeadingProps> = ({ title, tooltipText, className }) => {
  return (
    <div className={classNames(styles.heading, className)}>
      <h3 className={styles.title}>{title}</h3>
      {!!tooltipText && <Tooltip placement="bottom" overlay={tooltipText} />}
    </div>
  );
};

export default Heading;
