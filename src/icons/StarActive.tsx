import { FC } from 'react';

export const StarActive: FC<{ className?: string }> = ({ className }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className={className}
  >
    <rect width="16" height="16" fill="transparent" />
    <path
      d="M7.49603 2.78263C7.65034 2.33868 7.7275 2.11671 7.8416 2.05519C7.94034 2.00195 8.05925 2.00195 8.15799 2.05519C8.27209 2.11671 8.34925 2.33868 8.50356 2.78263L9.52374 5.71755C9.56766 5.8439 9.58962 5.90708 9.62919 5.95413C9.66415 5.99569 9.70873 6.02808 9.75906 6.04848C9.81603 6.07158 9.8829 6.07294 10.0166 6.07567L13.1232 6.13897C13.5931 6.14855 13.828 6.15334 13.9218 6.24284C14.0029 6.3203 14.0397 6.43338 14.0196 6.54375C13.9963 6.67127 13.8091 6.81325 13.4345 7.09719L10.9585 8.97439C10.8519 9.0552 10.7986 9.09561 10.7661 9.14778C10.7374 9.19387 10.7203 9.24628 10.7165 9.30045C10.7121 9.36177 10.7315 9.42579 10.7702 9.55382L11.67 12.5279C11.8061 12.9777 11.8741 13.2027 11.818 13.3195C11.7694 13.4206 11.6732 13.4905 11.562 13.5055C11.4336 13.5228 11.2407 13.3885 10.8549 13.1201L8.30442 11.3453C8.19462 11.2689 8.13973 11.2307 8.08006 11.2159C8.02735 11.2028 7.97224 11.2028 7.91953 11.2159C7.85986 11.2307 7.80496 11.2689 7.69517 11.3453L5.14472 13.1201C4.75893 13.3885 4.56603 13.5228 4.43757 13.5055C4.32639 13.4905 4.23019 13.4206 4.1816 13.3195C4.12545 13.2027 4.1935 12.9777 4.3296 12.5279L5.22937 9.55382C5.2681 9.42579 5.28747 9.36177 5.28311 9.30045C5.27926 9.24628 5.26223 9.19387 5.23351 9.14778C5.20099 9.09561 5.14769 9.0552 5.0411 8.97439L2.56507 7.0972C2.19054 6.81325 2.00327 6.67127 1.98002 6.54375C1.9599 6.43338 1.99664 6.3203 2.07779 6.24284C2.17156 6.15334 2.40651 6.14855 2.87641 6.13897L5.98295 6.07567C6.11668 6.07294 6.18355 6.07158 6.24053 6.04848C6.29086 6.02808 6.33544 5.99569 6.3704 5.95413C6.40997 5.90708 6.43193 5.8439 6.47585 5.71755L7.49603 2.78263Z"
      fill="#FFCE1F"
    />
  </svg>
);