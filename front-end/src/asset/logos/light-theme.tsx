import React from 'react';
import { PropsType } from './icon-props-type';

export default function LightThemeIcon(props: PropsType) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" {...props}>
            <path d="M480-373q44.583 0 75.792-31.208Q587-435.417 587-480t-31.208-75.792Q524.583-587 480-587t-75.792 31.208Q373-524.583 373-480t31.208 75.792Q435.417-373 480-373Zm0 106q-89 0-151-62t-62-151q0-89 62-151t151-62q89 0 151 62t62 151q0 89-62 151t-151 62ZM213-427H27v-106h186v106Zm720 0H747v-106h186v106ZM427-747v-186h106v186H427Zm0 720v-186h106v186H427ZM257-631 137-748l74-76 115 118-69 75Zm492 494L635-253l69-75 119 116-74 75ZM631-703l117-120 76 74-118 115-75-69ZM137-212l116-113 75 69-116 119-75-75Zm343-268Z" />
        </svg>
    );
}