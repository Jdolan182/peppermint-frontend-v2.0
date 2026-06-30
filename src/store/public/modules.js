import { defineStore } from 'pinia'
import { useAxios } from '@/composables/request'

export const usePublicModulesStore = defineStore('publicModules', {
  state: () => ({
    modules: {},
    loaded: false,
  }),

  actions: {
    async fetch() {
      const res = await useAxios.get('/api/public/modules')
      if (res?.data) {
        this.modules = res.data
        this.loaded = true
      }
    },
  },

  getters: {
    isEnabled: (state) => (name) => {
      // Env var is the licence gate — if not set, never enabled regardless of DB
      const envKey = 'VITE_MODULE_' + name.toUpperCase()
      if (import.meta.env[envKey] !== 'true') return false
      // If not loaded yet, default to allowing (fail open while fetching)
      if (!state.loaded) return true
      return state.modules[name] === true
    },
  },
})
