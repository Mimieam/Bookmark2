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

export async function moveBookmark(dragNode, dropNode, dropInfo) {
    // console.log({ dragNode, dropNode, dropInfo })
    // // Get the IDs of the bookmark nodes being dragged and dropped
    const isFolder = !dropNode.isLeaf;
    const dragBookmarkId = dragNode.raw_data.id;

    // found in the last position of semi-ui dropNode info 
    const dropPos = dropNode.pos.split('-');
    const dropPosition = dropInfo.dropPosition - Number(dropPos[dropPos.length - 1]);

    const correctDropNode = dropNode.raw_data?.children ? dropNode : (await chrome.bookmarks.getSubTree(dropNode.raw_data.parentId)).pop()
    let dropId = correctDropNode?.raw_data?.id || correctDropNode.id,
        dropIndex = Number(dropInfo.node.pos.split('-').pop()) + dropInfo.dropPosition
        
    // Move the bookmark in the browser's bookmark tree
    // dropId = dropNode.parentId

    dropIndex = +dropNode.pos.split('-').pop()
    console.log(`isFolder=${isFolder}, dropPosition=${dropPosition}, dropIndex=${dropIndex}`)
    
    if (isFolder){
        if (dropPosition === -1) {
            // drop in parent
            dropId = dropNode.parentId
            // console.log(`Drop in parent`, dropId)
        } else if (dropPosition === 1) {
            dropId = dropNode.raw_data.id
            dropIndex = 0
            // console.log(`Drop in itself at top`, dropId, dropPosition)
        } else {
            dropId = dropNode.raw_data.id
            dropIndex = dropPosition
            // console.log(`Drop in itself`, dropId, dropPosition)
        }

    } else {
        if (dropPosition === -1) {
            dropId = dropNode.parentId
            dropIndex = +dropNode.pos.split('-').pop()
            // console.log(`Drop in itself at top`, dropId, dropPosition)
        } else {
            // dropId = dropNode.raw_data.id
            dropIndex = +dropNode.pos.split('-').pop()+1
            // console.log(`Drop in itself keep index`, dropId, dropPosition)
        }
    }
    
    
    // try {
        console.log(`Trying to move bookmark [${dragBookmarkId}] to ${dropNode.parentId} at index ${dropIndex}.`);
        await chrome.bookmarks.move(dragBookmarkId, {
            parentId: dropId,
            // index: dropPosition < 0 ? Number(dropNode.pos.split('-').pop()) + 1 : Number(dropNode.pos.split('-').pop())
            index: dropIndex
        });
        // TODO: After a bookmark is moved... its data need to be remapped to stay in sync with the UI... otherwise the UI tree parentKeys will be messed up
        
        console.log(`Moved bookmark ${dragBookmarkId} to parent ${dropId} at index ${dropIndex}.`);
    // } catch (error) {
    //     console.info(`Error Moving bookmark ${dragBookmarkId} to parent ${dropId} at index ${dropIndex} - ${error}`)        
    // }

    // Optionally, update the state or perform any necessary post-processing
}

export function searchAndUpdate(tree, searchKey, searchValue, updateData) {
    function traverse(node) {
        console.log(searchKey, node[searchKey], searchValue)
        if (node[searchKey] === searchValue) {
            node = {
                ...node,
                ...updateData,
            };
            console.log("searchAndUpdate", node)
            return true; // Found and updated
        }

        if (node.children) {
            for (const child of node.children) {
                if (traverse(child)) {
                    return true; // Found and updated in child
                }
            }
        }

        return false; // Not found in this subtree
    }

    return [traverse(tree), tree];
}

export function reindexChildren(tree) {
    const _tree = {...tree}

    if (_tree.children) {
        _tree.children.forEach((child, index) => {
            // console.log(child.key, child.isLeaf ? "🍃" : '🟡', child.count, child.label)
            child.index = index;
            child.parentId = _tree.id;
            child.parentKey = _tree.key;
            child.key = _tree.key ? `${_tree.key }-${index}` : `${index}`;
            
            reindexChildren(child);
            // child.count = child.isLeaf ? 1 : 0

            if (child.children) {
                child.count = child.children?.map(c => c?.count | 0).reduce((a, b) => a + b, 0)
            } else {
                child.count = child.isLeaf ? 1 : 0
            }


        });
        _tree.count = _tree.children.map(child => child.count | 0).reduce((a, b) => a + b, 0)
        // console.log(_tree.key, _tree.count)
    }

    return _tree;
}
