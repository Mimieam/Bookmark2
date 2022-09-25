
/**
 * counts the leaves under a tree
 * @param n
 */
  export const recursiveCount = (n) => {
  return n.map(o => {
    if (!("files" in o)) {
      console.log(`leaf: ${o.name}`, 1)
      return 1
    } else {
      let cnt = recursiveCount(o.files)
      console.log(`branch: ${o.name}`, cnt)
      return cnt
    }
  }).reduce((x, y) => x + y)
}