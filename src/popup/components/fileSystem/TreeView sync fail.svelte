<svelte:head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.0/font/bootstrap-icons.css" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/mar10/wunderbaum@main/dist/wunderbaum.css" />
</svelte:head>

<script>
  import { onMount } from 'svelte'
  import { Wunderbaum } from "wunderbaum";
  import { Trees, isSyncingTrees, loadedTrees, source } from '../store/index'

  export let treeDOM='treeDOM_ID_1';
  export let parentDOM='parentDOM_ID_1';
  export let rootID;
  // export let otherTree;
  export let treeSource;
  let oT;

  let currentTree = null;



	const addToTreeArray = (newTree) => {
		$Trees = [...$Trees, newTree];
    console.log($Trees)
	};

  // let forest;
  // Trees.subscribe(val => {
  //   console.log("UPDATING TREE STORE")
  //   forest = val
  // })

  const syncWithOtherTrees = (updated_src) => {
    console.log(rootID, {updated_src})
    if ($isSyncingTrees == false) {

      isSyncingTrees.set(true)
      const forest = $Trees
      const syncs = forest.map(tree => {
        return (async ()=>{
          if (tree != currentTree){
            console.log("WAS THIS CALLED???", currentTree)
            // await tree.load({children: updated_src})
            // await tree.setModified('any');
            console.log(tree.format((n)=>n.title))
          }
        })()
      });
      console.log({syncs})
      return Promise.all(syncs).then(()=>{
        isSyncingTrees.set(false)
        console.log("DOne SYNCING", syncs)
      })
    }
  }
  // import { Wunderbaum } from "wunderbaum/dist/wunderbaum.esm.min";



  const init_tree = () => {
    const DOM = document.getElementById(treeDOM)
    if (DOM){
      DOM.innerHTML=''
      const _tree = new Wunderbaum({
        id: rootID,
        element: document.getElementById(treeDOM),
        debugLevel: 5,
        // connectTopBreadcrumb: document.getElementById(parentDOM),
        source: treeSource,

        edit: {
          trigger: ["clickActive", "F2", "macEnter"],
          select: true,
          beforeEdit: function (e) {
            // console.log(e.type, e, e.node, treeSource);
            // e.tree.load({source: treeSource})
            // return e.node.type === "person";
          },
          edit: function (e) {
            console.log(`[${rootID}]:`,"edit/edit", e.type, e);
            // e.tree.toDictArray()
            // oT?.load({children: e.tree.toDictArray()})
          },
          apply: function (e) {
            console.log(`[${rootID}]:`,"edit/apply ", e.type, e, e.tree.toDictArray());
            let _new_src =  e.tree.toDictArray()
            // oT?.load({children: _new_src})
            // console.log(e.tree.format((n)=>n.title))
            // console.log(e.node.tree.format((n)=>n.title))
            // console.log(e.node.tree.format((n)=>n.title))

            // syncWithOtherTrees(treeSource)

            //  return true
          },

        },
        update: async function(e){
          await syncWithOtherTrees(e.tree.toDictArray())
          if (!$isSyncingTrees){
            console.log({Sync_updating: true})
          }else {
            console.log({updating: true})
          }
          // console.log(e.tree.format((n)=>n.title))
        },
        render: async function (e) {
          const node = e.node;
          const util = e.util;
          // console.log(e.type, e.isNew, e);
          if (!$isSyncingTrees){
            let res = await syncWithOtherTrees(e.tree.toDictArray())
            console.log({Sync_rendering: true}, res)
          }else {
            console.log({updating: true})
          }
          await source.set(e.tree.toDictArray())
          console.log("render")
        },
        // change: function(e){
        //   syncWithOtherTrees(treeSource)
        // },
        load: function(e){
          console.log({loading: true})
        }
      });
      globalThis._trees = $Trees
      currentTree = _tree
      addToTreeArray(_tree)
      loadedTrees.set($loadedTrees + 1)
      return _tree
    }
  }

  // let treeSource;
  // source.subscribe(val => {
  //   console.log(`[${rootID}]: store updated..`, val)
  //   if (val){
  //     treeSource = structuredClone(val)
  //     // init_tree()
  //   }
  // })

  // globalThis._init_tree = init_tree

  document.addEventListener('DOMContentLoaded', () => {
    console.log("DOMContentLoaded!")
    // console.log(document.getElementById(treeDOM))
    // console.log(document.getElementById(parentDOM))
    init_tree()
    // source.set(Tree.toDictArray())

    // thisTree.set(Tree)
    // otherTree.subscribe(val=>{
    //   oT = val
    //   console.log({oT})
    // })
    // thisTree.subscribe(val=>{
    //   rawTree = val
    //   // console.log({rawTree})
    // })


  });

</script>

<div>

<!-- <div id={parentDOM} class="hide-on-welcome hidden"> -->
  <output id={parentDOM} class=""></output>
  <div id={treeDOM} class="">
    <!-- class="wb-rainbow wb-skeleton wb-initializing wb-alternate wb-checkbox-auto-hide wb-fade-expander"> -->
    <h1>TreeView</h1>
    <p>Loading&hellip;</p>
  </div>
  <!-- </div> -->
  <!-- {JSON.stringify(treeSource)} -->
</div>