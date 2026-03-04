
export const PeppermintRoutes = [
    {
        path: '/' + import.meta.env.VITE_MODULE_ADMIN_NAME,
        name: 'Peppermint',
        component: () => import('@/views/admin/Peppermint.vue'),
        meta: { 
            skipIfAuth: true,
            module: 'admin',
            excludeFromNav: true
        }
    }   
];