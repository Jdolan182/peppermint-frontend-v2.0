import { UserGroupIcon } from '@heroicons/vue/24/outline'

export const TeamRoutes = [
  {
    path: '/' + import.meta.env.VITE_MODULE_ADMIN_NAME.toLowerCase() + '/team/users',
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
