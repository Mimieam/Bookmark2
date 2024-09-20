import React from 'react';
import { Button, Dropdown, Toast, Tooltip, Tree } from '@douyinfe/semi-ui';
import {
    IconSearch, IconSort, IconEdit, IconMail,
    IconBottomLeftStroked, IconExport, IconMember,
    IconUnlockStroked, IconSimilarity,
    IconCheckList
} from '@douyinfe/semi-icons';

/**
 * Button handlers for various actions
 */
const handleMoveToFolder = (nodeKey, targetParentKey, treeData, setTreeData) => {
    const findNodeAndRemove = (data, key) => {
        let nodeToMove;
        const filteredData = data.filter(node => {
            if (node.children) {
                node.children = node.children.filter(child => {
                    if (child.key === key) {
                        nodeToMove = child;
                        return false;
                    }
                    return true;
                });
            }
            return node.key !== key;
        });
        return [filteredData, nodeToMove];
    };

    const insertNode = (data, key, node) => {
        return data.map(item => {
            if (item.key === key) {
                item.children = item.children ? [...item.children, node] : [node];
            } else if (item.children) {
                item.children = insertNode(item.children, key, node);
            }
            return item;
        });
    };

    const [updatedData, nodeToMove] = findNodeAndRemove(treeData, nodeKey);
    if (nodeToMove) {
        const newTreeData = insertNode(updatedData, targetParentKey, nodeToMove);
        setTreeData(newTreeData);
    }
};

const handleSortByTitle = (treeData, setTreeData) => {
    const sortTreeData = (data) => {
        return data.sort((a, b) => a.label.localeCompare(b.label))
            .map(node => node.children ? { ...node, children: sortTreeData(node.children) } : node);
    };
    const sortedData = sortTreeData([...treeData]);
    setTreeData(sortedData);
};

/**
 * 
 * @param {*} treeData 
 * @param {*} setTreeData 
 * @param {*} property 'title', 'url', 'accessDate' from remappedData
 */
const handleSortByProperty = (treeData, setTreeData, property, useRawData) => {
    const sortTreeData = (data) => {
        return data.sort(
            (a, b) => (
                !useRawData?
                a[property].localeCompare(b[property]):
               `${a.raw_data[property]}`.localeCompare(`${b.raw_data[property]}`) // auto cast everything to string so we can even compare date timestamps..
            )
        ).map(node => node.children ? { ...node, children: sortTreeData(node.children) } : node);
    };

    const sortedData = sortTreeData([...treeData]);
    setTreeData(sortedData);
};

export const checkLinksFromSelectedNodes = (treeData, setTreeData, selectedNodes) => {
    // Implement logic to check if the selected nodes contain any links
    // Return true if links are found, false otherwise
    const urls = selectedNodes//selectedNodes.map(key => treeData.find(node => node.key === key).url);
        chrome.runtime.sendMessage({ action: "checkLinks", urls: urls }, (response) => {
            console.log({response});
            if (response.ok) {
                Toast.info(`Link is alive (Status: ${response.status})`);
            } else {
                Toast.warning(`Link is dead or an error occurred (Status: ${response.status})`, response.message);
            }
        });
}
const MainButtonGroup = ({ treeData, setTreeData, selectedNodes }) => {
    return (
        <div>
            <Tooltip content="Search">
                <Button icon={<IconSearch />} onClick={() => console.log('Search button clicked')} />
            </Tooltip>
            <Tooltip content="Sort">
                <Dropdown
                    render={
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleSortByProperty(treeData, setTreeData, 'title', true)} > By Title</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleSortByProperty(treeData, setTreeData, 'url', true)} > By Url </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleSortByProperty(treeData, setTreeData, 'dateLastUsed', true)} > By Access Date </Dropdown.Item>
                            {/* <Dropdown.Item onClick={() => handleSortByTitle(treeData, setTreeData)} >Menu Item 2</Dropdown.Item> */}
                        </Dropdown.Menu>
                    }
                >
                    {/* <Tag>Hover Me</Tag> */}
                    <Button icon={<IconSort />} onClick={()=>handleSortByTitle(treeData, setTreeData)} />
                </Dropdown>
            </Tooltip>
            <Tooltip content="Check Selected Link(s)">
                <Button icon={<IconCheckList />} onClick={() => checkLinksFromSelectedNodes(treeData, setTreeData, selectedNodes)} />
            </Tooltip>
            <Tooltip content="Edit title">
                <Button icon={<IconEdit />} onClick={() => console.log('Edit button clicked')} />
            </Tooltip>
            <Tooltip content="Tags">
                <Button icon={<IconMail />} onClick={() => console.log('Tags button clicked')} />
            </Tooltip>
            <Tooltip content="Jump to folder">
                <Button icon={<IconBottomLeftStroked />} onClick={() => console.log('Jump to Folder button clicked')} />
            </Tooltip>
            <Tooltip content="Move to folder">
                <Button icon={<IconExport />} onClick={() => handleMoveToFolder('leaf-0-0', 'parent-1', treeData, setTreeData )} />
            </Tooltip>
            <Tooltip content="Pin folder(s)">
                <Button icon={<IconMember />} onClick={() => console.log('Pin Folder button clicked')} />
            </Tooltip>
            <Tooltip content="Add New Folder">
                <Button icon={<IconUnlockStroked />} onClick={() => console.log('Add New Folder button clicked')} />
            </Tooltip>
            <Tooltip content="Find Duplicates">
                <Button icon={<IconSimilarity />} onClick={() => console.log('Find Duplicates button clicked')} />
            </Tooltip>
        </div>
    );
};
export default MainButtonGroup;
