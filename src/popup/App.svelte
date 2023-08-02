<script>
  import "./components/globals/Theme.svelte";
  // import "./popup"

  import { onMount } from "svelte";
  import { sha256 } from 'crypto-hash';
  import { themeChange } from "theme-change";
  import SplitPanel from "./components/fileSystem/SplitPanel.svelte";
  // import LogOverlay from './components/fileSystem/LogOverlay.svelte';
  import TreeView from "./components/fileSystem/TreeView.svelte";
  // import Toolbar from "./components/fileSystem/Toolbar.svelte";
  import Icon from "@iconify/svelte";
  import moonFilledAltLoop from "@iconify/icons-line-md/moon-filled-alt-loop";
  import moonAltToSunnyOutlineLoopTransition from "@iconify/icons-line-md/moon-alt-to-sunny-outline-loop-transition";
  import {
    leftTreeStore,
    loadedTrees,
    rightTreeStore,
    source,
    bookmarksLoaded,

    refresh_ui,

    stack


  } from "./components/store";
  import { getBookmarks } from "./popup";
  import { Wunderbaum } from "wunderbaum/dist/wunderbaum.esm";

  //   import svelteTreeView from 'https://cdn.skypack.dev/svelte-tree-view';

  export let name;
  let isDarkMode;
  let themeSwitch = false;
  let bmarks;
  // NOTE: the element that is using one of the theme attributes must be in the DOM on mount
  onMount(async () => {
    // window.localStorage = chrome.storage.local
    themeChange(true);
    // refresh_ui.set(true)
    // bmarks = await chrome.bookmarks.getTree();
    // console.log({ bmarks });

    // source.set(bmarks)
    // 👆 false parameter is required for svelte
  });

  let refresh;
  refresh_ui.subscribe((val) => {
    refresh = val;
    console.log(`UI refreshing...`, refresh);
  });
  // import SplitPanel from "./SplitPanel.svelte";

//   let treeSource;
//   source.subscribe((val) => {
//     treeSource = val;
//     console.log(`Source Updated!`, treeSource);
//   });
  let expanded = {

  }
  document.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded! App");
    Wunderbaum?.util.onEvent(document, "click", ".wb-row", (e)=>{
      console.log({e})
      const info = Wunderbaum.getEventInfo(e);
      const node = info.node;
      if (node.isExpandable()){
        // there will be collisions if the folder names are the same...
        // const hash = await sha256(`${node.title}${node.data.id}`)
        const totally_not_a_hash = `${node.title}${node.data.id}`
        expanded[totally_not_a_hash] = node.expanded
        console.log({expanded, node})
      }
    })
  });


//   async function getBookmarks() {
//     const res = await chrome.bookmarks.getTree();
//     console.log({res})
//     res[0].expanded=true
//     stack.push(res)
//     globalThis.stack = stack
//     return res
// }

</script>

<!-- <h2>Hello {name}!</h2> -->
<p>Happy Bookmarking you wild one, it's gonna be ok!</p>
<nav class="flex row mb-5 justify-between">
  <h3>{name} - {"{+"} Live Mode {"+}"}</h3>
  <button
    on:click={() => {
      console.log(themeSwitch.click(), isDarkMode);
    }}
    class="p-1"
  >
    <input
      type="checkbox"
      hidden
      data-toggle-theme="dark,light"
      data-act-class="ACTIVECLASS"
      bind:checked={isDarkMode}
      bind:this={themeSwitch}
    />
    <Icon
      icon={isDarkMode
        ? moonAltToSunnyOutlineLoopTransition
        : moonFilledAltLoop}
    />
  </button>
</nav>
<div class="">
  <!-- <Panel/> -->

  {$loadedTrees}
  <!-- {$source} -->
{#key refresh}
  {#await getBookmarks() then data }
    <SplitPanel leftPanelWidth="50%" rightPanelWidth="50%">
      <div slot="left">
            <!-- <div> -->
          <TreeView
              treeSource={data}
              rootID="leftTree"
              treeDOM="leftTreeDOM"
              parentDOM="leftParentDOM"
              thisTree={leftTreeStore}
              otherTree={rightTreeStore}
          />
        <!-- </div> -->
    </div>
    <div class="bg-black" slot="right">
        <TreeView
              treeSource={structuredClone(data)}
              rootID="rightTree"
              treeDOM="rightTreeDOM"
              parentDOM="rightParentDOM"
        />
      </div>
  </SplitPanel>
  {/await}
{/key}
  <!-- {treeText} -->
</div>
