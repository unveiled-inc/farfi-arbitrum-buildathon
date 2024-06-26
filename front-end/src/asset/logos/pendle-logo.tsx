import React from 'react';
import { PropsType } from './icon-props-type';

export default function PendleLogo(props: PropsType) {
  return (
    <svg
      width="60"
      height="60"
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="23.0588" cy="41.1062" r="9.05885" fill="#1E4480" />
      <mask
        id="mask0_2584_2178"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="22"
        y="9"
        width="3"
        height="26"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M22.0624 34.2116L22.0624 9.93378L24.0818 9.93378L24.0818 34.2116L22.0624 34.2116Z"
          fill="white"
        />
      </mask>
      <g mask="url(#mask0_2584_2178)">
        <path
          d="M46.9333 25.4666C46.9333 34.5608 39.561 41.9332 30.4667 41.9332C21.3725 41.9332 14.0002 34.5608 14.0002 25.4666C14.0002 16.3724 21.3725 9.00003 30.4667 9.00003C39.561 9.00003 46.9333 16.3724 46.9333 25.4666Z"
          fill="white"
        />
      </g>
      <circle cx="30.4667" cy="25.4666" r="16.4666" fill="#DEDEDE" />
      <mask
        id="mask1_2584_2178"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="14"
        y="9"
        width="33"
        height="33"
      >
        <circle cx="30.4667" cy="25.4666" r="16.4666" fill="#DEDEDE" />
      </mask>
      <g mask="url(#mask1_2584_2178)">
        <circle cx="23.0588" cy="41.1062" r="9.05885" fill="#152E51" />
        <mask
          id="mask2_2584_2178"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="22"
          y="9"
          width="3"
          height="26"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M22.0624 34.2116L22.0624 9.93378L24.0818 9.93378L24.0818 34.2116L22.0624 34.2116Z"
            fill="#152E51"
          />
        </mask>
        <g mask="url(#mask2_2584_2178)">
          <path
            d="M46.9333 25.4666C46.9333 34.5608 39.561 41.9332 30.4667 41.9332C21.3725 41.9332 14.0002 34.5608 14.0002 25.4666C14.0002 16.3724 21.3725 9.00003 30.4667 9.00003C39.561 9.00003 46.9333 16.3724 46.9333 25.4666Z"
            fill="#152E51"
          />
        </g>
      </g>
    </svg>
  );
}
