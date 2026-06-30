import { defineStore } from 'pinia'
import { useAxios } from '@/composables/request'

export const useModulesStore = defineStore('modules', {
  state: () => ({
    settings: {},
    loaded: false,
  }),

  actions: {
    async fetch() {
      const res = await useAxios.get('/api/admin/settings')
      if (res?.data) {
        this.settings = res.data
        this.loaded = true
      }
    },
  },

  getters: {
    // Checks both layers: env var (licence) AND DB setting (on/off toggle)
    // Absence of a DB setting defaults to enabled — modules are on until explicitly turned off
    isEnabled: (state) => (name) => {
      const envKey = 'VITE_MODULE_' + name.toUpperCase()
      if (import.meta.env[envKey] !== 'true') return false
      const dbKey = 'module_' + name.toLowerCase()
      return state.settings[dbKey] !== 'false'
    },
  },
})
