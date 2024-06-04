import React from 'react';
import { PropsType } from './icon-props-type';
export default function DragBar(props: PropsType) {
    return (
        <svg viewBox="0 0 32 4" {...props} xmlns="http://www.w3.org/2000/svg">
            <rect width={props.width} height={props.height} fill={props.fill} />
        </svg>
    );
}
