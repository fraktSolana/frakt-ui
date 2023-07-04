import { SearchOutlined } from '@ant-design/icons';

import { CloseCircle } from '@frakt/icons';

import Button from '../Button';

import styles from './SearchSelect.module.scss';

export const PrefixInput = ({ onClick, collapsible = false }) => (
  <div className={styles.prefix}>
    {!collapsible ? (
      <SearchOutlined />
    ) : (
      <Button type="tertiary" onClick={onClick} className={styles.closeButton}>
        <CloseCircle />
      </Button>
    )}
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
