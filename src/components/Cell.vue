<template>
  <div class="border border-b-purple-900 rounded-lg m-auto w-6 h-6 text-center"
       :class="getCellClass()">
    {{ cellFill }}
  </div>
</template>

<script setup>
import {ref} from "vue";

const cellFill = ref('');
const props = defineProps({
  x: Number,
  y: Number,
  value: Number,
  state: String
})

const getCellClass = () => {
  if (props.state === 'flagged') {
    cellFill.value = '🚩'
    return 'bg-purple-900 rounded-lg'
  }
  if (props.state === 'question') {
    cellFill.value = '❓'
  }
  if (props.state === 'hidden') {
    return 'bg-purple-900 rounded-lg'
  }
  if (props.state === 'revealed') {
    if (props.value === -1) {
      cellFill.value = '💣'
    }
    else {
      cellFill.value = props.value
    }
    return 'bg-pink-100 rounded-lg'
  }
}

</script>

<style lang="scss" scoped>

</style>