<style global lang="postcss">

:root {
  --main-color: #95a5a6;
  --accent-color: #7f8c8d;
  --text-color: #ecf0f1;
  --dark-background-color: #1F2937;
  /* --background-color: #FFF; */
  --background-color: aliceblue;
  --text-size: 15px;
  /* --icon-size: 27px; */
  --icon-size: 23px;
  --button-height:35px;
  --button-radius: 15px;

}

@tailwind base;
@tailwind components;
@tailwind utilities;

@import "./../../global.css ";
@import "./../theme.css";

.ts-icon{
  font-size: var(--icon-size);
  align-items: center;
}

.ts-icon-status {
  @apply ts-icon;
  font-size: 16px!important;
}

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
[data-theme='light'] {
  --background-color: #ECEFF1;
	--text-color: #556273;
	--primary-color: #444444;
	--secondary-color: #556273  ;
  /* Primary Text: #444444
Background: #F2F2F2
Accents: #5CAE96 */
}
[data-theme='dark'] {
  --background-color: #252b30;
	--text-color: #556273;
	--primary-color: #555555;
	--secondary-color: #556273;
}

/* Primary Text: #333333
Background: #E0F2F1
Accents: #4DB6AC

Primary Text: #444444
Background: #F1F8E9
Accents: #7CB342

Primary Text: #555555
Background: #F0FFF4
Accents: #AED581 */


/* Primary Text: #555555
Background: #FFFFFF
Accents: #FFE082 */
/* Primary Text: #333333
Background: #F5F5F5
Accents: #B2DFDB */

body {
	padding: 4px;
	background-color: var(--background-color);
}


html, body {
	background: var(--background-color);
  font-size: var(--text-size);
  height: 100%;
	color: var(--text-color);
	/* background: #f9f9f9; */
}


	main {
		/* text-align: center; */
		padding: 10px;
		width: 100%;
		margin: 0 auto;
		box-sizing: border-box;
		@apply bg-gray-900;
	}

	h1, h2, h3, h4, h5{
		color: var(--secondary-color);
		font-weight: 300;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}


</style>


<script>
  // import "./NOPE FORGET THIS____Styles.svelte";
</script>