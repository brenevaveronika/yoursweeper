<script setup lang="ts">
  import { useGameStore } from '../stores/useGameStore';
  import LevelBadge from './LevelBadge.vue';

  const game = useGameStore();

  const levels = [
    { id: 'beginner', label: '', mines: 10, size: '8x8' },
    { id: 'intermediate', label: '', mines: 15, size: '10x10' },
    { id: 'expert', label: '', mines: 40, size: '16x16' }
  ];
</script>

<template>
  <div class="level-selector flex flex-wrap gap-3 justify-center mb-6 w-full">
    <LevelBadge
      v-for="level in levels"
      :key="level.id"
      :message="`${level.label} (${level.size})`"
      :isActive="game.currentLevel === level.id"
      @click="game.setLevel(level.id)"
    />
  </div>
</template>

<style scoped></style>
