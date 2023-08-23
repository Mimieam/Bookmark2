
// https://developer.chrome.com/docs/extensions/reference/bookmarks/#event-onChanged

import { EventEnum, eventBus } from "../shared/events"
import { refresh_ui, stack } from "./components/store"

/**
 * move a set a bookmark one at a time to their new parent location
 * their position in the array of bookmark will be used at index
 * */
export const moveAllBookmark = async (bookmarkIds, parentId) =>{
    // await chrome.bookmarks.move("1075", {index: 0, parentId: '1'})
    const moves = bookmarkIds.map(async (bmId, idx)=>{
        try {
            return await chrome.bookmarks.move(bmId, {index: idx, parentId: parentId})
        } catch (error) {
            console.log(`Error moving bookmark ${bmId}`, error)
        }
    })

    return Promise.all(moves)
}

export async function getBookmarks() {
    const res = await chrome.bookmarks.getTree();
    console.log({res})
    res[0].expanded=true
    stack.push(res)
    globalThis.stack = stack
    return res
}

export async function filterFolders(bookmarkTree) {
    function __filterFolder(node) {
      if (!node.children || node.children.length === 0) {
        return null; // Return null for nodes with no children
      }
      const folderObject = {
        title: node.title||"",
        id: node.id,
        parentId: node.parentId||"",
        children: []
      };

      for (const childNode of node.children) {
        const childFolder = _filterFolder(childNode);
        if (childFolder) {
          folderObject.children.push(childFolder);
        }
      }
      return folderObject;
    }

    function _filterFolder(node) {
        if (!node.children || node.children.length === 0) {
            return null; // Remove the node without children
        }

        const modifiedChildren = node.children
            .map(childNode => _filterFolder(childNode))
            .filter(childNode => childNode !== null);

        return { ...node, children: modifiedChildren };
      }

    const [rootBookmarkNode] = bookmarkTree|| await chrome.bookmarks.getTree();
    let folders = _filterFolder(rootBookmarkNode);
    console.log("ROOt = ", [folders])
    return [folders]
}

export const addParentToEachNode = (node, parent=null)=>{
    node.parent = parent
    if (node.children) {
        const _parent = node
        node.children.forEach(n => {
            return addParentToEachNode(n, _parent)
        });
    }
    return node
}

const refreshBookmarksUI = ()=>{
    // refresh_ui.update((n) => n+1)
    getBookmarks()
    console.log('refreshing bookmarks UI')
}
globalThis.refreshBookmarksUI = refreshBookmarksUI
globalThis.refresh_ui = refresh_ui

const saveToBookmarks = () => {
    console.log('saving bookmarks')
}


chrome.bookmarks.onChanged.addListener(()=>{console.log("bookmarks.onChanged triggered"); refreshBookmarksUI()})
chrome.bookmarks.onChildrenReordered.addListener(()=>{console.log("bookmarks.onChildrenReordered triggered"); refreshBookmarksUI()})
chrome.bookmarks.onCreated.addListener(()=>{console.log("bookmarks.onCreated triggered"); refreshBookmarksUI()})
// chrome.bookmarks.onImportBegan.addListener(()=>{console.log("bookmarks.onImportBegan triggered"); refreshBookmarksUI()})
// chrome.bookmarks.onImportEnded.addListener(()=>{console.log("bookmarks.onImportEnded triggered"); refreshBookmarksUI()})
chrome.bookmarks.onMoved.addListener(()=>{console.log("bookmarks.onMoved triggered"); refreshBookmarksUI()})
chrome.bookmarks.onRemoved.addListener(()=>{console.log("bookmarks.onRemoved triggered"); refreshBookmarksUI()})
const me = "popup"
console.log("ME = ", me, EventEnum)
const ignored_events = [EventEnum.TreeNodeSelected]
for (const event_name in EventEnum) {
// eventBus.subscribe(EventEnum[event_name], fnWrap(event_name, eventEnumHandlers[EventEnum[event_name]], [me]))
    if (!ignored_events.includes(EventEnum[event_name])){
        eventBus.subscribe(EventEnum[event_name], "popup", (src, data)=>{console.log(`EVENT-[${event_name}] SENT FROM [${src}] TO [${me}] `, data)} )
    }
}
