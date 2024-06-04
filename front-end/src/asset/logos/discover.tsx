import React from 'react';
import { PropsType } from './icon-props-type';
export default function DiscoverLogo(props: PropsType) {
    return (
        <svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path d="M0 8V0H8V8H0ZM0 18V10H8V18H0ZM10 8V0H18V8H10ZM10 18V10H18V18H10ZM2 6H6V2H2V6ZM12 6H16V2H12V6ZM12 16H16V12H12V16ZM2 16H6V12H2V16Z" />
        </svg>
    );
}