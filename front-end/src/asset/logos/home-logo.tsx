import React from 'react';
import { PropsType } from './icon-props-type';

export default function HomeLogo(props: PropsType) {
    return (
        <svg viewBox="0 0 16 18" {...props} xmlns="http://www.w3.org/2000/svg">
            <path d="M2 16H5V10H11V16H14V7L8 2.5L2 7V16ZM0 18V6L8 0L16 6V18H9V12H7V18H0Z" />
        </svg>
    );
}
