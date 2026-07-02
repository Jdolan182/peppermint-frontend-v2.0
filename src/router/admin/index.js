import { DashboardRoutes } from "./dashboard"
import { PeppermintRoutes } from "./peppermint"
import { ConsumerRoutes } from "./consumers"
import { TeamRoutes } from "./team"
import { SettingsRoutes } from "./settings"
import { BlogRoutes } from "./blogs"
import { PagesRoutes } from "./pages"
import { TasksRoutes } from "./tasks"
import { RoadmapRoutes } from "./roadmap"
import { CalendarRoutes } from "./calendar"

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

  if (import.meta.env.VITE_MODULE_TASKS === 'true') {
    routes.push(...TasksRoutes)
  }

  if (import.meta.env.VITE_MODULE_ROADMAP === 'true') {
    routes.push(...RoadmapRoutes)
  }

  if (import.meta.env.VITE_MODULE_TASKS === 'true' || import.meta.env.VITE_MODULE_ROADMAP === 'true') {
    routes.push(...CalendarRoutes)
  }

  return routes
}
