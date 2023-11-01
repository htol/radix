<template>
  <div v-if="node" class="tree-menu">
    <div
      v-if="node.leaf"
      :style="indent"
      >
      {{ int2ip(node.key) }}/{{node.bits}}
    </div>
    <AnotherTree :node="child0" :depth="newDepth" />
    <AnotherTree :node="child1" :depth="newDepth" />
  </div>
</template>

<script setup>
import { int2ip } from "@/lib/ip.js";
import { computed } from "vue";

const props = defineProps({ node: Object, depth: Number });
const node = props.node;
const depth = props.depth;

const child0 = computed(() => {
  return node?.child[0] != null ? node.child[0] : null;
});

const child1 = computed(() => {
  return node?.child[1] != null ? node.child[1] : null;
});

const indent = computed(() => {
  return { transform: `translate(${depth * 20}px)` };
});

const newDepth = computed(()=>{
  return node?.leaf ? depth+1 : depth;
});

</script>
