let root = [
  {
      name: 'News',
      children: [
          { name: 'https://cnn.com' },
          { name: 'https://msnbc.com' },
          { name: 'https://DW.com' }
      ]
  },
  {
      name: 'Folder 2',
      children: [
          {
              name: 'Folder 2.1',
              children: [
                  { name: 'https://google.com' },
                  { name: 'https://yahoo.com' },
                  { name: 'https://bing.com' },
                  { name: 'https://msn.com' },
              ]
          },
          {
              name: 'Folder 2.2',
              children: [
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
  constructor(root, id_prefix='node'){
    this.root = root
    this.id_prefix = id_prefix
    this.total_nodes = 0
    this.nodes = {
      [`${this.id_prefix}0`]: {id:`${this.id_prefix}0`},
    }
    this.mapping = {}
  }

  build = (root, parent_id = 0) => {
    console.log(root, parent_id)
    // ok ok... this will need to be revised in a future version
    return root.map(n => {
      // this.mapping = {...this.mapping, ...{[`node${ this.total_nodes }`]: n.name}}
      this.total_nodes = this.total_nodes + 1
      const res = {
        [`${this.id_prefix}${ this.total_nodes }`]: {
          parent_id: `${this.id_prefix}${parent_id }`,
          id:`${this.id_prefix}${this.total_nodes }`,
          children: (n && n.children) ? this.build(n.children, this.total_nodes) : [],
          name: n.name,
        }
      }
      this.nodes = {...this.nodes, ...res}
      return res
    })
  }

  move = (sourceNodeID, destinationNodeID) => {
    let _parent = this.nodes[this.nodes[sourceNodeID].parent_id]
    if (_parent) {
      _parent.children = _parent.children?.filter(c => !(sourceNodeID in c))
      this.nodes[sourceNodeID].parent_id = destinationNodeID
    }
    return this.nodes
  }

  get_root = (name_only = true) => {
    let root_name = `${this.id_prefix}0`
    return name_only? root_name: this.nodes[root_name]
  }

  get_children = (node) => {
    return Object.values(this.nodes).filter(o => o?.parent_id == node).map(o => o.id)
  }

  save = () => {
    return JSON.stringify(this.root)
  }

  get_depth(item, iteration = 0) {
    if (!item.children.length) return iteration;
    iteration++;
    return Math.max(...item.children.map(i => this.get_depth(i, iteration)));
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
