<template>
  <div class="space-y-4">
    <template v-for="field in fields" :key="field.key">

      <div>
        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{{ field.label }}</label>

        <!-- text -->
        <input
          v-if="field.type === 'text'"
          :value="localData[field.key]"
          type="text"
          @input="set(field.key, $event.target.value)"
          class="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <!-- url -->
        <UrlPicker
          v-else-if="field.type === 'url'"
          :modelValue="localData[field.key] ?? ''"
          @update:modelValue="set(field.key, $event)"
        />

        <!-- textarea -->
        <textarea
          v-else-if="field.type === 'textarea'"
          :value="localData[field.key]"
          rows="3"
          @input="set(field.key, $event.target.value)"
          class="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />

        <!-- number -->
        <input
          v-else-if="field.type === 'number'"
          :value="localData[field.key]"
          type="number"
          @input="set(field.key, Number($event.target.value))"
          class="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <!-- select -->
        <select
          v-else-if="field.type === 'select'"
          :value="localData[field.key]"
          @change="set(field.key, $event.target.value)"
          class="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option v-for="opt in field.options" :key="opt" :value="opt">{{ opt }}</option>
        </select>

        <!-- toggle -->
        <Toggle
          v-else-if="field.type === 'toggle'"
          :modelValue="!!localData[field.key]"
          @update:modelValue="set(field.key, $event)"
        />

        <!-- richtext -->
        <WysiwygEditor
          v-else-if="field.type === 'richtext'"
          :modelValue="localData[field.key] ?? ''"
          @update:modelValue="set(field.key, $event)"
        />

        <!-- image -->
        <div v-else-if="field.type === 'image'">
          <div
            v-if="localData[field.key]"
            class="relative w-40 h-28 rounded-lg overflow-hidden ring-1 ring-gray-200 dark:ring-gray-600 mb-2"
          >
            <img :src="localData[field.key]" alt="" class="w-full h-full object-cover" />
            <button
              @click="set(field.key, null)"
              class="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full text-xs flex items-center justify-center hover:bg-black/80"
            >&times;</button>
          </div>
          <button
            @click="openPicker(field.key)"
            class="rounded-lg border border-gray-200 dark:border-gray-600 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >{{ localData[field.key] ? 'Change image' : 'Pick image' }}</button>
        </div>

        <!-- items (repeating list) -->
        <div v-else-if="field.type === 'items'" class="space-y-3">
          <div
            v-for="(item, idx) in (localData[field.key] ?? [])"
            :key="idx"
            class="rounded-lg border border-gray-200 dark:border-gray-600 p-3 space-y-2"
          >
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs font-medium text-gray-500 dark:text-gray-400">#{{ idx + 1 }}</span>
              <div class="flex gap-2">
                <button v-if="idx > 0" @click="moveItem(field.key, idx, -1)" class="text-xs text-gray-400 hover:text-gray-600">↑</button>
                <button v-if="idx < (localData[field.key]?.length ?? 0) - 1" @click="moveItem(field.key, idx, 1)" class="text-xs text-gray-400 hover:text-gray-600">↓</button>
                <button @click="removeItem(field.key, idx)" class="text-xs text-red-400 hover:text-red-600">Remove</button>
              </div>
            </div>
            <template v-for="sub in field.subFields" :key="sub.key">
              <div>
                <label class="block text-xs text-gray-400 mb-0.5">{{ sub.label }}</label>

                <input
                  v-if="sub.type === 'text'"
                  :value="item[sub.key]"
                  type="text"
                  @input="setSubItem(field.key, idx, sub.key, $event.target.value)"
                  class="w-full rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <UrlPicker
                  v-else-if="sub.type === 'url'"
                  :modelValue="item[sub.key] ?? ''"
                  @update:modelValue="setSubItem(field.key, idx, sub.key, $event)"
                />

                <textarea
                  v-else-if="sub.type === 'textarea'"
                  :value="item[sub.key]"
                  rows="2"
                  @input="setSubItem(field.key, idx, sub.key, $event.target.value)"
                  class="w-full rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />

                <select
                  v-else-if="sub.type === 'select'"
                  :value="item[sub.key]"
                  @change="setSubItem(field.key, idx, sub.key, $event.target.value)"
                  class="w-full rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option v-for="opt in sub.options" :key="opt" :value="opt">{{ opt }}</option>
                </select>

                <!-- sub image -->
                <div v-else-if="sub.type === 'image'">
                  <div v-if="item[sub.key]" class="relative w-24 h-16 rounded overflow-hidden ring-1 ring-gray-200 dark:ring-gray-600 mb-1">
                    <img :src="item[sub.key]" alt="" class="w-full h-full object-cover" />
                    <button @click="setSubItem(field.key, idx, sub.key, null)" class="absolute top-0.5 right-0.5 w-4 h-4 bg-black/60 text-white rounded-full text-xs flex items-center justify-center">&times;</button>
                  </div>
                  <button
                    @click="openSubPicker(field.key, idx, sub.key)"
                    class="text-xs rounded-md border border-gray-200 dark:border-gray-600 px-2 py-1 text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
                  >{{ item[sub.key] ? 'Change' : 'Pick image' }}</button>
                </div>
              </div>
            </template>
          </div>

          <button
            @click="addItem(field)"
            class="rounded-lg border border-dashed border-gray-300 dark:border-gray-600 px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 hover:border-indigo-400 hover:text-indigo-600 w-full transition-colors"
          >+ Add {{ field.label.toLowerCase().replace(/s$/, '') }}</button>
        </div>

      </div>
    </template>

    <!-- Save button -->
    <div class="flex justify-end pt-2">
      <button
        @click="save"
        :disabled="saving"
        class="rounded-lg bg-gray-900 dark:bg-white px-4 py-2 text-sm font-semibold text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors disabled:opacity-50"
      >{{ saving ? 'Saving…' : 'Save block' }}</button>
    </div>
  </div>

  <!-- Media picker modal -->
  <MediaPicker
    v-if="pickerKey !== null"
    :modelValue="pickerCurrentValue"
    @update:modelValue="onPickerSelect"
    @close="pickerKey = null"
  />
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { getPageBlock, getFooterBlock } from '@/composables/blockRegistry'
import WysiwygEditor from '@/components/editor/WysiwygEditor.vue'
import Toggle from '@/components/inputs/Toggle.vue'
import MediaPicker from '@/components/pages/MediaPicker.vue'
import UrlPicker from '@/components/pages/UrlPicker.vue'

const props = defineProps({
  section: { type: Object, required: true },
  footer: { type: Boolean, default: false },
})
const emit = defineEmits(['update'])

const definition = computed(() =>
  props.footer
    ? getFooterBlock(props.section.type)
    : getPageBlock(props.section.type)
)

const fields = computed(() => definition.value?.fields ?? [])

const localData = reactive({ ...(props.section.data ?? {}) })

watch(() => props.section.data, (val) => {
  if (val) Object.assign(localData, val)
}, { deep: true })

const saving = ref(false)

async function save() {
  saving.value = true
  emit('update', { ...localData })
  await new Promise(r => setTimeout(r, 300))
  saving.value = false
}

function set(key, value) {
  localData[key] = value
}

function addItem(field) {
  const blank = {}
  ;(field.subFields ?? []).forEach(sf => { blank[sf.key] = sf.type === 'image' ? null : '' })
  if (!Array.isArray(localData[field.key])) localData[field.key] = []
  localData[field.key] = [...localData[field.key], blank]
}

function removeItem(key, idx) {
  localData[key] = localData[key].filter((_, i) => i !== idx)
}

function moveItem(key, idx, dir) {
  const arr = [...localData[key]]
  const newIdx = idx + dir
  if (newIdx < 0 || newIdx >= arr.length) return
  ;[arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]]
  localData[key] = arr
}

function setSubItem(key, idx, subKey, value) {
  const arr = [...localData[key]]
  arr[idx] = { ...arr[idx], [subKey]: value }
  localData[key] = arr
}

// Media picker state
const pickerKey = ref(null)
const pickerSubIdx = ref(null)
const pickerSubKey = ref(null)

const pickerCurrentValue = computed(() => {
  if (pickerSubIdx.value !== null && pickerKey.value) {
    return localData[pickerKey.value]?.[pickerSubIdx.value]?.[pickerSubKey.value] ?? null
  }
  return localData[pickerKey.value] ?? null
})

function openPicker(key) {
  pickerKey.value = key
  pickerSubIdx.value = null
  pickerSubKey.value = null
}

function openSubPicker(key, idx, subKey) {
  pickerKey.value = key
  pickerSubIdx.value = idx
  pickerSubKey.value = subKey
}

function onPickerSelect(url) {
  if (pickerSubIdx.value !== null) {
    setSubItem(pickerKey.value, pickerSubIdx.value, pickerSubKey.value, url)
  } else {
    set(pickerKey.value, url)
  }
  pickerKey.value = null
}
</script>
