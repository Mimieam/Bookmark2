<script>
  import Toolbar from "./Toolbar.svelte";
  export let leftPanelWidth = "30%";

  let isResizing = false;
  let startLeftPanelWidth = 0;

  function handleMouseDown(event) {
    isResizing = true;
    startLeftPanelWidth = event.clientX;;
  }

  function handleMouseMove(event) {
    if (isResizing) {
      const newLeftPanelWidth = event.clientX;
      leftPanelWidth = `${newLeftPanelWidth}px`;
    }
  }

  function handleMouseUp(event) {
    isResizing = false;
  }
</script>

<div class="split-panel" on:mousemove={handleMouseMove} on:mouseup={handleMouseUp}>
  <div class="split-panel-left" style="width: {leftPanelWidth}">
    <slot name="left"></slot>
  </div>
  <div class="split-panel-resize-handle" on:mousedown={handleMouseDown}></div>
  <div class="split-panel-right">
    <Toolbar/>
      <slot name="right"></slot>
  </div>
</div>

<style global lang="postcss">


.split-panel-right :global(div)::-webkit-scrollbar,
.split-panel-left :global(div) ::-webkit-scrollbar {
    display: none;  /* Safari and Chrome */
}
/* Optional: show position indicator in red */
.split-panel-left::-webkit-scrollbar-thumb {
    background: #FF0000;
}

/* hack to targetdiv.. remove it later... */
.split-panel-left :global(div),
.split-panel-right :global(div[slot='right']) {
  display: block;
  margin: 0 1px;
  border-radius: 5px;
  background-color: var(--base-100);
  height: 100%;
  scroll-behavior: smooth;
  overflow: scroll;
}

  .split-panel {
    display: flex;
    height: 80vh;
    width: 100%;
  }

  .split-panel-left,
  .split-panel-right {
    height: auto;
    overflow-y: hidden;
    overflow-x: hidden;
    scroll-behavior: smooth;
    -ms-overflow-style: none;  /* Internet Explorer 10+ */
    scrollbar-width: none;  /* Firefox */
  }

  .split-panel-left {
    display: block;
    min-width: 50px;
    width: 30%;
  }

  .split-panel-right {
    flex: 1;
    display: block;
    min-width: 50px;
  }

  .split-panel-resize-handle {
    width: 2px;
    border-radius: 0.7px;
    top: 6px;
    cursor: ew-resize;
    z-index: 9999;
    background: transparent;
    /* background: var(--primary-color); */
    /* background: hsl(0deg 0% 96% / 0%);  */
    position: relative;
    height: calc(80vh - 6px);
  }
</style>
