<script>
  export let onDrag;

  function handleMouseDown(event) {
    const startX = event.clientX;
    const onMouseMove = event => {
      onDrag(event.clientX - startX);
    };
    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }
</script>

<style>
  .divider {
    width: 4px;
    cursor: ew-resize;
    background-color: #eee;
  }
</style>

<div class="divider" on:mousedown|preventDefault={handleMouseDown} />
