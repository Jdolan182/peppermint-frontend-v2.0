import { DashboardRoutes } from "./dashboard"
import { PeppermintRoutes } from "./peppermint"

export function getAdminRoutes() {
  if (import.meta.env.VITE_MODULE_ADMIN !== 'true') return []

  const routes = [
    ...DashboardRoutes,
    ...PeppermintRoutes
  ]

//   if (import.meta.env.VITE_MODULE_BLOG_ENABLED === 'true') {
//     routes.push(...AdminRoutes)
//   }

  return routes
}