import { FC, SVGProps } from 'react';

export const LoaderCircle: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="65"
    height="65"
    viewBox="0 0 65 65"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M64.6748 32.675C64.6748 50.3482 50.3479 64.675 32.6748 64.675C15.0017 64.675 0.674805 50.3482 0.674805 32.675C0.674805 15.0019 15.0017 0.675049 32.6748 0.675049C50.3479 0.675049 64.6748 15.0019 64.6748 32.675ZM7.0748 32.675C7.0748 46.8135 18.5363 58.275 32.6748 58.275C46.8133 58.275 58.2748 46.8135 58.2748 32.675C58.2748 18.5366 46.8133 7.07505 32.6748 7.07505C18.5363 7.07505 7.0748 18.5366 7.0748 32.675Z"
      fill="#9CFF1F"
      fillOpacity="0.1"
    />
    <path
      d="M20.2434 62.1617C14.0165 59.5364 8.78044 55.0072 5.2858 49.2232C1.79117 43.4393 0.21733 36.6974 0.789855 29.964C1.36238 23.2305 4.05187 16.8512 8.47287 11.7402C12.8939 6.62929 18.8194 3.04913 25.4002 1.51289C31.981 -0.0233555 38.8792 0.56318 45.1062 3.18843C51.3332 5.81368 56.5692 10.3429 60.0638 16.1269C63.5584 21.9108 65.1323 28.6527 64.5598 35.3861C63.9872 42.1196 61.2977 48.4989 56.8767 53.6099L52.0363 49.4229C55.5731 45.3341 57.7247 40.2307 58.1828 34.8439C58.6408 29.4572 57.3817 24.0637 54.586 19.4365C51.7903 14.8093 47.6015 11.186 42.6199 9.08575C37.6383 6.98555 32.1198 6.51632 26.8551 7.74532C21.5905 8.97432 16.8501 11.8384 13.3133 15.9272C9.77646 20.016 7.62486 25.1194 7.16684 30.5062C6.70882 35.8929 7.9679 41.2864 10.7636 45.9136C13.5593 50.5408 17.7481 54.1641 22.7297 56.2643L20.2434 62.1617Z"
      fill="url(#paint0_linear_66386_164325)"
    />
    <defs>
      <linearGradient
        id="paint0_linear_66386_164325"
        x1="58.5"
        y1="42.5"
        x2="29.5"
        y2="68"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#9CFF1F" />
        <stop offset="1" stopColor="#9CFF1F" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);
