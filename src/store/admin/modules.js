import { defineStore } from 'pinia'
import { useAxios } from '@/composables/request'
import { config } from '@/config'

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
      if (!config.modules[name]) return false
      const dbKey = 'module_' + name.toLowerCase()
      return state.settings[dbKey] !== 'false'
    },
  },
})
