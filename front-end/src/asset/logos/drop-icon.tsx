import React from 'react';
import { PropsType } from './icon-props-type';
export default function DropIcon(props: PropsType) {
    return (
        <svg
            width={props.width}
            height={props.height}
            {...props}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M12.0396 2C7.60656 2 4 5.60656 4 10.0396C4 10.0965 4.01359 10.1526 4.03961 10.2031L4.07078 10.2637C4.0768 10.2754 4.08348 10.2868 4.09074 10.2977L11.7385 21.8307C11.778 21.894 11.8357 21.9429 11.9037 21.9713C11.9084 21.9733 11.913 21.9754 11.9178 21.9771C11.9269 21.9805 11.9361 21.9834 11.9455 21.986C11.9531 21.9882 11.9608 21.99 11.9686 21.9916C11.9765 21.9932 11.9842 21.9949 11.9922 21.9961C12.0067 21.9981 12.0213 21.9993 12.036 21.9996C12.0378 21.9996 12.0394 22 12.0412 22C12.0414 22 12.0416 22 12.0418 22C12.042 22 12.0423 22 12.0426 22C12.0426 22 12.0426 22 12.0427 22C12.0605 22 12.0779 21.9983 12.0951 21.9957C12.0979 21.9953 12.1006 21.9946 12.1034 21.9941C12.1188 21.9915 12.1339 21.9878 12.1488 21.9832C12.1508 21.9825 12.1528 21.9819 12.1548 21.9813C12.2299 21.9564 12.2959 21.9075 12.3406 21.8398L20.0199 10.2369C20.0586 10.1783 20.0793 10.1097 20.0793 10.0396C20.0792 5.60656 16.4727 2 12.0396 2ZM10.7753 3.23406C11.0696 2.98512 11.3733 2.82535 11.6821 2.75562V9.30487C11.2151 9.02409 10.6795 8.87381 10.1191 8.87378C9.566 8.87378 9.03702 9.0203 8.57429 9.29401C8.65808 7.57933 9.03011 5.99355 9.64323 4.7673C9.97421 4.10535 10.3551 3.58953 10.7753 3.23406ZM9.97264 3.01238C9.61776 3.39152 9.29151 3.87218 9.00382 4.44761C8.34065 5.7739 7.94128 7.48069 7.85777 9.31475C7.38687 9.02749 6.84511 8.87378 6.278 8.87378C5.73328 8.87378 5.21207 9.01608 4.75441 9.2819C5.06258 6.29652 7.17093 3.83785 9.97264 3.01238ZM4.81926 10.1028C5.23125 9.76991 5.73968 9.5887 6.278 9.5887C6.86859 9.5887 7.42359 9.80624 7.85425 10.2035L7.82284 10.2141L10.834 19.1732L4.81926 10.1028ZM11.6822 19.4525L8.56651 10.1826C8.99382 9.79881 9.53913 9.5887 10.1191 9.5887C10.7037 9.5887 11.2533 9.80213 11.6821 10.1919V19.4525H11.6822ZM12.397 2.75562C12.7058 2.82535 13.0096 2.98512 13.3039 3.23406C13.7241 3.58953 14.105 4.10535 14.436 4.7673C15.0491 5.99359 15.4213 7.5794 15.5051 9.29409C15.0424 9.02034 14.5133 8.87381 13.9601 8.87378C13.3997 8.87378 12.864 9.02409 12.397 9.30487V2.75562ZM12.397 10.1919C12.8258 9.80217 13.3754 9.58874 13.9601 9.58874C14.5401 9.58874 15.0855 9.79893 15.5127 10.1827L12.397 19.4599V10.1919ZM13.2467 19.1754L16.2563 10.2141L16.2249 10.2036C16.6556 9.80623 17.2106 9.58874 17.8012 9.58874C18.337 9.58874 18.8433 9.76831 19.2543 10.0983L13.2467 19.1754ZM17.8012 8.87378C17.2342 8.87378 16.6923 9.02749 16.2214 9.31475C16.1379 7.48069 15.7385 5.77386 15.0754 4.44761C14.7876 3.87211 14.4613 3.39152 14.1063 3.01234C16.9081 3.83773 19.0166 6.29651 19.3249 9.28194C18.8672 9.01608 18.3459 8.87378 17.8012 8.87378Z"
                fill={props.fill}
            />
        </svg>
    );
}