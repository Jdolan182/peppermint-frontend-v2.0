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