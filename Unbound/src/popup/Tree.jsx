import React, { useState, useEffect } from 'react';
import { Tree, TagInput, TagGroup, Tag, Button, Toast, RadioGroup, Radio, Empty, Badge } from '@douyinfe/semi-ui';

import { getFaviconFromURL, getURLTags, moveBookmark } from './bookmark.utils';
import { Switch } from '@douyinfe/semi-ui';
import { IconBookmark, IconCamera, IconDelete, IconEdit, IconFolder, IconTopLeftStroked } from '@douyinfe/semi-icons';
import EditableInput from './components/editable';
import MainButtonGroup, { checkLinksFromSelectedNodes } from './mainGroupBtns';
import Icon, { IconBreadcrumb, IconIntro, IconRating } from '@douyinfe/semi-icons-lab';
import { IconFolderOpened, IconFolderClosed }  from './components/IconFolderOpened';
// import IconFolderOpened from '../assets/folder-opened.svg';
// import IconFolderOpenedDATAURI from "./../assets/folder-closed.svg";
// var IconFolderOpened = atob(IconFolderOpenedDATAURI.replace(/data:image\/svg\+xml;base64,/, ''));

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

    /** sigh... live status check here... making this needlessly complicated... 
     you are simply recursively checking the status of every leaf in the tree... (can be slow and should be updated) 
     and returning the update tree data
    */
    const traverse = (data, parentKey) => {
        let count = 0
        const Promises = data.map(async (item, index) => {
            const key = parentKey ? `${parentKey}-${index}` : `${index}`;
            const newItem = {
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
                data: [],
                // disabled: "disabled",
                // children: "children",
                isLeaf: !item?.children,
                icon: getFaviconFromURL(item.url),
                tags: getURLTags(item.url),
                // isLiveLink: true
            };

            if (newItem.isLeaf) {
                const response = await chrome.runtime.sendMessage({ action: "checkLinks", urls: [item.url] })
                newItem.isLiveLink = response.ok 
                newItem.icon = newItem.isLiveLink ? 
                    <Badge dot theme='solid' type='success' position='leftTop'> {newItem.icon} </Badge>:
                    <Badge dot theme='solid' type='warning' position='leftTop'> {newItem.icon} </Badge>
            }

            if (item.children && item.children.length > 0) {
                newItem.children = await traverse(item.children, key);
                newItem.count = newItem.children.map(child => child?.count|0).reduce((a, b) => a + b, 0)
            } else {
                newItem.count = 1
            }

            return Promise.resolve(newItem);
        });
        return Promise.all(Promises);
    };

    remapped = traverse(initialData.children, parentKey)
    console.log({remapped})
    // return traverse(initialData.children, parentKey)
    
    
    return remapped
}

chrome.bookmarks.onChanged.addListener((changeInfo, ev) => {
    console.log('Bookmark changed ', changeInfo, ev)
})
chrome.bookmarks.onChildrenReordered.addListener((changeInfo) => {
    console.log('Bookmark ChildrenReordered ', changeInfo)
})
chrome.bookmarks.onCreated.addListener((changeInfo) => {
    console.log('Bookmark Created ', changeInfo)
})
chrome.bookmarks.onMoved.addListener((changeInfo) => {
    console.log('Bookmark Moved ', changeInfo)
})
chrome.bookmarks.onRemoved.addListener((changeInfo) => {
    console.log('Bookmark removed ', changeInfo)
})

export function BookTree() {

    const initialDatax = [
        {
            label: 'Asia',
            value: 'Asia',
            key: '0',
            children: [
                {
                    label: 'China',
                    value: 'China',
                    key: '0-0',
                    children: [
                        {
                            label: 'Beijing',
                            value: 'Beijing',
                            key: '0-0-0',
                        },
                        {
                            label: 'Shanghai',
                            value: 'Shanghai',
                            key: '0-0-1',
                        },
                    ],
                },
                {
                    label: 'Japan',
                    value: 'Japan',
                    key: '0-1',
                    children: [
                        {
                            label: 'Osaka',
                            value: 'Osaka',
                            key: '0-1-0'
                        }
                    ]
                },
            ],
        },
        {
            label: 'North America',
            value: 'North America',
            key: '1',
            children: [
                {
                    label: 'United States',
                    value: 'United States',
                    key: '1-0'
                },
                {
                    label: 'Canada',
                    value: 'Canada',
                    key: '1-1'
                }
            ]
        },
        {
            label: 'Europe',
            value: 'Europe',
            key: '2',
        }
    ];
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

    useEffect(() => {
        console.log('UseEffect Called')
        async function fetchData() {
            const bookmarks = await chrome.bookmarks.getTree()
            const [root] = bookmarks
            const initialData = await remapData(root);
            console.log({ initialData })
            setTreeData(initialData)
        }
        if (chrome.bookmarks){
            fetchData();
        } else {
            console.log('No chrome.bookmarks')
            setTreeData(initialDatax)
        }
    }, []);


    async function onDrop(info) {
        const { dropToGap, node, dragNode } = info;
        const dropKey = node.key;
        const dragKey = dragNode.key;
        const dropPos = node.pos.split('-');
        const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

        if (dropKey === '0') {
            Toast.warning("Sorry, You can't drop outside of the default root folders")
            return; // Do not allow dropping to root nodes
        }

        const data = [...treeData];
        const loop = (data, key, callback) => {
            data.forEach((item, ind, arr) => {
                if (item.key === key) return callback(item, ind, arr);
                if (item.children) return loop(item.children, key, callback);
            });
        };

        let dragObj;
        loop(data, dragKey, (item, ind, arr) => {
            arr.splice(ind, 1);
            dragObj = item;
        });

        if (!dropToGap) {
            // inset into the dropPosition
            loop(data, dropKey, (item, ind, arr) => {
                item.children = item.children || [];
                item.children.push(dragObj);
            });
        } else if (dropPosition === 1 && node.children && node.expanded) {
            // has children && expanded and drop into the node bottom gap
            // could insert anywhere. Here we insert to the top.
            loop(data, dropKey, item => {
                item.children = item.children || [];
                item.children.unshift(dragObj);
            });
        } else {
            let dropNodeInd;
            let dropNodePosArr;
            loop(data, dropKey, (item, ind, arr) => {
                dropNodePosArr = arr;
                dropNodeInd = ind;
            });
            if (dropPosition === -1) {
                // insert to top
                dropNodePosArr.splice(dropNodeInd, 0, dragObj);
            } else {
                // insert to bottom
                dropNodePosArr.splice(dropNodeInd + 1, 0, dragObj);
            }
        }
        console.log(dragNode, node)
        setTreeData(data);
        await moveBookmark(dragNode, node, info)
    }

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
        // (async function () {
            if (!data.isLeaf){
                label = `${label} - [#${data?.raw_data?.id}] - (${data?.count})`
            }

            //     // const response = await chrome.runtime.sendMessage({ action: "checkLinks", urls: [data.value] })
            //     console.log(data)
            //     // data.isLiveLink = response.ok
            //         data.icon = data.isLiveLink ?
            //             <Badge dot theme='solid'> {data.icon} </Badge> :
            //         data.icon
            // }
        // })();
        
        return (
            <span
                // role="treeitemxxx"
                style={{
                    display: "block",
                    alignItems: "center"
                }}
            >
            
                {/* {data.icon} */}

                <span style={{ 
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                        textOverflow: "ellipsis"
                    }}
                >
                    <EditableInput initialValue={label} bookmarkId={data.raw_data.id} />
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
                {/* <TagGroup
                    maxTagCount={5}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        width: 350,
                    }}
                    // tagList={data?.tags.map(t=><Tag>t</Tag>)}
                    tagList={data.tags.map(t=><Tag>t</Tag>)}
                    size='large'
                    // onTagClose={tagListClick}
                /> */}
            </span>
        );
    };

    return (
        <div>
            <RadioGroup type='button' defaultValue={0} onChange={e => toggleVisibleTags(e.target.value)}>
                <Radio value={1}>Show Tags</Radio>
                <Radio value={0}>Hide</Radio>
            </RadioGroup>
            <RadioGroup type='button' defaultValue={0} onChange={e => toggleMultiSelection(e.target.value)}>
                <Radio value={1}>Show Select</Radio>
                <Radio value={0}>Hide</Radio>
            </RadioGroup>

            {/* <Tree
                showLine
                treeData={treeData}
                renderLabel={renderLabel}
                draggable
                hideDraggingNode
                onDrop={onDrop}
            // virtualize

            /> */}
             <>
                 <Switch
                     checked={true}
                    //  onChange={this.onChange}
                     size="small"
                 />
                 <br />
                <MainButtonGroup
                    treeData={treeData}
                    setTreeData={setTreeData}
                    selectedNodes={selectedNodes}
                />
                 <Tree
                    showLine
                    icon={(data)=>{
                        // this is for the ROOT icon...
                        // return <IconBookmark />
                        return data.expanded ? <IconFolderOpened/>: <IconFolderClosed/>
                        // return < IconRating />
                    }}
                    treeData={treeData}
                    multiple={isSelecting}
                    labelEllipsis
                    filterTreeNode
                    leafOnly
                    emptyContent={<Empty />}
                    expandAll
                    renderLabel={renderLabel}
                    showFilteredOnly={true}
                    draggable
                    hideDraggingNode
                    onDrop={onDrop}
                    onChange={(value) => {
                        setSelectedNodes(value)
                        console.log('All selected values: ', value)
                    }}
                    onSelect={(k, v, n) => {
                        console.log('Current item: ', k,v,n)}
                    }
                 />
             </>
            {/* // <Button style={{ color: `var(--semi-color-success)` }} onClick={() => Toast.success(opts)}>Success</Button> */}
        </div>
    );
};



export default BookTree
