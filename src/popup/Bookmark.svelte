<script>
  import browser from 'webextension-polyfill';

  import Folder from './Folder.svelte';
  import { onMount } from 'svelte'

  import { Racine } from './nodes'

  import { treeState } from './components/store/index'


  let root = [
      {
          id: 'n1',
          name: 'News',
          children: [
              { name: 'https://cnn.com', id: 'n2' },
              { name: 'https://msnbc.com',  id: 'n3' },
              { name: 'https://DW.com',  id: 'n4' }
          ]
      },
      {
          id: 'n5',
          name: 'Folder 2',
          children: [
              {
                  id: 'n6',
                  name: 'Folder 2.1',
                  children: [
                      { name: 'https://google.com', id:'n7' },
                      { name: 'https://yahoo.com', id:'n8' },
                      { name: 'https://bing.com', id:'n9' },
                      { name: 'https://msn.com', id:'n10' },
                  ]
              },
              {
                  id:'n11',
                  name: 'Folder 2.2',
                  children: [
                      { name: 'apple.com', id: 'n12' },
                      { name: 'amazon.com', id: 'n13' }
                  ]
              },
              { name: 'zillow.com', id: 'n14' },
              { name: 'alsjdf.com', id: 'n15' },
              { name: 'somerandomwebsite.com', id: 'n16' },
          ]
      },
      { name: 'tabsorter2.com', id: 'n17' }
  ];

  let treePromise;

  const init = async ()=>{
    root = (await browser.bookmarks.getTree())[0]?.children
    const tree = await Promise.resolve(new Racine(root, 'n'))

    tree.build(root)
    console.log(root, tree)

    // promise = await promise.resolve()

    globalThis.tree = tree
    globalThis.browser = browser

    // return tree
    if (tree) {
		return tree;
    } else {
        throw new Error("failed to initialized the root of your tree");
    }
  }
  treePromise = init();
    // root = localStorage.getItem('bookmark_racine') || root

</script>

<!-- node0 = root_node -->
{#await treePromise}
    <p>...waiting</p>
{:then tree}
    <p>Total Nodes = {tree.total_nodes}</p>
    <Folder name="Bookmarks" tree={tree} children={tree.root} id={tree.get_root({name_only: true})}  expanded={true}/>
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}
