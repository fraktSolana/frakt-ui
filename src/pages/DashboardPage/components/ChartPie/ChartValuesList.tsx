import styles from './ChartPie.module.scss';

export const ChartValuesList = ({ data, colors }) => (
  <div className={styles.list}>
    {data.map(({ name, value, key }) => (
      <div key={key} className={styles.listRow}>
        <div className={styles.listInfo}>
          <div className={styles.dot} style={{ background: colors[key] }} />
          <p className={styles.listLabel}>{name}</p>
        </div>
        <p className={styles.listValue}>{value}</p>
      </div>
    ))}
  </div>
);
