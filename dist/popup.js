/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/popup/components/store/index.js":
/*!*********************************************!*\
  !*** ./src/popup/components/store/index.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "treeState": () => (/* binding */ treeState)
/* harmony export */ });
/* harmony import */ var svelte_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! svelte/store */ "./node_modules/.pnpm/svelte@3.50.1/node_modules/svelte/store/index.mjs");

const treeState = (0,svelte_store__WEBPACK_IMPORTED_MODULE_0__.writable)(null);


/***/ }),

/***/ "./src/popup/index.js":
/*!****************************!*\
  !*** ./src/popup/index.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _App_svelte__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./App.svelte */ "./src/popup/App.svelte");

const app = new _App_svelte__WEBPACK_IMPORTED_MODULE_0__["default"]({
  target: document.body,
  props: {
    name: "Bookmark2"
  }
});
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = (app);
if (false) {}


/***/ }),

/***/ "./src/popup/nodes.js":
/*!****************************!*\
  !*** ./src/popup/nodes.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Racine": () => (/* binding */ Racine)
/* harmony export */ });
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
let root = [
  {
    name: "News",
    children: [
      { name: "https://cnn.com" },
      { name: "https://msnbc.com" },
      { name: "https://DW.com" }
    ]
  },
  {
    name: "Folder 2",
    children: [
      {
        name: "Folder 2.1",
        children: [
          { name: "https://google.com" },
          { name: "https://yahoo.com" },
          { name: "https://bing.com" },
          { name: "https://msn.com" }
        ]
      },
      {
        name: "Folder 2.2",
        children: [
          { name: "apple.com" },
          { name: "amazon.com" }
        ]
      },
      { name: "zillow.com" },
      { name: "alsjdf.com" },
      { name: "somerandomwebsite.com" }
    ]
  },
  { name: "tabsorter2.com" }
];
class Racine {
  constructor(root2, id_prefix = "node") {
    __publicField(this, "build", (root2, parent_id = 0) => {
      return root2.map((n) => {
        this.total_nodes = this.total_nodes + 1;
        const res = {
          [`${this.id_prefix}${this.total_nodes}`]: {
            id: `${this.id_prefix}${this.total_nodes}`,
            parent_id: `${this.id_prefix}${parent_id}`,
            children: n && n.children ? this.build(n.children, this.total_nodes) : [],
            name: n.name
          }
        };
        this.nodes = { ...this.nodes, ...res };
        let full_parent_id = `${this.id_prefix}${parent_id}`;
        if (this.nodes[full_parent_id] && this.nodes[full_parent_id].children) {
          this.nodes[full_parent_id].children = [...this.nodes[full_parent_id].children, ...Object.values(res)];
          console.log(Object.values(this.nodes[full_parent_id].children));
          console.log(Object.values(res));
        }
        return Object.values(res);
      }).flatMap((x) => x);
    });
    __publicField(this, "undo", (nodes) => {
      const breadthFirstSearch = (root2, output = []) => {
        if (!root2)
          return output;
        const q = new Queue();
        q.enqueue(root2);
        while (!q.isEmpty()) {
          const node = q.dequeue();
          output.push(node.val);
          for (let child of node.children) {
            q.enqueue(child);
          }
        }
        return output;
      };
    });
    __publicField(this, "move", (sourceNodeID, destinationNodeID, idx = 0) => {
      let _parent = this.nodes[this.nodes[sourceNodeID].parent_id];
      if (_parent) {
        _parent.children = _parent.children.filter((c) => c.id != sourceNodeID);
        this.nodes[sourceNodeID].parent_id = destinationNodeID;
        let new_parent = this.nodes[destinationNodeID];
        new_parent.children = new_parent.children.filter((c) => c.id != sourceNodeID);
        new_parent.children.splice(idx, 0, this.nodes[sourceNodeID]);
      }
      return this.nodes;
    });
    __publicField(this, "get_root", (name_only = true) => {
      let root_name = `${this.id_prefix}0`;
      return name_only ? root_name : this.nodes[root_name];
    });
    __publicField(this, "get_children", (node) => {
      return Object.values(this.nodes).filter((o) => o?.parent_id == node).map((o) => o.id);
    });
    __publicField(this, "save", () => {
      return JSON.stringify(this.root);
    });
    __publicField(this, "print", (n) => {
      let children = this.get_children(n);
      if (children.length) {
        console.log(n.padEnd(6), `|[${children}]`);
        for (const c of children) {
          this.print(c);
        }
      }
    });
    this.root = root2;
    this.id_prefix = id_prefix;
    this.total_nodes = 0;
    this.nodes = {
      [`${this.id_prefix}0`]: {
        id: `${this.id_prefix}0`,
        name: "root",
        children: []
      }
    };
    this.mapping = {};
  }
  get_depth(item, iteration = 0) {
    if (!item.children.length)
      return iteration;
    iteration++;
    return Math.max(...item.children.map((i) => this.get_depth(i, iteration)));
  }
}


/***/ }),

/***/ "./src/popup/utils.js":
/*!****************************!*\
  !*** ./src/popup/utils.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "recursiveCount": () => (/* binding */ recursiveCount)
/* harmony export */ });
const recursiveCount = (n) => {
  return n.map((o) => {
    if (!("files" in o)) {
      console.log(`leaf: ${o.name}`, 1);
      return 1;
    } else {
      let cnt = recursiveCount(o.files);
      console.log(`branch: ${o.name}`, cnt);
      return cnt;
    }
  }).reduce((x, y) => x + y);
};


/***/ }),

/***/ "./src/popup/components/theme.css":
/*!****************************************!*\
  !*** ./src/popup/components/theme.css ***!
  \****************************************/
/***/ ((module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
// extracted by mini-css-extract-plugin

    if(true) {
      // 1665229633651
      var cssReload = __webpack_require__(/*! ./node_modules/.pnpm/mini-css-extract-plugin@1.6.2_webpack@5.74.0/node_modules/mini-css-extract-plugin/dist/hmr/hotModuleReplacement.js */ "./node_modules/.pnpm/mini-css-extract-plugin@1.6.2_webpack@5.74.0/node_modules/mini-css-extract-plugin/dist/hmr/hotModuleReplacement.js")(module.id, {"locals":false});
      module.hot.dispose(cssReload);
      module.hot.accept(undefined, cssReload);
    }
  

/***/ }),

/***/ "./src/popup/global.css":
/*!******************************!*\
  !*** ./src/popup/global.css ***!
  \******************************/
/***/ ((module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
// extracted by mini-css-extract-plugin

    if(true) {
      // 1665229633644
      var cssReload = __webpack_require__(/*! ./node_modules/.pnpm/mini-css-extract-plugin@1.6.2_webpack@5.74.0/node_modules/mini-css-extract-plugin/dist/hmr/hotModuleReplacement.js */ "./node_modules/.pnpm/mini-css-extract-plugin@1.6.2_webpack@5.74.0/node_modules/mini-css-extract-plugin/dist/hmr/hotModuleReplacement.js")(module.id, {"locals":false});
      module.hot.dispose(cssReload);
      module.hot.accept(undefined, cssReload);
    }
  

/***/ }),

/***/ "./src/popup/App.svelte":
/*!******************************!*\
  !*** ./src/popup/App.svelte ***!
  \******************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var svelte_internal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! svelte/internal */ "./node_modules/.pnpm/svelte@3.50.1/node_modules/svelte/internal/index.mjs");
/* harmony import */ var _global_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./global.css */ "./src/popup/global.css");
/* harmony import */ var _components_theme_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/theme.css */ "./src/popup/components/theme.css");
/* harmony import */ var _Bookmark_svelte__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Bookmark.svelte */ "./src/popup/Bookmark.svelte");
/* harmony import */ var svelte__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! svelte */ "./node_modules/.pnpm/svelte@3.50.1/node_modules/svelte/index.mjs");
/* harmony import */ var theme_change__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! theme-change */ "./node_modules/.pnpm/theme-change@2.2.0/node_modules/theme-change/index.js");
/* harmony import */ var theme_change__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(theme_change__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _Users_Miezan_Dev_Game_Bookmark2_node_modules_pnpm_svelte_loader_3_1_3_svelte_3_50_1_node_modules_svelte_loader_lib_hot_api_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./node_modules/.pnpm/svelte-loader@3.1.3_svelte@3.50.1/node_modules/svelte-loader/lib/hot-api.js */ "./node_modules/.pnpm/svelte-loader@3.1.3_svelte@3.50.1/node_modules/svelte-loader/lib/hot-api.js");
/* harmony import */ var _Users_Miezan_Dev_Game_Bookmark2_node_modules_pnpm_svelte_hmr_0_14_12_svelte_3_50_1_node_modules_svelte_hmr_runtime_proxy_adapter_dom_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./node_modules/.pnpm/svelte-hmr@0.14.12_svelte@3.50.1/node_modules/svelte-hmr/runtime/proxy-adapter-dom.js */ "./node_modules/.pnpm/svelte-hmr@0.14.12_svelte@3.50.1/node_modules/svelte-hmr/runtime/proxy-adapter-dom.js");
/* module decorator */ module = __webpack_require__.hmd(module);
/* src/popup/App.svelte generated by Svelte v3.50.1 */







const file = "src/popup/App.svelte";

function add_css(target) {
	(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.append_styles)(target, "svelte-2rika8", ":root{--color-default:#fff;--main-color:#a5ffd6;--accent-color:#6d6875;--primary-text-color:#ecf0f1;--secondary-text-color:#a0aec0;--background-color:#4a4e69;--primary-color:#6d6875;--secondary-color:#18e0c2;--accent-color:#4C2E4D;--neutral-color:#252b30;--base-100-color:#4C2E4D;--text-primary-color:--text-size: 15px;--icon-size:27px;--button-height:35px;--button-radius:15px}.Pollie-1-hex{color:#010326}.Pollie-2-hex{color:#393E59}.Pollie-3-hex{color:#F0F2F2}.Pollie-4-hex{color:#6FBFBF}.Pollie-5-hex{color:#82D9D9}.San-Marino-1-hex{color:#556273}.San-Marino-2-hex{color:#69788C}.San-Marino-3-hex{color:#8A99A6}.San-Marino-4-hex{color:#F2F2F2}.San-Marino-5-hex{color:#D9D9D9}:root{--base-color-hs:335, 100%;--base-color:hsl(var(--base-color-hs), 50%);--base-color-light:hsl(var(--base-color-hs), 85%);--base-color-dark:hsl(var(--base-color-hs), 20%);--base-color-translucent:hsla(var(--base-color-hs), 50%, .5)}@media(prefers-color-scheme: dark){:root{--background-color:#252b30}}[data-theme='dark']{--background-color:var(--primary);--text-color:var(--primary-content)}[data-theme='light']{--background-color:var(--primary-focus);--text-color:var(--primary-content)}[data-theme='🌸']{--background-color:#ffabc8}[data-theme='🐬']{--background-color:#7ec6ff}[data-theme='🐤']{--background-color:#ffd65a}body{background-color:var(--background-color)}html,body{font-size:var(--text-size);height:100%;background:var(--background-color);color:var(--text-color)}main{text-align:center;padding:1em;max-width:240px;margin:0 auto;--tw-bg-opacity:1;background-color:rgb(17 24 39 / var(--tw-bg-opacity))}h1,h2,h3,h4,h5{color:var(--secondary-color);font-weight:100}h1{text-transform:uppercase;font-size:4em}@media(min-width: 640px){main{max-width:none}}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXBwLnN2ZWx0ZSIsIm1hcHBpbmdzIjoiZ3REQW1KQSIsIm5hbWVzIjpbXSwic291cmNlcyI6WyJBcHAuc3ZlbHRlIl19 */");
}

function create_fragment(ctx) {
	let div;
	let h3;
	let t0;
	let t1;
	let t2_value = '{' + "";
	let t2;
	let t3;
	let t4_value = '}' + "";
	let t4;
	let t5;
	let select;
	let option0;
	let option1;
	let option2;
	let option3;
	let option4;
	let option5;
	let t12;
	let button;
	let t14;
	let bookmark;
	let current;
	bookmark = new _Bookmark_svelte__WEBPACK_IMPORTED_MODULE_3__["default"]({ $$inline: true });

	const block = {
		c: function create() {
			div = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.element)("div");
			h3 = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.element)("h3");
			t0 = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.text)(/*name*/ ctx[0]);
			t1 = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.text)(" - ");
			t2 = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.text)(t2_value);
			t3 = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.text)(" Live Mode ");
			t4 = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.text)(t4_value);
			t5 = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.space)();
			select = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.element)("select");
			option0 = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.element)("option");
			option0.textContent = "Default";
			option1 = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.element)("option");
			option1.textContent = "Dark";
			option2 = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.element)("option");
			option2.textContent = "Light";
			option3 = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.element)("option");
			option3.textContent = "🌸 Pink";
			option4 = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.element)("option");
			option4.textContent = "🐬 Blue";
			option5 = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.element)("option");
			option5.textContent = "🐤 Yellow";
			t12 = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.space)();
			button = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.element)("button");
			button.textContent = "Button";
			t14 = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.space)();
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.create_component)(bookmark.$$.fragment);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.add_location)(h3, file, 23, 2, 624);
			option0.__value = "";
			option0.value = option0.__value;
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.add_location)(option0, file, 26, 2, 825);
			option1.__value = "dark";
			option1.value = option1.__value;
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.add_location)(option1, file, 27, 2, 861);
			option2.__value = "light";
			option2.value = option2.__value;
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.add_location)(option2, file, 28, 2, 898);
			option3.__value = "🌸";
			option3.value = option3.__value;
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.add_location)(option3, file, 29, 2, 937);
			option4.__value = "🐬";
			option4.value = option4.__value;
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.add_location)(option4, file, 30, 2, 975);
			option5.__value = "🐤";
			option5.value = option5.__value;
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.add_location)(option5, file, 31, 2, 1013);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.attr_dev)(select, "data-choose-theme", "");
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.attr_dev)(select, "class", "focus:outline-none h-10 rounded-full px-3 border");
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.add_location)(select, file, 25, 1, 739);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.attr_dev)(button, "class", "btn btn-primary");
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.add_location)(button, file, 33, 1, 1063);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.attr_dev)(div, "class", "m-5");
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.add_location)(div, file, 22, 1, 604);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.insert_dev)(target, div, anchor);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.append_dev)(div, h3);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.append_dev)(h3, t0);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.append_dev)(h3, t1);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.append_dev)(h3, t2);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.append_dev)(h3, t3);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.append_dev)(h3, t4);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.append_dev)(div, t5);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.append_dev)(div, select);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.append_dev)(select, option0);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.append_dev)(select, option1);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.append_dev)(select, option2);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.append_dev)(select, option3);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.append_dev)(select, option4);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.append_dev)(select, option5);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.append_dev)(div, t12);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.append_dev)(div, button);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.insert_dev)(target, t14, anchor);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.mount_component)(bookmark, target, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (!current || dirty & /*name*/ 1) (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.set_data_dev)(t0, /*name*/ ctx[0]);
		},
		i: function intro(local) {
			if (current) return;
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.transition_in)(bookmark.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.transition_out)(bookmark.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.detach_dev)(div);
			if (detaching) (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.detach_dev)(t14);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.destroy_component)(bookmark, detaching);
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
	(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.validate_slots)('App', slots, []);
	let { name } = $$props;

	// NOTE: the element that is using one of the theme attributes must be in the DOM on mount
	(0,svelte__WEBPACK_IMPORTED_MODULE_4__.onMount)(() => {
		// window.localStorage = chrome.storage.local
		(0,theme_change__WEBPACK_IMPORTED_MODULE_5__.themeChange)(false);
	}); // 👆 false parameter is required for svelte

	const writable_props = ['name'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('name' in $$props) $$invalidate(0, name = $$props.name);
	};

	$$self.$capture_state = () => ({ Bookmark: _Bookmark_svelte__WEBPACK_IMPORTED_MODULE_3__["default"], onMount: svelte__WEBPACK_IMPORTED_MODULE_4__.onMount, themeChange: theme_change__WEBPACK_IMPORTED_MODULE_5__.themeChange, name });

	$$self.$inject_state = $$props => {
		if ('name' in $$props) $$invalidate(0, name = $$props.name);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [name];
}

class App extends svelte_internal__WEBPACK_IMPORTED_MODULE_0__.SvelteComponentDev {
	constructor(options) {
		super(options);
		(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.init)(this, options, instance, create_fragment, svelte_internal__WEBPACK_IMPORTED_MODULE_0__.safe_not_equal, { name: 0 }, add_css);

		(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.dispatch_dev)("SvelteRegisterComponent", {
			component: this,
			tagName: "App",
			options,
			id: create_fragment.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*name*/ ctx[0] === undefined && !('name' in props)) {
			console.warn("<App> was created without expected prop 'name'");
		}
	}

	get name() {
		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set name(value) {
		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

if (module && module.hot) { if (false) {}; App = _Users_Miezan_Dev_Game_Bookmark2_node_modules_pnpm_svelte_loader_3_1_3_svelte_3_50_1_node_modules_svelte_loader_lib_hot_api_js__WEBPACK_IMPORTED_MODULE_6__.applyHmr({ m: module, id: "\"src/popup/App.svelte\"", hotOptions: {"preserveLocalState":false,"noPreserveStateKey":["@hmr:reset","@!hmr"],"preserveAllLocalStateKey":"@hmr:keep-all","preserveLocalStateKey":"@hmr:keep","noReload":false,"optimistic":false,"acceptNamedExports":true,"acceptAccessors":true,"injectCss":false,"cssEjectDelay":100,"native":false,"importAdapterName":"___SVELTE_HMR_HOT_API_PROXY_ADAPTER","noOverlay":false,"allowLiveBinding":false}, Component: App, ProxyAdapter: _Users_Miezan_Dev_Game_Bookmark2_node_modules_pnpm_svelte_hmr_0_14_12_svelte_3_50_1_node_modules_svelte_hmr_runtime_proxy_adapter_dom_js__WEBPACK_IMPORTED_MODULE_7__.adapter, acceptable: true, preserveLocalState: false, emitCss: false, }); }
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (App);



/***/ }),

/***/ "./src/popup/Bookmark.svelte":
/*!***********************************!*\
  !*** ./src/popup/Bookmark.svelte ***!
  \***********************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var svelte_internal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! svelte/internal */ "./node_modules/.pnpm/svelte@3.50.1/node_modules/svelte/internal/index.mjs");
/* harmony import */ var webextension_polyfill__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! webextension-polyfill */ "./node_modules/.pnpm/webextension-polyfill@0.10.0/node_modules/webextension-polyfill/dist/browser-polyfill.js");
/* harmony import */ var webextension_polyfill__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(webextension_polyfill__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Folder_svelte__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Folder.svelte */ "./src/popup/Folder.svelte");
/* harmony import */ var svelte__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! svelte */ "./node_modules/.pnpm/svelte@3.50.1/node_modules/svelte/index.mjs");
/* harmony import */ var _nodes__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./nodes */ "./src/popup/nodes.js");
/* harmony import */ var _components_store_index__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/store/index */ "./src/popup/components/store/index.js");
/* harmony import */ var _Users_Miezan_Dev_Game_Bookmark2_node_modules_pnpm_svelte_loader_3_1_3_svelte_3_50_1_node_modules_svelte_loader_lib_hot_api_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./node_modules/.pnpm/svelte-loader@3.1.3_svelte@3.50.1/node_modules/svelte-loader/lib/hot-api.js */ "./node_modules/.pnpm/svelte-loader@3.1.3_svelte@3.50.1/node_modules/svelte-loader/lib/hot-api.js");
/* harmony import */ var _Users_Miezan_Dev_Game_Bookmark2_node_modules_pnpm_svelte_hmr_0_14_12_svelte_3_50_1_node_modules_svelte_hmr_runtime_proxy_adapter_dom_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./node_modules/.pnpm/svelte-hmr@0.14.12_svelte@3.50.1/node_modules/svelte-hmr/runtime/proxy-adapter-dom.js */ "./node_modules/.pnpm/svelte-hmr@0.14.12_svelte@3.50.1/node_modules/svelte-hmr/runtime/proxy-adapter-dom.js");
/* module decorator */ module = __webpack_require__.hmd(module);
/* src/popup/Bookmark.svelte generated by Svelte v3.50.1 */







const file = "src/popup/Bookmark.svelte";

function create_fragment(ctx) {
	let folder;
	let current;

	folder = new _Folder_svelte__WEBPACK_IMPORTED_MODULE_2__["default"]({
			props: {
				name: "Bookmarks",
				tree: /*tree*/ ctx[0],
				children: /*tree*/ ctx[0].root,
				id: /*tree*/ ctx[0].get_root({ name_only: true }),
				expanded: true
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.create_component)(folder.$$.fragment);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.mount_component)(folder, target, anchor);
			current = true;
		},
		p: svelte_internal__WEBPACK_IMPORTED_MODULE_0__.noop,
		i: function intro(local) {
			if (current) return;
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.transition_in)(folder.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.transition_out)(folder.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.destroy_component)(folder, detaching);
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
	(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.validate_slots)('Bookmark', slots, []);

	let root = [
		{
			id: 'n1',
			name: 'News',
			children: [
				{ name: 'https://cnn.com', id: 'n2' },
				{ name: 'https://msnbc.com', id: 'n3' },
				{ name: 'https://DW.com', id: 'n4' }
			]
		},
		{
			id: 'n5',
			name: 'Folder 2',
			children: [
				{
					id: 'n6',
					name: 'Folder 2.1',
					children: [
						{ name: 'https://google.com', id: 'n7' },
						{ name: 'https://yahoo.com', id: 'n8' },
						{ name: 'https://bing.com', id: 'n9' },
						{ name: 'https://msn.com', id: 'n10' }
					]
				},
				{
					id: 'n11',
					name: 'Folder 2.2',
					children: [{ name: 'apple.com', id: 'n12' }, { name: 'amazon.com', id: 'n13' }]
				},
				{ name: 'zillow.com', id: 'n14' },
				{ name: 'alsjdf.com', id: 'n15' },
				{ name: 'somerandomwebsite.com', id: 'n16' }
			]
		},
		{ name: 'tabsorter2.com', id: 'n17' }
	];

	// root = localStorage.getItem('bookmark_racine') || root
	const tree = new _nodes__WEBPACK_IMPORTED_MODULE_4__.Racine(root, 'n');

	// treeState.subscribe(value => { tree = value })
	tree.build(root);

	globalThis.tree = tree;
	globalThis.browser = (webextension_polyfill__WEBPACK_IMPORTED_MODULE_1___default());
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Bookmark> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({
		browser: (webextension_polyfill__WEBPACK_IMPORTED_MODULE_1___default()),
		Folder: _Folder_svelte__WEBPACK_IMPORTED_MODULE_2__["default"],
		onMount: svelte__WEBPACK_IMPORTED_MODULE_3__.onMount,
		Racine: _nodes__WEBPACK_IMPORTED_MODULE_4__.Racine,
		treeState: _components_store_index__WEBPACK_IMPORTED_MODULE_5__.treeState,
		root,
		tree
	});

	$$self.$inject_state = $$props => {
		if ('root' in $$props) root = $$props.root;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [tree];
}

class Bookmark extends svelte_internal__WEBPACK_IMPORTED_MODULE_0__.SvelteComponentDev {
	constructor(options) {
		super(options);
		(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.init)(this, options, instance, create_fragment, svelte_internal__WEBPACK_IMPORTED_MODULE_0__.safe_not_equal, {});

		(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.dispatch_dev)("SvelteRegisterComponent", {
			component: this,
			tagName: "Bookmark",
			options,
			id: create_fragment.name
		});
	}
}

if (module && module.hot) { if (false) {}; Bookmark = _Users_Miezan_Dev_Game_Bookmark2_node_modules_pnpm_svelte_loader_3_1_3_svelte_3_50_1_node_modules_svelte_loader_lib_hot_api_js__WEBPACK_IMPORTED_MODULE_6__.applyHmr({ m: module, id: "\"src/popup/Bookmark.svelte\"", hotOptions: {"preserveLocalState":false,"noPreserveStateKey":["@hmr:reset","@!hmr"],"preserveAllLocalStateKey":"@hmr:keep-all","preserveLocalStateKey":"@hmr:keep","noReload":false,"optimistic":false,"acceptNamedExports":true,"acceptAccessors":true,"injectCss":false,"cssEjectDelay":100,"native":false,"importAdapterName":"___SVELTE_HMR_HOT_API_PROXY_ADAPTER","noOverlay":false,"allowLiveBinding":false}, Component: Bookmark, ProxyAdapter: _Users_Miezan_Dev_Game_Bookmark2_node_modules_pnpm_svelte_hmr_0_14_12_svelte_3_50_1_node_modules_svelte_hmr_runtime_proxy_adapter_dom_js__WEBPACK_IMPORTED_MODULE_7__.adapter, acceptable: true, preserveLocalState: false, emitCss: false, }); }
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Bookmark);



/***/ }),

/***/ "./src/popup/Folder.svelte":
/*!*********************************!*\
  !*** ./src/popup/Folder.svelte ***!
  \*********************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var svelte_internal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! svelte/internal */ "./node_modules/.pnpm/svelte@3.50.1/node_modules/svelte/internal/index.mjs");
/* harmony import */ var _Website_svelte__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Website.svelte */ "./src/popup/Website.svelte");
/* harmony import */ var svelte_transition__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! svelte/transition */ "./node_modules/.pnpm/svelte@3.50.1/node_modules/svelte/transition/index.mjs");
/* harmony import */ var sortablejs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! sortablejs */ "./node_modules/.pnpm/sortablejs@1.15.0/node_modules/sortablejs/modular/sortable.esm.js");
/* harmony import */ var svelte__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! svelte */ "./node_modules/.pnpm/svelte@3.50.1/node_modules/svelte/index.mjs");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils */ "./src/popup/utils.js");
/* harmony import */ var _Users_Miezan_Dev_Game_Bookmark2_node_modules_pnpm_svelte_loader_3_1_3_svelte_3_50_1_node_modules_svelte_loader_lib_hot_api_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./node_modules/.pnpm/svelte-loader@3.1.3_svelte@3.50.1/node_modules/svelte-loader/lib/hot-api.js */ "./node_modules/.pnpm/svelte-loader@3.1.3_svelte@3.50.1/node_modules/svelte-loader/lib/hot-api.js");
/* harmony import */ var _Users_Miezan_Dev_Game_Bookmark2_node_modules_pnpm_svelte_hmr_0_14_12_svelte_3_50_1_node_modules_svelte_hmr_runtime_proxy_adapter_dom_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./node_modules/.pnpm/svelte-hmr@0.14.12_svelte@3.50.1/node_modules/svelte-hmr/runtime/proxy-adapter-dom.js */ "./node_modules/.pnpm/svelte-hmr@0.14.12_svelte@3.50.1/node_modules/svelte-hmr/runtime/proxy-adapter-dom.js");
/* module decorator */ module = __webpack_require__.hmd(module);
/* src/popup/Folder.svelte generated by Svelte v3.50.1 */


const { console: console_1 } = svelte_internal__WEBPACK_IMPORTED_MODULE_0__.globals;





const file = "src/popup/Folder.svelte";

function add_css(target) {
	(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.append_styles)(target, "svelte-2ag2qc", ".tab.svelte-2ag2qc{-webkit-user-select:\"none\";-moz-user-select:\"none\";user-select:\"none\";padding:4px;margin:0 0 1px 0;font:1em;background:var(--accent);color:var(--accent-content);border-radius:2px;display:block}.tab.isDragging.svelte-2ag2qc{background:var(--main-color)}span.svelte-2ag2qc{padding:0 0 0 0.11em;background-size:1em 1em;font-weight:bold;cursor:pointer}.expanded.svelte-2ag2qc{--tw-border-opacity:1;border-color:rgb(100 116 139 / var(--tw-border-opacity))}ul.svelte-2ag2qc{padding:0.2em 0 0 0.5em;margin:0 0 0 0.6em;list-style:none;border-left:1px solid #eee}li.svelte-2ag2qc{margin:0.2em 0}.no-arrow.svelte-2ag2qc{padding-left:1.0rem}.arrow.svelte-2ag2qc{cursor:pointer;display:inline-block}.arrowDown.svelte-2ag2qc{transform:rotate(90deg)}ul.svelte-2ag2qc{opacity:.9;color:#fff}li.svelte-2ag2qc{color:#fff}.hide.svelte-2ag2qc{display:none;transition:all 0.2s ease}.show.svelte-2ag2qc{display:block;transition:all 0.2s ease}.dragFrom{background-color:#a5ffd6!important}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRm9sZGVyLnN2ZWx0ZSIsIm1hcHBpbmdzIjoidzlCQXdPQSIsIm5hbWVzIjpbXSwic291cmNlcyI6WyJGb2xkZXIuc3ZlbHRlIl19 */");
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[12] = list[i];
	return child_ctx;
}

// (143:6) {:else}
function create_else_block(ctx) {
	let website;
	let current;

	const website_spread_levels = [
		/*node*/ ctx[12],
		{
			name: `${/*node*/ ctx[12].name}  [${/*node*/ ctx[12].id}]  (Level-${/*depth*/ ctx[1]})`
		},
		{ depth: /*depth*/ ctx[1] }
	];

	let website_props = {};

	for (let i = 0; i < website_spread_levels.length; i += 1) {
		website_props = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.assign)(website_props, website_spread_levels[i]);
	}

	website = new _Website_svelte__WEBPACK_IMPORTED_MODULE_1__["default"]({ props: website_props, $$inline: true });

	const block = {
		c: function create() {
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.create_component)(website.$$.fragment);
		},
		m: function mount(target, anchor) {
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.mount_component)(website, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const website_changes = (dirty & /*children, depth*/ 10)
			? (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.get_spread_update)(website_spread_levels, [
					dirty & /*children*/ 8 && (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.get_spread_object)(/*node*/ ctx[12]),
					{
						name: `${/*node*/ ctx[12].name}  [${/*node*/ ctx[12].id}]  (Level-${/*depth*/ ctx[1]})`
					},
					dirty & /*depth*/ 2 && { depth: /*depth*/ ctx[1] }
				])
			: {};

			website.$set(website_changes);
		},
		i: function intro(local) {
			if (current) return;
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.transition_in)(website.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.transition_out)(website.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.destroy_component)(website, detaching);
		}
	};

	(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.dispatch_dev)("SvelteRegisterBlock", {
		block,
		id: create_else_block.name,
		type: "else",
		source: "(143:6) {:else}",
		ctx
	});

	return block;
}

// (141:6) {#if node.children}
function create_if_block(ctx) {
	let folder;
	let current;

	const folder_spread_levels = [
		/*node*/ ctx[12],
		{
			name: `${/*node*/ ctx[12].name}  [${/*node*/ ctx[12].id}]  (Level-${/*depth*/ ctx[1]}) (${(0,_utils__WEBPACK_IMPORTED_MODULE_5__.recursiveCount)(/*node*/ ctx[12].children)})`
		},
		{ depth: /*depth*/ ctx[1] + 1 },
		{ tree: /*tree*/ ctx[4] }
	];

	let folder_props = {};

	for (let i = 0; i < folder_spread_levels.length; i += 1) {
		folder_props = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.assign)(folder_props, folder_spread_levels[i]);
	}

	folder = new Folder({ props: folder_props, $$inline: true });

	const block = {
		c: function create() {
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.create_component)(folder.$$.fragment);
		},
		m: function mount(target, anchor) {
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.mount_component)(folder, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const folder_changes = (dirty & /*children, depth, recursiveCount, tree*/ 26)
			? (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.get_spread_update)(folder_spread_levels, [
					dirty & /*children*/ 8 && (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.get_spread_object)(/*node*/ ctx[12]),
					dirty & /*children, depth, recursiveCount*/ 10 && {
						name: `${/*node*/ ctx[12].name}  [${/*node*/ ctx[12].id}]  (Level-${/*depth*/ ctx[1]}) (${(0,_utils__WEBPACK_IMPORTED_MODULE_5__.recursiveCount)(/*node*/ ctx[12].children)})`
					},
					dirty & /*depth*/ 2 && { depth: /*depth*/ ctx[1] + 1 },
					dirty & /*tree*/ 16 && { tree: /*tree*/ ctx[4] }
				])
			: {};

			folder.$set(folder_changes);
		},
		i: function intro(local) {
			if (current) return;
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.transition_in)(folder.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.transition_out)(folder.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.destroy_component)(folder, detaching);
		}
	};

	(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.dispatch_dev)("SvelteRegisterBlock", {
		block,
		id: create_if_block.name,
		type: "if",
		source: "(141:6) {#if node.children}",
		ctx
	});

	return block;
}

// (139:2) {#each children as node}
function create_each_block(ctx) {
	let li;
	let current_block_type_index;
	let if_block;
	let li_data_id_value;
	let t;
	let current;
	const if_block_creators = [create_if_block, create_else_block];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*node*/ ctx[12].children) return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx, -1);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	const block = {
		c: function create() {
			li = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.element)("li");
			if_block.c();
			t = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.space)();
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.attr_dev)(li, "draggable", "true");
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.attr_dev)(li, "class", "tab svelte-2ag2qc");
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.attr_dev)(li, "data-id", li_data_id_value = /*node*/ ctx[12].id);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.add_location)(li, file, 139, 4, 4221);
		},
		m: function mount(target, anchor) {
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.insert_dev)(target, li, anchor);
			if_blocks[current_block_type_index].m(li, null);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.insert_dev)(target, t, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx, dirty);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.group_outros)();

				(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.transition_out)(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.check_outros)();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				} else {
					if_block.p(ctx, dirty);
				}

				(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.transition_in)(if_block, 1);
				if_block.m(li, null);
			}

			if (!current || dirty & /*children*/ 8 && li_data_id_value !== (li_data_id_value = /*node*/ ctx[12].id)) {
				(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.attr_dev)(li, "data-id", li_data_id_value);
			}
		},
		i: function intro(local) {
			if (current) return;
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.transition_in)(if_block);
			current = true;
		},
		o: function outro(local) {
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.transition_out)(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.detach_dev)(li);
			if_blocks[current_block_type_index].d();
			if (detaching) (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.detach_dev)(t);
		}
	};

	(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.dispatch_dev)("SvelteRegisterBlock", {
		block,
		id: create_each_block.name,
		type: "each",
		source: "(139:2) {#each children as node}",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let span1;
	let span0;
	let t1;
	let t2;
	let t3;
	let ul;
	let ul_class_value;
	let current;
	let mounted;
	let dispose;
	let each_value = /*children*/ ctx[3];
	(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.validate_each_argument)(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	const out = i => (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.transition_out)(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	const block = {
		c: function create() {
			span1 = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.element)("span");
			span0 = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.element)("span");
			span0.textContent = "▶";
			t1 = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.space)();
			t2 = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.text)(/*name*/ ctx[2]);
			t3 = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.space)();
			ul = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.element)("ul");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.attr_dev)(span0, "class", "arrow svelte-2ag2qc");
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.toggle_class)(span0, "arrowDown", /*arrowDown*/ ctx[7]);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.add_location)(span0, file, 128, 2, 4035);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.attr_dev)(span1, "class", "svelte-2ag2qc");
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.toggle_class)(span1, "expanded", /*expanded*/ ctx[0]);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.add_location)(span1, file, 127, 0, 3993);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.attr_dev)(ul, "data-id", /*id*/ ctx[5]);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.attr_dev)(ul, "class", ul_class_value = "" + ((0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.null_to_empty)(`${/*expanded*/ ctx[0] ? 'show' : 'hide'} w-full`) + " svelte-2ag2qc"));
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.add_location)(ul, file, 133, 0, 4105);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.insert_dev)(target, span1, anchor);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.append_dev)(span1, span0);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.append_dev)(span1, t1);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.append_dev)(span1, t2);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.insert_dev)(target, t3, anchor);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.insert_dev)(target, ul, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(ul, null);
			}

			/*ul_binding*/ ctx[9](ul);
			current = true;

			if (!mounted) {
				dispose = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.listen_dev)(span1, "click", /*toggle*/ ctx[8], false, false, false);
				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (!current || dirty & /*arrowDown*/ 128) {
				(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.toggle_class)(span0, "arrowDown", /*arrowDown*/ ctx[7]);
			}

			if (!current || dirty & /*name*/ 4) (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.set_data_dev)(t2, /*name*/ ctx[2]);

			if (!current || dirty & /*expanded*/ 1) {
				(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.toggle_class)(span1, "expanded", /*expanded*/ ctx[0]);
			}

			if (dirty & /*children, depth, recursiveCount, tree*/ 26) {
				each_value = /*children*/ ctx[3];
				(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.validate_each_argument)(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.transition_in)(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.transition_in)(each_blocks[i], 1);
						each_blocks[i].m(ul, null);
					}
				}

				(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.group_outros)();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.check_outros)();
			}

			if (!current || dirty & /*id*/ 32) {
				(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.attr_dev)(ul, "data-id", /*id*/ ctx[5]);
			}

			if (!current || dirty & /*expanded*/ 1 && ul_class_value !== (ul_class_value = "" + ((0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.null_to_empty)(`${/*expanded*/ ctx[0] ? 'show' : 'hide'} w-full`) + " svelte-2ag2qc"))) {
				(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.attr_dev)(ul, "class", ul_class_value);
			}
		},
		i: function intro(local) {
			if (current) return;

			for (let i = 0; i < each_value.length; i += 1) {
				(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.transition_in)(each_blocks[i]);
			}

			current = true;
		},
		o: function outro(local) {
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.transition_out)(each_blocks[i]);
			}

			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.detach_dev)(span1);
			if (detaching) (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.detach_dev)(t3);
			if (detaching) (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.detach_dev)(ul);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.destroy_each)(each_blocks, detaching);
			/*ul_binding*/ ctx[9](null);
			mounted = false;
			dispose();
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

function calcInnerDepth(item, iteration = 0) {
	if (!item.children.length) return iteration;
	iteration++;
	return Math.max(...item.children.map(i => calcInnerDepth(i, iteration)));
}

function instance($$self, $$props, $$invalidate) {
	let arrowDown;
	let { $$slots: slots = {}, $$scope } = $$props;
	(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.validate_slots)('Folder', slots, []);
	let this_node = [1, 2, 3];
	let el;

	(0,svelte__WEBPACK_IMPORTED_MODULE_4__.onMount)(async function () {
		sortablejs__WEBPACK_IMPORTED_MODULE_3__["default"].create(el, {
			group: 'nested',
			animation: 150,
			fallbackOnBody: true,
			// forceFallback:true,
			swapThreshold: 0.65,
			ghostClass: 'dragFrom',
			swapClass: 'dragTo',
			// filter: '.no-drag > li',
			// forceFallback: true, fallbackClass: "sortable-fallback",
			store: {
				/**
 * Get the order of elements. Called once during initialization.
 * @param   {Sortable}  sortable
 * @returns {Array}
 */
				get(sortable) {
					var order = localStorage.getItem(sortable.options.group.name);
					console.log("order ==>", order);
					return order ? order.split('|') : [];
				},
				/**
 * Save the order of elements. Called onEnd (when the item is dropped).
 * @param {Sortable}  sortable
 */
				set(sortable) {
					var order = sortable.toArray();
					console.log(order);
					localStorage.setItem(sortable.options.group.name, order.join('|'));
				}
			},
			onEnd(/**Event*/
			evt) {
				console.log(evt.item.dataset.id, 'datasetID'); // var order = sortable.toArray();
				// $('.visuaplayoutCol02').attr('value', $('.visuaplayoutCol01').attr('value') + ',' + evt.item.dataset.id);
				// element's new index within parent

				console.log(evt.to.dataset.id, 'evt.to'); // element's new index within parent
				let itemEl = evt.item; // dragged HTMLElement

				// console.log(evt.to)
				// console.log(evt.from)
				// console.log(evt.oldIndex)
				// console.log(evt.newIndex)
				// console.log(evt.clone)
				// console.log(evt.pullMode)
				const src_el = evt.item.getAttribute('data-id');

				const to = evt.to.getAttribute('data-id');
				console.log(src_el, to);
				console.log("tree", tree);
				console.log("this_node", this_node);
				tree.move(src_el, to, evt.newIndex);
				console.log(src_el, tree.nodes[src_el]);
				localStorage.setItem('bookmark_racine', tree.root);
			}, // var order = sortable.toArray();
			
		}); // onAdd: function ( /**Event*/ evt) {
		//   var itemEl = evt.item; // dragged HTMLElement
		//   console.log(evt.from, 'From'); // previous list
	}); //   console.log(evt.to, 'To'); // next list
	//   //$('.visuaplayoutCol02').attr('value', $('.visuaplayoutCol01').attr('value') + ',' + evt.item.dataset.id);
	// },
	// onUpdate: function (evt) {

	let { expanded = false } = $$props;
	let { name = null } = $$props;
	let { children } = $$props;
	let { tree } = $$props;
	let { id } = $$props;
	let { depth } = $$props;

	function toggle() {
		$$invalidate(0, expanded = !expanded);
	}

	const get_depth = () => {
		tree.get_depth();
	};

	const writable_props = ['expanded', 'name', 'children', 'tree', 'id', 'depth'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Folder> was created with unknown prop '${key}'`);
	});

	function ul_binding($$value) {
		svelte_internal__WEBPACK_IMPORTED_MODULE_0__.binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			el = $$value;
			$$invalidate(6, el);
		});
	}

	$$self.$$set = $$props => {
		if ('expanded' in $$props) $$invalidate(0, expanded = $$props.expanded);
		if ('name' in $$props) $$invalidate(2, name = $$props.name);
		if ('children' in $$props) $$invalidate(3, children = $$props.children);
		if ('tree' in $$props) $$invalidate(4, tree = $$props.tree);
		if ('id' in $$props) $$invalidate(5, id = $$props.id);
		if ('depth' in $$props) $$invalidate(1, depth = $$props.depth);
	};

	$$self.$capture_state = () => ({
		Website: _Website_svelte__WEBPACK_IMPORTED_MODULE_1__["default"],
		fly: svelte_transition__WEBPACK_IMPORTED_MODULE_2__.fly,
		slide: svelte_transition__WEBPACK_IMPORTED_MODULE_2__.slide,
		Sortable: sortablejs__WEBPACK_IMPORTED_MODULE_3__["default"],
		MultiDrag: sortablejs__WEBPACK_IMPORTED_MODULE_3__.MultiDrag,
		Swap: sortablejs__WEBPACK_IMPORTED_MODULE_3__.Swap,
		onMount: svelte__WEBPACK_IMPORTED_MODULE_4__.onMount,
		recursiveCount: _utils__WEBPACK_IMPORTED_MODULE_5__.recursiveCount,
		this_node,
		el,
		expanded,
		name,
		children,
		tree,
		id,
		depth,
		toggle,
		calcInnerDepth,
		get_depth,
		arrowDown
	});

	$$self.$inject_state = $$props => {
		if ('this_node' in $$props) this_node = $$props.this_node;
		if ('el' in $$props) $$invalidate(6, el = $$props.el);
		if ('expanded' in $$props) $$invalidate(0, expanded = $$props.expanded);
		if ('name' in $$props) $$invalidate(2, name = $$props.name);
		if ('children' in $$props) $$invalidate(3, children = $$props.children);
		if ('tree' in $$props) $$invalidate(4, tree = $$props.tree);
		if ('id' in $$props) $$invalidate(5, id = $$props.id);
		if ('depth' in $$props) $$invalidate(1, depth = $$props.depth);
		if ('arrowDown' in $$props) $$invalidate(7, arrowDown = $$props.arrowDown);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*depth*/ 2) {
			$: $$invalidate(1, depth = depth || 0);
		}

		if ($$self.$$.dirty & /*expanded*/ 1) {
			$: $$invalidate(7, arrowDown = expanded);
		}
	};

	return [expanded, depth, name, children, tree, id, el, arrowDown, toggle, ul_binding];
}

class Folder extends svelte_internal__WEBPACK_IMPORTED_MODULE_0__.SvelteComponentDev {
	constructor(options) {
		super(options);

		(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.init)(
			this,
			options,
			instance,
			create_fragment,
			svelte_internal__WEBPACK_IMPORTED_MODULE_0__.safe_not_equal,
			{
				expanded: 0,
				name: 2,
				children: 3,
				tree: 4,
				id: 5,
				depth: 1
			},
			add_css
		);

		(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.dispatch_dev)("SvelteRegisterComponent", {
			component: this,
			tagName: "Folder",
			options,
			id: create_fragment.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*children*/ ctx[3] === undefined && !('children' in props)) {
			console_1.warn("<Folder> was created without expected prop 'children'");
		}

		if (/*tree*/ ctx[4] === undefined && !('tree' in props)) {
			console_1.warn("<Folder> was created without expected prop 'tree'");
		}

		if (/*id*/ ctx[5] === undefined && !('id' in props)) {
			console_1.warn("<Folder> was created without expected prop 'id'");
		}

		if (/*depth*/ ctx[1] === undefined && !('depth' in props)) {
			console_1.warn("<Folder> was created without expected prop 'depth'");
		}
	}

	get expanded() {
		throw new Error("<Folder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set expanded(value) {
		throw new Error("<Folder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get name() {
		throw new Error("<Folder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set name(value) {
		throw new Error("<Folder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get children() {
		throw new Error("<Folder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set children(value) {
		throw new Error("<Folder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get tree() {
		throw new Error("<Folder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set tree(value) {
		throw new Error("<Folder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get id() {
		throw new Error("<Folder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set id(value) {
		throw new Error("<Folder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get depth() {
		throw new Error("<Folder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set depth(value) {
		throw new Error("<Folder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

if (module && module.hot) { if (false) {}; Folder = _Users_Miezan_Dev_Game_Bookmark2_node_modules_pnpm_svelte_loader_3_1_3_svelte_3_50_1_node_modules_svelte_loader_lib_hot_api_js__WEBPACK_IMPORTED_MODULE_6__.applyHmr({ m: module, id: "\"src/popup/Folder.svelte\"", hotOptions: {"preserveLocalState":false,"noPreserveStateKey":["@hmr:reset","@!hmr"],"preserveAllLocalStateKey":"@hmr:keep-all","preserveLocalStateKey":"@hmr:keep","noReload":false,"optimistic":false,"acceptNamedExports":true,"acceptAccessors":true,"injectCss":false,"cssEjectDelay":100,"native":false,"importAdapterName":"___SVELTE_HMR_HOT_API_PROXY_ADAPTER","noOverlay":false,"allowLiveBinding":false}, Component: Folder, ProxyAdapter: _Users_Miezan_Dev_Game_Bookmark2_node_modules_pnpm_svelte_hmr_0_14_12_svelte_3_50_1_node_modules_svelte_hmr_runtime_proxy_adapter_dom_js__WEBPACK_IMPORTED_MODULE_7__.adapter, acceptable: true, preserveLocalState: false, emitCss: false, }); }
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Folder);



/***/ }),

/***/ "./src/popup/Website.svelte":
/*!**********************************!*\
  !*** ./src/popup/Website.svelte ***!
  \**********************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var svelte_internal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! svelte/internal */ "./node_modules/.pnpm/svelte@3.50.1/node_modules/svelte/internal/index.mjs");
/* harmony import */ var _Users_Miezan_Dev_Game_Bookmark2_node_modules_pnpm_svelte_loader_3_1_3_svelte_3_50_1_node_modules_svelte_loader_lib_hot_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/.pnpm/svelte-loader@3.1.3_svelte@3.50.1/node_modules/svelte-loader/lib/hot-api.js */ "./node_modules/.pnpm/svelte-loader@3.1.3_svelte@3.50.1/node_modules/svelte-loader/lib/hot-api.js");
/* harmony import */ var _Users_Miezan_Dev_Game_Bookmark2_node_modules_pnpm_svelte_hmr_0_14_12_svelte_3_50_1_node_modules_svelte_hmr_runtime_proxy_adapter_dom_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/.pnpm/svelte-hmr@0.14.12_svelte@3.50.1/node_modules/svelte-hmr/runtime/proxy-adapter-dom.js */ "./node_modules/.pnpm/svelte-hmr@0.14.12_svelte@3.50.1/node_modules/svelte-hmr/runtime/proxy-adapter-dom.js");
/* module decorator */ module = __webpack_require__.hmd(module);
/* src/popup/Website.svelte generated by Svelte v3.50.1 */


const file = "src/popup/Website.svelte";

function add_css(target) {
	(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.append_styles)(target, "svelte-1et4lum", "span.svelte-1et4lum{padding:2px 4px 4px 1.5em;background:0 0.1em no-repeat;background-size:1em 1em;background:rgba(0,0,0,.08);border:1px solid rgba(0,0,0,.1);display:flex;border-radius:2px;margin-left:20px;--tw-text-opacity:1;color:rgb(14 116 144 / var(--tw-text-opacity))}span.svelte-1et4lum:hover{border-bottom:2px solid var(--main-color);border-bottom-right-radius:2px;border-bottom-left-radius:2px}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV2Vic2l0ZS5zdmVsdGUiLCJtYXBwaW5ncyI6ImtaQW9DQSIsIm5hbWVzIjpbXSwic291cmNlcyI6WyJXZWJzaXRlLnN2ZWx0ZSJdfQ== */");
}

function create_fragment(ctx) {
	let span;
	let t0;
	let t1;
	let t2;

	const block = {
		c: function create() {
			span = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.element)("span");
			t0 = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.text)(/*url*/ ctx[0]);
			t1 = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.space)();
			t2 = (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.text)(/*depth*/ ctx[2]);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.attr_dev)(span, "id", /*id*/ ctx[1]);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.attr_dev)(span, "class", "svelte-1et4lum");
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.add_location)(span, file, 12, 0, 228);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.insert_dev)(target, span, anchor);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.append_dev)(span, t0);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.append_dev)(span, t1);
			(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.append_dev)(span, t2);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*url*/ 1) (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.set_data_dev)(t0, /*url*/ ctx[0]);
			if (dirty & /*depth*/ 4) (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.set_data_dev)(t2, /*depth*/ ctx[2]);

			if (dirty & /*id*/ 2) {
				(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.attr_dev)(span, "id", /*id*/ ctx[1]);
			}
		},
		i: svelte_internal__WEBPACK_IMPORTED_MODULE_0__.noop,
		o: svelte_internal__WEBPACK_IMPORTED_MODULE_0__.noop,
		d: function destroy(detaching) {
			if (detaching) (0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.detach_dev)(span);
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
	(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.validate_slots)('Website', slots, []);
	let { name = null } = $$props;
	let { url = null } = $$props;
	let { id = null } = $$props;
	let { depth = null } = $$props;

	// export let tree=null;
	url = url || name;

	const writable_props = ['name', 'url', 'id', 'depth'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Website> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('name' in $$props) $$invalidate(3, name = $$props.name);
		if ('url' in $$props) $$invalidate(0, url = $$props.url);
		if ('id' in $$props) $$invalidate(1, id = $$props.id);
		if ('depth' in $$props) $$invalidate(2, depth = $$props.depth);
	};

	$$self.$capture_state = () => ({ name, url, id, depth });

	$$self.$inject_state = $$props => {
		if ('name' in $$props) $$invalidate(3, name = $$props.name);
		if ('url' in $$props) $$invalidate(0, url = $$props.url);
		if ('id' in $$props) $$invalidate(1, id = $$props.id);
		if ('depth' in $$props) $$invalidate(2, depth = $$props.depth);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [url, id, depth, name];
}

class Website extends svelte_internal__WEBPACK_IMPORTED_MODULE_0__.SvelteComponentDev {
	constructor(options) {
		super(options);
		(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.init)(this, options, instance, create_fragment, svelte_internal__WEBPACK_IMPORTED_MODULE_0__.safe_not_equal, { name: 3, url: 0, id: 1, depth: 2 }, add_css);

		(0,svelte_internal__WEBPACK_IMPORTED_MODULE_0__.dispatch_dev)("SvelteRegisterComponent", {
			component: this,
			tagName: "Website",
			options,
			id: create_fragment.name
		});
	}

	get name() {
		throw new Error("<Website>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set name(value) {
		throw new Error("<Website>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get url() {
		throw new Error("<Website>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set url(value) {
		throw new Error("<Website>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get id() {
		throw new Error("<Website>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set id(value) {
		throw new Error("<Website>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get depth() {
		throw new Error("<Website>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set depth(value) {
		throw new Error("<Website>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

if (module && module.hot) { if (false) {}; Website = _Users_Miezan_Dev_Game_Bookmark2_node_modules_pnpm_svelte_loader_3_1_3_svelte_3_50_1_node_modules_svelte_loader_lib_hot_api_js__WEBPACK_IMPORTED_MODULE_1__.applyHmr({ m: module, id: "\"src/popup/Website.svelte\"", hotOptions: {"preserveLocalState":false,"noPreserveStateKey":["@hmr:reset","@!hmr"],"preserveAllLocalStateKey":"@hmr:keep-all","preserveLocalStateKey":"@hmr:keep","noReload":false,"optimistic":false,"acceptNamedExports":true,"acceptAccessors":true,"injectCss":false,"cssEjectDelay":100,"native":false,"importAdapterName":"___SVELTE_HMR_HOT_API_PROXY_ADAPTER","noOverlay":false,"allowLiveBinding":false}, Component: Website, ProxyAdapter: _Users_Miezan_Dev_Game_Bookmark2_node_modules_pnpm_svelte_hmr_0_14_12_svelte_3_50_1_node_modules_svelte_hmr_runtime_proxy_adapter_dom_js__WEBPACK_IMPORTED_MODULE_2__.adapter, acceptable: true, preserveLocalState: false, emitCss: false, }); }
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Website);



/***/ }),

/***/ "./node_modules/.pnpm/webpack-dev-server@3.11.3_5v66e2inugklgvlh4huuavolfq/node_modules/webpack/hot ./node_modules/webpack/hot sync ^\\.\\/log$":
/*!*******************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/webpack-dev-server@3.11.3_5v66e2inugklgvlh4huuavolfq/node_modules/webpack/hot/ ./node_modules/webpack/hot/ sync nonrecursive ^\.\/log$ ***!
  \*******************************************************************************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./log": "./node_modules/.pnpm/webpack@5.74.0_webpack-cli@4.10.0/node_modules/webpack/hot/log.js"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./node_modules/.pnpm/webpack-dev-server@3.11.3_5v66e2inugklgvlh4huuavolfq/node_modules/webpack/hot ./node_modules/webpack/hot sync ^\\.\\/log$";

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
/******/ 			if (cachedModule.error !== undefined) throw cachedModule.error;
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
/******/ 		try {
/******/ 			var execOptions = { id: moduleId, module: module, factory: __webpack_modules__[moduleId], require: __webpack_require__ };
/******/ 			__webpack_require__.i.forEach(function(handler) { handler(execOptions); });
/******/ 			module = execOptions.module;
/******/ 			execOptions.factory.call(module.exports, module, module.exports, execOptions.require);
/******/ 		} catch(e) {
/******/ 			module.error = e;
/******/ 			throw e;
/******/ 		}
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
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = __webpack_module_cache__;
/******/ 	
/******/ 	// expose the module execution interceptor
/******/ 	__webpack_require__.i = [];
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
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
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
/******/ 	/* webpack/runtime/get javascript update chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference all chunks
/******/ 		__webpack_require__.hu = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + "." + __webpack_require__.h() + ".hot-update.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get mini-css chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference all chunks
/******/ 		__webpack_require__.miniCssF = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".css";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get update manifest filename */
/******/ 	(() => {
/******/ 		__webpack_require__.hmrF = () => ("popup_js." + __webpack_require__.h() + ".hot-update.json");
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/getFullHash */
/******/ 	(() => {
/******/ 		__webpack_require__.h = () => ("128efaa4d0969c43af4e")
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
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "bookmark2:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			;
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hot module replacement */
/******/ 	(() => {
/******/ 		var currentModuleData = {};
/******/ 		var installedModules = __webpack_require__.c;
/******/ 		
/******/ 		// module and require creation
/******/ 		var currentChildModule;
/******/ 		var currentParents = [];
/******/ 		
/******/ 		// status
/******/ 		var registeredStatusHandlers = [];
/******/ 		var currentStatus = "idle";
/******/ 		
/******/ 		// while downloading
/******/ 		var blockingPromises = 0;
/******/ 		var blockingPromisesWaiting = [];
/******/ 		
/******/ 		// The update info
/******/ 		var currentUpdateApplyHandlers;
/******/ 		var queuedInvalidatedModules;
/******/ 		
/******/ 		// eslint-disable-next-line no-unused-vars
/******/ 		__webpack_require__.hmrD = currentModuleData;
/******/ 		
/******/ 		__webpack_require__.i.push(function (options) {
/******/ 			var module = options.module;
/******/ 			var require = createRequire(options.require, options.id);
/******/ 			module.hot = createModuleHotObject(options.id, module);
/******/ 			module.parents = currentParents;
/******/ 			module.children = [];
/******/ 			currentParents = [];
/******/ 			options.require = require;
/******/ 		});
/******/ 		
/******/ 		__webpack_require__.hmrC = {};
/******/ 		__webpack_require__.hmrI = {};
/******/ 		
/******/ 		function createRequire(require, moduleId) {
/******/ 			var me = installedModules[moduleId];
/******/ 			if (!me) return require;
/******/ 			var fn = function (request) {
/******/ 				if (me.hot.active) {
/******/ 					if (installedModules[request]) {
/******/ 						var parents = installedModules[request].parents;
/******/ 						if (parents.indexOf(moduleId) === -1) {
/******/ 							parents.push(moduleId);
/******/ 						}
/******/ 					} else {
/******/ 						currentParents = [moduleId];
/******/ 						currentChildModule = request;
/******/ 					}
/******/ 					if (me.children.indexOf(request) === -1) {
/******/ 						me.children.push(request);
/******/ 					}
/******/ 				} else {
/******/ 					console.warn(
/******/ 						"[HMR] unexpected require(" +
/******/ 							request +
/******/ 							") from disposed module " +
/******/ 							moduleId
/******/ 					);
/******/ 					currentParents = [];
/******/ 				}
/******/ 				return require(request);
/******/ 			};
/******/ 			var createPropertyDescriptor = function (name) {
/******/ 				return {
/******/ 					configurable: true,
/******/ 					enumerable: true,
/******/ 					get: function () {
/******/ 						return require[name];
/******/ 					},
/******/ 					set: function (value) {
/******/ 						require[name] = value;
/******/ 					}
/******/ 				};
/******/ 			};
/******/ 			for (var name in require) {
/******/ 				if (Object.prototype.hasOwnProperty.call(require, name) && name !== "e") {
/******/ 					Object.defineProperty(fn, name, createPropertyDescriptor(name));
/******/ 				}
/******/ 			}
/******/ 			fn.e = function (chunkId) {
/******/ 				return trackBlockingPromise(require.e(chunkId));
/******/ 			};
/******/ 			return fn;
/******/ 		}
/******/ 		
/******/ 		function createModuleHotObject(moduleId, me) {
/******/ 			var _main = currentChildModule !== moduleId;
/******/ 			var hot = {
/******/ 				// private stuff
/******/ 				_acceptedDependencies: {},
/******/ 				_acceptedErrorHandlers: {},
/******/ 				_declinedDependencies: {},
/******/ 				_selfAccepted: false,
/******/ 				_selfDeclined: false,
/******/ 				_selfInvalidated: false,
/******/ 				_disposeHandlers: [],
/******/ 				_main: _main,
/******/ 				_requireSelf: function () {
/******/ 					currentParents = me.parents.slice();
/******/ 					currentChildModule = _main ? undefined : moduleId;
/******/ 					__webpack_require__(moduleId);
/******/ 				},
/******/ 		
/******/ 				// Module API
/******/ 				active: true,
/******/ 				accept: function (dep, callback, errorHandler) {
/******/ 					if (dep === undefined) hot._selfAccepted = true;
/******/ 					else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 					else if (typeof dep === "object" && dep !== null) {
/******/ 						for (var i = 0; i < dep.length; i++) {
/******/ 							hot._acceptedDependencies[dep[i]] = callback || function () {};
/******/ 							hot._acceptedErrorHandlers[dep[i]] = errorHandler;
/******/ 						}
/******/ 					} else {
/******/ 						hot._acceptedDependencies[dep] = callback || function () {};
/******/ 						hot._acceptedErrorHandlers[dep] = errorHandler;
/******/ 					}
/******/ 				},
/******/ 				decline: function (dep) {
/******/ 					if (dep === undefined) hot._selfDeclined = true;
/******/ 					else if (typeof dep === "object" && dep !== null)
/******/ 						for (var i = 0; i < dep.length; i++)
/******/ 							hot._declinedDependencies[dep[i]] = true;
/******/ 					else hot._declinedDependencies[dep] = true;
/******/ 				},
/******/ 				dispose: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				addDisposeHandler: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				removeDisposeHandler: function (callback) {
/******/ 					var idx = hot._disposeHandlers.indexOf(callback);
/******/ 					if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 				},
/******/ 				invalidate: function () {
/******/ 					this._selfInvalidated = true;
/******/ 					switch (currentStatus) {
/******/ 						case "idle":
/******/ 							currentUpdateApplyHandlers = [];
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							setStatus("ready");
/******/ 							break;
/******/ 						case "ready":
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							break;
/******/ 						case "prepare":
/******/ 						case "check":
/******/ 						case "dispose":
/******/ 						case "apply":
/******/ 							(queuedInvalidatedModules = queuedInvalidatedModules || []).push(
/******/ 								moduleId
/******/ 							);
/******/ 							break;
/******/ 						default:
/******/ 							// ignore requests in error states
/******/ 							break;
/******/ 					}
/******/ 				},
/******/ 		
/******/ 				// Management API
/******/ 				check: hotCheck,
/******/ 				apply: hotApply,
/******/ 				status: function (l) {
/******/ 					if (!l) return currentStatus;
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				addStatusHandler: function (l) {
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				removeStatusHandler: function (l) {
/******/ 					var idx = registeredStatusHandlers.indexOf(l);
/******/ 					if (idx >= 0) registeredStatusHandlers.splice(idx, 1);
/******/ 				},
/******/ 		
/******/ 				//inherit from previous dispose call
/******/ 				data: currentModuleData[moduleId]
/******/ 			};
/******/ 			currentChildModule = undefined;
/******/ 			return hot;
/******/ 		}
/******/ 		
/******/ 		function setStatus(newStatus) {
/******/ 			currentStatus = newStatus;
/******/ 			var results = [];
/******/ 		
/******/ 			for (var i = 0; i < registeredStatusHandlers.length; i++)
/******/ 				results[i] = registeredStatusHandlers[i].call(null, newStatus);
/******/ 		
/******/ 			return Promise.all(results);
/******/ 		}
/******/ 		
/******/ 		function unblock() {
/******/ 			if (--blockingPromises === 0) {
/******/ 				setStatus("ready").then(function () {
/******/ 					if (blockingPromises === 0) {
/******/ 						var list = blockingPromisesWaiting;
/******/ 						blockingPromisesWaiting = [];
/******/ 						for (var i = 0; i < list.length; i++) {
/******/ 							list[i]();
/******/ 						}
/******/ 					}
/******/ 				});
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function trackBlockingPromise(promise) {
/******/ 			switch (currentStatus) {
/******/ 				case "ready":
/******/ 					setStatus("prepare");
/******/ 				/* fallthrough */
/******/ 				case "prepare":
/******/ 					blockingPromises++;
/******/ 					promise.then(unblock, unblock);
/******/ 					return promise;
/******/ 				default:
/******/ 					return promise;
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function waitForBlockingPromises(fn) {
/******/ 			if (blockingPromises === 0) return fn();
/******/ 			return new Promise(function (resolve) {
/******/ 				blockingPromisesWaiting.push(function () {
/******/ 					resolve(fn());
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function hotCheck(applyOnUpdate) {
/******/ 			if (currentStatus !== "idle") {
/******/ 				throw new Error("check() is only allowed in idle status");
/******/ 			}
/******/ 			return setStatus("check")
/******/ 				.then(__webpack_require__.hmrM)
/******/ 				.then(function (update) {
/******/ 					if (!update) {
/******/ 						return setStatus(applyInvalidatedModules() ? "ready" : "idle").then(
/******/ 							function () {
/******/ 								return null;
/******/ 							}
/******/ 						);
/******/ 					}
/******/ 		
/******/ 					return setStatus("prepare").then(function () {
/******/ 						var updatedModules = [];
/******/ 						currentUpdateApplyHandlers = [];
/******/ 		
/******/ 						return Promise.all(
/******/ 							Object.keys(__webpack_require__.hmrC).reduce(function (
/******/ 								promises,
/******/ 								key
/******/ 							) {
/******/ 								__webpack_require__.hmrC[key](
/******/ 									update.c,
/******/ 									update.r,
/******/ 									update.m,
/******/ 									promises,
/******/ 									currentUpdateApplyHandlers,
/******/ 									updatedModules
/******/ 								);
/******/ 								return promises;
/******/ 							},
/******/ 							[])
/******/ 						).then(function () {
/******/ 							return waitForBlockingPromises(function () {
/******/ 								if (applyOnUpdate) {
/******/ 									return internalApply(applyOnUpdate);
/******/ 								} else {
/******/ 									return setStatus("ready").then(function () {
/******/ 										return updatedModules;
/******/ 									});
/******/ 								}
/******/ 							});
/******/ 						});
/******/ 					});
/******/ 				});
/******/ 		}
/******/ 		
/******/ 		function hotApply(options) {
/******/ 			if (currentStatus !== "ready") {
/******/ 				return Promise.resolve().then(function () {
/******/ 					throw new Error(
/******/ 						"apply() is only allowed in ready status (state: " +
/******/ 							currentStatus +
/******/ 							")"
/******/ 					);
/******/ 				});
/******/ 			}
/******/ 			return internalApply(options);
/******/ 		}
/******/ 		
/******/ 		function internalApply(options) {
/******/ 			options = options || {};
/******/ 		
/******/ 			applyInvalidatedModules();
/******/ 		
/******/ 			var results = currentUpdateApplyHandlers.map(function (handler) {
/******/ 				return handler(options);
/******/ 			});
/******/ 			currentUpdateApplyHandlers = undefined;
/******/ 		
/******/ 			var errors = results
/******/ 				.map(function (r) {
/******/ 					return r.error;
/******/ 				})
/******/ 				.filter(Boolean);
/******/ 		
/******/ 			if (errors.length > 0) {
/******/ 				return setStatus("abort").then(function () {
/******/ 					throw errors[0];
/******/ 				});
/******/ 			}
/******/ 		
/******/ 			// Now in "dispose" phase
/******/ 			var disposePromise = setStatus("dispose");
/******/ 		
/******/ 			results.forEach(function (result) {
/******/ 				if (result.dispose) result.dispose();
/******/ 			});
/******/ 		
/******/ 			// Now in "apply" phase
/******/ 			var applyPromise = setStatus("apply");
/******/ 		
/******/ 			var error;
/******/ 			var reportError = function (err) {
/******/ 				if (!error) error = err;
/******/ 			};
/******/ 		
/******/ 			var outdatedModules = [];
/******/ 			results.forEach(function (result) {
/******/ 				if (result.apply) {
/******/ 					var modules = result.apply(reportError);
/******/ 					if (modules) {
/******/ 						for (var i = 0; i < modules.length; i++) {
/******/ 							outdatedModules.push(modules[i]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		
/******/ 			return Promise.all([disposePromise, applyPromise]).then(function () {
/******/ 				// handle errors in accept handlers and self accepted module load
/******/ 				if (error) {
/******/ 					return setStatus("fail").then(function () {
/******/ 						throw error;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				if (queuedInvalidatedModules) {
/******/ 					return internalApply(options).then(function (list) {
/******/ 						outdatedModules.forEach(function (moduleId) {
/******/ 							if (list.indexOf(moduleId) < 0) list.push(moduleId);
/******/ 						});
/******/ 						return list;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				return setStatus("idle").then(function () {
/******/ 					return outdatedModules;
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function applyInvalidatedModules() {
/******/ 			if (queuedInvalidatedModules) {
/******/ 				if (!currentUpdateApplyHandlers) currentUpdateApplyHandlers = [];
/******/ 				Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 					queuedInvalidatedModules.forEach(function (moduleId) {
/******/ 						__webpack_require__.hmrI[key](
/******/ 							moduleId,
/******/ 							currentUpdateApplyHandlers
/******/ 						);
/******/ 					});
/******/ 				});
/******/ 				queuedInvalidatedModules = undefined;
/******/ 				return true;
/******/ 			}
/******/ 		}
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/css loading */
/******/ 	(() => {
/******/ 		var createStylesheet = (chunkId, fullhref, resolve, reject) => {
/******/ 			var linkTag = document.createElement("link");
/******/ 		
/******/ 			linkTag.rel = "stylesheet";
/******/ 			linkTag.type = "text/css";
/******/ 			var onLinkComplete = (event) => {
/******/ 				// avoid mem leaks.
/******/ 				linkTag.onerror = linkTag.onload = null;
/******/ 				if (event.type === 'load') {
/******/ 					resolve();
/******/ 				} else {
/******/ 					var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 					var realHref = event && event.target && event.target.href || fullhref;
/******/ 					var err = new Error("Loading CSS chunk " + chunkId + " failed.\n(" + realHref + ")");
/******/ 					err.code = "CSS_CHUNK_LOAD_FAILED";
/******/ 					err.type = errorType;
/******/ 					err.request = realHref;
/******/ 					linkTag.parentNode.removeChild(linkTag)
/******/ 					reject(err);
/******/ 				}
/******/ 			}
/******/ 			linkTag.onerror = linkTag.onload = onLinkComplete;
/******/ 			linkTag.href = fullhref;
/******/ 		
/******/ 			document.head.appendChild(linkTag);
/******/ 			return linkTag;
/******/ 		};
/******/ 		var findStylesheet = (href, fullhref) => {
/******/ 			var existingLinkTags = document.getElementsByTagName("link");
/******/ 			for(var i = 0; i < existingLinkTags.length; i++) {
/******/ 				var tag = existingLinkTags[i];
/******/ 				var dataHref = tag.getAttribute("data-href") || tag.getAttribute("href");
/******/ 				if(tag.rel === "stylesheet" && (dataHref === href || dataHref === fullhref)) return tag;
/******/ 			}
/******/ 			var existingStyleTags = document.getElementsByTagName("style");
/******/ 			for(var i = 0; i < existingStyleTags.length; i++) {
/******/ 				var tag = existingStyleTags[i];
/******/ 				var dataHref = tag.getAttribute("data-href");
/******/ 				if(dataHref === href || dataHref === fullhref) return tag;
/******/ 			}
/******/ 		};
/******/ 		var loadStylesheet = (chunkId) => {
/******/ 			return new Promise((resolve, reject) => {
/******/ 				var href = __webpack_require__.miniCssF(chunkId);
/******/ 				var fullhref = __webpack_require__.p + href;
/******/ 				if(findStylesheet(href, fullhref)) return resolve();
/******/ 				createStylesheet(chunkId, fullhref, resolve, reject);
/******/ 			});
/******/ 		}
/******/ 		// no chunk loading
/******/ 		
/******/ 		var oldTags = [];
/******/ 		var newTags = [];
/******/ 		var applyHandler = (options) => {
/******/ 			return { dispose: () => {
/******/ 				for(var i = 0; i < oldTags.length; i++) {
/******/ 					var oldTag = oldTags[i];
/******/ 					if(oldTag.parentNode) oldTag.parentNode.removeChild(oldTag);
/******/ 				}
/******/ 				oldTags.length = 0;
/******/ 			}, apply: () => {
/******/ 				for(var i = 0; i < newTags.length; i++) newTags[i].rel = "stylesheet";
/******/ 				newTags.length = 0;
/******/ 			} };
/******/ 		}
/******/ 		__webpack_require__.hmrC.miniCss = (chunkIds, removedChunks, removedModules, promises, applyHandlers, updatedModulesList) => {
/******/ 			applyHandlers.push(applyHandler);
/******/ 			chunkIds.forEach((chunkId) => {
/******/ 				var href = __webpack_require__.miniCssF(chunkId);
/******/ 				var fullhref = __webpack_require__.p + href;
/******/ 				var oldTag = findStylesheet(href, fullhref);
/******/ 				if(!oldTag) return;
/******/ 				promises.push(new Promise((resolve, reject) => {
/******/ 					var tag = createStylesheet(chunkId, fullhref, () => {
/******/ 						tag.as = "style";
/******/ 						tag.rel = "preload";
/******/ 						resolve();
/******/ 					}, reject);
/******/ 					oldTags.push(oldTag);
/******/ 					newTags.push(tag);
/******/ 				}));
/******/ 			});
/******/ 		}
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = __webpack_require__.hmrS_jsonp = __webpack_require__.hmrS_jsonp || {
/******/ 			"popup.js": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		var currentUpdatedModulesList;
/******/ 		var waitingUpdateResolves = {};
/******/ 		function loadUpdateChunk(chunkId, updatedModulesList) {
/******/ 			currentUpdatedModulesList = updatedModulesList;
/******/ 			return new Promise((resolve, reject) => {
/******/ 				waitingUpdateResolves[chunkId] = resolve;
/******/ 				// start update chunk loading
/******/ 				var url = __webpack_require__.p + __webpack_require__.hu(chunkId);
/******/ 				// create error before stack unwound to get useful stacktrace later
/******/ 				var error = new Error();
/******/ 				var loadingEnded = (event) => {
/******/ 					if(waitingUpdateResolves[chunkId]) {
/******/ 						waitingUpdateResolves[chunkId] = undefined
/******/ 						var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 						var realSrc = event && event.target && event.target.src;
/******/ 						error.message = 'Loading hot update chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 						error.name = 'ChunkLoadError';
/******/ 						error.type = errorType;
/******/ 						error.request = realSrc;
/******/ 						reject(error);
/******/ 					}
/******/ 				};
/******/ 				__webpack_require__.l(url, loadingEnded);
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		self["webpackHotUpdatebookmark2"] = (chunkId, moreModules, runtime) => {
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					currentUpdate[moduleId] = moreModules[moduleId];
/******/ 					if(currentUpdatedModulesList) currentUpdatedModulesList.push(moduleId);
/******/ 				}
/******/ 			}
/******/ 			if(runtime) currentUpdateRuntime.push(runtime);
/******/ 			if(waitingUpdateResolves[chunkId]) {
/******/ 				waitingUpdateResolves[chunkId]();
/******/ 				waitingUpdateResolves[chunkId] = undefined;
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		var currentUpdateChunks;
/******/ 		var currentUpdate;
/******/ 		var currentUpdateRemovedChunks;
/******/ 		var currentUpdateRuntime;
/******/ 		function applyHandler(options) {
/******/ 			if (__webpack_require__.f) delete __webpack_require__.f.jsonpHmr;
/******/ 			currentUpdateChunks = undefined;
/******/ 			function getAffectedModuleEffects(updateModuleId) {
/******/ 				var outdatedModules = [updateModuleId];
/******/ 				var outdatedDependencies = {};
/******/ 		
/******/ 				var queue = outdatedModules.map(function (id) {
/******/ 					return {
/******/ 						chain: [id],
/******/ 						id: id
/******/ 					};
/******/ 				});
/******/ 				while (queue.length > 0) {
/******/ 					var queueItem = queue.pop();
/******/ 					var moduleId = queueItem.id;
/******/ 					var chain = queueItem.chain;
/******/ 					var module = __webpack_require__.c[moduleId];
/******/ 					if (
/******/ 						!module ||
/******/ 						(module.hot._selfAccepted && !module.hot._selfInvalidated)
/******/ 					)
/******/ 						continue;
/******/ 					if (module.hot._selfDeclined) {
/******/ 						return {
/******/ 							type: "self-declined",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					if (module.hot._main) {
/******/ 						return {
/******/ 							type: "unaccepted",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					for (var i = 0; i < module.parents.length; i++) {
/******/ 						var parentId = module.parents[i];
/******/ 						var parent = __webpack_require__.c[parentId];
/******/ 						if (!parent) continue;
/******/ 						if (parent.hot._declinedDependencies[moduleId]) {
/******/ 							return {
/******/ 								type: "declined",
/******/ 								chain: chain.concat([parentId]),
/******/ 								moduleId: moduleId,
/******/ 								parentId: parentId
/******/ 							};
/******/ 						}
/******/ 						if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 						if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 							if (!outdatedDependencies[parentId])
/******/ 								outdatedDependencies[parentId] = [];
/******/ 							addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 							continue;
/******/ 						}
/******/ 						delete outdatedDependencies[parentId];
/******/ 						outdatedModules.push(parentId);
/******/ 						queue.push({
/******/ 							chain: chain.concat([parentId]),
/******/ 							id: parentId
/******/ 						});
/******/ 					}
/******/ 				}
/******/ 		
/******/ 				return {
/******/ 					type: "accepted",
/******/ 					moduleId: updateModuleId,
/******/ 					outdatedModules: outdatedModules,
/******/ 					outdatedDependencies: outdatedDependencies
/******/ 				};
/******/ 			}
/******/ 		
/******/ 			function addAllToSet(a, b) {
/******/ 				for (var i = 0; i < b.length; i++) {
/******/ 					var item = b[i];
/******/ 					if (a.indexOf(item) === -1) a.push(item);
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			// at begin all updates modules are outdated
/******/ 			// the "outdated" status can propagate to parents if they don't accept the children
/******/ 			var outdatedDependencies = {};
/******/ 			var outdatedModules = [];
/******/ 			var appliedUpdate = {};
/******/ 		
/******/ 			var warnUnexpectedRequire = function warnUnexpectedRequire(module) {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" + module.id + ") to disposed module"
/******/ 				);
/******/ 			};
/******/ 		
/******/ 			for (var moduleId in currentUpdate) {
/******/ 				if (__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 					var newModuleFactory = currentUpdate[moduleId];
/******/ 					/** @type {TODO} */
/******/ 					var result;
/******/ 					if (newModuleFactory) {
/******/ 						result = getAffectedModuleEffects(moduleId);
/******/ 					} else {
/******/ 						result = {
/******/ 							type: "disposed",
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					/** @type {Error|false} */
/******/ 					var abortError = false;
/******/ 					var doApply = false;
/******/ 					var doDispose = false;
/******/ 					var chainInfo = "";
/******/ 					if (result.chain) {
/******/ 						chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 					}
/******/ 					switch (result.type) {
/******/ 						case "self-declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of self decline: " +
/******/ 										result.moduleId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of declined dependency: " +
/******/ 										result.moduleId +
/******/ 										" in " +
/******/ 										result.parentId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "unaccepted":
/******/ 							if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 							if (!options.ignoreUnaccepted)
/******/ 								abortError = new Error(
/******/ 									"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "accepted":
/******/ 							if (options.onAccepted) options.onAccepted(result);
/******/ 							doApply = true;
/******/ 							break;
/******/ 						case "disposed":
/******/ 							if (options.onDisposed) options.onDisposed(result);
/******/ 							doDispose = true;
/******/ 							break;
/******/ 						default:
/******/ 							throw new Error("Unexception type " + result.type);
/******/ 					}
/******/ 					if (abortError) {
/******/ 						return {
/******/ 							error: abortError
/******/ 						};
/******/ 					}
/******/ 					if (doApply) {
/******/ 						appliedUpdate[moduleId] = newModuleFactory;
/******/ 						addAllToSet(outdatedModules, result.outdatedModules);
/******/ 						for (moduleId in result.outdatedDependencies) {
/******/ 							if (__webpack_require__.o(result.outdatedDependencies, moduleId)) {
/******/ 								if (!outdatedDependencies[moduleId])
/******/ 									outdatedDependencies[moduleId] = [];
/******/ 								addAllToSet(
/******/ 									outdatedDependencies[moduleId],
/******/ 									result.outdatedDependencies[moduleId]
/******/ 								);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 					if (doDispose) {
/******/ 						addAllToSet(outdatedModules, [result.moduleId]);
/******/ 						appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 			currentUpdate = undefined;
/******/ 		
/******/ 			// Store self accepted outdated modules to require them later by the module system
/******/ 			var outdatedSelfAcceptedModules = [];
/******/ 			for (var j = 0; j < outdatedModules.length; j++) {
/******/ 				var outdatedModuleId = outdatedModules[j];
/******/ 				var module = __webpack_require__.c[outdatedModuleId];
/******/ 				if (
/******/ 					module &&
/******/ 					(module.hot._selfAccepted || module.hot._main) &&
/******/ 					// removed self-accepted modules should not be required
/******/ 					appliedUpdate[outdatedModuleId] !== warnUnexpectedRequire &&
/******/ 					// when called invalidate self-accepting is not possible
/******/ 					!module.hot._selfInvalidated
/******/ 				) {
/******/ 					outdatedSelfAcceptedModules.push({
/******/ 						module: outdatedModuleId,
/******/ 						require: module.hot._requireSelf,
/******/ 						errorHandler: module.hot._selfAccepted
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			var moduleOutdatedDependencies;
/******/ 		
/******/ 			return {
/******/ 				dispose: function () {
/******/ 					currentUpdateRemovedChunks.forEach(function (chunkId) {
/******/ 						delete installedChunks[chunkId];
/******/ 					});
/******/ 					currentUpdateRemovedChunks = undefined;
/******/ 		
/******/ 					var idx;
/******/ 					var queue = outdatedModules.slice();
/******/ 					while (queue.length > 0) {
/******/ 						var moduleId = queue.pop();
/******/ 						var module = __webpack_require__.c[moduleId];
/******/ 						if (!module) continue;
/******/ 		
/******/ 						var data = {};
/******/ 		
/******/ 						// Call dispose handlers
/******/ 						var disposeHandlers = module.hot._disposeHandlers;
/******/ 						for (j = 0; j < disposeHandlers.length; j++) {
/******/ 							disposeHandlers[j].call(null, data);
/******/ 						}
/******/ 						__webpack_require__.hmrD[moduleId] = data;
/******/ 		
/******/ 						// disable module (this disables requires from this module)
/******/ 						module.hot.active = false;
/******/ 		
/******/ 						// remove module from cache
/******/ 						delete __webpack_require__.c[moduleId];
/******/ 		
/******/ 						// when disposing there is no need to call dispose handler
/******/ 						delete outdatedDependencies[moduleId];
/******/ 		
/******/ 						// remove "parents" references from all children
/******/ 						for (j = 0; j < module.children.length; j++) {
/******/ 							var child = __webpack_require__.c[module.children[j]];
/******/ 							if (!child) continue;
/******/ 							idx = child.parents.indexOf(moduleId);
/******/ 							if (idx >= 0) {
/******/ 								child.parents.splice(idx, 1);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// remove outdated dependency from module children
/******/ 					var dependency;
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									dependency = moduleOutdatedDependencies[j];
/******/ 									idx = module.children.indexOf(dependency);
/******/ 									if (idx >= 0) module.children.splice(idx, 1);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				},
/******/ 				apply: function (reportError) {
/******/ 					// insert new code
/******/ 					for (var updateModuleId in appliedUpdate) {
/******/ 						if (__webpack_require__.o(appliedUpdate, updateModuleId)) {
/******/ 							__webpack_require__.m[updateModuleId] = appliedUpdate[updateModuleId];
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// run new runtime modules
/******/ 					for (var i = 0; i < currentUpdateRuntime.length; i++) {
/******/ 						currentUpdateRuntime[i](__webpack_require__);
/******/ 					}
/******/ 		
/******/ 					// call accept handlers
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							var module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								var callbacks = [];
/******/ 								var errorHandlers = [];
/******/ 								var dependenciesForCallbacks = [];
/******/ 								for (var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									var dependency = moduleOutdatedDependencies[j];
/******/ 									var acceptCallback =
/******/ 										module.hot._acceptedDependencies[dependency];
/******/ 									var errorHandler =
/******/ 										module.hot._acceptedErrorHandlers[dependency];
/******/ 									if (acceptCallback) {
/******/ 										if (callbacks.indexOf(acceptCallback) !== -1) continue;
/******/ 										callbacks.push(acceptCallback);
/******/ 										errorHandlers.push(errorHandler);
/******/ 										dependenciesForCallbacks.push(dependency);
/******/ 									}
/******/ 								}
/******/ 								for (var k = 0; k < callbacks.length; k++) {
/******/ 									try {
/******/ 										callbacks[k].call(null, moduleOutdatedDependencies);
/******/ 									} catch (err) {
/******/ 										if (typeof errorHandlers[k] === "function") {
/******/ 											try {
/******/ 												errorHandlers[k](err, {
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k]
/******/ 												});
/******/ 											} catch (err2) {
/******/ 												if (options.onErrored) {
/******/ 													options.onErrored({
/******/ 														type: "accept-error-handler-errored",
/******/ 														moduleId: outdatedModuleId,
/******/ 														dependencyId: dependenciesForCallbacks[k],
/******/ 														error: err2,
/******/ 														originalError: err
/******/ 													});
/******/ 												}
/******/ 												if (!options.ignoreErrored) {
/******/ 													reportError(err2);
/******/ 													reportError(err);
/******/ 												}
/******/ 											}
/******/ 										} else {
/******/ 											if (options.onErrored) {
/******/ 												options.onErrored({
/******/ 													type: "accept-errored",
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k],
/******/ 													error: err
/******/ 												});
/******/ 											}
/******/ 											if (!options.ignoreErrored) {
/******/ 												reportError(err);
/******/ 											}
/******/ 										}
/******/ 									}
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// Load self accepted modules
/******/ 					for (var o = 0; o < outdatedSelfAcceptedModules.length; o++) {
/******/ 						var item = outdatedSelfAcceptedModules[o];
/******/ 						var moduleId = item.module;
/******/ 						try {
/******/ 							item.require(moduleId);
/******/ 						} catch (err) {
/******/ 							if (typeof item.errorHandler === "function") {
/******/ 								try {
/******/ 									item.errorHandler(err, {
/******/ 										moduleId: moduleId,
/******/ 										module: __webpack_require__.c[moduleId]
/******/ 									});
/******/ 								} catch (err2) {
/******/ 									if (options.onErrored) {
/******/ 										options.onErrored({
/******/ 											type: "self-accept-error-handler-errored",
/******/ 											moduleId: moduleId,
/******/ 											error: err2,
/******/ 											originalError: err
/******/ 										});
/******/ 									}
/******/ 									if (!options.ignoreErrored) {
/******/ 										reportError(err2);
/******/ 										reportError(err);
/******/ 									}
/******/ 								}
/******/ 							} else {
/******/ 								if (options.onErrored) {
/******/ 									options.onErrored({
/******/ 										type: "self-accept-errored",
/******/ 										moduleId: moduleId,
/******/ 										error: err
/******/ 									});
/******/ 								}
/******/ 								if (!options.ignoreErrored) {
/******/ 									reportError(err);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					return outdatedModules;
/******/ 				}
/******/ 			};
/******/ 		}
/******/ 		__webpack_require__.hmrI.jsonp = function (moduleId, applyHandlers) {
/******/ 			if (!currentUpdate) {
/******/ 				currentUpdate = {};
/******/ 				currentUpdateRuntime = [];
/******/ 				currentUpdateRemovedChunks = [];
/******/ 				applyHandlers.push(applyHandler);
/******/ 			}
/******/ 			if (!__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 				currentUpdate[moduleId] = __webpack_require__.m[moduleId];
/******/ 			}
/******/ 		};
/******/ 		__webpack_require__.hmrC.jsonp = function (
/******/ 			chunkIds,
/******/ 			removedChunks,
/******/ 			removedModules,
/******/ 			promises,
/******/ 			applyHandlers,
/******/ 			updatedModulesList
/******/ 		) {
/******/ 			applyHandlers.push(applyHandler);
/******/ 			currentUpdateChunks = {};
/******/ 			currentUpdateRemovedChunks = removedChunks;
/******/ 			currentUpdate = removedModules.reduce(function (obj, key) {
/******/ 				obj[key] = false;
/******/ 				return obj;
/******/ 			}, {});
/******/ 			currentUpdateRuntime = [];
/******/ 			chunkIds.forEach(function (chunkId) {
/******/ 				if (
/******/ 					__webpack_require__.o(installedChunks, chunkId) &&
/******/ 					installedChunks[chunkId] !== undefined
/******/ 				) {
/******/ 					promises.push(loadUpdateChunk(chunkId, updatedModulesList));
/******/ 					currentUpdateChunks[chunkId] = true;
/******/ 				} else {
/******/ 					currentUpdateChunks[chunkId] = false;
/******/ 				}
/******/ 			});
/******/ 			if (__webpack_require__.f) {
/******/ 				__webpack_require__.f.jsonpHmr = function (chunkId, promises) {
/******/ 					if (
/******/ 						currentUpdateChunks &&
/******/ 						__webpack_require__.o(currentUpdateChunks, chunkId) &&
/******/ 						!currentUpdateChunks[chunkId]
/******/ 					) {
/******/ 						promises.push(loadUpdateChunk(chunkId));
/******/ 						currentUpdateChunks[chunkId] = true;
/******/ 					}
/******/ 				};
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.hmrM = () => {
/******/ 			if (typeof fetch === "undefined") throw new Error("No browser support: need fetch API");
/******/ 			return fetch(__webpack_require__.p + __webpack_require__.hmrF()).then((response) => {
/******/ 				if(response.status === 404) return; // no update available
/******/ 				if(!response.ok) throw new Error("Failed to fetch update manifest " + response.statusText);
/******/ 				return response.json();
/******/ 			});
/******/ 		};
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
/******/ 	// module cache are used so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	__webpack_require__.O(undefined, ["vendors.js"], () => (__webpack_require__("./src/popup/index.js")))
/******/ 	__webpack_require__.O(undefined, ["vendors.js"], () => (__webpack_require__("./node_modules/.pnpm/webpack-dev-server@3.11.3_5v66e2inugklgvlh4huuavolfq/node_modules/webpack-dev-server/client/index.js?http://localhost:8080")))
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors.js"], () => (__webpack_require__("./node_modules/.pnpm/webpack@5.74.0_webpack-cli@4.10.0/node_modules/webpack/hot/dev-server.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=popup.js.map