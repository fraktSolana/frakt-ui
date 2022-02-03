import React from 'react';

const icon = (
  <>
    <path
      d="M1.6521 6.63857H5.65897C6.48922 6.63857 6.97294 6.15485 6.97294 5.3246V1.37549C6.97294 0.920654 6.62639 0.581334 6.16434 0.581334C5.70951 0.581334 5.37741 0.913435 5.37741 1.37549V1.88808L5.52902 4.12615L3.86129 2.37179L1.79649 0.29255C1.64488 0.133719 1.44995 0.0615234 1.23336 0.0615234C0.742432 0.0615234 0.388672 0.393624 0.388672 0.884556C0.388672 1.10836 0.475307 1.31051 0.634138 1.46212L2.70616 3.53414L4.46052 5.20187L2.20801 5.05026H1.6521C1.19005 5.05026 0.850725 5.37514 0.850725 5.83719C0.850725 6.29925 1.19005 6.63857 1.6521 6.63857ZM8.79227 13.9448C9.2471 13.9448 9.57921 13.6127 9.57921 13.1506V12.5658L9.42759 10.335L11.0953 12.0894L13.2034 14.2047C13.3478 14.3635 13.55 14.4357 13.7593 14.4357C14.2503 14.4357 14.604 14.1036 14.604 13.6127C14.604 13.3889 14.5174 13.194 14.3658 13.0351L12.2505 10.927L10.4961 9.25928L12.7486 9.41089H13.3695C13.8315 9.41089 14.1709 9.07879 14.1709 8.62395C14.1709 8.15468 13.8315 7.82258 13.3695 7.82258H9.29764C8.46739 7.82258 7.98368 8.30629 7.98368 9.13654V13.1506C7.98368 13.6055 8.33022 13.9448 8.79227 13.9448Z"
      fill="white"
    />
  </>
);

export const BuyIcon = ({
  className,
  width,
  height,
}: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    className={className || ''}
    width={width || '15'}
    height={height || '15'}
    viewBox="0 0 15 15"
    fill="none"
  >
    {icon}
  </svg>
);
