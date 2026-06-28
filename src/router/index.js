import { createRouter, createWebHistory } from 'vue-router'
import { getAdminRoutes } from './admin'
import { getPublicRoutes } from './public'
import { useAuthStore } from '@/store/admin/auth'
import { useConsumerAuthStore } from '@/store/consumer/auth'

const routes = [
  ...getAdminRoutes(),
  ...getPublicRoutes(),
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  const adminAuth = useAuthStore()
  const consumerAuth = useConsumerAuthStore()

  if (to.meta.skipIfAuth && adminAuth.getIsLoggedIn) {
    return { name: 'Dashboard' }
  }

  if (to.meta.requiresAuth && !adminAuth.getIsLoggedIn) {
    return { name: 'Peppermint' }
  }

  if (to.meta.skipIfConsumerAuth && consumerAuth.getIsLoggedIn) {
    return { name: 'Home' }
  }

  if (to.meta.requiresConsumerAuth && !consumerAuth.getIsLoggedIn) {
    return { name: 'ConsumerLogin' }
  }
})

export default router