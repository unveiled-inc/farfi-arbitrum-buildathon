import React from 'react';
import { PropsType } from './icon-props-type';

export default function ArrowRight(props: PropsType) {
    return (
        <svg viewBox="0 0 16 16" {...props} xmlns="http://www.w3.org/2000/svg">
            <path d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z" />
        </svg>
    );
}
