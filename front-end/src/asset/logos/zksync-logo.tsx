import React from 'react';
import { PropsType } from './icon-props-type';

export default function ZkSyncLogo(props: PropsType) {
    return (
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="120" height="120" rx="60" fill="black" />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M99.9997 59.6235L77.3089 37V53.5644L54.7812 70.148L77.3089 70.1672V82.2376L99.9997 59.6235Z"
                fill="white"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20 59.6139L42.6908 82.2281V65.798L65.2183 49.08L42.6908 49.0608V37L20 59.6139Z"
                fill="white"
            />
        </svg>
    );
}
