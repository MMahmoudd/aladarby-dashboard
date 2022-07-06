
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,

  routes: [
    // Login
    {
      name: 'Login',
      path: '/login',
      component: () => import('@/pages/login'),
    },
    {
      name: 'Inter Phone Number',
      path: '/ResetPassword',
      component: () => import('@/pages/ResetPassword/EnterPhone'),
    },
    {
      name: 'Inter Code',
      path: '/enterCode',
      component: () => import('@/pages/ResetPassword/RessetCode'),
    },
    {
      name: 'Enter New Password',
      path: '/enterPass',
      component: () => import('@/pages/ResetPassword/NewPassword'),
    },
    {
      path: '/',
      meta: { requiresAuth: true },
      redirect: '/',
      component: () => import('@/views/dashboard/Index'),
      children: [
        // Dashboard
        {
          name: 'Dashboard',
          path: '/',
          component: () => import('@/views/dashboard/Dashboard'),
          meta: { requiresAuth: true },
        },
        // Pending Drivers
        {
          name: 'Pending Drivers',
          path: '/pending-drivers',
          component: () => import('@/views/dashboard/pending/pendingDrivers'),
          meta: { requiresAuth: true },
        },
        // Rejected Drivers On CIT
        {
          name: 'Rejected Drivers On CIT',
          path: '/rejected-on-CIT',
          component: () => import('@/views/dashboard/pending/pendingOnCIT'),
          meta: { requiresAuth: true },
        },
        // Pending Cars
        {
          name: 'Pending Cars',
          path: '/pending-cars',
          component: () => import('@/views/dashboard/pending/pendingCars'),
          meta: { requiresAuth: true },
        },
        // Pending Verification
        {
          name: 'Pending Verification',
          path: '/pending-verification',
          component: () => import('@/views/dashboard/pending/pendingVerification'),
          meta: { requiresAuth: true },
        },
        // All Drivers
        {
          name: 'All Drivers',
          path: '/all-drivers',
          component: () => import('@/views/dashboard/users/allDrivers'),
          meta: { requiresAuth: true },
        },
        // All Users
        {
          name: 'All Users',
          path: '/all-users',
          component: () => import('@/views/dashboard/users/allUsers'),
          meta: { requiresAuth: true },
        },
        // All Cars
        {
          name: 'All Cars',
          path: '/all-cars',
          component: () => import('@/views/dashboard/tables/allCars'),
          meta: { requiresAuth: true },
        },
        // Tickets
        {
          name: 'Tickets',
          path: '/tickets',
          component: () => import('@/views/dashboard/tickets/Tickets'),
          meta: { requiresAuth: true },
        },
        {
          name: 'Ticket Type',
          path: '/tickets-type',
          component: () => import('@/views/dashboard/tickets/TicketType'),
          meta: { requiresAuth: true },
        },
        // Pricing
        {
          name: 'Pricing',
          path: '/Pricing',
          component: () => import('@/views/dashboard/pricing/Pricing'),
          meta: { requiresAuth: true },
        },
        // payment
        // debts
        {
          name: 'Ammount for Drivers',
          path: '/debts',
          component: () => import('@/views/dashboard/payment/ForDrivers'),
          meta: { requiresAuth: true },
        },
        {
          name: 'Ammounts For App',
          path: '/for-app',
          component: () => import('@/views/dashboard/payment/ForApp'),
          meta: { requiresAuth: true },
        },
        {
          name: 'Confirm Transfers',
          path: '/transfers',
          component: () => import('@/views/dashboard/payment/Transfers'),
          meta: { requiresAuth: true },
        },
        // Blocked Drivers
        {
          name: 'Blocked Drivers',
          path: '/Blocked-drivers',
          component: () => import('@/views/dashboard/blocked/blockedDrivers'),
          meta: { requiresAuth: true },
        },
        // Blocked Users
        {
          name: 'Blocked Clints',
          path: '/blocked-users',
          component: () => import('@/views/dashboard/blocked/blockedUsers'),
          meta: { requiresAuth: true },
        },
        // Blocked Cars
        {
          name: 'Blocked Cars',
          path: '/blocked-cars',
          component: () => import('@/views/dashboard/blocked/blockedCars'),
          meta: { requiresAuth: true },
        },
        // app setting
        {
          name: 'App Setting',
          path: '/app-setting',
          component: () => import('@/views/dashboard/appSetting/AppSetting'),
          meta: { requiresAuth: true },
        },
        // tracking Shipment
        {
          name: 'Tracking Shipment',
          path: '/shipment',
          component: () => import('@/views/dashboard/shipment/shipment'),
          meta: { requiresAuth: true },
        },
        // Rejected Drivers
        {
          name: 'Rejected Drivers',
          path: '/rejected-drivers',
          component: () => import('@/views/dashboard/rejected/rejectedDrivers'),
          meta: { requiresAuth: true },
        },
        // transactions History
        {
          name: 'transaction history',
          path: '/transaction-history',
          component: () => import('@/views/dashboard/payment/history'),
          meta: { requiresAuth: true },
        },
        // Shipmint Package
        {
          name: 'Shipment Type',
          path: '/shipment-type',
          component: () => import('@/views/dashboard/shipment/shipment-type'),
          meta: { requiresAuth: true },
        },
        // pending shipment
        {
          name: 'Pending Shipment',
          path: '/pending-shipment',
          component: () => import('@/views/dashboard/shipment/pending-shipment'),
          meta: { requiresAuth: true },
        },
        // pending shipment
        {
          name: 'Rejected Shipment',
          path: '/rejected-shipment',
          component: () => import('@/views/dashboard/shipment/rejected-shipment'),
          meta: { requiresAuth: true },
        },
        // pending shipment
        {
          name: 'About App',
          path: '/about-app',
          component: () => import('@/views/dashboard/aboutApp/about-app'),
          meta: { requiresAuth: true },
        },
        // pending shipment
        {
          name: 'Change Password',
          path: '/change-password',
          component: () => import('@/views/dashboard/account-setting/changePassword'),
          meta: { requiresAuth: true },
        },

        { path: '*', redirect: '/login' },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth) {
    if (!token) {
      next({
        name: 'Login',
      })
    } else {
      return next()
    }
  } else {
    next()
  }
})

export default router
