import React from 'react';
import { PropsType } from './icon-props-type';

export default function DarkThemeIcon(props: PropsType) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" {...props}>
            <path d="M480-107q-155 0-264-109T107-480q0-155 109-264t264-109q9 0 20.5.5T527-850q-40 38-55 85t-15 82q0 85 63 155.5T686-457q52 0 91.5-19t71.5-53q2 13 3 28.5t1 20.5q0 155-109 264T480-107Z" />
        </svg>
    );
}