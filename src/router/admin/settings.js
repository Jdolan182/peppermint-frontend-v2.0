import { Cog6ToothIcon } from '@heroicons/vue/24/outline'
import { config } from '@/config'

export const SettingsRoutes = [
  {
    path: '/' + config.admin.slug + '/settings',
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
