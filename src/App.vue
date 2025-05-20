<script setup>
import Cell from "./components/Cell.vue";
const field = [];
for (let i = 0; i < 9; i++) {
  field.push([]);
  for (let j = 0; j < 9; j++) {
    field[i].push({
      state: 'hidden', // 'hidden' | 'revealed' | 'flagged'
      value: null,     // null (пусто), -1 (мина), 1-8 (цифра)
    });
  }
}
</script>

<template>
  <main class="bg-pink-100 min-h-dvh font-mono text-purple-900 p-10 flex flex-col justify-center items-center">
    <h1 class="text-3xl"> Hello, Yoursweeper! </h1>
    <div class="field p-4 inline-block">
      <div v-for="(row, x) in field" :key="`row-${x}`" class="flex w-fit">
        <Cell
            v-for="(cell, y) in row"
            :key="`cell-${x}-${y}`"
            :x="x"
            :y="y"
            :value="cell.value"
            :state="cell.state"
        />
      </div>
    </div>
  </main>
</template>

<style scoped>
</style>
