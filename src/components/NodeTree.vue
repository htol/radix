<template>
  <li v-if="node && node.leaf" class="node-tree">
    <span v-if="node && node.leaf" class="label"
      >{{ int2ip(node.key) }}/{{ node.bits }}</span
    >

    <ul v-if="node && node.leaf && node.child.length">
      <NodeTree
        v-for="(child, index) in node.child"
        :key="index"
        :node="child"
      ></NodeTree>
    </ul>
  </li>
  <NodeTree
    v-for="(child, index) in node.child"
    v-else-if="node"
    :key="index"
    :node="child"
  ></NodeTree>
</template>

<script setup>
import { int2ip } from "@/lib/ip.js";
defineProps({
  node: Object,
});
</script>
