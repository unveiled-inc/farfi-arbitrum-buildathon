import React from 'react';
import { PropsType } from './icon-props-type';
export default function LogoutLogo(props: PropsType) {
    return (
        <svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path d="M2 18C1.45 18 0.979167 17.8042 0.5875 17.4125C0.195833 17.0208 0 16.55 0 16V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H9V2H2V16H9V18H2ZM13 14L11.625 12.55L14.175 10H6V8H14.175L11.625 5.45L13 4L18 9L13 14Z" />
        </svg>
    );
}
