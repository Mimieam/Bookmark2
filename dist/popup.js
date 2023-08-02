/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/popup/components/store/index.js":
/*!*********************************************!*\
  !*** ./src/popup/components/store/index.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "bookmarksLoaded": () => (/* binding */ bookmarksLoaded),
/* harmony export */   "loadedTrees": () => (/* binding */ loadedTrees),
/* harmony export */   "refresh_ui": () => (/* binding */ refresh_ui),
/* harmony export */   "source": () => (/* binding */ source),
/* harmony export */   "stack": () => (/* binding */ stack)
/* harmony export */ });
/* unused harmony exports Trees, isSyncingTrees, source2 */
/* harmony import */ var svelte_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! svelte/store */ "./node_modules/.pnpm/svelte@3.50.1/node_modules/svelte/store/index.mjs");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils */ "./src/popup/utils.js");


const refresh_ui = (0,svelte_store__WEBPACK_IMPORTED_MODULE_0__.writable)(true);
const loadedTrees = (0,svelte_store__WEBPACK_IMPORTED_MODULE_0__.writable)(0);
const Trees = (0,svelte_store__WEBPACK_IMPORTED_MODULE_0__.writable)([]);
const bookmarksLoaded = (0,svelte_store__WEBPACK_IMPORTED_MODULE_0__.writable)(false);
const isSyncingTrees = (0,svelte_store__WEBPACK_IMPORTED_MODULE_0__.writable)(false);
const source = (0,svelte_store__WEBPACK_IMPORTED_MODULE_0__.writable)([]);
const source2 = (0,svelte_store__WEBPACK_IMPORTED_MODULE_0__.writable)(
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
  ]
);
globalThis.get = svelte_store__WEBPACK_IMPORTED_MODULE_0__.get;
function createEmptyStack(limit = 10) {
  const _stack = (0,svelte_store__WEBPACK_IMPORTED_MODULE_0__.writable)([]);
  const { subscribe, set, update } = _stack;
  return {
    subscribe,
    set,
    update,
    push: (state_obj) => update((_stack2) => {
      _stack2.push(structuredClone(state_obj));
      console.log("Pushed on top");
      if (_stack2.length > 10) {
        _stack2.shift();
        console.log("removing > 10");
      }
      return _stack2;
    }),
    pop: () => {
      const bottomObj = (0,svelte_store__WEBPACK_IMPORTED_MODULE_0__.get)(_stack).pop();
      return bottomObj;
    },
    peek: () => (0,svelte_store__WEBPACK_IMPORTED_MODULE_0__.get)(stack),
    find: () => {
    },
    print: () => {
      const arr = (0,svelte_store__WEBPACK_IMPORTED_MODULE_0__.get)(stack);
      arr.map((s, idx) => {
        console.log(`pos ${idx}:`);
        console.log((0,_utils__WEBPACK_IMPORTED_MODULE_1__.displayTree)(s, (n) => n.title));
      });
    },
    updateButKeepExpanded: () => {
    },
    reset: () => set([])
  };
}
const stack = createEmptyStack();


/***/ }),

/***/ "./src/popup/index.js":
/*!****************************!*\
  !*** ./src/popup/index.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

/* harmony import */ var _App_svelte__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./App.svelte */ "./src/popup/App.svelte");

const app = new _App_svelte__WEBPACK_IMPORTED_MODULE_0__["default"]({
  target: document.body,
  props: {
    name: "Bookmark 2"
  }
});
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = (app);


/***/ }),

/***/ "./src/popup/utils.js":
/*!****************************!*\
  !*** ./src/popup/utils.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "displayTree": () => (/* binding */ displayTree),
/* harmony export */   "styleToString": () => (/* binding */ styleToString)
/* harmony export */ });
const get_bm_node_parent = (tree, node) => {
  node.parentId;
};
const addParentToEachNode = (node, parent = null) => {
  node.parent = parent;
  if (node.children) {
    const _parent = node;
    node.children.forEach((n) => {
      return addParentToEachNode(n, _parent);
    });
  }
  return node;
};
const flat_node_map = (node) => {
  let children = node.children ? node.children.map((cn) => flat_node_map(cn)) : [];
  console.log(children);
  let res = {
    ...Object.assign({}, ...children),
    [node.id]: node
  };
  return res;
};
globalThis.flat_node_map = flat_node_map;
function* format_iter(_this, name_cb, connectors, fm) {
  connectors !== null && connectors !== void 0 ? connectors : connectors = ["    ", " |  ", " \u2570\u2500 ", " \u251C\u2500 "];
  name_cb !== null && name_cb !== void 0 ? name_cb : name_cb = (node) => "" + node;
  function _is_last(node) {
    if (node.parentId) {
      const ca = fm[node.parentId].children;
      return node === ca[ca.length - 1];
    } else {
      return true;
    }
  }
  const _format_line = (node) => {
    const parts = [name_cb(node)];
    parts.unshift(connectors[_is_last(node) ? 2 : 3]);
    let p = fm[node.parentId];
    while (p && p !== _this) {
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
function displayTree(_this, name_cb, connectors) {
  let [root] = _this;
  root = structuredClone(root);
  _this = addParentToEachNode(root, root);
  console.log({ root });
  const fm = flat_node_map(root);
  const a = [];
  for (let line of format_iter([_this], name_cb, connectors, fm)) {
    a.push(line);
  }
  return a.join("\n");
}
const styleToString = (style) => {
  return Object.keys(style).reduce((acc, key) => acc + key.split(/(?=[A-Z])/).join("-").toLowerCase() + ":" + style[key] + ";", "");
};


/***/ }),

/***/ "./src/popup/App.svelte":
/*!******************************************!*\
  !*** ./src/popup/App.svelte + 1 modules ***!
  \******************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ App_svelte)
});

// EXTERNAL MODULE: ./node_modules/.pnpm/svelte@3.50.1/node_modules/svelte/internal/index.mjs
var internal = __webpack_require__("./node_modules/.pnpm/svelte@3.50.1/node_modules/svelte/internal/index.mjs");
// EXTERNAL MODULE: ./src/popup/components/globals/Theme.svelte
var Theme_svelte = __webpack_require__("./src/popup/components/globals/Theme.svelte");
// EXTERNAL MODULE: ./node_modules/.pnpm/svelte@3.50.1/node_modules/svelte/index.mjs
var svelte = __webpack_require__("./node_modules/.pnpm/svelte@3.50.1/node_modules/svelte/index.mjs");
// EXTERNAL MODULE: ./node_modules/.pnpm/crypto-hash@2.0.1/node_modules/crypto-hash/browser.js
var browser = __webpack_require__("./node_modules/.pnpm/crypto-hash@2.0.1/node_modules/crypto-hash/browser.js");
// EXTERNAL MODULE: ./node_modules/.pnpm/theme-change@2.2.0/node_modules/theme-change/index.js
var theme_change = __webpack_require__("./node_modules/.pnpm/theme-change@2.2.0/node_modules/theme-change/index.js");
// EXTERNAL MODULE: ./src/popup/components/fileSystem/SplitPanel.svelte
var SplitPanel_svelte = __webpack_require__("./src/popup/components/fileSystem/SplitPanel.svelte");
// EXTERNAL MODULE: ./src/popup/components/fileSystem/TreeView.svelte
var TreeView_svelte = __webpack_require__("./src/popup/components/fileSystem/TreeView.svelte");
// EXTERNAL MODULE: ./node_modules/.pnpm/@iconify+svelte@3.1.3_svelte@3.50.1/node_modules/@iconify/svelte/dist/Icon.svelte + 1 modules
var Icon_svelte = __webpack_require__("./node_modules/.pnpm/@iconify+svelte@3.1.3_svelte@3.50.1/node_modules/@iconify/svelte/dist/Icon.svelte");
// EXTERNAL MODULE: ./node_modules/.pnpm/@iconify+icons-line-md@1.2.22/node_modules/@iconify/icons-line-md/moon-filled-alt-loop.js
var moon_filled_alt_loop = __webpack_require__("./node_modules/.pnpm/@iconify+icons-line-md@1.2.22/node_modules/@iconify/icons-line-md/moon-filled-alt-loop.js");
// EXTERNAL MODULE: ./node_modules/.pnpm/@iconify+icons-line-md@1.2.22/node_modules/@iconify/icons-line-md/moon-alt-to-sunny-outline-loop-transition.js
var moon_alt_to_sunny_outline_loop_transition = __webpack_require__("./node_modules/.pnpm/@iconify+icons-line-md@1.2.22/node_modules/@iconify/icons-line-md/moon-alt-to-sunny-outline-loop-transition.js");
// EXTERNAL MODULE: ./src/popup/components/store/index.js
var store = __webpack_require__("./src/popup/components/store/index.js");
;// CONCATENATED MODULE: ./src/popup/popup.js

async function getBookmarks() {
  const res = await chrome.bookmarks.getTree();
  console.log({ res });
  res[0].expanded = true;
  store.stack.push(res);
  globalThis.stack = store.stack;
  return res;
}
const addParentToEachNode = (node, parent = null) => {
  node.parent = parent;
  if (node.children) {
    const _parent = node;
    node.children.forEach((n) => {
      return addParentToEachNode(n, _parent);
    });
  }
  return node;
};
const refreshBookmarksUI = () => {
  getBookmarks();
  console.log("refreshing bookmarks UI");
};
globalThis.refreshBookmarksUI = refreshBookmarksUI;
globalThis.refresh_ui = store.refresh_ui;
const saveToBookmarks = () => {
  console.log("saving bookmarks");
};
chrome.bookmarks.onChanged.addListener(() => {
  console.log("bookmarks.onChanged triggered");
  refreshBookmarksUI();
});
chrome.bookmarks.onChildrenReordered.addListener(() => {
  console.log("bookmarks.onChildrenReordered triggered");
  refreshBookmarksUI();
});
chrome.bookmarks.onCreated.addListener(() => {
  console.log("bookmarks.onCreated triggered");
  refreshBookmarksUI();
});
chrome.bookmarks.onImportBegan.addListener(() => {
  console.log("bookmarks.onImportBegan triggered");
  refreshBookmarksUI();
});
chrome.bookmarks.onImportEnded.addListener(() => {
  console.log("bookmarks.onImportEnded triggered");
  refreshBookmarksUI();
});
chrome.bookmarks.onMoved.addListener(() => {
  console.log("bookmarks.onMoved triggered");
  refreshBookmarksUI();
});
chrome.bookmarks.onRemoved.addListener(() => {
  console.log("bookmarks.onRemoved triggered");
  refreshBookmarksUI();
});

// EXTERNAL MODULE: ./node_modules/.pnpm/wunderbaum@0.3.5/node_modules/wunderbaum/dist/wunderbaum.esm.js
var wunderbaum_esm = __webpack_require__("./node_modules/.pnpm/wunderbaum@0.3.5/node_modules/wunderbaum/dist/wunderbaum.esm.js");
// EXTERNAL MODULE: ./node_modules/.pnpm/svelte-loader@3.1.3_svelte@3.50.1/node_modules/svelte-loader/lib/hot-api.js + 4 modules
var hot_api = __webpack_require__("./node_modules/.pnpm/svelte-loader@3.1.3_svelte@3.50.1/node_modules/svelte-loader/lib/hot-api.js");
// EXTERNAL MODULE: ./node_modules/.pnpm/svelte-hmr@0.14.12_svelte@3.50.1/node_modules/svelte-hmr/runtime/proxy-adapter-dom.js + 1 modules
var proxy_adapter_dom = __webpack_require__("./node_modules/.pnpm/svelte-hmr@0.14.12_svelte@3.50.1/node_modules/svelte-hmr/runtime/proxy-adapter-dom.js");
;// CONCATENATED MODULE: ./src/popup/App.svelte
/* module decorator */ module = __webpack_require__.hmd(module);
/* src/popup/App.svelte generated by Svelte v3.50.1 */


const { console: console_1 } = internal.globals;


// import "./popup"






// import LogOverlay from './components/fileSystem/LogOverlay.svelte';


// import Toolbar from "./components/fileSystem/Toolbar.svelte";









const file = "src/popup/App.svelte";

// (1:0) <script>   import "./components/globals/Theme.svelte";   // import "./popup"    import { onMount }
function create_catch_block(ctx) {
	const block = {
		c: internal.noop,
		m: internal.noop,
		p: internal.noop,
		i: internal.noop,
		o: internal.noop,
		d: internal.noop
	};

	(0,internal.dispatch_dev)("SvelteRegisterBlock", {
		block,
		id: create_catch_block.name,
		type: "catch",
		source: "(1:0) <script>   import \\\"./components/globals/Theme.svelte\\\";   // import \\\"./popup\\\"    import { onMount }",
		ctx
	});

	return block;
}

// (123:36)      <SplitPanel leftPanelWidth="50%" rightPanelWidth="50%">       <div slot="left">             <!-- <div> -->           <TreeView               treeSource={data}
function create_then_block(ctx) {
	let splitpanel;
	let current;

	splitpanel = new SplitPanel_svelte["default"]({
			props: {
				leftPanelWidth: "50%",
				rightPanelWidth: "50%",
				$$slots: {
					right: [create_right_slot],
					left: [create_left_slot]
				},
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			(0,internal.create_component)(splitpanel.$$.fragment);
		},
		m: function mount(target, anchor) {
			(0,internal.mount_component)(splitpanel, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const splitpanel_changes = {};

			if (dirty & /*$$scope*/ 2048) {
				splitpanel_changes.$$scope = { dirty, ctx };
			}

			splitpanel.$set(splitpanel_changes);
		},
		i: function intro(local) {
			if (current) return;
			(0,internal.transition_in)(splitpanel.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			(0,internal.transition_out)(splitpanel.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			(0,internal.destroy_component)(splitpanel, detaching);
		}
	};

	(0,internal.dispatch_dev)("SvelteRegisterBlock", {
		block,
		id: create_then_block.name,
		type: "then",
		source: "(123:36)      <SplitPanel leftPanelWidth=\\\"50%\\\" rightPanelWidth=\\\"50%\\\">       <div slot=\\\"left\\\">             <!-- <div> -->           <TreeView               treeSource={data}",
		ctx
	});

	return block;
}

// (125:6) 
function create_left_slot(ctx) {
	let div;
	let treeview;
	let current;

	treeview = new TreeView_svelte["default"]({
			props: {
				treeSource: /*data*/ ctx[10],
				rootID: "leftTree",
				treeDOM: "leftTreeDOM",
				parentDOM: "leftParentDOM",
				thisTree: store.leftTreeStore,
				otherTree: store.rightTreeStore
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			div = (0,internal.element)("div");
			(0,internal.create_component)(treeview.$$.fragment);
			(0,internal.attr_dev)(div, "slot", "left");
			(0,internal.add_location)(div, file, 124, 6, 3505);
		},
		m: function mount(target, anchor) {
			(0,internal.insert_dev)(target, div, anchor);
			(0,internal.mount_component)(treeview, div, null);
			current = true;
		},
		p: internal.noop,
		i: function intro(local) {
			if (current) return;
			(0,internal.transition_in)(treeview.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			(0,internal.transition_out)(treeview.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) (0,internal.detach_dev)(div);
			(0,internal.destroy_component)(treeview);
		}
	};

	(0,internal.dispatch_dev)("SvelteRegisterBlock", {
		block,
		id: create_left_slot.name,
		type: "slot",
		source: "(125:6) ",
		ctx
	});

	return block;
}

// (137:4) 
function create_right_slot(ctx) {
	let div;
	let treeview;
	let current;

	treeview = new TreeView_svelte["default"]({
			props: {
				treeSource: structuredClone(/*data*/ ctx[10]),
				rootID: "rightTree",
				treeDOM: "rightTreeDOM",
				parentDOM: "rightParentDOM"
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			div = (0,internal.element)("div");
			(0,internal.create_component)(treeview.$$.fragment);
			(0,internal.attr_dev)(div, "class", "bg-black");
			(0,internal.attr_dev)(div, "slot", "right");
			(0,internal.add_location)(div, file, 136, 4, 3842);
		},
		m: function mount(target, anchor) {
			(0,internal.insert_dev)(target, div, anchor);
			(0,internal.mount_component)(treeview, div, null);
			current = true;
		},
		p: internal.noop,
		i: function intro(local) {
			if (current) return;
			(0,internal.transition_in)(treeview.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			(0,internal.transition_out)(treeview.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) (0,internal.detach_dev)(div);
			(0,internal.destroy_component)(treeview);
		}
	};

	(0,internal.dispatch_dev)("SvelteRegisterBlock", {
		block,
		id: create_right_slot.name,
		type: "slot",
		source: "(137:4) ",
		ctx
	});

	return block;
}

// (1:0) <script>   import "./components/globals/Theme.svelte";   // import "./popup"    import { onMount }
function create_pending_block(ctx) {
	const block = {
		c: internal.noop,
		m: internal.noop,
		p: internal.noop,
		i: internal.noop,
		o: internal.noop,
		d: internal.noop
	};

	(0,internal.dispatch_dev)("SvelteRegisterBlock", {
		block,
		id: create_pending_block.name,
		type: "pending",
		source: "(1:0) <script>   import \\\"./components/globals/Theme.svelte\\\";   // import \\\"./popup\\\"    import { onMount }",
		ctx
	});

	return block;
}

// (122:0) {#key refresh}
function create_key_block(ctx) {
	let await_block_anchor;
	let promise;
	let current;

	let info = {
		ctx,
		current: null,
		token: null,
		hasCatch: false,
		pending: create_pending_block,
		then: create_then_block,
		catch: create_catch_block,
		value: 10,
		blocks: [,,,]
	};

	(0,internal.handle_promise)(promise = getBookmarks(), info);

	const block = {
		c: function create() {
			await_block_anchor = (0,internal.empty)();
			info.block.c();
		},
		m: function mount(target, anchor) {
			(0,internal.insert_dev)(target, await_block_anchor, anchor);
			info.block.m(target, info.anchor = anchor);
			info.mount = () => await_block_anchor.parentNode;
			info.anchor = await_block_anchor;
			current = true;
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			(0,internal.update_await_block_branch)(info, ctx, dirty);
		},
		i: function intro(local) {
			if (current) return;
			(0,internal.transition_in)(info.block);
			current = true;
		},
		o: function outro(local) {
			for (let i = 0; i < 3; i += 1) {
				const block = info.blocks[i];
				(0,internal.transition_out)(block);
			}

			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) (0,internal.detach_dev)(await_block_anchor);
			info.block.d(detaching);
			info.token = null;
			info = null;
		}
	};

	(0,internal.dispatch_dev)("SvelteRegisterBlock", {
		block,
		id: create_key_block.name,
		type: "key",
		source: "(122:0) {#key refresh}",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let p;
	let t1;
	let nav;
	let h3;
	let t2;
	let t3;
	let t4_value = "{+" + "";
	let t4;
	let t5;
	let t6_value = "+}" + "";
	let t6;
	let t7;
	let button;
	let input;
	let t8;
	let icon;
	let t9;
	let div;
	let t10;
	let t11;
	let previous_key = /*refresh*/ ctx[3];
	let current;
	let mounted;
	let dispose;

	icon = new Icon_svelte["default"]({
			props: {
				icon: /*isDarkMode*/ ctx[1]
				? moon_alt_to_sunny_outline_loop_transition["default"]
				: moon_filled_alt_loop["default"]
			},
			$$inline: true
		});

	let key_block = create_key_block(ctx);

	const block = {
		c: function create() {
			p = (0,internal.element)("p");
			p.textContent = "Happy Bookmarking you wild one, it's gonna be ok!";
			t1 = (0,internal.space)();
			nav = (0,internal.element)("nav");
			h3 = (0,internal.element)("h3");
			t2 = (0,internal.text)(/*name*/ ctx[0]);
			t3 = (0,internal.text)(" - ");
			t4 = (0,internal.text)(t4_value);
			t5 = (0,internal.text)(" Live Mode ");
			t6 = (0,internal.text)(t6_value);
			t7 = (0,internal.space)();
			button = (0,internal.element)("button");
			input = (0,internal.element)("input");
			t8 = (0,internal.space)();
			(0,internal.create_component)(icon.$$.fragment);
			t9 = (0,internal.space)();
			div = (0,internal.element)("div");
			t10 = (0,internal.text)(/*$loadedTrees*/ ctx[4]);
			t11 = (0,internal.space)();
			key_block.c();
			(0,internal.add_location)(p, file, 92, 0, 2736);
			(0,internal.add_location)(h3, file, 94, 2, 2839);
			(0,internal.attr_dev)(input, "type", "checkbox");
			input.hidden = true;
			(0,internal.attr_dev)(input, "data-toggle-theme", "dark,light");
			(0,internal.attr_dev)(input, "data-act-class", "ACTIVECLASS");
			(0,internal.add_location)(input, file, 101, 4, 2996);
			(0,internal.attr_dev)(button, "class", "p-1");
			(0,internal.add_location)(button, file, 95, 2, 2883);
			(0,internal.attr_dev)(nav, "class", "flex row mb-5 justify-between");
			(0,internal.add_location)(nav, file, 93, 0, 2793);
			(0,internal.attr_dev)(div, "class", "");
			(0,internal.add_location)(div, file, 116, 0, 3313);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			(0,internal.insert_dev)(target, p, anchor);
			(0,internal.insert_dev)(target, t1, anchor);
			(0,internal.insert_dev)(target, nav, anchor);
			(0,internal.append_dev)(nav, h3);
			(0,internal.append_dev)(h3, t2);
			(0,internal.append_dev)(h3, t3);
			(0,internal.append_dev)(h3, t4);
			(0,internal.append_dev)(h3, t5);
			(0,internal.append_dev)(h3, t6);
			(0,internal.append_dev)(nav, t7);
			(0,internal.append_dev)(nav, button);
			(0,internal.append_dev)(button, input);
			input.checked = /*isDarkMode*/ ctx[1];
			/*input_binding*/ ctx[6](input);
			(0,internal.append_dev)(button, t8);
			(0,internal.mount_component)(icon, button, null);
			(0,internal.insert_dev)(target, t9, anchor);
			(0,internal.insert_dev)(target, div, anchor);
			(0,internal.append_dev)(div, t10);
			(0,internal.append_dev)(div, t11);
			key_block.m(div, null);
			current = true;

			if (!mounted) {
				dispose = [
					(0,internal.listen_dev)(input, "change", /*input_change_handler*/ ctx[5]),
					(0,internal.listen_dev)(button, "click", /*click_handler*/ ctx[7], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (!current || dirty & /*name*/ 1) (0,internal.set_data_dev)(t2, /*name*/ ctx[0]);

			if (dirty & /*isDarkMode*/ 2) {
				input.checked = /*isDarkMode*/ ctx[1];
			}

			const icon_changes = {};

			if (dirty & /*isDarkMode*/ 2) icon_changes.icon = /*isDarkMode*/ ctx[1]
			? moon_alt_to_sunny_outline_loop_transition["default"]
			: moon_filled_alt_loop["default"];

			icon.$set(icon_changes);
			if (!current || dirty & /*$loadedTrees*/ 16) (0,internal.set_data_dev)(t10, /*$loadedTrees*/ ctx[4]);

			if (dirty & /*refresh*/ 8 && (0,internal.safe_not_equal)(previous_key, previous_key = /*refresh*/ ctx[3])) {
				(0,internal.group_outros)();
				(0,internal.transition_out)(key_block, 1, 1, internal.noop);
				(0,internal.check_outros)();
				key_block = create_key_block(ctx);
				key_block.c();
				(0,internal.transition_in)(key_block, 1);
				key_block.m(div, null);
			} else {
				key_block.p(ctx, dirty);
			}
		},
		i: function intro(local) {
			if (current) return;
			(0,internal.transition_in)(icon.$$.fragment, local);
			(0,internal.transition_in)(key_block);
			current = true;
		},
		o: function outro(local) {
			(0,internal.transition_out)(icon.$$.fragment, local);
			(0,internal.transition_out)(key_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) (0,internal.detach_dev)(p);
			if (detaching) (0,internal.detach_dev)(t1);
			if (detaching) (0,internal.detach_dev)(nav);
			/*input_binding*/ ctx[6](null);
			(0,internal.destroy_component)(icon);
			if (detaching) (0,internal.detach_dev)(t9);
			if (detaching) (0,internal.detach_dev)(div);
			key_block.d(detaching);
			mounted = false;
			(0,internal.run_all)(dispose);
		}
	};

	(0,internal.dispatch_dev)("SvelteRegisterBlock", {
		block,
		id: create_fragment.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance($$self, $$props, $$invalidate) {
	let $loadedTrees;
	(0,internal.validate_store)(store.loadedTrees, 'loadedTrees');
	(0,internal.component_subscribe)($$self, store.loadedTrees, $$value => $$invalidate(4, $loadedTrees = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	(0,internal.validate_slots)('App', slots, []);
	let { name } = $$props;
	let isDarkMode;
	let themeSwitch = false;
	let bmarks;

	// NOTE: the element that is using one of the theme attributes must be in the DOM on mount
	(0,svelte.onMount)(async () => {
		// window.localStorage = chrome.storage.local
		(0,theme_change.themeChange)(true);
	}); // refresh_ui.set(true)
	// bmarks = await chrome.bookmarks.getTree();
	// console.log({ bmarks });
	// source.set(bmarks)

	// 👆 false parameter is required for svelte
	let refresh;

	store.refresh_ui.subscribe(val => {
		$$invalidate(3, refresh = val);
		console.log(`UI refreshing...`, refresh);
	});

	// import SplitPanel from "./SplitPanel.svelte";
	//   let treeSource;
	//   source.subscribe((val) => {
	//     treeSource = val;
	//     console.log(`Source Updated!`, treeSource);
	//   });
	let expanded = {};

	document.addEventListener("DOMContentLoaded", () => {
		console.log("DOMContentLoaded! App");

		wunderbaum_esm.Wunderbaum?.util.onEvent(document, "click", ".wb-row", e => {
			console.log({ e });
			const info = wunderbaum_esm.Wunderbaum.getEventInfo(e);
			const node = info.node;

			if (node.isExpandable()) {
				// there will be collisions if the folder names are the same...
				// const hash = await sha256(`${node.title}${node.data.id}`)
				const totally_not_a_hash = `${node.title}${node.data.id}`;

				expanded[totally_not_a_hash] = node.expanded;
				console.log({ expanded, node });
			}
		});
	});

	const writable_props = ['name'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
	});

	function input_change_handler() {
		isDarkMode = this.checked;
		$$invalidate(1, isDarkMode);
	}

	function input_binding($$value) {
		internal.binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			themeSwitch = $$value;
			$$invalidate(2, themeSwitch);
		});
	}

	const click_handler = () => {
		console.log(themeSwitch.click(), isDarkMode);
	};

	$$self.$$set = $$props => {
		if ('name' in $$props) $$invalidate(0, name = $$props.name);
	};

	$$self.$capture_state = () => ({
		onMount: svelte.onMount,
		sha256: browser.sha256,
		themeChange: theme_change.themeChange,
		SplitPanel: SplitPanel_svelte["default"],
		TreeView: TreeView_svelte["default"],
		Icon: Icon_svelte["default"],
		moonFilledAltLoop: moon_filled_alt_loop["default"],
		moonAltToSunnyOutlineLoopTransition: moon_alt_to_sunny_outline_loop_transition["default"],
		leftTreeStore: store.leftTreeStore,
		loadedTrees: store.loadedTrees,
		rightTreeStore: store.rightTreeStore,
		source: store.source,
		bookmarksLoaded: store.bookmarksLoaded,
		refresh_ui: store.refresh_ui,
		stack: store.stack,
		getBookmarks: getBookmarks,
		Wunderbaum: wunderbaum_esm.Wunderbaum,
		name,
		isDarkMode,
		themeSwitch,
		bmarks,
		refresh,
		expanded,
		$loadedTrees
	});

	$$self.$inject_state = $$props => {
		if ('name' in $$props) $$invalidate(0, name = $$props.name);
		if ('isDarkMode' in $$props) $$invalidate(1, isDarkMode = $$props.isDarkMode);
		if ('themeSwitch' in $$props) $$invalidate(2, themeSwitch = $$props.themeSwitch);
		if ('bmarks' in $$props) bmarks = $$props.bmarks;
		if ('refresh' in $$props) $$invalidate(3, refresh = $$props.refresh);
		if ('expanded' in $$props) expanded = $$props.expanded;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		name,
		isDarkMode,
		themeSwitch,
		refresh,
		$loadedTrees,
		input_change_handler,
		input_binding,
		click_handler
	];
}

class App extends internal.SvelteComponentDev {
	constructor(options) {
		super(options);
		(0,internal.init)(this, options, instance, create_fragment, internal.safe_not_equal, { name: 0 });

		(0,internal.dispatch_dev)("SvelteRegisterComponent", {
			component: this,
			tagName: "App",
			options,
			id: create_fragment.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*name*/ ctx[0] === undefined && !('name' in props)) {
			console_1.warn("<App> was created without expected prop 'name'");
		}
	}

	get name() {
		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set name(value) {
		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

if (module && module.hot) {}
/* harmony default export */ const App_svelte = (App);



/***/ }),

/***/ "./src/popup/components/fileSystem/SplitPanel.svelte":
/*!***********************************************************!*\
  !*** ./src/popup/components/fileSystem/SplitPanel.svelte ***!
  \***********************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var svelte_internal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! svelte/internal */ "./node_modules/.pnpm/svelte@3.50.1/node_modules/svelte/internal/index.mjs");
/* harmony import */ var _Toolbar_svelte__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Toolbar.svelte */ "./src/popup/components/fileSystem/Toolbar.svelte");
/* harmony import */ var _Users_miezan_Desktop_Dev_Bookmark2_node_modules_pnpm_svelte_loader_3_1_3_svelte_3_50_1_node_modules_svelte_loader_lib_hot_api_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/.pnpm/svelte-loader@3.1.3_svelte@3.50.1/node_modules/svelte-loader/lib/hot-api.js */ "./node_modules/.pnpm/svelte-loader@3.1.3_svelte@3.50.1/node_modules/svelte-loader/lib/hot-api.js");
/* harmony import */ var _Users_miezan_Desktop_Dev_Bookmark2_node_modules_pnpm_svelte_hmr_0_14_12_svelte_3_50_1_node_modules_svelte_hmr_runtime_proxy_adapter_dom_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node_modules/.pnpm/svelte-hmr@0.14.12_svelte@3.50.1/node_modules/svelte-hmr/runtime/proxy-adapter-dom.js */ "./node_modules/.pnpm/svelte-hmr@0.14.12_svelte@3.50.1/node_modules/svelte-hmr/runtime/proxy-adapter-dom.js");
/* module decorator */ module = __webpack_require__.hmd(module);
/* src/popup/components/fileSystem/SplitPanel.svelte generated by Svelte v3.50.1 */



const file = "src/popup/components/fileSystem/SplitPanel.svelte";
const get_right_slot_changes = dirty => ({});
const get_right_slot_context = ctx => ({});
const get_left_slot_changes = dirty => ({});
const get_left_slot_context = ctx => ({});

function create_fragment(ctx) {
	let div3;
	let div0;
	let t0;
	let div1;
	let t1;
	let div2;
	let toolbar;
	let t2;
	let current;
	let mounted;
	let dispose;
	const left_slot_template = /*#slots*/ ctx[5].left;
	const left_slot = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.create_slot)(left_slot_template, ctx, /*$$scope*/ ctx[4], get_left_slot_context);
	toolbar = new _Toolbar_svelte__WEBPACK_IMPORTED_MODULE_1__["default"]({ $$inline: true });
	const right_slot_template = /*#slots*/ ctx[5].right;
	const right_slot = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.create_slot)(right_slot_template, ctx, /*$$scope*/ ctx[4], get_right_slot_context);

	const block = {
		c: function create() {
			div3 = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.element)("div");
			div0 = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.element)("div");
			if (left_slot) left_slot.c();
			t0 = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.space)();
			div1 = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.element)("div");
			t1 = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.space)();
			div2 = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.element)("div");
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.create_component)(toolbar.$$.fragment);
			t2 = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.space)();
			if (right_slot) right_slot.c();
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.attr_dev)(div0, "class", "split-panel-left");
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.set_style)(div0, "width", /*leftPanelWidth*/ ctx[0]);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.add_location)(div0, file, 25, 2, 577);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.attr_dev)(div1, "class", "split-panel-resize-handle");
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.add_location)(div1, file, 28, 2, 681);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.attr_dev)(div2, "class", "split-panel-right");
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.add_location)(div2, file, 29, 2, 760);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.attr_dev)(div3, "class", "split-panel");
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.add_location)(div3, file, 24, 0, 491);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.insert_dev)(target, div3, anchor);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.append_dev)(div3, div0);

			if (left_slot) {
				left_slot.m(div0, null);
			}

			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.append_dev)(div3, t0);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.append_dev)(div3, div1);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.append_dev)(div3, t1);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.append_dev)(div3, div2);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.mount_component)(toolbar, div2, null);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.append_dev)(div2, t2);

			if (right_slot) {
				right_slot.m(div2, null);
			}

			current = true;

			if (!mounted) {
				dispose = [
					(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.listen_dev)(div1, "mousedown", /*handleMouseDown*/ ctx[1], false, false, false),
					(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.listen_dev)(div3, "mousemove", /*handleMouseMove*/ ctx[2], false, false, false),
					(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.listen_dev)(div3, "mouseup", /*handleMouseUp*/ ctx[3], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (left_slot) {
				if (left_slot.p && (!current || dirty & /*$$scope*/ 16)) {
					(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.update_slot_base)(
						left_slot,
						left_slot_template,
						ctx,
						/*$$scope*/ ctx[4],
						!current
						? (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.get_all_dirty_from_scope)(/*$$scope*/ ctx[4])
						: (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.get_slot_changes)(left_slot_template, /*$$scope*/ ctx[4], dirty, get_left_slot_changes),
						get_left_slot_context
					);
				}
			}

			if (!current || dirty & /*leftPanelWidth*/ 1) {
				(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.set_style)(div0, "width", /*leftPanelWidth*/ ctx[0]);
			}

			if (right_slot) {
				if (right_slot.p && (!current || dirty & /*$$scope*/ 16)) {
					(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.update_slot_base)(
						right_slot,
						right_slot_template,
						ctx,
						/*$$scope*/ ctx[4],
						!current
						? (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.get_all_dirty_from_scope)(/*$$scope*/ ctx[4])
						: (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.get_slot_changes)(right_slot_template, /*$$scope*/ ctx[4], dirty, get_right_slot_changes),
						get_right_slot_context
					);
				}
			}
		},
		i: function intro(local) {
			if (current) return;
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.transition_in)(left_slot, local);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.transition_in)(toolbar.$$.fragment, local);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.transition_in)(right_slot, local);
			current = true;
		},
		o: function outro(local) {
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.transition_out)(left_slot, local);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.transition_out)(toolbar.$$.fragment, local);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.transition_out)(right_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.detach_dev)(div3);
			if (left_slot) left_slot.d(detaching);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.destroy_component)(toolbar);
			if (right_slot) right_slot.d(detaching);
			mounted = false;
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.run_all)(dispose);
		}
	};

	(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.dispatch_dev)("SvelteRegisterBlock", {
		block,
		id: create_fragment.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.validate_slots)('SplitPanel', slots, ['left','right']);
	let { leftPanelWidth = "30%" } = $$props;
	let isResizing = false;
	let startLeftPanelWidth = 0;

	function handleMouseDown(event) {
		isResizing = true;
		startLeftPanelWidth = event.clientX;
		;
	}

	function handleMouseMove(event) {
		if (isResizing) {
			const newLeftPanelWidth = event.clientX;
			$$invalidate(0, leftPanelWidth = `${newLeftPanelWidth}px`);
		}
	}

	function handleMouseUp(event) {
		isResizing = false;
	}

	const writable_props = ['leftPanelWidth'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SplitPanel> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('leftPanelWidth' in $$props) $$invalidate(0, leftPanelWidth = $$props.leftPanelWidth);
		if ('$$scope' in $$props) $$invalidate(4, $$scope = $$props.$$scope);
	};

	$$self.$capture_state = () => ({
		Toolbar: _Toolbar_svelte__WEBPACK_IMPORTED_MODULE_1__["default"],
		leftPanelWidth,
		isResizing,
		startLeftPanelWidth,
		handleMouseDown,
		handleMouseMove,
		handleMouseUp
	});

	$$self.$inject_state = $$props => {
		if ('leftPanelWidth' in $$props) $$invalidate(0, leftPanelWidth = $$props.leftPanelWidth);
		if ('isResizing' in $$props) isResizing = $$props.isResizing;
		if ('startLeftPanelWidth' in $$props) startLeftPanelWidth = $$props.startLeftPanelWidth;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		leftPanelWidth,
		handleMouseDown,
		handleMouseMove,
		handleMouseUp,
		$$scope,
		slots
	];
}

class SplitPanel extends svelte_internal__WEBPACK_IMPORTED_MODULE_0__.SvelteComponentDev {
	constructor(options) {
		super(options);
		(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.init)(this, options, instance, create_fragment, svelte_internal__WEBPACK_IMPORTED_MODULE_0__.safe_not_equal, { leftPanelWidth: 0 });

		(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.dispatch_dev)("SvelteRegisterComponent", {
			component: this,
			tagName: "SplitPanel",
			options,
			id: create_fragment.name
		});
	}

	get leftPanelWidth() {
		throw new Error("<SplitPanel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set leftPanelWidth(value) {
		throw new Error("<SplitPanel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

if (module && module.hot) {}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SplitPanel);




/***/ }),

/***/ "./src/popup/components/fileSystem/Toolbar.svelte":
/*!********************************************************!*\
  !*** ./src/popup/components/fileSystem/Toolbar.svelte ***!
  \********************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var svelte_internal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! svelte/internal */ "./node_modules/.pnpm/svelte@3.50.1/node_modules/svelte/internal/index.mjs");
/* harmony import */ var _Users_miezan_Desktop_Dev_Bookmark2_node_modules_pnpm_svelte_loader_3_1_3_svelte_3_50_1_node_modules_svelte_loader_lib_hot_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/.pnpm/svelte-loader@3.1.3_svelte@3.50.1/node_modules/svelte-loader/lib/hot-api.js */ "./node_modules/.pnpm/svelte-loader@3.1.3_svelte@3.50.1/node_modules/svelte-loader/lib/hot-api.js");
/* harmony import */ var _Users_miezan_Desktop_Dev_Bookmark2_node_modules_pnpm_svelte_hmr_0_14_12_svelte_3_50_1_node_modules_svelte_hmr_runtime_proxy_adapter_dom_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/.pnpm/svelte-hmr@0.14.12_svelte@3.50.1/node_modules/svelte-hmr/runtime/proxy-adapter-dom.js */ "./node_modules/.pnpm/svelte-hmr@0.14.12_svelte@3.50.1/node_modules/svelte-hmr/runtime/proxy-adapter-dom.js");
/* module decorator */ module = __webpack_require__.hmd(module);
/* src/popup/components/fileSystem/Toolbar.svelte generated by Svelte v3.50.1 */


const file = "src/popup/components/fileSystem/Toolbar.svelte";

function create_fragment(ctx) {
	let div;
	let ul;
	let li0;
	let a0;
	let svg0;
	let path0;
	let t0;
	let t1;
	let li1;
	let a1;
	let svg1;
	let path1;
	let t2;
	let t3;
	let li2;
	let svg2;
	let path2;
	let t4;

	const block = {
		c: function create() {
			div = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.element)("div");
			ul = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.element)("ul");
			li0 = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.element)("li");
			a0 = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.element)("a");
			svg0 = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.svg_element)("svg");
			path0 = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.svg_element)("path");
			t0 = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.text)("\n        Home");
			t1 = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.space)();
			li1 = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.element)("li");
			a1 = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.element)("a");
			svg1 = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.svg_element)("svg");
			path1 = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.svg_element)("path");
			t2 = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.text)("\n        Documents");
			t3 = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.space)();
			li2 = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.element)("li");
			svg2 = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.svg_element)("svg");
			path2 = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.svg_element)("path");
			t4 = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.text)("\n      Add Document");
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.attr_dev)(path0, "stroke-linecap", "round");
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.attr_dev)(path0, "stroke-linejoin", "round");
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.attr_dev)(path0, "stroke-width", "2");
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.attr_dev)(path0, "d", "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z");
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.add_location)(path0, file, 5, 116, 229);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.attr_dev)(svg0, "xmlns", "http://www.w3.org/2000/svg");
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.attr_dev)(svg0, "fill", "none");
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.attr_dev)(svg0, "viewBox", "0 0 24 24");
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.attr_dev)(svg0, "class", "w-4 h-4 mr-2 stroke-current");
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.add_location)(svg0, file, 5, 8, 121);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.add_location)(a0, file, 4, 6, 108);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.add_location)(li0, file, 2, 4, 45);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.attr_dev)(path1, "stroke-linecap", "round");
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.attr_dev)(path1, "stroke-linejoin", "round");
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.attr_dev)(path1, "stroke-width", "2");
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.attr_dev)(path1, "d", "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z");
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.add_location)(path1, file, 12, 116, 612);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.attr_dev)(svg1, "xmlns", "http://www.w3.org/2000/svg");
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.attr_dev)(svg1, "fill", "none");
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.attr_dev)(svg1, "viewBox", "0 0 24 24");
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.attr_dev)(svg1, "class", "w-4 h-4 mr-2 stroke-current");
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.add_location)(svg1, file, 12, 8, 504);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.add_location)(a1, file, 11, 6, 492);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.add_location)(li1, file, 9, 4, 429);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.attr_dev)(path2, "stroke-linecap", "round");
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.attr_dev)(path2, "stroke-linejoin", "round");
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.attr_dev)(path2, "stroke-width", "2");
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.attr_dev)(path2, "d", "M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z");
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.add_location)(path2, file, 17, 114, 936);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.attr_dev)(svg2, "xmlns", "http://www.w3.org/2000/svg");
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.attr_dev)(svg2, "fill", "none");
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.attr_dev)(svg2, "viewBox", "0 0 24 24");
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.attr_dev)(svg2, "class", "w-4 h-4 mr-2 stroke-current");
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.add_location)(svg2, file, 17, 6, 828);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.add_location)(li2, file, 16, 4, 817);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.add_location)(ul, file, 1, 2, 36);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.attr_dev)(div, "class", "text-sm breadcrumbs");
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.add_location)(div, file, 0, 0, 0);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.insert_dev)(target, div, anchor);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.append_dev)(div, ul);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.append_dev)(ul, li0);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.append_dev)(li0, a0);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.append_dev)(a0, svg0);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.append_dev)(svg0, path0);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.append_dev)(a0, t0);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.append_dev)(ul, t1);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.append_dev)(ul, li1);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.append_dev)(li1, a1);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.append_dev)(a1, svg1);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.append_dev)(svg1, path1);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.append_dev)(a1, t2);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.append_dev)(ul, t3);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.append_dev)(ul, li2);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.append_dev)(li2, svg2);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.append_dev)(svg2, path2);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.append_dev)(li2, t4);
		},
		p: svelte_internal__WEBPACK_IMPORTED_MODULE_0__.noop,
		i: svelte_internal__WEBPACK_IMPORTED_MODULE_0__.noop,
		o: svelte_internal__WEBPACK_IMPORTED_MODULE_0__.noop,
		d: function destroy(detaching) {
			if (detaching) (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.detach_dev)(div);
		}
	};

	(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.dispatch_dev)("SvelteRegisterBlock", {
		block,
		id: create_fragment.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance($$self, $$props) {
	let { $$slots: slots = {}, $$scope } = $$props;
	(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.validate_slots)('Toolbar', slots, []);
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Toolbar> was created with unknown prop '${key}'`);
	});

	return [];
}

class Toolbar extends svelte_internal__WEBPACK_IMPORTED_MODULE_0__.SvelteComponentDev {
	constructor(options) {
		super(options);
		(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.init)(this, options, instance, create_fragment, svelte_internal__WEBPACK_IMPORTED_MODULE_0__.safe_not_equal, {});

		(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.dispatch_dev)("SvelteRegisterComponent", {
			component: this,
			tagName: "Toolbar",
			options,
			id: create_fragment.name
		});
	}
}

if (module && module.hot) {}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Toolbar);



/***/ }),

/***/ "./src/popup/components/fileSystem/TreeView.svelte":
/*!*********************************************************!*\
  !*** ./src/popup/components/fileSystem/TreeView.svelte ***!
  \*********************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var svelte_internal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! svelte/internal */ "./node_modules/.pnpm/svelte@3.50.1/node_modules/svelte/internal/index.mjs");
/* harmony import */ var svelte__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! svelte */ "./node_modules/.pnpm/svelte@3.50.1/node_modules/svelte/index.mjs");
/* harmony import */ var wunderbaum__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! wunderbaum */ "./node_modules/.pnpm/wunderbaum@0.3.5/node_modules/wunderbaum/dist/wunderbaum.esm.js");
/* harmony import */ var _store_index__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../store/index */ "./src/popup/components/store/index.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../utils */ "./src/popup/utils.js");
/* harmony import */ var _Users_miezan_Desktop_Dev_Bookmark2_node_modules_pnpm_svelte_loader_3_1_3_svelte_3_50_1_node_modules_svelte_loader_lib_hot_api_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./node_modules/.pnpm/svelte-loader@3.1.3_svelte@3.50.1/node_modules/svelte-loader/lib/hot-api.js */ "./node_modules/.pnpm/svelte-loader@3.1.3_svelte@3.50.1/node_modules/svelte-loader/lib/hot-api.js");
/* harmony import */ var _Users_miezan_Desktop_Dev_Bookmark2_node_modules_pnpm_svelte_hmr_0_14_12_svelte_3_50_1_node_modules_svelte_hmr_runtime_proxy_adapter_dom_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./node_modules/.pnpm/svelte-hmr@0.14.12_svelte@3.50.1/node_modules/svelte-hmr/runtime/proxy-adapter-dom.js */ "./node_modules/.pnpm/svelte-hmr@0.14.12_svelte@3.50.1/node_modules/svelte-hmr/runtime/proxy-adapter-dom.js");
/* module decorator */ module = __webpack_require__.hmd(module);
/* src/popup/components/fileSystem/TreeView.svelte generated by Svelte v3.50.1 */


const { console: console_1, document: document_1 } = svelte_internal__WEBPACK_IMPORTED_MODULE_0__.globals;


// import { Wunderbaum } from "wunderbaum/dist/wunderbaum.esm.min";




const file = "src/popup/components/fileSystem/TreeView.svelte";

function create_fragment(ctx) {
	let link0;
	let link1;
	let t0;
	let div1;
	let output;
	let t1;
	let div0;
	let h1;
	let t3;
	let p;

	const block = {
		c: function create() {
			link0 = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.element)("link");
			link1 = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.element)("link");
			t0 = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.space)();
			div1 = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.element)("div");
			output = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.element)("output");
			t1 = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.space)();
			div0 = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.element)("div");
			h1 = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.element)("h1");
			h1.textContent = "Bookmark";
			t3 = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.space)();
			p = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.element)("p");
			p.textContent = "Loading…";
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.attr_dev)(link0, "rel", "stylesheet");
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.attr_dev)(link0, "href", "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.0/font/bootstrap-icons.css");
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.add_location)(link0, file, 1, 2, 16);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.attr_dev)(link1, "rel", "stylesheet");
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.attr_dev)(link1, "href", "https://cdn.jsdelivr.net/gh/mar10/wunderbaum@main/dist/wunderbaum.css");
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.add_location)(link1, file, 2, 2, 127);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.attr_dev)(output, "id", /*parentDOM*/ ctx[1]);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.attr_dev)(output, "class", "");
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.add_location)(output, file, 172, 2, 5291);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.add_location)(h1, file, 175, 4, 5480);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.add_location)(p, file, 176, 4, 5502);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.attr_dev)(div0, "id", /*treeDOM*/ ctx[0]);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.attr_dev)(div0, "class", "");
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.add_location)(div0, file, 173, 2, 5335);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.add_location)(div1, file, 170, 0, 5282);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.append_dev)(document_1.head, link0);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.append_dev)(document_1.head, link1);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.insert_dev)(target, t0, anchor);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.insert_dev)(target, div1, anchor);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.append_dev)(div1, output);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.append_dev)(div1, t1);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.append_dev)(div1, div0);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.append_dev)(div0, h1);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.append_dev)(div0, t3);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.append_dev)(div0, p);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*parentDOM*/ 2) {
				(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.attr_dev)(output, "id", /*parentDOM*/ ctx[1]);
			}

			if (dirty & /*treeDOM*/ 1) {
				(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.attr_dev)(div0, "id", /*treeDOM*/ ctx[0]);
			}
		},
		i: svelte_internal__WEBPACK_IMPORTED_MODULE_0__.noop,
		o: svelte_internal__WEBPACK_IMPORTED_MODULE_0__.noop,
		d: function destroy(detaching) {
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.detach_dev)(link0);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.detach_dev)(link1);
			if (detaching) (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.detach_dev)(t0);
			if (detaching) (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.detach_dev)(div1);
		}
	};

	(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.dispatch_dev)("SvelteRegisterBlock", {
		block,
		id: create_fragment.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

const _expansionState = {}; /* treeNodeId: expanded <boolean> */

function faviconURL(u) {
	const url = new URL(chrome.runtime.getURL("/_favicon/"));
	url.searchParams.set("pageUrl", u);
	url.searchParams.set("size", "64");
	return url.toString();
}

function instance($$self, $$props, $$invalidate) {
	let $loadedTrees;
	(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.validate_store)(_store_index__WEBPACK_IMPORTED_MODULE_3__.loadedTrees, 'loadedTrees');
	(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.component_subscribe)($$self, _store_index__WEBPACK_IMPORTED_MODULE_3__.loadedTrees, $$value => $$invalidate(5, $loadedTrees = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.validate_slots)('TreeView', slots, []);
	let { treeDOM = 'treeDOM_ID_1' } = $$props;
	let { parentDOM = 'parentDOM_ID_1' } = $$props;
	let { rootID } = $$props;
	let { treeSource } = $$props;
	let tree;
	console.log("loading treeview...", rootID, treeSource);
	let showUrl = true;

	// _expansionState[label] = !expanded;
	// https://mar10.github.io/wunderbaum/index.html#/tutorial/tutorial_events?id=common-event-handlers
	const init_tree = () => {
		const DOM = document.getElementById(treeDOM);
		console.log(DOM);

		// if (DOM){
		// DOM.innerHTML=''
		const _tree = new wunderbaum__WEBPACK_IMPORTED_MODULE_2__.Wunderbaum({
				id: rootID,
				element: document.getElementById(treeDOM),
				debugLevel: 5,
				// connectTopBreadcrumb: document.getElementById(parentDOM),
				source: treeSource,
				header: "Bookmark",
				// headerHeightPx: ROW_HEIGHT,
				// rowHeightPx: ROW_HEIGHT,
				columns: null,
				types: null,
				// escapeTitles: true,
				enabled: true,
				fixedCol: false,
				showSpinner: false,
				checkbox: false,
				minExpandLevel: 0,
				emptyChildListExpandable: false,
				updateThrottleWait: 100,
				skeleton: false,
				connectTopBreadcrumb: null,
				// --- KeyNav ---
				navigationModeOption: null,
				quicksearch: true,
				// --- Events ---
				// change: noop,
				enhanceTitle: e => {
					if (showUrl) {
						e.node.setTitle(e.node.data.url || e.node.title);
					}

					console.log("updating... enhanceTitle", { e });
				},
				icon: e => {
					if (e.node?.data?.url) {
						const _style = {
							marginRight: "8px",
							backgroundImage: `url(${faviconURL(e.node.data.url)})`,
							backgroundSize: "cover"
						};

						return `<i class='wb-icon' style=${(0,_utils__WEBPACK_IMPORTED_MODULE_4__.styleToString)(_style)}> </i>`;
					}
				}, // Exit without returning a value: continue with default processing.
				// error: noop,
				// receive: noop,
				render(e) {
					const node = e.node;
					const util = e.util;

					if (e.node.data?.url) {
						const newTitle = `<span class=wb-title><a href="${e.node.data.url}">${e.node.title}</a></span>`;
						const titleSpan = e.node.getColElem(0).querySelector(".wb-title");
						titleSpan.innerHTML = newTitle;
					}
				},
				load(e) {
					console.log({ loading: true });
				},
				edit: {
					trigger: ["clickActive", "F2", "macEnter"],
					select: true,
					beforeEdit(e) {
						
					}, // console.log(e.type, e);
					// return e.node.type === "person";
					// console.log(e.type, e);
					edit(e) {
						console.log(e.type, e);
					},
					apply(e) {
						console.log(e.type, e);

						// Simulate async storage that also validates:
						return e.util.setTimeoutPromise(
							() => {
								e.inputElem.setCustomValidity("");

								if (e.newValue.match(/.*\d.*/)) {
									e.inputElem.setCustomValidity("No numbers please.");
									return false;
								}
							},
							1000
						);
					}
				}
			});

		// addToTreeArray(_tree)
		_store_index__WEBPACK_IMPORTED_MODULE_3__.loadedTrees.set($loadedTrees + 1);

		// globalThis._tree = _tree
		tree = _tree;

		return _tree;
	}; // }

	(0,svelte__WEBPACK_IMPORTED_MODULE_1__.onMount)(() => {
		init_tree();
	}); // window.addEventListener('OnMount::DOMContentLoaded')
	// return () => window.removeEventListener('DOMContentLoaded');

	// let treeSource;
	// source.subscribe(val => {
	//   console.log(`[${rootID}]: store updated..`, val)
	//   if (val){
	//     treeSource = val
	//     // init_tree()
	//   }
	// })
	globalThis._init_tree = init_tree;

	const writable_props = ['treeDOM', 'parentDOM', 'rootID', 'treeSource'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<TreeView> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('treeDOM' in $$props) $$invalidate(0, treeDOM = $$props.treeDOM);
		if ('parentDOM' in $$props) $$invalidate(1, parentDOM = $$props.parentDOM);
		if ('rootID' in $$props) $$invalidate(2, rootID = $$props.rootID);
		if ('treeSource' in $$props) $$invalidate(3, treeSource = $$props.treeSource);
	};

	$$self.$capture_state = () => ({
		_expansionState,
		onMount: svelte__WEBPACK_IMPORTED_MODULE_1__.onMount,
		Wunderbaum: wunderbaum__WEBPACK_IMPORTED_MODULE_2__.Wunderbaum,
		loadedTrees: _store_index__WEBPACK_IMPORTED_MODULE_3__.loadedTrees,
		source: _store_index__WEBPACK_IMPORTED_MODULE_3__.source,
		styleToString: _utils__WEBPACK_IMPORTED_MODULE_4__.styleToString,
		treeDOM,
		parentDOM,
		rootID,
		treeSource,
		tree,
		faviconURL,
		showUrl,
		init_tree,
		$loadedTrees
	});

	$$self.$inject_state = $$props => {
		if ('treeDOM' in $$props) $$invalidate(0, treeDOM = $$props.treeDOM);
		if ('parentDOM' in $$props) $$invalidate(1, parentDOM = $$props.parentDOM);
		if ('rootID' in $$props) $$invalidate(2, rootID = $$props.rootID);
		if ('treeSource' in $$props) $$invalidate(3, treeSource = $$props.treeSource);
		if ('tree' in $$props) tree = $$props.tree;
		if ('showUrl' in $$props) showUrl = $$props.showUrl;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [treeDOM, parentDOM, rootID, treeSource];
}

class TreeView extends svelte_internal__WEBPACK_IMPORTED_MODULE_0__.SvelteComponentDev {
	constructor(options) {
		super(options);

		(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.init)(this, options, instance, create_fragment, svelte_internal__WEBPACK_IMPORTED_MODULE_0__.safe_not_equal, {
			treeDOM: 0,
			parentDOM: 1,
			rootID: 2,
			treeSource: 3
		});

		(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.dispatch_dev)("SvelteRegisterComponent", {
			component: this,
			tagName: "TreeView",
			options,
			id: create_fragment.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*rootID*/ ctx[2] === undefined && !('rootID' in props)) {
			console_1.warn("<TreeView> was created without expected prop 'rootID'");
		}

		if (/*treeSource*/ ctx[3] === undefined && !('treeSource' in props)) {
			console_1.warn("<TreeView> was created without expected prop 'treeSource'");
		}
	}

	get treeDOM() {
		throw new Error("<TreeView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set treeDOM(value) {
		throw new Error("<TreeView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get parentDOM() {
		throw new Error("<TreeView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set parentDOM(value) {
		throw new Error("<TreeView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get rootID() {
		throw new Error("<TreeView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set rootID(value) {
		throw new Error("<TreeView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get treeSource() {
		throw new Error("<TreeView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set treeSource(value) {
		throw new Error("<TreeView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

if (module && module.hot) {}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TreeView);



/***/ }),

/***/ "./src/popup/components/globals/Theme.svelte":
/*!***************************************************!*\
  !*** ./src/popup/components/globals/Theme.svelte ***!
  \***************************************************/
/***/ ((module, __unused_webpack___webpack_exports__, __webpack_require__) => {

/* harmony import */ var svelte_internal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! svelte/internal */ "./node_modules/.pnpm/svelte@3.50.1/node_modules/svelte/internal/index.mjs");
/* harmony import */ var _Users_miezan_Desktop_Dev_Bookmark2_node_modules_pnpm_svelte_loader_3_1_3_svelte_3_50_1_node_modules_svelte_loader_lib_hot_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/.pnpm/svelte-loader@3.1.3_svelte@3.50.1/node_modules/svelte-loader/lib/hot-api.js */ "./node_modules/.pnpm/svelte-loader@3.1.3_svelte@3.50.1/node_modules/svelte-loader/lib/hot-api.js");
/* harmony import */ var _Users_miezan_Desktop_Dev_Bookmark2_node_modules_pnpm_svelte_hmr_0_14_12_svelte_3_50_1_node_modules_svelte_hmr_runtime_proxy_adapter_dom_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/.pnpm/svelte-hmr@0.14.12_svelte@3.50.1/node_modules/svelte-hmr/runtime/proxy-adapter-dom.js */ "./node_modules/.pnpm/svelte-hmr@0.14.12_svelte@3.50.1/node_modules/svelte-hmr/runtime/proxy-adapter-dom.js");
/* module decorator */ module = __webpack_require__.hmd(module);
/* src/popup/components/globals/Theme.svelte generated by Svelte v3.50.1 */


const file = "src/popup/components/globals/Theme.svelte";

function create_fragment(ctx) {
	const block = {
		c: svelte_internal__WEBPACK_IMPORTED_MODULE_0__.noop,
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: svelte_internal__WEBPACK_IMPORTED_MODULE_0__.noop,
		p: svelte_internal__WEBPACK_IMPORTED_MODULE_0__.noop,
		i: svelte_internal__WEBPACK_IMPORTED_MODULE_0__.noop,
		o: svelte_internal__WEBPACK_IMPORTED_MODULE_0__.noop,
		d: svelte_internal__WEBPACK_IMPORTED_MODULE_0__.noop
	};

	(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.dispatch_dev)("SvelteRegisterBlock", {
		block,
		id: create_fragment.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance($$self, $$props) {
	let { $$slots: slots = {}, $$scope } = $$props;
	(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.validate_slots)('Theme', slots, []);
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Theme> was created with unknown prop '${key}'`);
	});

	return [];
}

class Theme extends svelte_internal__WEBPACK_IMPORTED_MODULE_0__.SvelteComponentDev {
	constructor(options) {
		super(options);
		(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.init)(this, options, instance, create_fragment, svelte_internal__WEBPACK_IMPORTED_MODULE_0__.safe_not_equal, {});

		(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.dispatch_dev)("SvelteRegisterComponent", {
			component: this,
			tagName: "Theme",
			options,
			id: create_fragment.name
		});
	}
}

if (module && module.hot) {}
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = (Theme);




/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/harmony module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.hmd = (module) => {
/******/ 			module = Object.create(module);
/******/ 			if (!module.children) module.children = [];
/******/ 			Object.defineProperty(module, 'exports', {
/******/ 				enumerable: true,
/******/ 				set: () => {
/******/ 					throw new Error('ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: ' + module.id);
/******/ 				}
/******/ 			});
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"popup.js": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkbookmark2"] = self["webpackChunkbookmark2"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors.js"], () => (__webpack_require__("./src/popup/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=popup.js.map