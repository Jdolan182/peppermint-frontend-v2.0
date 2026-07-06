import { ref, reactive } from 'vue'

const toasts = ref([])
let _id = 0

function show(message, type = 'success', duration = 4000) {
  const id = ++_id
  toasts.value.push({ id, message, type })
  if (duration > 0) setTimeout(() => dismiss(id), duration)
  return id
}

function dismiss(id) {
  toasts.value = toasts.value.filter(t => t.id !== id)
}

const store = reactive({ toasts, show, dismiss })

export const useToastStore = () => store
