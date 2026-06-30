import { createRouter, createWebHistory } from 'vue-router'
import { getAdminRoutes } from './admin'
import { getPublicRoutes } from './public'
import { useAuthStore } from '@/store/admin/auth'
import { useConsumerAuthStore } from '@/store/consumer/auth'
import { useModulesStore } from '@/store/admin/modules'
import { usePublicModules } from '@/composables/publicModules'

const routes = [
  ...getAdminRoutes(),
  ...getPublicRoutes(),
  // Always registered — needed even when public module is off or MAINTENANCE_MODE is set
  {
    path: '/maintenance',
    name: 'Maintenance',
    component: () => import('@/views/public/MaintenancePage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

function checkMaintenanceBypass(to) {
  const pwd = import.meta.env.VITE_MAINTENANCE_PASSWORD
  if (!pwd) return false
  if (to.query.bypass === pwd) {
    localStorage.setItem('maintenance_bypass', pwd)
  }
  return localStorage.getItem('maintenance_bypass') === pwd
}

router.beforeEach(async (to) => {
  const adminAuth = useAuthStore()
  const consumerAuth = useConsumerAuthStore()

  // --- Maintenance page: redirect away if maintenance is not active ---
  if (to.name === 'Maintenance') {
    if (import.meta.env.VITE_MAINTENANCE_MODE === 'true' && !checkMaintenanceBypass(to)) return
    const { fetchPublicModules, maintenance } = usePublicModules()
    await fetchPublicModules()
    if (!maintenance.value) return { name: 'Home' }
    return
  }

  // --- Env-based global maintenance: blocks everything including admin ---
  if (import.meta.env.VITE_MAINTENANCE_MODE === 'true' && !checkMaintenanceBypass(to)) {
    return { name: 'Maintenance' }
  }

  // --- Auth guards ---
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

  // --- Module guards ---
  if (!to.meta.module) return

  if (to.meta.requiresAuth) {
    // Admin route — check admin modules store (env + DB)
    const modulesStore = useModulesStore()
    if (!modulesStore.loaded) {
      await modulesStore.fetch()
    }
    if (!modulesStore.isEnabled(to.meta.module)) {
      return { name: 'Dashboard' }
    }
  } else {
    // Public route — fetch module states (30s cache, shared with header)
    const { fetchPublicModules, isPublicModuleEnabled, maintenance } = usePublicModules()
    await fetchPublicModules()

    // DB-based maintenance: redirect all public navigation to maintenance page
    if (maintenance.value && !checkMaintenanceBypass(to) && to.name !== 'Maintenance') {
      return { name: 'Maintenance' }
    }

    if (!isPublicModuleEnabled(to.meta.module)) {
      // Whole public site is off — show nothing (blank page)
      if (to.meta.module === 'public') return false
      // Specific module off but site is on — go to home
      return { name: 'Home' }
    }
  }
})

export default router
