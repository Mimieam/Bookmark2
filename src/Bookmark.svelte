<script>
  import Folder from './Folder.svelte';
  import { onMount } from 'svelte'

  import { Racine } from './nodes'
//   onMount(() => {
      new Racine()
//   })

  let root = [
      {
          id: 'n1',
          name: 'News',
          files: [
              { name: 'https://cnn.com', id: 'n2' },
              { name: 'https://msnbc.com',  id: 'n3' },
              { name: 'https://DW.com',  id: 'n4' }
          ]
      },
      {
          id: 'n5',
          name: 'Folder 2',
          files: [
              {
                  id: 'n17',
                  name: 'Folder 2.1',
                  files: [
                      { name: 'https://google.com', id:'n6' },
                      { name: 'https://yahoo.com', id:'n7' },
                      { name: 'https://bing.com', id:'n8' },
                      { name: 'https://msn.com', id:'n9' },
                  ]
              },
              {
                  id:'n10',
                  name: 'Folder 2.2',
                  files: [
                      { name: 'apple.com', id: 'n11' },
                      { name: 'amazon.com', id: 'n12' }
                  ]
              },
              { name: 'zillow.com', id: 'n13' },
              { name: 'alsjdf.com', id: 'n14' },
              { name: 'somerandomwebsite.com', id: 'n15' },
          ]
      },
      { name: 'tabsorter2.com', id: 'n16' }
  ];

    const tree = new Racine(root)
</script>


<Folder name="Bookmarks" files={tree.root} id='root'  expanded/>