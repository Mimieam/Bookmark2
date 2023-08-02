const get_bm_node_parent = (tree, node) =>{
    (node.parentId)
}

const addParentToEachNode = (node, parent=null)=>{
    node.parent = parent
    if (node.children) {
        const _parent = node
        node.children.forEach(n => {
            return addParentToEachNode(n, _parent)
        });
    }
    return node
}

const flat_node_map = (node)=>{
    let children = node.children? node.children.map(cn => flat_node_map(cn)): []
    console.log(children)
    let res = {
        // ...Object.assign({}, ...children.map(o => ({[o.key]: o.value}))),
        ...Object.assign({}, ...children),
        [node.id]:node,

    }
    return res
}
globalThis.flat_node_map = flat_node_map

function *format_iter(_this, name_cb, connectors, fm) {
    connectors !== null && connectors !== void 0 ? connectors : (connectors = ["    ", " |  ", " ╰─ ", " ├─ "]);
    name_cb !== null && name_cb !== void 0 ? name_cb : (name_cb = (node) => "" + node);
    function _is_last(node) {
        if (node.parentId){
            const ca = fm[node.parentId].children;
            return node === ca[ca.length - 1];
        }
        else {
            return true
        }
    }
    const _format_line = (node) => {
        // https://www.measurethat.net/Benchmarks/Show/12196/0/arr-unshift-vs-push-reverse-small-array
        const parts = [name_cb(node)];
        parts.unshift(connectors[_is_last(node) ? 2 : 3]);
        let p = fm[node.parentId];
        while (p && p !== _this) {
            // `this` is the top node
            parts.unshift(connectors[_is_last(p) ? 0 : 1]);
            p = fm[p.parentId];
        }
        return parts.join("");
    };
    yield name_cb(_this);
    for (let node of _this) {
        yield _format_line(node);
    }
}


export function displayTree(_this, name_cb, connectors) {
    // _this = [{..}]

    let [root] = _this
    root = structuredClone(root)
    _this = addParentToEachNode(root, root)
    console.log({root})
    const fm = flat_node_map(root)

    const a = [];
    for (let line of format_iter([_this], name_cb, connectors, fm)) {
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
