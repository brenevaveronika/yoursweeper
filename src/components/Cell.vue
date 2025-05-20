<template>
  <button
      class="w-6 h-6 md:w-8 md:h-8 border flex items-center justify-center m-0.5 rounded-md"
      :class="{
      'bg-purple-900': state === 'hidden',
      'bg-pink-100': state === 'revealed',
    }"
      @click.left="handleClick"
      @click.right.prevent="handleRightClick"
  >
    <span v-if="state === 'flagged'">🚩</span>
    <span v-else-if="state === 'revealed' && value === -1">💣</span>
    <span v-else-if="state === 'revealed' && value > 0">{{ value }}</span>
  </button>
</template>

<script setup>
import {ref} from "vue";

const props = defineProps({
  x: Number,
  y: Number,
  value: Number,
  state: String
});

const emit = defineEmits(['click', 'right-click']);

const handleClick = () => {
  emit('click', props.x, props.y);
};

const handleRightClick = () => {
  emit('right-click', props.x, props.y);
};

</script>

<style lang="scss" scoped>
</style>