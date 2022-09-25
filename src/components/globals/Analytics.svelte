<svelte:head>
    <script src="./../../ga.js"></script>
</svelte:head>

<script>
    // import { popupHandShakeState } from '@store/index.js'

    let _AnalyticsCode = 'UA-154024944-1';
    /**
     * Below is a modified version of the Google Analytics asynchronous tracking
     * code snippet.  It has been modified to pull the HTTPS version of ga.js
     * instead of the default HTTP version.  It is recommended that you use this
     * snippet instead of the standard tracking snippet provided when setting up
     * a Google Analytics account.
     */
    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', _AnalyticsCode]);
    _gaq.push(['_trackPageview']);

    export const initialize_analytics = () => {
        let buttons = document.querySelectorAll('button');
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener('click', trackButtonClick);
        }
        console.log('Initialize_analytics - done');
    }

    export const trackButtonClick = (e) => {
        console.log(e)
        let target = ["SPAN", "I"].includes(e.target.nodeName) ? e.target.parentNode : e.target
        let [btnType, ...rest] = Array.from(target.classList).filter(x => x.includes('Btn'))
        _gaq.push(['_trackEvent', btnType, 'clicked']);
    }

  // popupHandShakeState.subscribe(async value => {
  //   if (value == 'Done') {
  //       console.log('analytics... -- ', value);
  //       initialize_analytics()
  //   }
  // })
</script>