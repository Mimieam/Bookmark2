import { writable, derived, get } from 'svelte/store';
import { displayTree } from '../../utils';

export const refresh_ui = writable(true)

// export const leftTreeStore = writable(null)
// export const rightTreeStore = writable(null)
export const loadedTrees = writable(0)
export const Trees = writable([])
export const Forest = writable([])
export const bookmarksLoaded = writable(false)
export const isSyncingTrees = writable(false)
export const source = writable([])
export const source2 = writable(
  [
    {
        "children": [
            {
                "children": [],
                "dateAdded": 1690465904942,
                "id": "1",
                "index": 0,
                "parentId": "0",
                "title": "Bookmarks Bar"
            },
            {
                "children": [],
                "dateAdded": 1690465904942,
                "id": "2",
                "index": 1,
                "parentId": "0",
                "title": "Other Bookmarks"
            }
        ],
        "expanded": true,
        "dateAdded": 1690465904942,
        "id": "0",
        "title": ""
    }
]);

// export const stack = writable([])

globalThis.get = get
function createEmptyStack(limit=10) {
    // const { subscribe, set, update }  = writable([]);
    const _stack = writable([]);
    const { subscribe, set, update } = _stack

	return {
		subscribe,
        set,
        update,
        push: (state_obj) => update(_stack => {
            // [s0, s1, s2...]
            _stack.push(structuredClone(state_obj))
            console.log("Pushed on top")
            if (_stack.length > 10){
                // remove the oldest element
                _stack.shift()

                console.log("removing > 10")
            }
            return _stack
        }),
        /**
         * remove the latest element from the stack
         * @returns the last inserted element
         */
		pop: () => {
            const bottomObj = get(_stack).pop();
            return bottomObj
        },
        peek: ()=> get(stack),
        find: ()=>{},

        printAll:(cb=(n)=>`${n.title} ${n?.children?.length||''}`)=>{
             // [s0, s1, s2...] from oldest to youngest
            const myStack = get(stack)
            myStack.map((state, idx) => {
                const [treeRoot] = state
                console.groupCollapsed("Tree #", idx)
                console.info(displayTree(treeRoot, cb))
                console.groupEnd()
            })
        },
        print: (idx, expanded=false, cb=(n)=>n.title)=>{
            const myStack = get(stack)
            idx = idx && (0 < idx)&& (idx < myStack.length) ? idx: myStack.length - 1
            const state = myStack[idx]
            const [treeRoot] = state

            expanded? console.group("Tree #", idx) : console.groupCollapsed("Tree #", idx)
            console.info(displayTree(treeRoot, cb))
            console.groupEnd()

        },
        updateButKeepExpanded: ()=> {

        },

		reset: () => set([])
		// three: () => update((n) => {
		// 	n = n+1
		// 	return n
		// })
	};
}

export const stack = createEmptyStack();