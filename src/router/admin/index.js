import { config } from '@/config'
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
  if (!config.modules.admin) return []

  const routes = [
    ...DashboardRoutes,
    ...PeppermintRoutes,
  ]

  if (config.modules.consumers) {
    routes.push(...ConsumerRoutes)
  }

  if (config.modules.team) {
    routes.push(...TeamRoutes)
  }

  if (config.modules.settings) {
    routes.push(...SettingsRoutes)
  }

  if (config.modules.blogs) {
    routes.push(...BlogRoutes)
  }

  if (config.modules.pages) {
    routes.push(...PagesRoutes)
  }

  if (config.modules.tasks) {
    routes.push(...TasksRoutes)
  }

  if (config.modules.roadmap) {
    routes.push(...RoadmapRoutes)
  }

  if (config.modules.tasks || config.modules.roadmap) {
    routes.push(...CalendarRoutes)
  }

  return routes
}
