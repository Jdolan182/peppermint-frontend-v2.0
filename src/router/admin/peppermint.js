
import { config } from '@/config'
const adminBase = '/' + config.admin.slug

export const PeppermintRoutes = [
    {
        path: adminBase,
        name: 'Peppermint',
        component: () => import('@/views/admin/Peppermint.vue'),
        meta: {
            skipIfAuth: true,
            module: 'admin',
            excludeFromNav: true
        }
    },
    {
        path: adminBase + '/forgot-password',
        name: 'AdminForgotPassword',
        component: () => import('@/views/admin/auth/AdminForgotPassword.vue'),
        meta: { skipIfAuth: true, module: 'admin' },
    },
    {
        path: adminBase + '/reset-password',
        name: 'AdminResetPassword',
        component: () => import('@/views/admin/auth/AdminResetPassword.vue'),
        meta: { skipIfAuth: true, module: 'admin' },
    },
    {
        path: adminBase + '/profile',
        name: 'AdminProfile',
        component: () => import('@/views/admin/profile/AdminProfile.vue'),
        meta: {
            requiresAuth: true,
            layout: 'admin',
        }
    },
];