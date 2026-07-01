import { DashboardRoutes } from "./dashboard"
import { PeppermintRoutes } from "./peppermint"
import { ConsumerRoutes } from "./consumers"
import { TeamRoutes } from "./team"
import { SettingsRoutes } from "./settings"
import { BlogRoutes } from "./blogs"
import { PagesRoutes } from "./pages"

export function getAdminRoutes() {
  if (import.meta.env.VITE_MODULE_ADMIN !== 'true') return []

  const routes = [
    ...DashboardRoutes,
    ...PeppermintRoutes,
  ]

  if (import.meta.env.VITE_MODULE_CONSUMERS === 'true') {
    routes.push(...ConsumerRoutes)
  }

  if (import.meta.env.VITE_MODULE_TEAM === 'true') {
    routes.push(...TeamRoutes)
  }

  if (import.meta.env.VITE_MODULE_SETTINGS === 'true') {
    routes.push(...SettingsRoutes)
  }

  if (import.meta.env.VITE_MODULE_BLOGS === 'true') {
    routes.push(...BlogRoutes)
  }

  if (import.meta.env.VITE_MODULE_PAGES === 'true') {
    routes.push(...PagesRoutes)
  }

  return routes
}
