<script>
  import Website from './Website.svelte';
  import { fly, slide }  from 'svelte/transition'

  export let expanded = false;
  export let name=null;
  export let files=null;
  export let ondrop=null;
  export let ondragstart=null;
  export let ondragover=null;
  export let depth=0;




  function toggle() {
      expanded = !expanded;
  }
  $: arrowDown = expanded

  function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  console.log("dragging...", ev.target)
  ev.currentTarget.style.border = "dashed";
  ev.dataTransfer.setData("target_id", [ev.target.id]);
}

function drop(ev) {
  ev.preventDefault();
  console.log("droppping. @..", ev.target)
  var data = ev.dataTransfer.getData("target_id");

  console.log("drop=", data)
  console.log("closest UL =", ev.target.closest("ul:not(div)"))
  const _ul = ev.target.closest("ul")
  if (_ul){
    _ul.appendChild(document.getElementById(data))
  } else {
    document.appendChild(data)
  }
}

</script>


<span class:expanded on:click={toggle}>
  <span class="arrow" class:arrowDown>&#x25b6</span>
  {name}
</span>

<!-- draggable="true" ondragstart="drag(event)"  -->

{#if expanded}
    <ul transition:slide="{{duration:500}}" on:drop={drop} on:dragover={allowDrop} id={"ul"+window.crypto.randomUUID()}>
        {#each files as file}
            <li draggable="true" on:dragstart={drag} id={"li"+ window.crypto.randomUUID()}>
                {#if file.files}
                    <svelte:self {...file} name={`${file.name} (Level-${depth})`} depth={depth+1}/>
                {:else}
                    <Website {...file} name={`${file.name} (Level-${depth})`}/>
                {/if}
            </li>
        {/each}
    </ul>
{/if}

<style>
    span {
        padding: 0 0 0 0.11em;
        background: url(/assets/icons/folder.svg) 0 0.1em no-repeat;
        background-size: 1em 1em;
        font-weight: bold;
        cursor: pointer;
    }

    .expanded {
        background-image: url(/assets/icons/folder-open.svg);
    }

    ul {
        padding: 0.2em 0 0 0.5em;
        margin: 0 0 0 0.5em;
        list-style: none;
        border-left: 1px solid #eee;
    }

    li {
        margin: 0.2em 0;
    }

  /* ul {
		margin: 0;
		list-style: none;
		padding-left: 1.2rem;
		user-select: none;
	} */
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
    color:#a0aec0
  }
  li {
    /* background: #2d3748; */
    color:#a0aec0
  }
</style>
