import { UserGroupIcon } from '@heroicons/vue/24/outline'
import { config } from '@/config'

export const TeamRoutes = [
  {
    path: '/' + config.admin.slug + '/team/users',
    meta: {
      requiresAuth: true,
      layout: 'admin',
      module: 'team',
      icon: UserGroupIcon,
      nav: 'Admin Users',
    },
    children: [
      {
        path: '',
        name: 'AdminUsers',
        component: () => import('@/views/admin/team/AdminUsers.vue'),
      },
    ],
  },
]
