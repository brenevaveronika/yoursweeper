<script setup>
  import GameHeader from './components/GameHeader.vue';
  import GameField from './components/GameField.vue';
  import { useGameStore } from './stores/useGameStore.ts';
  import { onMounted } from 'vue';
  import LevelSelector from './components/LevelSelector.vue';
  const game = useGameStore();

  onMounted(() => {
    game.initField();
  });
</script>

<template>
  <main class="bg-pink-100 min-h-dvh p-10 flex justify-center font-mono">
    <div class="game-interface flex flex-col justify-center items-center">
      <h1 class="text-2xl font-bold uppercase text-pink-500 mb-10">Pickme Minesweeper</h1>
      <LevelSelector />
      <div class="game border md:border-2 border-pink-500 rounded-md p-4">
        <GameHeader />
        <GameField />
      </div>
      <p class="text-pink-500 mt-10">
        made by
        <a
          class="hover:text-pink-950 transition duration-200 underline underline-offset-5"
          href="https://github.com/brenevaveronika"
          target="_blank"
          >@nikaginger</a
        >
      </p>
    </div>
  </main>
</template>

<style></style>
