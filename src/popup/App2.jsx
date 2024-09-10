import React, { useState, useEffect } from 'react';
import { Tree } from '@douyinfe/semi-ui';
// import { Tree, TagInput, TagGroup, Tag} from '@douyinfe/semi-ui';
// import { Toast, Button } from '@douyinfe/semi-ui';

// import Form from './react-components/Form';
import { bookmarks } from 'webextension-polyfill';
import { styleToString } from './utils';


function getFaviconFromURL(u) {
    if (!u) return 

    function faviconURL(u) {
        const url = new URL(chrome.runtime.getURL("/_favicon/"));
        url.searchParams.set("pageUrl", u);
        url.searchParams.set("size", "64");
        return url.toString();
    }
    const _style = {
        marginRight: "8px",
        backgroundImage: `url(${faviconURL(u)})`,
        backgroundSize: "cover",
        height: "16px",
        width: "16px",
    }
    return (<i className='wb-icon' style={_style}> </i>)
}

function getURLTags(u){
    return ['Semi', 'Hotsoon', 'Pipixia'] 
}

/**
 * converts chrome native bookmarks to semi-ui data
 * 
 * @param {*} initialData data from chrome.bookmark.getTree()
 * @param {*} parentKey semi-ui parent node key representation
 * @param {*} parentId chrome browser parent node key representation
 * @returns 
 */
function remapData(initialData, parentKey=null) {
    const remapped = [];

    const traverse = (data, parentKey) => {
        return data.map((item, index) => {
            const key = parentKey ? `${parentKey}-${index}` : `${index}`;
            const newItem = {
                // browser 
                raw_data: item,  // chrome bookmwark NodeTree object
                index: item.index,  // origin index in the the bookmark
                parentId: item.parentId,  // chrome ids
                parentKey: parentKey,  // tree depth
                
                // semi-ui elements
                label: item.title,
                value: item.title,
                key: key,
                // disabled: "disabled",
                // children: "children",
                isLeaf: !item?.children,
                icon: getFaviconFromURL(item.url),
                tags: getURLTags(item.url)
            };

            if (item.children && item.children.length > 0) {
                newItem.children = traverse(item.children, key);
            }

            return newItem;
        });
    };

    return traverse(initialData.children, parentKey);
}

export function App2() {

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
    const [selectedThroughParent, setSelectedThroughParent] = useState(new Set());

    useEffect(() => {
        console.log('UseEffect Called')
        async function fetchData() {
            const bookmarks = await chrome.bookmarks.getTree()
            const [root] = bookmarks
            const initialData = remapData(root);
            console.log({ initialData })
            setTreeData(initialData)
        }
        fetchData();
    }, []); 

    async function moveBookmark(dragNode, dropNode, dropInfo) {
        console.log({ dragNode, dropNode, dropInfo })
        // // Get the IDs of the bookmark nodes being dragged and dropped
        const dragBookmarkId = dragNode.raw_data.id;
        // const dropId = dropNode.raw_data.id;

        // // Retrieve the full bookmark node data for the drop parent node
        // const dropLocationNode = dropNode.raw_data
        // if (!dropLocationNode.children){
        //     const [dropParent] = await chrome.bookmarks.get(dropNode.raw_data.parentId);
        // }

        // // Check if dropLocationNode has children
        // if (!dropLocationNode.children) {
        //     console.error(`Drop parent (${dropId}) has no children.`, dropLocationNode);
        //     return;
        // }


        // found in the last position of semi-ui dropNode info 
        const dropPos = dropNode.pos.split('-');
        const dropPosition = dropInfo.dropPosition - Number(dropPos[dropPos.length - 1]);
        // console.log(dropPosition, dropPos)
        console.log(dropPosition, dropPos, dropInfo.dropPosition, Number(dropPos[dropPos.length - 1]))
        
        const correctDropNode = dropNode.raw_data?.children ? dropNode : (await chrome.bookmarks.getSubTree(dropNode.raw_data.parentId)).pop()
        
        const dropId = correctDropNode?.raw_data?.id || correctDropNode.id,
        
            dropIndex = Number(dropInfo.node.pos.split('-').pop()) + dropInfo.dropPosition

        console.log({ correctDropNode, dropIndex })
        console.log(correctDropNode.index, dropNode.index, dropPosition, dropNode.index + dropPosition)
        console.log(`dropPosition`, dropPosition)
        console.log(`dropNode.index`, dropNode.index)
        console.log(`dropNode.pos`, dropNode.pos.split('-').pop())
        // console.log(`correctDropNode.index`, correctDropNode.index)
        console.log(`dropIndex`, dropIndex)
        // Move the bookmark in the browser's bookmark tree
        await chrome.bookmarks.move(dragBookmarkId, {
            parentId: dropId,
            index: dropPosition > 0 ? Number(dropNode.pos.split('-').pop()) + 1 : Number(dropNode.pos.split('-').pop()) 
            // index: dropPosition > 0 ? dropNode.index + 1 : dropNode.index
        });

        // Optionally, update the state or perform any necessary post-processing
        console.log(`Moved bookmark ${dragBookmarkId} to parent ${dropId} at index ${dropIndex}.`);
    }

    async function onDrop(info) {
        const { dropToGap, node, dragNode } = info;
        const dropKey = node.key;
        const dragKey = dragNode.key;
        const dropPos = node.pos.split('-');
        const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

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

    const renderLabel = (
        label,
        data,
    ) => {
        // console.log({label, data})
        // const { icon, key } = data;
        const isLeaf = !(data?.children && data?.children.length);
        // const style = {
        //     backgroundColor: selected.has(key)
        //         ? 'rgba(var(--semi-blue-0), 1)'
        //         : selectedThroughParent.has(key)
        //             ? 'rgba(var(--semi-blue-0), .5)' : 'transparent'
        // };

        return (
            <span
                // role="treeitemxxx"
                style={{
                    display: "inline-flex",
                    alignItems: "center"
                }}
            >
                {/* {isLeaf ? <span style={{ width: 24 }}></span> : "**"} */}
                {/* {data.icon} */}
                <span>{label}</span>
                
                {/* <TagInput
                    clearIcon='false'
                    // showClear
                    defaultValue={data.tags}
                    placeholder='Please enter...'
                    onChange={v => console.log(v)}
                /> */}
                {/* <TagGroup
                    maxTagCount={5}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        width: 350,
                    }}
                    // tagList={data?.tags.map(t=><Tag>t</Tag>)}
                    tagList={data?.tags.map(t=><Tag>t</Tag>)}
                    size='large'
                    // onTagClose={tagListClick}
                /> */}
            </span>
        );
    };

    return (
        <div>
            {/* <Form 
            // onClose={changeVisible}
            description="A pre-released version is available"
        /> */}
        
    <Tree
        showLine
        treeData={treeData}
        renderLabel={renderLabel}
        draggable
        hideDraggingNode
        onDrop={onDrop}
        // virtualize
        
    />
    {/* // <Button style={{ color: `var(--semi-color-success)` }} onClick={() => Toast.success(opts)}>Success</Button> */}
     </div>
    );
};

export default App2