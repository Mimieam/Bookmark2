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
      [`${ this.id_prefix }0`]: {
        id: `${ this.id_prefix }0`,
        name: 'root',
        children: []
      },
    }
    this.mapping = {}
  }
  // dfs
  build = (root, parent_id = 0) => {
    console.log(root, parent_id)
    // ok ok... this will need to be revised in a future version
    return root.map(n => {
      // this.mapping = {...this.mapping, ...{[`node${ this.total_nodes }`]: n.name}}
      this.total_nodes = this.total_nodes + 1
      const res = {
        [`${this.id_prefix}${ this.total_nodes }`]: {
          id:`${this.id_prefix}${this.total_nodes }`,
          parent_id: `${this.id_prefix}${parent_id }`,
          children: (n && n.children) ? this.build(n.children, this.total_nodes) : [],
          name: n.name,
        }
      }

      this.nodes = { ...this.nodes, ...res }
      let full_parent_id = `${ this.id_prefix }${ parent_id }`

      if (this.nodes[full_parent_id] && this.nodes[full_parent_id].children) {
        this.nodes[full_parent_id].children = [...this.nodes[full_parent_id].children, ...Object.values(res)]
        console.log(Object.values(this.nodes[full_parent_id].children))
      }
      return res
    })
  }
  // bfs  .. sorta
  undo = (nodes) => {
    const breadthFirstSearch = (root, output = []) => {
      // Handle the edge case that the function is
      // called without providing the root node
      if (!root) return output;

      // We will use a queue to store each node in
      // breadth-first order, initializing it with
      // the root node
      const q = new Queue();
      q.enqueue(root);

      // While the queue is not empty, we have more
      // nodes to "process"
      while (!q.isEmpty()) {
        // Retrieve the oldest node from the queue
        const node = q.dequeue();

        // "Process" the node
        output.push(node.val);

        // Enqueue all of the current node's children
        // If the node is a leaf, this loop will not
        // execute
        for (let child of node.children) {
          q.enqueue(child);
        }
      }

      // Once the queue is empty, we can be certain
      // that we have visited every node in the tree
      return output;
    };
  }

  move = (sourceNodeID, destinationNodeID, idx=0) => {
    let _parent = this.nodes[this.nodes[sourceNodeID].parent_id]
    if (_parent) {
      //update old parent
      _parent.children = _parent.children.filter(c => c.id != sourceNodeID)
      this.nodes[sourceNodeID].parent_id = destinationNodeID
      // update new parent
      let new_parent = this.nodes[destinationNodeID]
      new_parent.children = new_parent.children.filter(c => c.id != sourceNodeID)
      console.log(sourceNodeID, new_parent.children)
      new_parent.children.splice(idx, 0, this.nodes[sourceNodeID])
      console.log(sourceNodeID, new_parent.children)
      console.log(Object.values(this.nodes).map((item) => item))
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
