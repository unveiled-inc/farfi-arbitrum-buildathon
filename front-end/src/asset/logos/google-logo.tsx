import React from 'react';
import { PropsType } from './icon-props-type';

export default function GoogleLogo(props: PropsType) {
    return (
        <svg viewBox="0 0 106 106" xmlns="http://www.w3.org/2000/svg" {...props}>
            <g clipPath="url(#clip0_55508_27124)">
                <mask
                    id="mask0_55508_27124"
                    style={{ maskType: 'luminance' }}
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="106"
                    height="106"
                >
                    <path d="M105.5 0.5H0.5V105.5H105.5V0.5Z" fill="white" />
                </mask>
                <g mask="url(#mask0_55508_27124)">
                    <path
                        d="M103.4 54.193C103.4 50.4702 103.066 46.8908 102.446 43.4541H53V63.7621H81.2544C80.0375 70.3246 76.3389 75.8849 70.7786 79.6077V92.7805H87.7456C97.6728 83.6407 103.4 70.1813 103.4 54.193Z"
                        fill="#4285F4"
                    />
                    <path
                        d="M53.0001 105.5C67.1751 105.5 79.059 100.798 87.7451 92.7804L70.7782 79.6077C66.0773 82.7577 60.0634 84.6188 53.0001 84.6188C39.3259 84.6188 27.7523 75.3835 23.6237 62.9746H6.08398V76.5768C14.7229 93.7349 32.4773 105.5 53.0001 105.5Z"
                        fill="#34A853"
                    />
                    <path
                        d="M23.6236 62.9751C22.5736 59.8251 21.9772 56.4604 21.9772 53.0001C21.9772 49.5398 22.5736 46.1751 23.6236 43.0251V29.4229H6.0839C2.5286 36.5104 0.5 44.5287 0.5 53.0001C0.5 61.4715 2.5286 69.4898 6.0839 76.5773L23.6236 62.9751Z"
                        fill="#FBBC04"
                    />
                    <path
                        d="M53.0001 21.3808C60.7076 21.3808 67.6282 24.0295 73.0693 29.2317L88.1273 14.1736C79.0354 5.70222 67.1509 0.5 53.0001 0.5C32.4773 0.5 14.7229 12.2647 6.08398 29.4228L23.6237 43.025C27.7523 30.6161 39.3259 21.3808 53.0001 21.3808Z"
                        fill="#E94235"
                    />
                </g>
            </g>
            <defs>
                <clipPath id="clip0_55508_27124">
                    <rect width="105.5" height="106" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
}
