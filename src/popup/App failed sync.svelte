<script>

    import "./components/globals/Theme.svelte";

    import { onMount } from 'svelte'
    import { themeChange } from 'theme-change'
    import SplitPanel from './components/fileSystem/SplitPanel.svelte';
    // import LogOverlay from './components/fileSystem/LogOverlay.svelte';
    import TreeView from './components/fileSystem/TreeView.svelte';
    // import Toolbar from "./components/fileSystem/Toolbar.svelte";
    import Icon from '@iconify/svelte';
    import moonFilledAltLoop from '@iconify/icons-line-md/moon-filled-alt-loop';
    import moonAltToSunnyOutlineLoopTransition from '@iconify/icons-line-md/moon-alt-to-sunny-outline-loop-transition';
    import { Trees, isSyncingTrees, leftTreeStore, loadedTrees, rightTreeStore, source } from "./components/store";


//   import svelteTreeView from 'https://cdn.skypack.dev/svelte-tree-view';

    export let name;
    let isDarkMode;
    let themeSwitch=false;
    let bmarks;
    // NOTE: the element that is using one of the theme attributes must be in the DOM on mount
    onMount(async () => {
        // window.localStorage = chrome.storage.local
        themeChange(false)
        bmarks = await chrome.bookmarks.getTree()
        console.log({bmarks})
        // source.set(bmarks)
        // 👆 false parameter is required for svelte
    })

  // import SplitPanel from "./SplitPanel.svelte";

  let treeSource;
  source.subscribe(val => {
    treeSource=bmarks
    console.log(`Source Updated!`, bmarks)

  })

  document.addEventListener('DOMContentLoaded', () => {
    console.log("DOMContentLoaded! App")
  });


//   loadedTrees.subscribe(val=> {
//     if (val === 2){

//     }
//   })

</script>

    <!-- <h2>Hello {name}!</h2> -->
    <p>Happy Bookmarking you wild one, it's gonna be ok!</p>
    <nav class="flex row mb-5 justify-between	">
        <h3>{name} - {'{+'} Live Mode {'+}'} </h3>
        <button on:click={()=>{console.log(themeSwitch.click(), isDarkMode)}} class='p-1'>
            <input type="checkbox" hidden data-toggle-theme="dark,light" data-act-class="ACTIVECLASS"
                bind:checked={isDarkMode}
                bind:this={themeSwitch}
            >
            <Icon icon={isDarkMode? moonAltToSunnyOutlineLoopTransition: moonFilledAltLoop} />
        </button>

    </nav>
    <div class="">

    <!-- <Panel/> -->

{$loadedTrees}
{$source}
<SplitPanel leftPanelWidth="30%" rightPanelWidth="70%">
  <div slot="left">
        <div>
      <TreeView
            treeSource={treeSource}
            rootID="leftTree"
            treeDOM="leftTreeDOM"
            parentDOM="leftParentDOM"
            thisTree={leftTreeStore}
            otherTree={rightTreeStore}
      />
    </div>
</div>
<div class="full bg-black" slot="right">
    <!-- <TreeView
        rootID="rightTree"
        treeDOM="rightTreeDOM"
        parentDOM="rightParentDOM"
        treeSource={treeSource}
        thisTree={rightTreeStore}
        otherTree={leftTreeStore}
    /> -->
    <!-- <Toolbar/> -->
        <!-- <div>Right Panel Lorem	Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore officia repudiandae adipisci doloribus atque impedit soluta accusantium eius! Impedit ipsam eligendi vel quod perferendis cupiditate, accusantium recusandae doloremque officiis alias. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nesciunt, tenetur quasi repudiandae, sed atque voluptatem, architecto minima obcaecati molestias laborum totam! Id animi delectus officia commodi expedita debitis modi iure! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Temporibus facilis repudiandae, recusandae nesciunt illum magni architecto accusantium excepturi non accusamus modi vel eius quo id, quis mollitia deleniti nostrum sunt. Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi ratione esse quidem, natus officiis nam aperiam, nisi illo dicta porro distinctio. Earum quia inventore fuga illum vel aliquid iure vitae? Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur, dignissimos nulla corrupti incidunt repellat totam obcaecati veniam repellendus eaque. Nihil ipsam delectus saepe doloribus tempore quaerat dolores ipsum sint cum. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Recusandae, nesciunt nulla delectus reiciendis libero possimus amet incidunt velit. Dolorum quos eius dignissimos soluta consequuntur saepe asperiores numquam reprehenderit vel et!Lorem 	Content Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed magnam totam deleniti at error temporibus provident fugit delectus cum. Laudantium excepturi perspiciatis dolorem vero velit illum nisi rem consequatur saepe? Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quasi adipisci doloremque officia quos magnam amet assumenda recusandae praesentium quo repudiandae incidunt dolorem, dolore non quis culpa deleniti, voluptates sapiente dignissimos!Lorem Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tempora provident perspiciatis consectetur ipsum eum ratione vel nisi laborum numquam. Fugiat tempora nesciunt repellat distinctio veritatis laborum architecto accusamus laboriosam excepturi. Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea enim quia natus asperiores placeat repellat dolore, facilis fugit maxime sapiente, totam quibusdam iusto animi cupiditate in perspiciatis maiores amet libero/ </div> -->
    </div>
</SplitPanel>
<!-- <TreeView
  class="tree-view"
/> -->
<!-- {treeText} -->
    <!-- <LogOverlay/> -->
</div>

