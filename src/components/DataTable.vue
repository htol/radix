<template>
    <div>
        <div class="p-4">
            <input v-model="search" type="text" class="border-1 rounded h-8 p-3" placeholder="Search" />
        </div>
        <div class="grid grid-cols-{{len(cols)}} m-4">
            <div v-for="(col, index) in cols" :key="index">{{ col }}</div>
            <template v-for="row in filteredTable">
                <div v-for="(rowItem, rowIndex) in row" :key="rowIndex" class="...">
                    {{ rowItem }}
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from "vue";
const props = defineProps(["cols", "rows"]);
const search = ref("");
const cols = props.cols;
const rows = props.rows;
//console.log(rows)
console.log(search.value);

const filteredTable = computed(() => {
    if (search.value != "" && search.value != null) {
        console.log("search: ", search.value);
        return rows.filter((row) => {
            return row.join(" ").includes(search.value);
        });
    }
    return rows;
});
</script>

<style scoped></style>
