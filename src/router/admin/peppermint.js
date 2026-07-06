
export const PeppermintRoutes = [
    {
        path: '/' + import.meta.env.VITE_MODULE_ADMIN_NAME.toLowerCase(),
        name: 'Peppermint',
        component: () => import('@/views/admin/Peppermint.vue'),
        meta: {
            skipIfAuth: true,
            module: 'admin',
            excludeFromNav: true
        }
    },
    {
        path: '/' + import.meta.env.VITE_MODULE_ADMIN_NAME.toLowerCase() + '/profile',
        name: 'AdminProfile',
        component: () => import('@/views/admin/profile/AdminProfile.vue'),
        meta: {
            requiresAuth: true,
            layout: 'admin',
        }
    },
];