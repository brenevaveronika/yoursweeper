<script setup>
  import Cell from './components/Cell.vue';
  import GameHeader from './components/GameHeader.vue';
  const field = [];
  for (let i = 0; i < 9; i++) {
    field.push([]);
    for (let j = 0; j < 9; j++) {
      field[i].push({
        state: 'hidden', // 'hidden' | 'revealed' | 'flagged'
        value: null // null (пусто), -1 (мина), 1-8 (цифра)
      });
    }
  }
</script>

<template>
  <main class="bg-pink-100 min-h-dvh p-10 flex flex-col justify-center items-center">
    <div class="game border-2 border-pink-500 rounded-md p-4">
      <GameHeader />

      <div class="field inline-block">
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
    </div>
  </main>
</template>

<style scoped></style>
