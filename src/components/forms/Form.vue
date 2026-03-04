<template>
  <form @submit.prevent="submit">
    <slot></slot>
  </form>
</template>

<script setup>
import { ref } from "vue"

const emit = defineEmits(["submit"])
const submitting = ref(false)

const submit = async () => {
  if (submitting.value) return
  submitting.value = true

  try {
    // Emit submit and wait for any async handling in parent
    await emit("submit")
  } finally {
    submitting.value = false
  }
}
</script>