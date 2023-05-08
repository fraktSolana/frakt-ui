import { defaultsColors } from './constants';
import styles from './MyLoans.module.scss';

export const LoansAmountList = ({ data }) => (
  <div className={styles.loansList}>
    {data.map(({ name, value, key }) => (
      <div key={key} className={styles.row}>
        <div className={styles.loanInfo}>
          <div
            className={styles.dot}
            style={{ background: defaultsColors[key] }}
          />
          <p className={styles.loanName}>{name}</p>
        </div>
        <p className={styles.loanValue}>{value}</p>
      </div>
    ))}
  </div>
);
