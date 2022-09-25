<script>
  import Website from './Website.svelte';
  import { fly, slide }  from 'svelte/transition'
  import Sortable, { MultiDrag, Swap } from 'sortablejs';
  import { onMount } from "svelte";
  import { recursiveCount } from "./utils"

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
            console.log(order)
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

          var itemEl = evt.item;  // dragged HTMLElement
          console.log(evt.to)
          console.log(evt.from)
          console.log(evt.oldIndex)
          console.log(evt.newIndex)
          console.log(evt.clone)
          console.log(evt.pullMode)


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
      console.log('OnMount Called')
    }
  );

  export let expanded = false;
  export let name=null;
  export let files;
  export let id;
  export let depth=0;

  function toggle() {
      expanded = !expanded;
  }
  $: arrowDown = expanded


</script>


<span class:expanded on:click={toggle}>
  <span class="arrow" class:arrowDown>&#x25b6</span>
  {name}
</span>
<!-- <button/>
<button/>
<button/> -->


<!-- {#if expanded} -->
<!-- data-id={`UL_${name}_${window.crypto.randomUUID()}`} -->
<ul
  bind:this={el}
  data-id={id}
  class={`${expanded? 'show': 'hide'} w-full no-drag`}
>
  {#each files as file}
    <li draggable="true" class="tab" data-id={file.id}>
      {#if file.files}
          <svelte:self {...file} name={`${file.name} (Level-${depth}) (${recursiveCount(file.files)})`} depth={depth+1}/>
      {:else}
          <Website {...file} name={`${file.name} (Level-${depth})`}/>
      {/if}
    </li>
    <!-- {#if file.files}
    <div class="divider"></div>
    {/if} -->
    {/each}
  </ul>
  <div class="divider"></div>
<!-- {/if} -->

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
        background: url(/assets/icons/folder.svg) 0 0.1em no-repeat;
        background-size: 1em 1em;
        font-weight: bold;
        cursor: pointer;
        /* padding: 4px; */

    }

    .expanded {
        background-image: url(/assets/icons/folder-open.svg);
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
