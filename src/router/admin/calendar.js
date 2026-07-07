import { config } from '@/config'

export const CalendarRoutes = [
  {
    path: '/' + config.admin.slug + '/calendar',
    meta: {
      requiresAuth: true,
      layout: 'admin',
    },
    children: [
      {
        path: '',
        name: 'Calendar',
        component: () => import('@/views/admin/calendar/CalendarView.vue'),
      },
    ],
  },
]
