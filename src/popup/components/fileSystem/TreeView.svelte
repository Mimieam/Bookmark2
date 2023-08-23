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
  import { loadedTrees, source, Forest } from '../store/index'
  import { styleToString } from '../../utils'
  // import EventBusTool, {event_bus} from '@shared/event_bus'
  import { EventBusTool, eventBus } from '../../../shared/eventBus.js'
  import { EventEnum, fnWrap, eventEnumHandlers } from '../../../shared/eventHandlers'

  export let treeDOM='treeDOM_ID_1';
  export let parentDOM='parentDOM_ID_1';
  export let rootID;
  export let treeSource;
  let me = rootID
  let tree;

  // console.log("loading treeview...", rootID, treeSource)

  // globalThis.eventBus = eventBus
  // globalThis.EventEnum = EventEnum

  const handleAllEvents = (data=>{
    console.log("handleAllEvents", data, me)
    if (data.event.src !== me){
      console.log(`${treeDOM} received LOADED event:`, event)
    }
  })

  // eventBus.subscribeToAll(handleAllEvents)
  eventBus.emit(EventEnum.TreeViewLoaded, {src: treeDOM}, me)

	const addTreeToForest = (newTree) => {
		$Forest = [...$Forest, newTree];
    console.log($Forest)
	};
  function faviconURL(u) {
    const url = new URL(chrome.runtime.getURL("/_favicon/"));
    url.searchParams.set("pageUrl", u);
    url.searchParams.set("size", "64");
    return url.toString();
  }

  // const event_bus = EventBusTool.getEventBus();

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

        // header: "Bookmark",
        // headerHeightPx: ROW_HEIGHT,
        // rowHeightPx: ROW_HEIGHT,
        columns: null,
        types: null,
        // escapeTitles: true,
        enabled: true,
        fixedCol: false,
        showSpinner: false,
        checkbox: false,
        // minExpandLevel: 3,
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
          // console.log("updating... enhanceTitle", {e})
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

          // if (e.node.data?.url){
          //   const newTitle = `<span class=wb-title><a href="${e.node.data.url}">${e.node.title}</a></span>`
          //   const titleSpan = e.node
          //     .getColElem(0)
          //     .querySelector(".wb-title");
          //   titleSpan.innerHTML = newTitle;
          // }

        },

        // load: function(e){

        //   console.log({loading: true})

        // },
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
        // lazyLoad: (e) => {
        //   return { url: `https://fakestoreapi.com/products/category/${e.node.refKey}` }
        // },
        receive: (e) => {
          return e.response.map((elem) => {
            console.log("receive", {elem})
            return {
              title: elem.title,
              children: elem.children,
              refKey: elem.id,
            }
          });
        },


        /** ------- drag and drop --------*/
        dnd: {
          dragStart: (e) => {
            if (e.node.type === "folder") {
              return false;
            }
            e.event.dataTransfer.effectAllowed = "all";
            return true;
          },
          dragEnter: (e) => {
            if (e.node.type === "folder") {
              e.event.dataTransfer.dropEffect = "copy";
              return "over";
            }
            return ["before", "after"];
          },
          drop: (e) => {
            console.log("Drop " + e.sourceNode + " => " + e.region + " " + e.node, e);
            e.sourceNode.moveTo(e.node, e.defaultDropMode)
          },
        },
      });
      addTreeToForest(_tree)
      loadedTrees.set($loadedTrees + 1)
      // globalThis._tree = _tree
    //  console.info(_tree.format(n=>n.key))
      tree = _tree
      return _tree
    // }
  }

  onMount(() => {
    const myTree = init_tree()

    for (const event_name in EventEnum) {
      // eventBus.subscribe(EventEnum[event_name], me, (src, data)=>{
      //   console.log(`EVENT-[${event_name}] SENT FROM [${src}] TO [${me}] `, data)
      //   const destinationNode = myTree
      //   fnWrap(event_name, eventEnumHandlers[EventEnum[event_name]], [data, src, destinationNode])()
      // })
      eventBus.subscribe(EventEnum[event_name], me, (src, data)=>{
        console.log(`EVENT-[${event_name}] SENT FROM [${src}] TO [${me}] `, data)
        const destinationNode = myTree
        fnWrap(
          event_name, eventEnumHandlers[EventEnum[event_name]],
          [{event: event_name, source: src, target: myTree, data: data}]
        )()
      })
    }

		// window.addEventListener('OnMount::DOMContentLoaded')
		// return () => window.removeEventListener('DOMContentLoaded');
	})


  globalThis._init_tree = init_tree

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