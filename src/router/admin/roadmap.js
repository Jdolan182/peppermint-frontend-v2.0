import { config } from '@/config'

export const RoadmapRoutes = [
  {
    path: '/' + config.admin.slug + '/roadmap',
    meta: {
      requiresAuth: true,
      layout: 'admin',
      module: 'roadmap',
    },
    children: [
      {
        path: '',
        name: 'Roadmap',
        component: () => import('@/views/admin/roadmap/RoadmapIndex.vue'),
      },
      {
        path: 'categories',
        name: 'RoadmapCategories',
        component: () => import('@/views/admin/roadmap/RoadmapCategoriesSettings.vue'),
      },
    ],
  },
]
