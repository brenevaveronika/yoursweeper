<script setup>
  import GameHeader from './components/GameHeader.vue';
  import GameField from './components/GameField.vue';
  import { useGameStore } from './stores/useGameStore.ts';
  import { onMounted } from 'vue';
  const game = useGameStore();

  onMounted(() => {
    game.initField();
  });
</script>

<template>
  <main class="bg-pink-100 min-h-dvh p-10 flex flex-col justify-center items-center">
    <div class="game border-2 border-pink-500 rounded-md p-4">
      <GameHeader />
      <GameField />
    </div>
  </main>
</template>

<style scoped></style>
