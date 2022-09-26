let root = [
  {
      name: 'News',
      items: [
          { name: 'https://cnn.com' },
          { name: 'https://msnbc.com' },
          { name: 'https://DW.com' }
      ]
  },
  {
      name: 'Folder 2',
      items: [
          {
              name: 'Folder 2.1',
              items: [
                  { name: 'https://google.com' },
                  { name: 'https://yahoo.com' },
                  { name: 'https://bing.com' },
                  { name: 'https://msn.com' },
              ]
          },
          {
              name: 'Folder 2.2',
              items: [
                  { name: 'apple.com' },
                  { name: 'amazon.com' }
              ]
          },
          { name: 'zillow.com' },
          { name: 'alsjdf.com' },
          { name: 'somerandomwebsite.com' }
      ]
  },
  { name: 'tabsorter2.com' }
];



export class Racine {
  constructor(root){
    this.root = root
    this.total_nodes = 0
    this.nodes = {
      node0: {id: 'node0'},
    }
    this.mapping = {}
  }

  build = (root, parent_id = 0) => {
    // ok ok... this will need to be revised in a future version
    return root.map(n => {
      this.mapping = {...this.mapping, ...{[`node${ this.total_nodes }`]: n.name}}
      this.total_nodes = this.total_nodes + 1
      const res = {
        [`node${ this.total_nodes }`]: {
          parent_id: `node${parent_id }`,
          id:`node${this.total_nodes }`,
          children: (n && n.items) ? this.build(n.items, this.total_nodes) : [],
          // name: n.name,
        }
      }
      this.nodes = {...this.nodes, ...res}
      return res
    })
  }

  move = (sourceNodeID, destinationNodeID) => {
    let _parent = this.nodes[this.nodes[sourceNodeID].parent_id]
    _parent.children = _parent.children?.filter(c => !(sourceNodeID in c))
    this.nodes[sourceNodeID].parent_id = destinationNodeID
    return this.nodes
  }

  get_children = (node) => {
    return Object.values(this.nodes).filter(o => o?.parent_id == node).map(o => o.id)
  }

  save = () => {
    return JSON.stringify(r.nodes)
  }

  print = (n) => {
    let children = this.get_children(n)
    if (children.length) {
      console.log(n.padEnd(6), `|[${ children }]`)
      for (const c of children) {
        this.print(c)
      }
    }
  }
}


// r = new Racine(root)
// r.build(root)
// // r.nodes
// // r.move('node11', 'node0')
// // r.move('node2', 'node10')
// r.print("node0")
