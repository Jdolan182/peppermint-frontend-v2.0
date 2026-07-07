import { config } from '@/config'
import { HomeRoutes } from "./home"
import { ConsumerAuthRoutes } from "./auth"
import { PublicBlogRoutes } from "./blogs"

export function getPublicRoutes() {
  if (!config.modules.public) return []

  const routes = [
    ...HomeRoutes,
    ...ConsumerAuthRoutes,
  ]

  if (config.modules.blogs) {
    routes.push(...PublicBlogRoutes)
  }

  if (config.modules.roadmap) {
    routes.push({
      path: '/roadmap',
      name: 'PublicRoadmap',
      component: () => import('@/views/public/roadmap/PublicRoadmap.vue'),
      meta: { layout: 'public', module: 'roadmap' },
    })
  }

  if (config.modules.tasks) {
    routes.push({
      path: '/my-tasks',
      name: 'ConsumerTasks',
      component: () => import('@/views/consumer/ConsumerTasks.vue'),
      meta: { layout: 'public', requiresConsumerAuth: true, module: 'tasks_consumer' },
    })
    routes.push({
      path: '/my-calendar',
      name: 'ConsumerCalendar',
      component: () => import('@/views/consumer/ConsumerCalendar.vue'),
      meta: { layout: 'public', requiresConsumerAuth: true, module: 'tasks_consumer' },
    })
  }

  if (config.modules.consumers) {
    routes.push({
      path: '/profile',
      name: 'ConsumerProfile',
      component: () => import('@/views/consumer/ConsumerProfile.vue'),
      meta: { layout: 'public', requiresConsumerAuth: true },
    })
  }

  if (config.modules.pages) {
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