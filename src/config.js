const env = import.meta.env

export const config = {
  apiUrl: (env.VITE_API_URL ?? 'http://localhost/').replace(/\/$/, ''),

  admin: {
    name:          env.VITE_MODULE_ADMIN_NAME ?? 'Peppermint',
    slug:          (env.VITE_MODULE_ADMIN_NAME ?? 'peppermint').toLowerCase(),
    dashboardName: env.VITE_MODULE_ADMIN_DASHBOARD_NAME ?? 'Dashboard',
  },

  maintenance: {
    enabled: env.VITE_MAINTENANCE_MODE === 'true',
    bypass:  env.VITE_MAINTENANCE_BYPASS === 'true',
  },

  modules: {
    admin:          env.VITE_MODULE_ADMIN === 'true',
    public:         env.VITE_MODULE_PUBLIC === 'true',
    public_login:   env.VITE_MODULE_PUBLIC_LOGIN === 'true',
    consumers:      env.VITE_MODULE_CONSUMERS === 'true',
    team:           env.VITE_MODULE_TEAM === 'true',
    settings:       env.VITE_MODULE_SETTINGS === 'true',
    blogs:          env.VITE_MODULE_BLOGS === 'true',
    pages:          env.VITE_MODULE_PAGES === 'true',
    tasks:          env.VITE_MODULE_TASKS === 'true',
    tasks_consumer: env.VITE_MODULE_TASKS === 'true',
    roadmap:        env.VITE_MODULE_ROADMAP === 'true',
    roadmap_public: env.VITE_MODULE_ROADMAP === 'true',
  },
}
