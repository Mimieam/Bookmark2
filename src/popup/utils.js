const get_bm_node_parent = (tree, node) =>{
    (node.parentId)
}

const addParentToEachNode = (node, parent=null)=>{
    node.parent = parent
    if (node.children) {
        // console.log(node, node.children)
        const _parent = node
        node.children.forEach(n => {
            return addParentToEachNode(n, _parent)
        });
    }
    return node
}

const flat_node_map = (node)=>{

    let children = node.children? node.children.map(cn => flat_node_map(cn)): []
    // console.log(node.id, node, {children})
    let res = {
        // ...Object.assign({}, ...children.map(o => ({[o.key]: o.value}))),
        ...Object.assign({}, ...children),
        [node.id]:node,
    }
    return res
}
globalThis.flat_node_map = flat_node_map

const myDynamicSymbolIterator = function*(){
    const cl = this.children;
    if (cl) {
        for (let i = 0, l = cl.length; i < l; i++) {
            const n = cl[i];
            if (!n[Symbol.iterator]){
                n[Symbol.iterator] = myDynamicSymbolIterator
            }
            yield n;
            if (n.children) {
                yield* n;
            }
        }
    }
}

function *format_iter(_this, name_cb, connectors, fm) {
    connectors !== null && connectors !== void 0 ? connectors : (connectors = ["    ", " |  ", " ╰─ ", " ├─ "]);
    name_cb !== null && name_cb !== void 0 ? name_cb : (name_cb = (node) => "" + node);
    function _is_last(node) {
        const ca = node.parent.children;
        return node === ca[ca.length - 1];
    }
    const _format_line = (node) => {
        // https://www.measurethat.net/Benchmarks/Show/12196/0/arr-unshift-vs-push-reverse-small-array
        const parts = [name_cb(node)];
        parts.unshift(connectors[_is_last(node) ? 2 : 3]);
        let p = node.parent;
        while (p && p.id !== "0") {
            // `this` is the top node
            parts.unshift(connectors[_is_last(p) ? 0 : 1]);
            p = p.parent;
        }
        return parts.join("");
    };
    yield name_cb(_this);
    _this[Symbol.iterator] = myDynamicSymbolIterator
    for (let node of _this) {
        yield _format_line(node);
    }
}


export function displayTree(_this, name_cb, connectors) {
    _this = addParentToEachNode(_this, _this)
    const fm = flat_node_map(_this)

    const a = [];
    for (let line of format_iter(_this, name_cb, connectors, fm)) {
        a.push(line);
    }
    return a.join("\n");
}

// https://stackoverflow.com/a/61410824/623546
export const styleToString = (style) => {
    return Object.keys(style).reduce((acc, key) => (
        acc + key.split(/(?=[A-Z])/).join('-').toLowerCase() + ':' + style[key] + ';'
    ), '');
};



// function makeIndent(indentLength) {
//     return ".".repeat(indentLength);
//   }

//   function logItems(bookmarkItem, indent) {
//     if (bookmarkItem.url) {
//       console.log(makeIndent(indent) + bookmarkItem.url);
//     } else {
//       console.log(`${makeIndent(indent)}Folder`);
//       indent++;
//     }
//     if (bookmarkItem.children) {
//       for (const child of bookmarkItem.children) {
//         logItems(child, indent);
//       }
//     }
//     indent--;
//   }

//   function logTree(bookmarkItems) {
//     logItems(bookmarkItems[0], 0);
//   }

//   function onRejected(error) {
//     console.log(`An error: ${error}`);
//   }

//   let gettingTree = browser.bookmarks.getTree();
//   gettingTree.then(logTree, onRejected);