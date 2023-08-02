
// https://developer.chrome.com/docs/extensions/reference/bookmarks/#event-onChanged

import { refresh_ui, stack } from "./components/store"


export async function getBookmarks() {
    const res = await chrome.bookmarks.getTree();
    console.log({res})
    res[0].expanded=true
    stack.push(res)
    globalThis.stack = stack
    return res
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
chrome.bookmarks.onImportBegan.addListener(()=>{console.log("bookmarks.onImportBegan triggered"); refreshBookmarksUI()})
chrome.bookmarks.onImportEnded.addListener(()=>{console.log("bookmarks.onImportEnded triggered"); refreshBookmarksUI()})
chrome.bookmarks.onMoved.addListener(()=>{console.log("bookmarks.onMoved triggered"); refreshBookmarksUI()})
chrome.bookmarks.onRemoved.addListener(()=>{console.log("bookmarks.onRemoved triggered"); refreshBookmarksUI()})