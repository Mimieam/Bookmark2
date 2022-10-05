<script>
  import Website from './Website.svelte';
  import { fly, slide }  from 'svelte/transition'
  import Sortable, { MultiDrag, Swap } from 'sortablejs';
  import { onMount } from "svelte";
  import { recursiveCount } from "./utils"

  // import { treeState } from './components/store/index'
  // treeState.subscribe(value => { tree = value })



  let this_node = [1,2,3];
  let el;
  onMount(
    async function () {
      Sortable.create(el, {
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
          get: function (sortable) {
            var order = localStorage.getItem(sortable.options.group.name);
            console.log("order ==>", order)
            return order ? order.split('|') : [];
          },

          /**
           * Save the order of elements. Called onEnd (when the item is dropped).
           * @param {Sortable}  sortable
           */
          set: function (sortable) {
            var order = sortable.toArray();
            console.log(order)
            localStorage.setItem(sortable.options.group.name, order.join('|'));
          }
        },
        onEnd: function ( /**Event*/ evt) {
          console.log(evt.item.dataset.id, 'datasetID'); // element's new index within parent
          console.log(evt.to.dataset.id, 'evt.to'); // element's new index within parent

          let itemEl = evt.item;  // dragged HTMLElement
          // console.log(evt.to)
          // console.log(evt.from)
          // console.log(evt.oldIndex)
          // console.log(evt.newIndex)
          // console.log(evt.clone)
          // console.log(evt.pullMode)
          const src_el = evt.item.getAttribute('data-id')
          const to =  evt.to.getAttribute('data-id')
          console.log(src_el, to)

          console.log("tree", tree)
          console.log("this_node", this_node)
          tree.move(src_el, to, evt.newIndex)
          console.log(src_el, tree.nodes[src_el])
          localStorage.setItem('bookmark_racine', tree.root)


          // var order = sortable.toArray();
          // $('.visuaplayoutCol02').attr('value', $('.visuaplayoutCol01').attr('value') + ',' + evt.item.dataset.id);
        },
        // onAdd: function ( /**Event*/ evt) {
        //   var itemEl = evt.item; // dragged HTMLElement
        //   console.log(evt.from, 'From'); // previous list
        //   console.log(evt.to, 'To'); // next list
        //   //$('.visuaplayoutCol02').attr('value', $('.visuaplayoutCol01').attr('value') + ',' + evt.item.dataset.id);
        // },
        // onUpdate: function (evt) {
        //   var itemEl = evt.item; // dragged HTMLElement
        //   console.log(itemEl, 'draggedelement');
        // },
        // onSort: function (evt) {
        //   var itemEl = evt.item; // dragged HTMLElement
        //   console.log(itemEl, 'onSort');
        // },
      });
    }
  );

  export let expanded = false;
  export let name=null;
  export let children;
  export let tree;
  export let id;
  export let depth;

  $: depth=depth || 0 ;

  function toggle() {
      expanded = !expanded;
  }
  $: arrowDown = expanded

  // export let level = 0;
  // export let maxLevel;


// $: dropFromOthersDisabled = level + $depthOfDragged >= maxLevel;

function calcInnerDepth(item, iteration = 0) {
	if (!item.children.length) return iteration;
	iteration++;
	return Math.max(...item.children.map(i => calcInnerDepth(i, iteration)));
}

const get_depth = () => {
  tree.get_depth()
}

</script>

<!-- ERROR - ul and Li are getting the same data-id... -->
<!-- {@debug tree, el} -->


<span class:expanded on:click={toggle}>
  <span class="arrow" class:arrowDown>&#x25b6</span>
  {name}
</span>


<ul
  bind:this={el}
  data-id={id}
  class={`${expanded? 'show': 'hide'} w-full`}
>
  {#each children as node}
    <li draggable="true" class="tab" data-id={node.id}>
      {#if node.children}
          <svelte:self {...node} name={`${node.name}  [${node.id}]  (Level-${depth}) (${recursiveCount(node.children)})`} depth={depth+1} tree={tree}/>
      {:else}
          <Website {...node} name={`${node.name}  [${node.id}]  (Level-${depth})`} depth={depth}/>
      {/if}
    </li>
    <!-- {#if node.children}
    <div class="divider"></div>
    {/if} -->
    {/each}
  </ul>
  <!-- <div class="divider"></div> -->

<style>
  .tab {
    user-select: "none";
    padding: 4px;
    margin: 0 0 1px 0;
    font: 1em;
    background:var(--accent);
    color:var(--accent-content);
    border-radius: 2px;
    display: block;
  }
  .tab.isDragging {
    background: var(--main-color);
  }

    span {
        padding: 0 0 0 0.11em;
        /* background: url(/assets/icons/folder.svg) 0 0.1em no-repeat; */
        background-size: 1em 1em;
        font-weight: bold;
        cursor: pointer;
        /* padding: 4px; */
    }

    .expanded {
        /* background-image: url(/assets/icons/folder-open.svg); */
        @apply border-slate-500
    }

    ul {
        padding: 0.2em 0 0 0.5em;
        margin: 0 0 0 0.6em;
        list-style: none;
        border-left: 1px solid #eee;
        /* border-bottom: 2px solid #eee; */
    }

    li {
        margin: 0.2em 0;
    }

  .no-arrow { padding-left: 1.0rem; }
  .arrow {
    cursor: pointer;
    display: inline-block;
    /* transition: transform 200ms; */
  }
  .arrowDown { transform: rotate(90deg); }
  ul {
    /* background: #1a202c; */
    opacity: .9;
    color:#fff;

    /* background: #fff;
    padding: 0; */
  }
  li {
    /* background: #2d3748; */
    color:#fff;
    /* margin-bottom: 16px; */
		/* border: 1px solid black; */
  }
  .hide {
    /* opacity: 0; */
    display: none;
    transition: all 0.2s ease;
  }
  .show {
    /* opacity: 1; */
    display: block;
    transition: all 0.2s ease;
    /* transition: all s cubic-bezier(0.785, 0.135, 0.15, 0.86); */
  }
  :global(.dragFrom){
    background-color: #a5ffd6!important;

}


</style>
