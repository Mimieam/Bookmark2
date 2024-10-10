import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Tree, TagInput, TagGroup, Tag, Button, Toast, RadioGroup, Radio, Empty, Badge } from '@douyinfe/semi-ui';

import { getFaviconFromURL, getURLTags, moveBookmark, reindexChildren as reIndexTree, searchAndUpdate } from './bookmark.utils';
import { Switch } from '@douyinfe/semi-ui';
import { IconBookmark, IconCamera, IconDelete, IconEdit, IconFolder, IconTopLeftStroked } from '@douyinfe/semi-icons';
import EditableInput from './components/editable';
import MainButtonGroup, { checkLinksFromSelectedNodes } from './mainGroupBtns';
import Icon, { IconBreadcrumb, IconIntro, IconRating } from '@douyinfe/semi-icons-lab';
import { IconFolderOpened, IconFolderClosed }  from './components/IconFolderOpened';
import { applyCustomConsoleLog, customLogOptions } from './log';
import { LinkButtonGroup } from './components/buttonGroup';

// const blueishGray = '#9ba6d1'
// const kindaNicePink = '#fb8990'

// const logStyle = [
//     `background: ${blueishGray}`,
//     'border-radius: 3px',
//     'color: white',
//     'font-weight: bold',
//     'padding: 2px 5px',
//     'margin: 1px'
// ].join(';')

// console.log(`%c❱❱ Hello World!`, logStyle)


// Call the function to apply the custom console log
const original = console.log;
// console.log = Function.prototype.bind.call(original, console, `%c❱❱ %c%s`, 'background:#fb8990;color:white;padding:2px;border-radius:3px;', 'background:#9ba6d1;color:white;padding:2px;border-radius:3px;');
console.log = Function.prototype.bind.call(...customLogOptions);

/**
 * converts chrome native bookmarks to semi-ui data
 * 
 * @param {*} initialData data from chrome.bookmark.getTree()
 * @param {*} parentKey semi-ui parent node key representation
 * @param {*} parentId chrome browser parent node key representation
 * @returns 
 */
export function remapData(initialData, parentKey = null) {
    let remapped= [];
    let totalCount = 0;
    // console.log({initialData, parentKey})
    /** sigh... live status check here... making this needlessly complicated... 
     you are simply recursively checking the status of every leaf in the tree... (can be slow and should be updated) 
     and returning the update tree data
    */
    const traverse = (data, parentKey) => {
        let count = 0
        const Promises = data.map(async (item, index) => {
            const key = parentKey ? `${parentKey}-${index}` : `${index}`;
            const newItem = {
                ...item,
                // browser 
                raw_data: {
                    ...item,
                    // https://developer.chrome.com/docs/extensions/reference/api/bookmarks#type-BookmarkTreeNode
                    dateLastUsed: item?.dateLastUsed ? item.dateLastUsed : 0, // (new Date(0)).getTime() = 0 => start of epoch
                },  // chrome bookmwark NodeTree object
                
                index: item.index,  // origin index in the the bookmark
                parentId: item.parentId,  // chrome ids
                parentKey: parentKey,  // tree depth

                // semi-ui elements
                label: item.title,
                value: item.url,
                key: key,
                // pos: item.pos,

                // disabled: "disabled",
                // children: "children",
                isLeaf: !item?.children,
                icon: getFaviconFromURL(item.url),
                tags: getURLTags(item.url),
                count: 0
            };

            // if (newItem.isLeaf) {
            //     const response = await chrome.runtime.sendMessage({ action: "checkLinks", urls: [item.url] })
            //     newItem.isLiveLink = response.ok 
            //     newItem.icon = newItem.isLiveLink ?
            //         <Badge dot theme='solid' type='success' position='leftTop'> {newItem.icon} </Badge>:
            //         <Badge dot theme='solid' type='warning' position='leftTop'> {newItem.icon} </Badge>
            // }

            if (item.children && item.children.length > 0) {
                newItem.children = await traverse(item.children, key);
                newItem.count = newItem.children.map(child => child?.count|0).reduce((a, b) => a + b, 0)
            } else {
                if (newItem.isLeaf){
                    newItem.count = 1
                } 
            }

            return Promise.resolve(newItem);
        });
        return Promise.all(Promises);
    };

    remapped = traverse(initialData.children, parentKey)
    return remapped
}

// chrome.bookmarks.onChanged.addListener((changeInfo, ev) => {
//     console.log('Bookmark changed ', changeInfo, ev)
// })
// chrome.bookmarks.onChildrenReordered.addListener((changeInfo) => {
//     console.log('Bookmark ChildrenReordered ', changeInfo)
// })
// chrome.bookmarks.onCreated.addListener((changeInfo) => {
//     console.log('Bookmark Created ', changeInfo)
// })
// chrome.bookmarks.onMoved.addListener((changeInfo) => {
//     console.log('Bookmark Moved ', changeInfo)
// })
// chrome.bookmarks.onRemoved.addListener((changeInfo) => {
//     console.log('Bookmark removed ', changeInfo)
// })

export function BookTree() {

    const initialDatax = [];
    const [treeData, setTreeData] = useState(null);
    const [selected, setSelected] = useState(new Set());
    const [selectedNodes, setSelectedNodes] = useState([]);
    const [selectedThroughParent, setSelectedThroughParent] = useState(new Set());
    const [visibleTags, setVisibleTags] = useState(false);
    const [isSelecting, setIsSelecting ] = useState(false)

    const toggleVisibleTags = () => {
        setVisibleTags(!visibleTags);
    };
    const toggleMultiSelection = () => {
        setIsSelecting(!isSelecting);
    };

    const fetchBookmarks = useCallback(async () => {
        if (!chrome.bookmarks) {
            console.log('No chrome.bookmarks');
            return null;
        }
        const bookmarks = await chrome.bookmarks.getTree();
        const [root] = bookmarks;
        return remapData(root);
    }, []);

    const memoizedTreeData = useMemo(() => fetchBookmarks(), [fetchBookmarks]);

    useEffect(() => {
        async function loadData() {
            const initialData = await memoizedTreeData;
            if (initialData) {
                console.log('Setting initial data: ', initialData);
                setTreeData(initialData);
            }
        }
        loadData();
    }, [memoizedTreeData]);


    const loop = (data, key, callback) => {
        data.forEach((item, ind, arr) => {
            if (item.key === key) return callback(item, ind, arr);
            if (item.children) return loop(item.children, key, callback);
        });
    };

    const onDrop = async (info) => {
        const { dropToGap, node, dragNode } = info;
        const dropKey = node.key; // prevent dropping outside the default root folder
        // const dropKey = node.key == 0 ? 1 : node.key; // prevent dropping outside the default root folder
        const dragKey = dragNode.key;
        const dropPos = node.pos.split('-');
        const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
        console.log({dragNode, node})
        const data = [...treeData];

        if (['0','1'].includes(dropKey) && [-1].includes(dropPosition)){
            Toast.warning("Sorry, You can't drop outside of the default root folders")
            return; // Do not allow dropping to root nodes
        } 

        let dragObj;
        loop(data, dragKey, (item, ind, arr) => {
            arr.splice(ind, 1);
            dragObj = item;
        });

        let dropNodeInd;
        if (!dropToGap) {
            console.log('Dropping on a NODE')
            loop(data, dropKey, (item, ind, arr) => {
                if (item.isLeaf){
                    console.log('Dropping on a LEAF... ', dropKey, item.parentKey)
                    // get parent

                    let dropNodePosArr;
                    loop(data, dropKey, (item, ind, arr) => {
                        dropNodePosArr = arr;
                        dropNodeInd = ind;
                    });

                    if (dropPosition === -1) {
                        dropNodePosArr.splice(dropNodeInd, 0, dragObj);
                        console.log('Drop Location X1 ----- @ Pos: ', dropNodeInd)
                    } else {
                        dropNodeInd = dropNodeInd + 1
                        dropNodePosArr.splice(dropNodeInd, 0, dragObj);
                        console.log('Drop Location X2 ----- @ Pos: ', dropNodeInd)
                    }
                    
                } else {
                    console.log('Dropping on a FOLDER... ')
                    item.children = item.children || [];
                    console.log('dropping at top')
                    item.children.unshift(dragObj);
                    dropNodeInd = 0
                    console.log('Drop Location X3 ----- @ Pos: ', dropNodeInd)
                }
            });
        } else if (dropPosition === 1 && node.children && node.expanded) {
            console.log('Dropping on a GAP', dropKey, dropPosition)
            loop(data, dropKey, item => {
                item.children = item.children || [];
                console.log('dropping at top')
                item.children.unshift(dragObj);
                dropNodeInd = 0
                console.log('Drop Location X4 ----- @ Pos: ', dropNodeInd)
            });
        } else {
            console.log('Dropping on a GAP', dropKey, dropPosition )

            let dropNodePosArr;
            loop(data, dropKey, (item, ind, arr) => {
                dropNodePosArr = arr;
                dropNodeInd = ind;
            });
            if (dropPosition === -1) {
                console.log('Dropping at top')
                dropNodePosArr.splice(dropNodeInd, 0, dragObj);
                console.log('Drop Location X5 ----- @ Pos: ', dropNodeInd)
            } else {
                console.log('Dropping at bottom')
                dropNodeInd = dropNodeInd + 1
                dropNodePosArr.splice(dropNodeInd, 0, dragObj);
                console.log('Drop Location X6 ----- @ Pos: ', dropNodeInd)
            }
        }

        const newParentKey = node.isLeaf ? node.parentKey : dropKey
        console.log('====================================================================================')
        console.log('OLD Info', { index: dragNode.index, parentKey: dragNode.parentKey, key: dragNode.key })
        console.log('NEW Info', { index: dropNodeInd, parentKey: newParentKey, key: `${newParentKey}-${dropNodeInd}` })
        console.log('====================================================================================')
        
        globalThis.data = data
        // console.log('c%moving to new pos', 'style', data)
        
        await moveBookmark(dragNode, node, info)
        const root = Object.assign({}, reIndexTree({children: data}))
        console.log('After reIndexing --- ', root.children)

        console.log("------------------------------------------------------------------------------------------------")
        setTreeData(root.children);
    };

    /**
     * 
     * @param {str} label 
     * @param {object} data the remapData
     * @returns 
     */
    const renderLabel = (
        label,
        data,
    ) => {
        if (!data.isLeaf){
            // label = `[key=${data.key}, idx=${data.index}, pKey=${data.parentKey}] ${label} - (${data?.count})`
            label = `${label} - (${data?.count})`
        } else {
            // label = `[key=${data.key}, idx=${data.index}, pKey=${data.parentKey}] ${label}`
        }
        // label = `[node_id=${data.key},  bk_id=${data?.id}, bk_raw_id=${data?.raw_data?.id}, idx=${data.index}] ${label}`
        // console.log('renderLabel called', label)
        return (
            <span
                style={{
                    display: "block",
                    alignItems: "center"
                }}
            >
                <span style={{ 
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        display: "flex",
                        justifyContent: "space-between"
                    }}
                >
                    <EditableInput initialValue={label} bookmarkId={data.raw_data.id} />
                    {/* {label} */}
                    <LinkButtonGroup node={data} label={label} />
                </span>

                {visibleTags? <TagInput
                    clearIcon='false'
                    // showClear
                    defaultValue={data.tags}
                    placeholder='Please enter...'
                    onChange={v => console.log(v)}
                    size='small'
                    addOnBlur={true}
                />: null}
            </span>
        );
    };

    const onHoverHandler = (event) => {
        console.info(event.target)
    }

    const renderLabel2 = (label, data) => {
        <span data-node={data}>
            {label}
        </span>
    }


    // console.log('Render called')
    return (
        <div
            onMouseOver={onHoverHandler}
            >
            {/* <RadioGroup type='button' defaultValue={0} onChange={e => toggleVisibleTags(e.target.value)}>
                <Radio value={1}>Show Tags</Radio>
                <Radio value={0}>Hide</Radio>
            </RadioGroup>
            <RadioGroup type='button' defaultValue={0} onChange={e => toggleMultiSelection(e.target.value)}>
                <Radio value={1}>Show Select</Radio>
                <Radio value={0}>Hide</Radio>
            </RadioGroup> */}

                 <br />
                <MainButtonGroup
                    treeData={treeData}
                    setTreeData={setTreeData}
                    selectedNodes={selectedNodes}
                />
                 <Tree
                    style = {{
                        margin:"0 auto",
                        border: '1px solid var(--semi-color-border)',
                        width: '85vw',
                    }}
                    // showLine
                    icon={(data)=>{
                        // this is for the ROOT icon...
                        // return <IconBookmark />
                        return data.expanded ? <IconFolderOpened/>: <IconFolderClosed/>
                        // return < IconRating />
                    }}
                    treeData={treeData}
                    // treeDataSimpleJson={}
                    multiple={isSelecting}
                    labelEllipsis
                    // filterTreeNode
                    // leafOnly
                    emptyContent={<Empty>No bookmark</Empty>}
                    expandAll
                    renderLabel={renderLabel2}
                    // renderFullLabel={fullRenderLabel}
                    showFilteredOnly={true}
                    draggable
                    directory={true}
                    // blockNode={false}
                    hideDraggingNode
                    // onDrop={onDrop}
                    onDrop={onDrop}
                    virtualize
                    
                    
                    // onChange={(value) => {
                    //     setSelectedNodes(value)
                    //     console.log('All selected values: ', value)
                    // }}
                    // onSelect={(k, v, n) => {
                    //     console.log('Current item: ', k,v,n)}
                    // }
                 />
        </div>
    );
};



export default BookTree
