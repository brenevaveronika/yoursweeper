<script setup lang="ts">
  interface Props {
    message: string;
    isActive?: boolean;
  }

  const props = defineProps<Props>();
</script>

<template>
  <button
    class="badge uppercase w-fit px-4 py-2 rounded-sm border md:border-2 font-bold font-mono hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer select-none"
    :class="{
      'bg-purple-300 border-purple-500 text-purple-600': !isActive,
      'bg-purple-600 border-purple-700 text-white shadow-md': isActive
    }"
  >
    {{ message }}
  </button>
</template>
