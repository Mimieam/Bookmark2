// create a button group that will accept multiple function to be triggered on lick
import React from 'react';
import { Button, Dropdown, Toast, Tooltip, Tree } from '@douyinfe/semi-ui';
import {
    IconSearch, IconSort, IconEdit, IconMail,
    IconBottomLeftStroked, IconExport, IconMember,
    IconUnlockStroked, IconSimilarity,
    IconCheckList
} from '@douyinfe/semi-icons';


export const LinkButtonGroup = ({ node, label }) => {
    return (
        <div style={{
            right: 0,
            display: "flex"
        }}>
            <Tooltip content="Sort">
                <Dropdown
                    render={
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleSortByProperty(treeData, setTreeData, 'title', true)} > By Title</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleSortByProperty(treeData, setTreeData, 'url', true)} > By Url </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleSortByProperty(treeData, setTreeData, 'dateLastUsed', true)} > By Access Date </Dropdown.Item>
                        </Dropdown.Menu>
                    }
                >
                    <Button icon={<IconSort />} onClick={()=>handleSortByTitle(treeData, setTreeData)} />
                </Dropdown>
            </Tooltip>
            <Tooltip content="Edit title">
                <Button icon={<IconEdit />} onClick={() => console.log('Edit button clicked')} />
            </Tooltip>
            <Tooltip content="Tags">
                <Button icon={<IconMail />} onClick={() => console.log('Tags button clicked')} />
            </Tooltip>
            <Tooltip content="Move to">
                <Button icon={<IconExport />} onClick={() => handleMoveToFolder('leaf-0-0', 'parent-1', treeData, setTreeData )} />
            </Tooltip>
            <Tooltip content="Pin folder(s)">
                <Button icon={<IconMember />} onClick={() => console.log('Pin Folder button clicked')} />
            </Tooltip>
        </div>
    );
};
