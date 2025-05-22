<template>
  <button
    class="w-6 h-6 md:w-8 md:h-8 border-pink-400 border-2 flex items-center justify-center m-0.5 rounded-sm hover:bg-pink-600 hover:border-pink-600 duration-300 cursor-pointer"
    :class="{
      'bg-pink-300': state === 'hidden',
      'bg-pink-500': state === 'revealed'
    }"
    @click.left="handleClick"
    @click.right.prevent="handleRightClick"
  >
    <span v-if="state === 'flagged'">🚩</span>
    <span v-else-if="state === 'revealed' && value === -1">💣</span>
    <span v-else-if="state === 'revealed' && value > 0">{{ value }}</span>
  </button>
</template>

<script setup lang="ts">
  interface Props {
    x: number;
    y: number;
    value: number | null;
    state: 'hidden' | 'revealed' | 'flagged' | 'question';
  }

  const props = defineProps<Props>();

  const emit = defineEmits<{
    (e: 'click', x: number, y: number): void;
    (e: 'right-click', x: number, y: number): void;
  }>();

  const handleClick = () => emit('click', props.x, props.y);
  const handleRightClick = (e: Event) => {
    e.preventDefault();
    emit('right-click', props.x, props.y);
  };
</script>

<style lang="scss" scoped></style>
