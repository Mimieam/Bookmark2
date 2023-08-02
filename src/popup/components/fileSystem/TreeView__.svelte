<svelte:head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.0/font/bootstrap-icons.css" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/mar10/wunderbaum@main/dist/wunderbaum.css" />
</svelte:head>

<script>
  import { onMount } from 'svelte'
  import { Wunderbaum } from "wunderbaum";

  export let treeDOM='treeDOM_ID_1';
  export let parentDOM='parentDOM_ID_1';
  // import { Wunderbaum } from "wunderbaum/dist/wunderbaum.esm.min";

  let Tree;

  // onMount(() => {
  // });

  document.addEventListener('DOMContentLoaded', () => {
    console.log("DOMContentLoaded!")
    console.log(document.getElementById(treeDOM))
    console.log(document.getElementById(parentDOM))
    Tree = new Wunderbaum({
      id: "demo",
      element: document.getElementById(treeDOM),
      debugLevel: 5,
      connectTopBreadcrumb: document.getElementById(parentDOM),
      // checkbox: false,
      // minExpandLevel: 1,
      // fixedCol: true,
      navigationModeOption: "row",
      source:
        // "https://cdn.jsdelivr.net/gh/mar10/assets@master/wunderbaum/fixture_store_104k_3_7_flat_comp.json",
      "https://cdn.jsdelivr.net/gh/mar10/assets@master/wunderbaum/ajax_100k_3_1_6.json",
      // "../../test/generator/fixture_store_104k_3_7_flat_comp.json",
      // source: "../assets/ajax_100k_3_1_6.json",
      types: {
        folder: { colspan: true, checkbox: false },
        book: { icon: "bi bi-book" },
        computer: { icon: "bi bi-laptop" },
        music: { icon: "bi bi-disc" },
        phone: { icon: "bi bi-phone" },
      },
      columns: [
        { id: "*", title: "Product", width: "250px" },
        { id: "author", title: "Author", width: "200px" },
        { id: "year", title: "Year", width: "50px", classes: "wb-helper-end" },
        { id: "qty", title: "Qty", width: "100px", classes: "wb-helper-end" },
        {
          id: "price",
          title: "Price ($)",
          width: "80px",
          classes: "wb-helper-end",
        },
        // In order to test horizontal scrolling, we need a fixed or at least minimal width:
      ],
      dnd: {
        dragStart: (e) => {
          if (e.node.type === "folder") {
            return false;
          }
          e.event.dataTransfer.effectAllowed = "all";
          return true;
        },
        dragEnter: (e) => {
          if (e.node.type === "folder") {
            e.event.dataTransfer.dropEffect = "copy";
            return "over";
          }
          return ["before", "after"];
        },
        drop: (e) => {
          console.log(
            "Drop " + e.sourceNode + " => " + e.region + " " + e.node
          );
          e.sourceNode.moveTo(e.node, e.defaultDropMode);
        },
      },
      edit: {
        trigger: ["clickActive", "F2", "macEnter"],
        select: true,
        beforeEdit: function (e) {
          console.log(e.type, e);
          // return false;
        },
        edit: function (e) {
          console.log(e.type, e);
        },
        apply: function (e) {
          console.log(e.type, e);
          // Simulate async storage that also validates:
          return e.util.setTimeoutPromise(() => {
            e.inputElem.setCustomValidity("");
            if (e.newValue.match(/.*\d.*/)) {
              e.inputElem.setCustomValidity("No numbers please.");
              return false;
            }
          }, 1000);
        },
      },
      filter: {
        connectInput: "input#filterQuery",
        // mode: "dim",
      },
      init: (e) => {
        // e.tree.setFocus();
      },
      load: function (e) {
        // e.tree.addChildren({ title: "custom1", classes: "wb-error" });
      },
      lazyLoad: function (e) {
        console.log(e.type, e);
        // return { url: "../assets/ajax-lazy-products.json" };
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            // reject("Epic fail")
            resolve({ url: "../assets/ajax-lazy-products.json" });
          }, 1500);
        });
      },
      change: function (e) {
        const info = e.info;
        const colId = info.colId;

        console.log(e.type, e);
        // For demo purposes, simulate a backend delay:
        return e.util.setTimeoutPromise(() => {
          // Assumption: we named column.id === node.data.NAME
          switch (colId) {
            case "sale":
            case "details":
              e.node.data[colId] = e.inputValue;
              break;
          }
          // e.node.update()
        }, 500);
      },
      render: function (e) {
        // console.log(e.type, e.isNew, e);
        const node = e.node;
        const util = e.util;

        for (const col of Object.values(e.renderColInfosById)) {
          switch (col.id) {
            case "price":
              col.elem.textContent = "$ " + node.data.price.toFixed(2);
              break;
            case "year": // date stamp
              col.elem.textContent = new Date(node.data.year).getFullYear();
              break;
            case "qty": // thousands separator
              col.elem.textContent = node.data.qty.toLocaleString();
              break;
            // case "sale": // checkbox control
            //   if (e.isNew) {
            //     col.elem.innerHTML = "<input type='checkbox'>";
            //   }
            //   // Cast value to bool, since we don't want tri-state behavior
            //   util.setValueToElem(col.elem, !!node.data.sale);
            //   break;
            // case "details": // text control
            //   if (e.isNew) {
            //     col.elem.innerHTML = "<input type='text'>";
            //   }
            //   util.setValueToElem(col.elem, node.data.details);
            //   break;
            default:
              // Assumption: we named column.id === node.data.NAME
              col.elem.textContent = node.data[col.id];
              break;
          }
        }
      },
    });
  });
</script>

<div>
  <section class="header">
    <output id="demo-info" class="hide-on-welcome hint">
  A treegrid with about 100,000 nodes.
  Navigation mode: 'row'.
  </output>
    <hr class="hide-on-welcome">
    <span id="demo-modifiers" class="hide-on-welcome">
      Modifiers:
      <button type="button" id="show-checkboxes" class="toggle-button" title="Show checkboxes">
        <i class="bi bi-list-check"></i></button>
      <button type="button" id="disable-tree" class="toggle-button" title="Disable tree">
        <i class="bi bi-pause-circle"></i></button>
      <button type="button" id="enable-cellnav" class="toggle-button checked" title="Enable cell-navigation mode (treegrids only)">
        <i class="bi bi-grid-3x3-gap"></i></button>
      |
      <label><input type="checkbox" class="auto-class-setter" data-classname="wb-rainbow"> wb-rainbow</label>,
      <label><input type="checkbox" class="auto-class-setter" data-classname="wb-alternate"> wb-alternate</label>,
      <label><input type="checkbox" class="auto-class-setter" data-classname="wb-checkbox-auto-hide">
        wb-checkbox-auto-hide</label>,
      <label><input type="checkbox" class="auto-class-setter" data-classname="wb-fade-expander">
        wb-fade-expander</label>
    </span>
    <br>
    <!-- <hr> -->
    <span id="demo-controls" class="hide-on-welcome">
      <!-- <button id="expand-all" class="icon-button"><i class="bi bi-plus-square"></i></button> -->
      <!-- <button id="collapse-all" class="icon-button"><i class="bi bi-dash-square"></i></button> -->
      <button id="toggle-expand-all" class="icon-button" title="Expand/Collapse all">
        <i class="bi bi-plus-slash-minus"></i></button>
      <button id="toggle-select-all" class="icon-button" title="(De)Select all">
        <i class="bi bi-check2-square"></i></button>
      |
      <label for="filterQuery">Filter:</label>
      <input id="filterQuery" type="search" placeholder="Enter search query" autofocus="">
      <button type="button" id="filter-hide" title="Hide unmatched nodes" class="toggle-button">
        <i class="bi bi-funnel"></i></button>
    </span>
  </section>
  <main class="view">
<!-- <div id={parentDOM} class="hide-on-welcome hidden"> -->
  <output id={parentDOM} class="hide-on-welcome"></output>
  <div id={treeDOM} class="wb-skeleton wb-initializing wb-no-select">
    YO!
            <!-- class="wb-rainbow wb-skeleton wb-initializing wb-alternate wb-checkbox-auto-hide wb-fade-expander"> -->
            <h1>Wunderbaum Demo</h1>
            <p>Loading&hellip;</p>
  </div>
<!-- </div> -->
</main>
</div>