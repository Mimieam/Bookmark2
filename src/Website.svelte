<script>
  export let name=null;
  export let url=null;
  export let id=null;
  url = url || name
  // export let title=null;
  // export let icon=null;
  $: type = url.slice(url.lastIndexOf('.') + 1);
</script>

<span id={id} style="background-image: url(assets/icons/{type}.svg)">{url}</span>

<style>
  span {
      padding: 2px 4px 4px 1.5em;
      /* padding: 0 0 0 1.5em; */
      background: 0 0.1em no-repeat;
      background-size: 1em 1em;

      background: rgba(0,0,0,.08);
      border: 1px solid rgba(0,0,0,.1);
      display: flex;
      border-radius: 2px;
      margin-left: 20px;
      @apply text-cyan-700;
      /* padding: 4px; */
  }
  span:hover {
    border-bottom: 2px solid var(--main-color);
    border-bottom-right-radius: 2px;
    border-bottom-left-radius: 2px;
}

</style>