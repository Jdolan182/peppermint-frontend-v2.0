import { defineStore } from 'pinia'
import { useConsumerUserStore } from './user'
import router from '@/router/index.js'

export const useConsumerAuthStore = defineStore('consumerAuth', {
  state: () => ({
    isLoggedIn: JSON.parse(localStorage.getItem('consumerIsLoggedIn')) ?? false,
  }),
  getters: {
    getIsLoggedIn: (state) => state.isLoggedIn,
  },
  actions: {
    setLoggedIn(val) {
      localStorage.setItem('consumerIsLoggedIn', val)
      this.isLoggedIn = val
    },
    logout() {
      const userStore = useConsumerUserStore()
      userStore.removeUser()
      localStorage.removeItem('consumerIsLoggedIn')
      this.isLoggedIn = false
      router.push({ name: 'ConsumerLogin' })
    },
  },
})
