import { createRouter, createWebHistory } from 'vue-router'
import { getAdminRoutes } from './admin'
import { getPublicRoutes } from './public'
// import { useAuthStore } from '@/store/admin/auth'
// import { useConsumerAuthStore } from '@/store/frontend/consumerAuth'

const routes = [
  ...getAdminRoutes(),
  ...getPublicRoutes(),
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// router.beforeEach((to) => {
//   const adminAuth = useAuthStore()
//   const consumerAuth = useConsumerAuthStore()

//   if (to.meta.layout === 'admin') {
//     if (to.meta.requiresAuth && !adminAuth.getIsLoggedIn) {
//       return { name: 'Peppermint' }
//     }
//   }

//   if (to.meta.layout === 'frontend') {
//     if (to.meta.requiresAuth && !consumerAuth.getIsLoggedIn) {
//       return { name: 'Login' }
//     }
//   }
// })

export default router