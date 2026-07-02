export const CalendarRoutes = [
  {
    path: '/' + import.meta.env.VITE_MODULE_ADMIN_NAME.toLowerCase() + '/calendar',
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
