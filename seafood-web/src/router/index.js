import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/c'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue') // 注意路径和文件名大小写
  },
 {
  path:'/c',
  component: () => import('../views/admin.vue'),
  //redirect: 'c/product-list',
  children:[
    { path: 'product-list', component: () => import('../views/ProductList.vue') },
    { path: 'bad-record-container', component: () => import('../views/BadRecord.vue') } ,
    { path:'stock-out',component:()=>import('../views/StockOutList.vue')},
    { path:'product-type',component:()=>import('../views/Category.vue')},
    { path:'purchase-order',component:()=>import('../views/PurchaseOrder.vue')},
    { path: 'user-list',component: () => import('../views/User.vue')},
    { path: 'cost-list',component: () => import('../views/cost.vue')}
  ]
 }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router