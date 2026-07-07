<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" @click.self="$emit('close')">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">

        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <h2 class="text-base font-semibold text-gray-900 dark:text-white">Media</h2>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>

        <!-- Tabs -->
        <div class="flex border-b border-gray-100 dark:border-gray-700 px-6">
          <button
            v-for="tab in tabs"
            :key="tab"
            @click="activeTab = tab"
            class="py-3 px-1 mr-6 text-sm font-medium border-b-2 transition-colors"
            :class="activeTab === tab ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'"
          >{{ tab }}</button>
        </div>

        <!-- Tab content -->
        <div class="flex-1 overflow-y-auto p-6">

          <!-- Gallery tab -->
          <div v-if="activeTab === 'Gallery'">
            <div v-if="loadingMedia" class="text-sm text-gray-400">Loading…</div>
            <div v-else-if="!media.length" class="text-sm text-gray-400 text-center py-8">No media uploaded yet.</div>
            <div v-else class="grid grid-cols-4 gap-3">
              <button
                v-for="item in media"
                :key="item.id"
                @click="select(item.url)"
                class="relative aspect-square rounded-lg overflow-hidden ring-2 transition-all"
                :class="selected === item.url ? 'ring-indigo-600' : 'ring-transparent hover:ring-gray-300'"
              >
                <img :src="storageUrl(item.url)" :alt="item.alt || item.filename" class="w-full h-full object-cover" />
                <div v-if="selected === item.url" class="absolute inset-0 bg-indigo-600/20 flex items-center justify-center">
                  <span class="text-white text-lg">✓</span>
                </div>
              </button>
            </div>
          </div>

          <!-- Upload tab -->
          <div v-else-if="activeTab === 'Upload'">
            <div
              class="border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl p-12 text-center"
              @dragover.prevent
              @drop.prevent="handleDrop"
            >
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">Drag and drop or</p>
              <label class="cursor-pointer rounded-lg bg-gray-900 dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors">
                Choose file
                <input type="file" accept="image/*" class="sr-only" @change="handleFile" />
              </label>
              <p v-if="uploading" class="mt-3 text-sm text-gray-400">Uploading…</p>
            </div>
          </div>

          <!-- URL tab -->
          <div v-else-if="activeTab === 'URL'">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">Paste an external image URL</p>
            <div class="flex gap-2">
              <input
                v-model="urlInput"
                type="url"
                placeholder="https://example.com/image.jpg"
                class="flex-1 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                @click="selectUrl"
                class="rounded-lg bg-gray-900 dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors"
              >Use</button>
            </div>
            <div v-if="urlInput" class="mt-4">
              <img :src="urlInput" alt="" class="max-h-48 rounded-lg object-contain" />
            </div>
          </div>

        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-gray-700">
          <button v-if="modelValue" @click="clear" class="text-sm text-red-500 hover:text-red-700">Remove image</button>
          <div v-else />
          <button
            v-if="selected && activeTab === 'Gallery'"
            @click="confirm"
            class="rounded-lg bg-gray-900 dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors"
          >Select</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAxios } from '@/composables/request'
import { config } from '@/config'

// The backend returns an absolute URL based on APP_URL, which may not match
// the actual host the frontend is talking to. Extract just the path and
// rebuild the URL using config.apiUrl so it always resolves correctly.
function storageUrl(url) {
  if (!url) return url
  const match = url.match(/\/storage\/.+$/)
  return match ? config.apiUrl + match[0] : url
}

const props = defineProps({
  modelValue: { type: String, default: null },
})
const emit = defineEmits(['update:modelValue', 'close'])

const tabs = ['Gallery', 'Upload', 'URL']
const activeTab = ref('Gallery')
const media = ref([])
const loadingMedia = ref(false)
const uploading = ref(false)
const selected = ref(props.modelValue)
const urlInput = ref('')

async function loadMedia() {
  loadingMedia.value = true
  const res = await useAxios.get('/api/admin/media')
  media.value = res?.data ?? []
  loadingMedia.value = false
}

function select(url) {
  selected.value = storageUrl(url)
}

function confirm() {
  emit('update:modelValue', selected.value)
  emit('close')
}

function selectUrl() {
  if (!urlInput.value) return
  emit('update:modelValue', urlInput.value)
  emit('close')
}

function clear() {
  emit('update:modelValue', null)
  emit('close')
}

async function upload(file) {
  uploading.value = true
  const form = new FormData()
  form.append('file', file)
  const res = await useAxios.post('/api/admin/media', form)
  if (res?.data) {
    media.value.unshift(res.data)
    const url = storageUrl(res.data.url)
    selected.value = url
    activeTab.value = 'Gallery'
    emit('update:modelValue', url)
    emit('close')
  }
  uploading.value = false
}

function handleFile(e) {
  const file = e.target.files?.[0]
  if (file) upload(file)
}

function handleDrop(e) {
  const file = e.dataTransfer.files?.[0]
  if (file) upload(file)
}

onMounted(loadMedia)
</script>
