import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/** note: sub-menu only appear when children.length>=1
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']    will control the page roles (you can set multiple roles)
    title: 'title'               the name show in sub-menu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if true, the page will no be cached(default is false)
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
    affix: true                  if true, the tag will affix in the tags-view
  }
**/

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 * */

const oAsyncRoutes = [
  // {
  //   path: '/DAGBoard',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/DAGBoard/index'),
  //       name: 'CRD编辑器',
  //       meta: { title: 'CRD编辑器', icon: 'user', affix: true }
  //     }
  //   ]
  // },
  {
    path: '/diagnosis',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/diagnosis/index'),
        name: 'diagnosis',
        meta: { title: '诊断编排', icon: 'layout', affix: true }
      }
    ]
  },
  {
    path: '/arrangeList',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/arrangeList/index'),
        name: 'arrangeList',
        meta: { title: '编排管理', icon: 'arrange', affix: true }
      }
    ]
  },
  {
    path: '/operation',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/operation/index'),
        name: 'operation',
        meta: { title: '操作管理', icon: 'operation', affix: true }
      }
    ]
  },

  // {
  //   path: '/userManage',
  //   component: Layout,
  //   redirect: '/userManage/userList',
  //   name: 'userManage',
  //   alwaysShow: true, // will always show the root menu
  //   meta: {
  //     title: 'CRD编辑器',
  //     icon: 'user',
  //     roles: ['Super Admin', 'EC', 'PR', 'CRM'] // you can set roles in root nav
  //   },
  //   children: [
  //     {
  //       path: 'userList',
  //       component: () => import('@/views/userManage/userList'),
  //       name: 'userList',
  //       meta: {
  //         title: 'CRD编辑器',
  //         roles: ['Super Admin', 'EC', 'PR', 'CRM'] // or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path: 'userListAdd/:id(\\d+)',
  //       component: () => import('@/views/userManage/userList-add'),
  //       name: 'userListAdd',
  //       meta: {
  //         title: 'userListAdd',
  //         noCache: true,
  //       },
  //       hidden: true
  //     },
  //   ]
  // },
  { path: '*', redirect: '/404', hidden: true }
]
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'home', noCache: true, affix: true }
      }
    ]
  },
  ...oAsyncRoutes
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
*/
export const asyncRoutes = [
  // ...oAsyncRoutes
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
