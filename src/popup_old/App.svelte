<script>
	// import "./components/globals/Theme.svelte";
	import './global.css';
	import './components/theme.css';
  import Bookmark from "./Bookmark.svelte";
	import { onMount } from 'svelte'
	import { themeChange } from 'theme-change'
	export let name;

	// NOTE: the element that is using one of the theme attributes must be in the DOM on mount
	onMount(() => {
		// window.localStorage = chrome.storage.local
		themeChange(false)
		// 👆 false parameter is required for svelte
	})

</script>

<!-- <main>
	<h1>Hello {name}!</h1>
	<p>Happy Bookmarking you wild one, it's gonna be ok!</p>
</main> -->
	<div class="m-5">
		<h3>{name} - {'{+'} Live Mode {'+}'} </h3>
	<!-- <h2 class="mb-4 text-2xl text-green-700 font-bold">Select</h2> -->
	<select data-choose-theme class="focus:outline-none h-10 rounded-full px-3 border">
		<option value="">Default</option>
		<option value="dark">Dark</option>
		<option value="light">Light</option>
		<option value="🌸">🌸 Pink</option>
		<option value="🐬">🐬 Blue</option>
		<option value="🐤">🐤 Yellow</option>
	</select>
	<button class="btn btn-primary">Button</button>
</div>
<Bookmark/>

<style global lang="postcss">
/* @import './components/Theme.css'; */
:root {
  --color-default: #fff;
	--main-color: #a5ffd6;
	--accent-color: #6d6875;
	--primary-text-color: #ecf0f1;
	--secondary-text-color: #a0aec0;
	--background-color: #4a4e69;

	--primary-color: #6d6875;
	--secondary-color: #18e0c2;
	--accent-color: #4C2E4D;
	--neutral-color: #252b30;
	--base-100-color: #4C2E4D;

	--text-primary-color:

	--text-size: 15px;
	--icon-size: 27px;
	--button-height:35px;
	--button-radius: 15px;



}
/* Color Theme Swatches in Hex */
.Pollie-1-hex { color: #010326; }
.Pollie-2-hex { color: #393E59; }
.Pollie-3-hex { color: #F0F2F2; }
.Pollie-4-hex { color: #6FBFBF; }
.Pollie-5-hex { color: #82D9D9; }


/* Color Theme Swatches in Hex */
.San-Marino-1-hex { color: #556273; }
.San-Marino-2-hex { color: #69788C; }
.San-Marino-3-hex { color: #8A99A6; }
.San-Marino-4-hex { color: #F2F2F2; }
.San-Marino-5-hex { color: #D9D9D9; }

:root {
	--base-color-hs: 335, 100%;
	--base-color: hsl(var(--base-color-hs), 50%);
	--base-color-light: hsl(var(--base-color-hs), 85%);
	--base-color-dark: hsl(var(--base-color-hs), 20%);
	--base-color-translucent: hsla(var(--base-color-hs), 50%, .5);
}

@media (prefers-color-scheme: dark){
	:root{
		--background-color: #252b30;
	}
}
[data-theme='dark'] {
  --background-color: var(--primary);
	--text-color: var(--primary-content);
}
[data-theme='light'] {
  --background-color: var(--primary-focus);
  --text-color: var(--primary-content);
}
[data-theme='🌸'] {
  /* --color-default: #fff;
	--main-color: #A0C0FF;
	--accent-color: #FFD56B;
	--primary-text-color: #A0C0FF;
	--secondary-text-color: #FFD56B; */
	--background-color: #90CAF9;
	--primary-color: #FFF176;
	--secondary-color: #FF8A65;
}
[data-theme='🐬'] {
	--background-color: #F5F5F5;
	--primary-color: var(--neutral-color);
	--accent: #FFC107;
	--text-color:var(--neutral-color);
}
[data-theme='🐤'] {
  --background-color: #ffd65a;
}
body {
	background-color: var(--background-color);
}


	html, body {
  /* background: var(--background-color); */
  font-size: var(--text-size);
  height: 100%;
	background: var(--background-color);
	color: var(--text-color);
  /* @apply bg-gray-900; */
}


	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
		@apply bg-gray-900;
	}

	h1, h2, h3, h4, h5{
		color: var(--secondary-color);
		font-weight: 100;
	}
	h1 {
		text-transform: uppercase;
		font-size: 4em;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}


</style>
