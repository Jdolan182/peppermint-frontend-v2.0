import { config } from '@/config'

export const TasksRoutes = [
  {
    path: '/' + config.admin.slug + '/tasks',
    meta: {
      requiresAuth: true,
      layout: 'admin',
      module: 'tasks',
    },
    children: [
      {
        path: '',
        name: 'Tasks',
        component: () => import('@/views/admin/tasks/TasksIndex.vue'),
      },
      {
        path: 'types',
        name: 'TaskTypes',
        component: () => import('@/views/admin/tasks/TaskTypesSettings.vue'),
      },
      {
        path: 'statuses',
        name: 'TaskStatuses',
        component: () => import('@/views/admin/tasks/TaskStatusesSettings.vue'),
      },
    ],
  },
]
