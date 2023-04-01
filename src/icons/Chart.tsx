import { FC } from 'react';

export const Chart: FC<{ className?: string }> = ({ className }) => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    className={className}
  >
    <rect x="0.5" y="0.5" width="27" height="27" rx="13.5" fill="white" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.69883 7.17499C7.98878 7.17499 8.22383 7.41004 8.22383 7.69999V16.94C8.22383 17.5367 8.22424 17.9527 8.2507 18.2765C8.27665 18.5942 8.32505 18.7768 8.39549 18.915C8.54649 19.2114 8.78744 19.4523 9.08379 19.6033C9.22206 19.6738 9.40459 19.7222 9.7223 19.7481C10.0461 19.7746 10.4621 19.775 11.0588 19.775H20.2988C20.5888 19.775 20.8238 20.01 20.8238 20.3C20.8238 20.5899 20.5888 20.825 20.2988 20.825H11.0363C10.4674 20.825 10.0084 20.825 9.6368 20.7946C9.25415 20.7634 8.91806 20.6973 8.6071 20.5389C8.11318 20.2872 7.7116 19.8856 7.45994 19.3917C7.3015 19.0808 7.23545 18.7447 7.20418 18.362C7.17382 17.9904 7.17382 17.5314 7.17383 16.9625L7.17383 7.69999C7.17383 7.41004 7.40888 7.17499 7.69883 7.17499ZM18.8988 8.57499C19.1888 8.57499 19.4238 8.81004 19.4238 9.09999V17.5C19.4238 17.7899 19.1888 18.025 18.8988 18.025C18.6089 18.025 18.3738 17.7899 18.3738 17.5V9.09999C18.3738 8.81004 18.6089 8.57499 18.8988 8.57499ZM13.2988 9.97499C13.5888 9.97499 13.8238 10.21 13.8238 10.5V17.5C13.8238 17.7899 13.5888 18.025 13.2988 18.025C13.0089 18.025 12.7738 17.7899 12.7738 17.5V10.5C12.7738 10.21 13.0089 9.97499 13.2988 9.97499ZM16.0988 12.075C16.3888 12.075 16.6238 12.31 16.6238 12.6V17.5C16.6238 17.7899 16.3888 18.025 16.0988 18.025C15.8089 18.025 15.5738 17.7899 15.5738 17.5V12.6C15.5738 12.31 15.8089 12.075 16.0988 12.075ZM10.4988 14.175C10.7888 14.175 11.0238 14.41 11.0238 14.7V17.5C11.0238 17.7899 10.7888 18.025 10.4988 18.025C10.2089 18.025 9.97383 17.7899 9.97383 17.5V14.7C9.97383 14.41 10.2089 14.175 10.4988 14.175Z"
      fill="black"
    />
    <rect x="0.5" y="0.5" width="27" height="27" rx="13.5" stroke="#AEAEB2" />
  </svg>
);
