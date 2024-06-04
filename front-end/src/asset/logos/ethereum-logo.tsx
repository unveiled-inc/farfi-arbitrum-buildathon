import React from 'react';
import { PropsType } from './icon-props-type';
export default function EthereumLogo(props: PropsType) {
    return (
        <svg viewBox="0 0 20 20" {...props} xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_55487_42455)">
                <path
                    d="M10 20C15.5229 20 20 15.5229 20 10C20 4.47715 15.5229 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5229 4.47715 20 10 20Z"
                    fill="#627EEA"
                />
                <path d="M10.3113 2.5V8.04375L14.9969 10.1375L10.3113 2.5Z" fill="white" fillOpacity="0.602" />
                <path d="M10.3112 2.5L5.625 10.1375L10.3112 8.04375V2.5Z" fill="white" />
                <path d="M10.3113 13.73V17.4969L15 11.01L10.3113 13.73Z" fill="white" fillOpacity="0.602" />
                <path d="M10.3112 17.4969V13.7294L5.625 11.01L10.3112 17.4969Z" fill="white" />
                <path d="M10.3113 12.8583L14.9969 10.1377L10.3113 8.04517V12.8583Z" fill="white" fillOpacity="0.2" />
                <path d="M5.625 10.1377L10.3112 12.8583V8.04517L5.625 10.1377Z" fill="white" fillOpacity="0.602" />
            </g>
            <defs>
                <clipPath id="clip0_55487_42455">
                    <rect width="20" height="20" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
}
