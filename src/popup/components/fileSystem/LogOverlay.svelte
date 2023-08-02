<script>
  import { onMount } from 'svelte'


  let height = 0

  onMount(() => {

      var log = document.querySelector('.overlay .content');
    ['log','debug','info','warn','error'].forEach(function (verb) {
        console[verb] = (function (method, verb, log) {
            return function () {
                method.apply(console, arguments);
                var msg = document.createElement('div');
                msg.classList.add(verb);
                msg.textContent = verb + ': ' + Array.prototype.slice.call(arguments).join(' ');
                log.appendChild(msg);
                // log.animate({scrollTop: log.scrollHeight}, 500);
                log.scrollTop = log.scrollHeight
            };
        })(console[verb], verb, log);
    });

	})

</script>

<style>
  .overlay {
  position: fixed;
  bottom: 0;
  width: 100%;
  /* background-color: #fff; */
  border-top: 1px solid #ccc;
  padding: 10px;
  text-align: center;
  z-index: 9999;

  background: linear-gradient(to top, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 70%, rgba(255, 255, 255, 0) 100%);
  box-shadow: 0 -10px 20px rgba(0, 0, 0, 0.1);
}

.content {
  height: 75px; /* set your content height */
  overflow-y: scroll;
}
</style>


<div class="overlay">
  <p>This is an overlay div</p>
  <div class="content">
    <!-- Your content goes here -->
  </div>
</div>
