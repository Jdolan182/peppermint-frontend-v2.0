import { HomeRoutes } from "./home"
import { ConsumerAuthRoutes } from "./auth"
import { PublicBlogRoutes } from "./blogs"

export function getPublicRoutes() {
  if (import.meta.env.VITE_MODULE_PUBLIC !== 'true') return []

  const routes = [
    ...HomeRoutes,
    ...ConsumerAuthRoutes,
  ]

  if (import.meta.env.VITE_MODULE_BLOGS === 'true') {
    routes.push(...PublicBlogRoutes)
  }

  if (import.meta.env.VITE_MODULE_ROADMAP === 'true') {
    routes.push({
      path: '/roadmap',
      name: 'PublicRoadmap',
      component: () => import('@/views/public/roadmap/PublicRoadmap.vue'),
      meta: { layout: 'public', module: 'roadmap' },
    })
  }

  if (import.meta.env.VITE_MODULE_TASKS === 'true') {
    routes.push({
      path: '/my-tasks',
      name: 'ConsumerTasks',
      component: () => import('@/views/consumer/ConsumerTasks.vue'),
      meta: { layout: 'public', requiresConsumerAuth: true },
    })
  }

  if (import.meta.env.VITE_MODULE_PAGES === 'true') {
    routes.push({
      path: '/preview/:id',
      name: 'PagePreview',
      component: () => import('@/views/public/pages/PagePreview.vue'),
      meta: { layout: 'public', module: 'public' },
    })

    // Catch-all — must be last so named routes take priority
    routes.push({
      path: '/:slug',
      name: 'DynamicPage',
      component: () => import('@/views/public/pages/DynamicPage.vue'),
      meta: { layout: 'public', module: 'pages' },
    })
  }

  return routes
}