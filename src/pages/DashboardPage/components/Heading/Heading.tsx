import { FC, ReactNode } from 'react';
import classNames from 'classnames';

import styles from './Heading.module.scss';

interface HeadingProps {
  title: string;
  description?: ReactNode;
  className?: string;
}

const Heading: FC<HeadingProps> = ({ title, description, className }) => {
  return (
    <div className={classNames(styles.heading, className)}>
      <h3 className={styles.title}>{title}</h3>
      {description && description}
    </div>
  );
};

export default Heading;
