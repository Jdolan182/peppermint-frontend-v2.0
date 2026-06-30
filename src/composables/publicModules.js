import axios from 'axios'
import { ref } from 'vue'

// Module-level singleton — shared across all imports in the same app instance
const modules = ref({})
const loaded = ref(false)
let cacheAt = 0
const TTL = 30_000

const maintenance = ref(false)
const maintenanceMessage = ref("We'll be back soon.")
const siteName = ref('Peppermint')

async function fetchPublicModules() {
  const now = Date.now()
  if (loaded.value && now - cacheAt < TTL) return modules.value
  try {
    const res = await axios.get('/api/public/modules')
    if (res?.data) {
      modules.value = res.data
      maintenance.value = res.data.maintenance === true
      maintenanceMessage.value = res.data.maintenance_message || "We'll be back soon."
      siteName.value = res.data.site_name || 'Peppermint'
      loaded.value = true
      cacheAt = now
    }
  } catch {}
  return modules.value
}

function invalidatePublicModulesCache() {
  cacheAt = 0
  loaded.value = false
}

function isPublicModuleEnabled(name) {
  const envKey = 'VITE_MODULE_' + name.toUpperCase()
  if (import.meta.env[envKey] !== 'true') return false
  if (!loaded.value) return true
  if (Object.prototype.hasOwnProperty.call(modules.value, name)) {
    return modules.value[name] === true
  }
  return true
}

export function usePublicModules() {
  return {
    modules,
    loaded,
    maintenance,
    maintenanceMessage,
    siteName,
    fetchPublicModules,
    invalidatePublicModulesCache,
    isPublicModuleEnabled,
  }
}
