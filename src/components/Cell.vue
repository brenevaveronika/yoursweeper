<template>
  <button
    class="cell"
    :class="cellClasses"
    @click="handleLeftClick"
    @contextmenu.prevent="handleRightClick"
  >
    <span v-if="state === 'flagged'">🚩</span>
    <span v-else-if="state === 'question'">❓</span>
    <span v-else-if="state === 'revealed' && value === -1">💣</span>
    <span v-else-if="state === 'revealed' && value > 0">{{ value }}</span>
  </button>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  interface Props {
    x: number;
    y: number;
    value: number | null;
    state: 'hidden' | 'revealed' | 'flagged' | 'question';
  }

  const props = defineProps<Props>();

  const emit = defineEmits<{
    (e: 'left-click', x: number, y: number): void;
    (e: 'right-click', x: number, y: number): void;
  }>();

  const handleLeftClick = () => {
    if (props.state !== 'flagged' && props.state !== 'question') {
      emit('left-click', props.x, props.y);
    }
  };

  const handleRightClick = () => {
    emit('right-click', props.x, props.y);
  };

  const cellClasses = computed(() => [
    'text-pink-300 font-mono font-bold w-6 h-6 md:w-8 md:h-8 border-pink-400 border-2',
    'flex items-center justify-center m-0.5 rounded-sm duration-300',
    'cursor-pointer select-none',
    {
      'bg-pink-300': props.state === 'hidden',
      'bg-pink-500': props.state === 'revealed',
      'bg-red-200': props.state === 'revealed' && props.value === -1,
      'hover:bg-pink-600 hover:border-pink-600': props.state === 'hidden'
    }
  ]);
</script>

<style lang="scss" scoped></style>
