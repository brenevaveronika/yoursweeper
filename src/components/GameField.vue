<script setup>
  import GameCell from './GameCell.vue';
  import { useGameStore } from '../stores/useGameStore.ts';
  import { onMounted } from 'vue';

  const game = useGameStore();

  onMounted(() => {
    if (game.field.length === 0) {
      game.initField();
    }
  });
</script>

<template v-if="game.field.length > 0">
  <div v-for="(row, x) in game.field" :key="`row-${x}`" class="flex">
    <GameCell
      v-for="(cell, y) in row"
      :key="`cell-${x}-${y}`"
      :x="x"
      :y="y"
      :value="cell.value"
      :state="cell.state"
      @left-click="game.handleCellPress(x, y)"
      @right-click="game.toggleCellMark(x, y)"
    />
  </div>
</template>

<style scoped></style>
