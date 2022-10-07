import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		name: 'Bookmark2'
	}
});

export default app;

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/#hot-module-replacement
if (import.meta.hot) {
  // console.log("HOT EXT RELOAD", chrome.runtime.reload())
  import.meta.hot.accept();
  import.meta.hot.dispose(() => {
    app.$destroy();
  });

}