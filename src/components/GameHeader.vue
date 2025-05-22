<script setup>
  import IconWin from './icons/IconWin.vue';
  import IconSmile from './icons/IconSmile.vue';
  import IconLose from './icons/IconLose.vue';

  import { useGameStore } from '../stores/useGameStore.ts';

  const game = useGameStore();
</script>

<template>
  <div class="game-header flex justify-between items-center mb-4">
    <div class="status min-w-24">
      <div
        class="status-badge w-fit px-2 py-1 bg-purple-300 rounded-sm border-2 border-purple-500 font-bold text-purple-600 font-mono"
      >
        <span v-if="game.gameState === 'win'"> YOU WIN! </span>
        <span v-else-if="game.gameState === 'lose'"> YOU LOSE </span>
        <span v-else> {{ game.remainingMines }} </span>
      </div>
    </div>
    <button
      @click="game.resetGame()"
      class="emoji-button p-2 active:scale-95 hover:scale-110 transition-transform duration-200"
      aria-label="Restart game"
    >
      <component
        :is="game.gameState === 'win' ? IconWin : game.gameState === 'lose' ? IconLose : IconSmile"
      />
    </button>
    <div class="timer min-w-24 text-end px-1 font-mono text-purple-600 font-bold">
      {{ game.formattedTime }}
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
