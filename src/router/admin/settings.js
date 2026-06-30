import { Cog6ToothIcon } from '@heroicons/vue/24/outline'

export const SettingsRoutes = [
  {
    path: '/' + import.meta.env.VITE_MODULE_ADMIN_NAME.toLowerCase() + '/settings',
    meta: {
      requiresAuth: true,
      layout: 'admin',
      icon: Cog6ToothIcon,
      nav: 'Settings',
    },
    children: [
      {
        path: '',
        name: 'Settings',
        component: () => import('@/views/admin/settings/Settings.vue'),
      },
    ],
  },
]
