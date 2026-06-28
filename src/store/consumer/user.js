import { defineStore } from 'pinia'
import { useConsumerAuthStore } from './auth'
import { useAxios } from '@/composables/request.js'

export const useConsumerUserStore = defineStore('consumerUser', {
  state: () => ({
    userId: localStorage.getItem('consumerUserId') ?? null,
    name: localStorage.getItem('consumerUserName') ?? null,
    email: localStorage.getItem('consumerUserEmail') ?? null,
  }),
  getters: {
    getId: (state) => state.userId,
    getName: (state) => state.name,
    getEmail: (state) => state.email,
  },
  actions: {
    setUser(data) {
      this.name = data.name
      this.userId = data.id

      const authStore = useConsumerAuthStore()
      authStore.setLoggedIn(true)
      this.getUser()
    },
    async getUser() {
      const res = await useAxios.get('api/consumer/user')
      const data = res.data.data

      localStorage.setItem('consumerUserId', data.id)
      this.userId = data.id
      localStorage.setItem('consumerUserName', data.name)
      this.name = data.name
      localStorage.setItem('consumerUserEmail', data.email)
      this.email = data.email
    },
    removeUser() {
      localStorage.removeItem('consumerUserId')
      this.userId = null
      localStorage.removeItem('consumerUserName')
      this.name = null
      localStorage.removeItem('consumerUserEmail')
      this.email = null
    },
  },
})
