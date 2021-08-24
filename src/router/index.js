import { createRouter, createWebHashHistory } from 'vue-router'
import Index from '../views/Index.vue'
import ErrorPage from '../views/Error.vue'
import Dashboard from '../views/Dashboard/Index.vue'
import Home from '../views/Dashboard/Home.vue'
import Member from '../views/Dashboard/Member.vue'
import Goods from '../views/Dashboard/Goods.vue'
import Iou from '../views/Dashboard/Iou.vue'
import Balance from '../views/Dashboard/Balance.vue'

const routes = [{
  path: '/',
  name: 'Index',
  component: Index,
  meta: {
    requiresAuth: false
  }
}, {
  path: '/:pathMatch(.*)*',
  name: 'Error',
  component: ErrorPage,
}, {
  path: '/dashboard',
  name: 'Dashboard',
  component: Dashboard,
  redirect: '/dashboard/home',
  meta: {
    requiresAuth: true
  },
  children: [{
    path: 'home',
    name: 'Home',
    component: Home
  }, {
    path: 'member',
    name: 'Member',
    component: Member
  }, {
    path: 'goods',
    name: 'Goods',
    component: Goods
  }, {
    path: 'iou',
    name: 'Iou',
    component: Iou
  }, {
    path: 'balance',
    name: 'Balance',
    component: Balance
  }]
}]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return {
        savedPosition,
        behavior: 'smooth'
      }
    } else {
      return {
        x: 0, y: 0, behavior: 'smooth'
      }
    }
  }
})

// 路由守衛
router.beforeEach((to, from, next) => {
  function checkLoginStatus() {
    const isLogin = sessionStorage.getItem('token') === 'ImLogin';
    return isLogin;
  }

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!checkLoginStatus()) {
      next({ name: 'Error' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
