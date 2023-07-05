import styles from './RootHeader.module.scss';

const RootHeader = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <h3 className={styles.title}>Auctions</h3>
      </div>
    </div>
  );
};

export default RootHeader;
