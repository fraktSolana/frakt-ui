import React from 'react';

const icon = () => (
  <path
    d="M9.00003 14.1453C9.36728 14.1453 9.62719 13.8854 9.62719 13.5125V6.53463L9.58199 5.31421L11.0454 6.94709L12.3336 8.22402C12.4466 8.33702 12.6048 8.41047 12.78 8.41047C13.1246 8.41047 13.3845 8.15057 13.3845 7.79461C13.3845 7.63075 13.3224 7.4782 13.1868 7.3426L9.46334 3.61353C9.33903 3.48357 9.16953 3.41577 9.00003 3.41577C8.82487 3.41577 8.65537 3.48357 8.53107 3.61353L4.81329 7.3426C4.67769 7.4782 4.61554 7.63075 4.61554 7.79461C4.61554 8.15057 4.86979 8.41047 5.21445 8.41047C5.39525 8.41047 5.55346 8.33702 5.66646 8.22402L6.94904 6.94709L8.41806 5.30856L8.36721 6.53463V13.5125C8.36721 13.8854 8.62712 14.1453 9.00003 14.1453Z"
    fill="black"
  />
);

export const ArrowUp = ({
  className,
  width,
  height,
}: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    className={className || ''}
    width={width || '18'}
    height={height || '18'}
    viewBox="0 0 18 18"
    fill="none"
  >
    {icon()}
  </svg>
);
