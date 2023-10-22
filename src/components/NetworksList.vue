<script setup>
import { ref } from "vue";
import DataTable from "./DataTable.vue";
import { RadixTree } from "../lib/radix.js";
let list = ref();

const nets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.2.0/30", "10.0.0.0/16"];

// make trie
let tree = new RadixTree();
nets.forEach((net) => {
    tree.insert(net);
});
console.log(tree);

const level = 0;
const str = new Array(10).fill(0);
console.log(tree.display(tree.getRoot(), str, level));

let result = ref(null);
result.value = "found: " + tree.search("10.0.0.0/16");

// make table
let rows = [];
nets.forEach((entry) => {
    rows.push([entry]);
});
let cols = ["Address"];
</script>

<template>
    <div class="justify-center flex-rows bg-blue-300 items-center h-screen">
        <div class="text-center text-3xl font-bold underline">OPA</div>
        <DataTable :cols="cols" :rows="rows" />
        <div>{{ list }}</div>
        <div class="m-4">{{ result }}</div>
    </div>
</template>
