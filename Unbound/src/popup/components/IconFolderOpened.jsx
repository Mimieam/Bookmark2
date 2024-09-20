import React from 'react';
import { Icon } from '@douyinfe/semi-ui';
import folderSVG from '../../assets/folder-opened.svg';

// export default () => {
//     function CustomIcon() {
//         return <svg version="1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" enableBackground="new 0 0 48 48">
//             <path fill="#FFA000" d="M38,12H22l-4-4H8c-2.2,0-4,1.8-4,4v24c0,2.2,1.8,4,4,4h31c1.7,0,3-1.3,3-3V16C42,13.8,40.2,12,38,12z" />
//             <path fill="#FFCA28" d="M42.2,18H15.3c-1.9,0-3.6,1.4-3.9,3.3L8,40h31.7c1.9,0,3.6-1.4,3.9-3.3l2.5-14C46.6,20.3,44.7,18,42.2,18z" />
//         </svg>

//     }
//     return <Icon svg={<CustomIcon />} />
// };

// export default () => <Icon svg={<img src={folderSVG} />} />;
export const IconFolderOpened = () => {
    function CustomIcon() {
        return <svg width="1em" height="1em" viewBox="0 0 48 48" fill="none" enableBackground="new 0 0 48 48"  xmlns="http://www.w3.org/2000/svg">
            {/* <circle cx="12" cy="12" r="11" fill="#FBCD2C" /> */}
            <path fill="#FFA000" d="M38,12H22l-4-4H8c-2.2,0-4,1.8-4,4v24c0,2.2,1.8,4,4,4h31c1.7,0,3-1.3,3-3V16C42,13.8,40.2,12,38,12z" />
            <path fill="#FFCA28" d="M42.2,18H15.3c-1.9,0-3.6,1.4-3.9,3.3L8,40h31.7c1.9,0,3.6-1.4,3.9-3.3l2.5-14C46.6,20.3,44.7,18,42.2,18z" />
            <mask id="mask0" masktype="alpha" maskUnits="userSpaceOnUse" x="1" y="1" width="22" height="22">
                <circle cx="22" cy="22" r="21" fill="#A2845E" />
            </mask>
            <g mask="url(#mask0)">
                {/* <path fillRule="evenodd" clipRule="evenodd" d="M11.9996 17.7963C13.7184 17.7963 15.2479 16.3561 16.0881 14.2048C16.6103 13.9909 17.1072 13.3424 17.334 12.4957C17.629 11.3948 17.5705 10.4118 16.7665 10.1059C16.6885 6.27115 15.1754 4.78714 11.9996 4.78714C8.82412 4.78714 7.31097 6.27097 7.2328 10.1052C6.42711 10.4103 6.36828 11.394 6.66349 12.4957C6.89064 13.3435 7.38849 13.9926 7.91145 14.2056C8.7518 16.3565 10.2811 17.7963 11.9996 17.7963ZM20.0126 23C20.34 23 20.5906 22.7037 20.4686 22.3999C19.6099 20.2625 16.1444 18.6636 12 18.6636C7.85555 18.6636 4.39008 20.2625 3.53142 22.3999C3.40937 22.7037 3.65999 23 3.9874 23H20.0126Z" fill="white" /> */}
            </g>
        </svg>;
    }
    return (
            <Icon svg={<CustomIcon />} />
    );
};

export const IconFolderClosed = () => {
    function CustomIcon() {
        return <svg width="1em" height="1em" viewBox="0 0 48 48" fill="none" enableBackground="new 0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path fill="#FFA000" d="M40,12H22l-4-4H8c-2.2,0-4,1.8-4,4v8h40v-4C44,13.8,42.2,12,40,12z" />
            <path fill="#FFCA28" d="M40,12H8c-2.2,0-4,1.8-4,4v20c0,2.2,1.8,4,4,4h32c2.2,0,4-1.8,4-4V16C44,13.8,42.2,12,40,12z" />
        </svg>
    }
    
    return (
        <Icon svg={<CustomIcon />} />
    );
};
