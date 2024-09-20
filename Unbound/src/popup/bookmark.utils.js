export function renderBookmark(title) {
    return (
    <div className='bookmark-item'>
        {title}
    </div>
    )
}


export function getFaviconFromURL(u) {
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
        display: "flex"
    }
    return (<i className='wb-icon' style={_style}> </i>)
}

export function getURLTags(u) {
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
export function remapData(initialData, parentKey = null) {
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
                label: renderBookmark(item.title),
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

export async function moveBookmark(dragNode, dropNode, dropInfo) {
    console.log({ dragNode, dropNode, dropInfo })
    // // Get the IDs of the bookmark nodes being dragged and dropped
    const dragBookmarkId = dragNode.raw_data.id;

    // found in the last position of semi-ui dropNode info 
    const dropPos = dropNode.pos.split('-');
    const dropPosition = dropInfo.dropPosition - Number(dropPos[dropPos.length - 1]);

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
    try {
        await chrome.bookmarks.move(dragBookmarkId, {
            parentId: dropId,
            index: dropPosition > 0 ? Number(dropNode.pos.split('-').pop()) + 1 : Number(dropNode.pos.split('-').pop())
            // index: dropPosition > 0 ? dropNode.index + 1 : dropNode.index
        });
        console.log(`Moved bookmark ${dragBookmarkId} to parent ${dropId} at index ${dropIndex}.`);
    } catch (error) {
        console.info(`Error Moving bookmark ${dragBookmarkId} to parent ${dropId} at index ${dropIndex} - ${error}`)        
    }

    // Optionally, update the state or perform any necessary post-processing
}
