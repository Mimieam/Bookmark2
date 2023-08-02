<svelte:head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.0/font/bootstrap-icons.css" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/mar10/wunderbaum@main/dist/wunderbaum.css" />
</svelte:head>
<script context="module">
	// retain module scoped expansion state for each tree node
	const _expansionState = {
		/* treeNodeId: expanded <boolean> */
	}
</script>
<script>
  import { onMount } from 'svelte'
  // import { Wunderbaum } from "wunderbaum/dist/wunderbaum.esm.min";
  import { Wunderbaum } from "wunderbaum";
  import { loadedTrees, source } from '../store/index'
  import { styleToString } from '../../utils'

  export let treeDOM='treeDOM_ID_1';
  export let parentDOM='parentDOM_ID_1';
  export let rootID;
  export let treeSource;

  let tree;
  console.log("loading treeview...", rootID, treeSource)

	// const addToTreeArray = (newTree) => {
	// 	$Trees = [...$Trees, newTree];
  //   console.log($Trees)
	// };
  function faviconURL(u) {
    const url = new URL(chrome.runtime.getURL("/_favicon/"));
    url.searchParams.set("pageUrl", u);
    url.searchParams.set("size", "64");
    return url.toString();
  }

  let showUrl = true
  // _expansionState[label] = !expanded;
  // https://mar10.github.io/wunderbaum/index.html#/tutorial/tutorial_events?id=common-event-handlers
  const init_tree = () => {

    const DOM = document.getElementById(treeDOM)
    console.log(DOM)
    // if (DOM){
      // DOM.innerHTML=''
      const _tree = new Wunderbaum({
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
            enhanceTitle: (e)=>{
              if(showUrl){
                e.node.setTitle(e.node.data.url || e.node.title)
              }
              console.log("updating... enhanceTitle", {e})
            },
            icon: (e) => {
              if (e.node?.data?.url){
                const _style = {
                  marginRight: "8px",
                  backgroundImage: `url(${ faviconURL(e.node.data.url) })`,
                  backgroundSize: "cover",
                }
                return `<i class='wb-icon' style=${styleToString(_style)}> </i>`
              }
              // Exit without returning a value: continue with default processing.
            },
            // error: noop,
            // receive: noop,

        render: function (e) {
          const node = e.node;
          const util = e.util;

          if (e.node.data?.url){
            const newTitle = `<span class=wb-title><a href="${e.node.data.url}">${e.node.title}</a></span>`
            const titleSpan = e.node
              .getColElem(0)
              .querySelector(".wb-title");
            titleSpan.innerHTML = newTitle;

          }
        },
        load: function(e){

          console.log({loading: true})
        },
        edit: {
          trigger: ["clickActive", "F2", "macEnter"],
          select: true,
          beforeEdit: function (e) {
            // console.log(e.type, e);
            // return e.node.type === "person";
          },
          edit: function (e) {
            console.log(e.type, e);
          },
          apply: function (e) {
            console.log(e.type, e);
            // Simulate async storage that also validates:
            return e.util.setTimeoutPromise(() => {
              e.inputElem.setCustomValidity("");
              if (e.newValue.match(/.*\d.*/)) {
                e.inputElem.setCustomValidity("No numbers please.");
                return false;
              }
            }, 1000);
          },
        },
      });
      // addToTreeArray(_tree)
      loadedTrees.set($loadedTrees + 1)
      // globalThis._tree = _tree
      tree = _tree
      return _tree
    // }
  }

  onMount(() => {
    init_tree()

		// window.addEventListener('OnMount::DOMContentLoaded')
		// return () => window.removeEventListener('DOMContentLoaded');
	})

  // let treeSource;
  // source.subscribe(val => {
  //   console.log(`[${rootID}]: store updated..`, val)
  //   if (val){
  //     treeSource = val
  //     // init_tree()
  //   }
  // })

  globalThis._init_tree = init_tree

  // document.addEventListener('DOMContentLoaded', () => {
  //   console.log("DOMContentLoaded treeview... ", rootID)
  //   // console.log(document.getElementById(treeDOM))
  //   // console.log(document.getElementById(parentDOM))
  //   tree?.util.onEvent(document, "click", ".wb-row", (e)=>{
  //     console.log({e})
  //   })
  //   init_tree()
  // });

</script>

<div>

  <output id={parentDOM} class=""></output>
  <div id={treeDOM} class="">
    <!-- class="wb-rainbow wb-skeleton wb-initializing wb-alternate wb-checkbox-auto-hide wb-fade-expander"> -->
    <h1>Bookmark</h1>
    <p>Loading&hellip;</p>
  </div>
  <!-- </div> -->
  <!-- {JSON.stringify(treeSource)} -->
</div>