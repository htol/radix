<script setup>
//import { ref } from "vue";
import DataTable from "./DataTable.vue";
import { Tree } from "../lib/ipt.js";
import { l } from "../lib/debug_helper.js";
// import TreeView from "./TreeView.vue";
import AnotherTree from "./AnotherTree.vue";

const nets = [
  "10.0.1.0/24",
  "10.0.2.0/24",
  "10.0.2.0/30",
  "10.0.0.0/16",
  "127.0.0.122/24",
  "127.0.0.128/32",
  "127.0.1.1/24",
  "127.0.1.1/25",
  "127.0.1.129/25",
  "127.0.1.129/32",
  "127.0.1.130/32",
  "127.0.0.0/16",
  "127.0.1.131/32",
  "127.0.1.132/32",
  "127.0.1.133/32",
  "127.0.1.134/32",
  "127.0.1.135/32",
];

// make trie
let tree = new Tree();
nets.forEach((net) => {
  tree.insertNet(net);
});
l(tree);
l(tree.toString());

// make table
let rows = [];
nets.forEach((entry) => {
  rows.push([entry]);
});
let cols = ["Address"];
</script>

<template>
  <div class="justify-center flex-rows bg-blue-300 items-center">
    <div class="text-center text-3xl font-bold underline">OPA</div>
    <AnotherTree :node="tree.getRoot()" :depth="0" />
    <DataTable :cols="cols" :rows="rows" />
    <!-- <TreeView :tree="tree" /> -->
  </div>
</template>
