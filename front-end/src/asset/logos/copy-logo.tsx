import React from 'react';
import { PropsType } from './icon-props-type';
export default function CopyLogo(props: PropsType) {
    return (
        <svg viewBox="0 0 16 16" {...props} xmlns="http://www.w3.org/2000/svg">
            {/* <mask
                id="mask0_55768_1540"
                // style="mask-type:alpha"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="16"
                height="16"
            >
                <rect width="16" height="16" />
            </mask> */}
            <g mask="url(#mask0_55768_1540)">
                <path
                    d="M6 12.0002C5.63333 12.0002 5.31944 11.8696 5.05833 11.6085C4.79722 11.3474 4.66667 11.0335 4.66667 10.6668V2.66683C4.66667 2.30016 4.79722 1.98627 5.05833 1.72516C5.31944 1.46405 5.63333 1.3335 6 1.3335H12C12.3667 1.3335 12.6806 1.46405 12.9417 1.72516C13.2028 1.98627 13.3333 2.30016 13.3333 2.66683V10.6668C13.3333 11.0335 13.2028 11.3474 12.9417 11.6085C12.6806 11.8696 12.3667 12.0002 12 12.0002H6ZM6 10.6668H12V2.66683H6V10.6668ZM3.33333 14.6668C2.96667 14.6668 2.65278 14.5363 2.39167 14.2752C2.13056 14.0141 2 13.7002 2 13.3335V4.00016H3.33333V13.3335H10.6667V14.6668H3.33333Z"
                    // fill={props.fill}
                />
            </g>
        </svg>
    );
}
