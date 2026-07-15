import { createRouter, createWebHistory } from 'vue-router'
import { getAdminRoutes } from './admin'
import { getPublicRoutes } from './public'
import { useAuthStore } from '@/store/admin/auth'
import { useConsumerAuthStore } from '@/store/consumer/auth'
import { useModulesStore } from '@/store/admin/modules'
import { usePublicModules } from '@/composables/publicModules'
import { config } from '@/config'

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
  if (!config.maintenance.bypass) return false
  return !!localStorage.getItem('pm_bypass_token')
}

router.beforeEach(async (to) => {
  const adminAuth = useAuthStore()
  const consumerAuth = useConsumerAuthStore()

  // --- Maintenance page: redirect away if maintenance is not active ---
  if (to.name === 'Maintenance') {
    if (config.maintenance.enabled && !checkMaintenanceBypass(to)) return
    const { fetchPublicModules, maintenance } = usePublicModules()
    await fetchPublicModules()
    if (!maintenance.value) return { name: 'Home' }
    return
  }

  // --- Env-based global maintenance: blocks everything including admin ---
  if (config.maintenance.enabled && !checkMaintenanceBypass(to)) {
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

// --- Document titles -------------------------------------------------------
// CMS pages (Home/DynamicPage/PagePreview) fetch their content and set their
// own meta titles; everything else gets a title here so it never shows the
// previous page's leftover.
const CMS_TITLED = new Set(['Home', 'DynamicPage', 'PagePreview'])

const ROUTE_TITLES = {
  PublicBlogs:            'Blog',
  PublicBlogPost:         'Blog',
  PublicRoadmap:          'Roadmap',
  ConsumerLogin:          'Sign in',
  ConsumerForgotPassword: 'Forgot password',
  ConsumerResetPassword:  'Reset password',
  ConsumerTasks:          'My tasks',
  ConsumerCalendar:       'Calendar',
  ConsumerProfile:        'Profile',
  Maintenance:            'Down for maintenance',
  Peppermint:             'Sign in',
  AdminForgotPassword:    'Forgot password',
  AdminResetPassword:     'Reset password',
  AdminProfile:           'Profile',
  AdminUsers:             'Team',
  TaskTypes:              'Task types',
  TaskStatuses:           'Task statuses',
  BlogCreate:             'New blog post',
  BlogEdit:               'Edit blog post',
  BlogCategories:         'Blog categories',
  RoadmapCategories:      'Roadmap categories',
  PageEditor:             'Page editor',
  FooterEditor:           'Footer editor',
  ContactSubmissions:     'Contact submissions',
}

router.afterEach((to) => {
  if (CMS_TITLED.has(to.name)) return

  const { siteName } = usePublicModules()
  // Admin screens brand as the panel; public screens brand as the site
  const base = to.meta.requiresAuth ? config.admin.name : (siteName.value || config.admin.name)
  const label = ROUTE_TITLES[to.name]
    ?? (typeof to.name === 'string' ? to.name.replace(/([a-z])([A-Z])/g, '$1 $2') : '')

  document.title = label && label !== base ? `${label} · ${base}` : base
})

export default router
