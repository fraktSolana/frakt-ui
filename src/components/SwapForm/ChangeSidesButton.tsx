import styles from './styles.module.scss';

interface ChangeSidesButtonProps {
  onClick: () => void;
}

export const ChangeSidesButton = ({
  onClick,
}: ChangeSidesButtonProps): JSX.Element => {
  return (
    <button onClick={onClick} className={styles.changeSidesBtn}>
      <svg
        viewBox="64 64 896 896"
        data-icon="swap"
        width="1em"
        height="1em"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M847.9 592H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h605.2L612.9 851c-4.1 5.2-.4 13 6.3 13h72.5c4.9 0 9.5-2.2 12.6-6.1l168.8-214.1c16.5-21 1.6-51.8-25.2-51.8zM872 356H266.8l144.3-183c4.1-5.2.4-13-6.3-13h-72.5c-4.9 0-9.5 2.2-12.6 6.1L150.9 380.2c-16.5 21-1.6 51.8 25.1 51.8h696c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z"></path>
      </svg>
    </button>
  );
};
