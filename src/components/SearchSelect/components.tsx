import { SearchOutlined } from '@ant-design/icons';
import Button from '../Button';

import styles from './SearchSelect.module.scss';

export const PrefixInput = () => (
  <div className={styles.prefix}>
    <SearchOutlined />
  </div>
);

export const SelectLabels = ({ labels = [] }) => (
  <div className={styles.labels}>
    {labels.map((label) => (
      <span>{label}</span>
    ))}
  </div>
);

export const CollapsedContent = ({ onClick }: { onClick: () => void }) => (
  <div className={styles.collapsedContent}>
    <Button type="tertiary" onClick={onClick}>
      <SearchOutlined />
    </Button>
  </div>
);
