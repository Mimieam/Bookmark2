// import App from './App.svelte';



// const app = new App({
// 	target: document.body.querySelector("app1"),
// 	props: {
// 		name: 'Bookmark 2'
// 	}
// });
// export default {
// 	app: app
// }

import { createRoot } from 'react-dom/client';
import App2 from './App2.jsx'
const container = document.body.querySelector("app2")
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App2/>);

