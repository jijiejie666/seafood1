<template>
  <el-container class="layout-container">
    
    <el-aside width="220px">
      <div class="logo">海鲜 WMS 管理端</div>
      <el-menu 
        :default-active="$route.path" 
        class="el-menu-vertical"
        background-color="#304156"
        text-color="#fff"
        active-text-color="#ffd04b"
        router
      >
        <el-menu-item index="/home">
          <el-icon><House /></el-icon>
          <span>系统首页</span>
        </el-menu-item>

        <el-sub-menu index="1">
          <template #title>
            <el-icon><Menu /></el-icon>
            <span>海鲜管理</span>
          </template>
          <el-menu-item index="/c/product-list">库存</el-menu-item>
          <el-menu-item index="/c/stock-out">出库查询</el-menu-item>
          <el-menu-item index="/c/product-in">入库管理</el-menu-item>
          <el-menu-item index="/c/product-type">品类管理</el-menu-item>
          <el-menu-item index="/c/bad-record-container">查看报损</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="2">
          <template #title>
            <el-icon><List /></el-icon>
            <span>订单管理</span>
          </template>
          <el-menu-item index="/c/purchase-order">采购订单</el-menu-item>
          
        </el-sub-menu>

        <el-sub-menu index="3">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>员工管理</span>
          </template>
          <el-menu-item index="/c/user-list">员工信息</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="4">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>成本</span>
          </template>
          <el-menu-item index="/c/cost-list">核算成本</el-menu-item>
        </el-sub-menu>

      </el-menu>

       
    </el-aside>

    <el-container>
      <el-header>
        <div class="header-left">仓库后台系统</div>
        <div class="header-right">
          <el-dropdown>
            <span class="user-info">
              管理员：{{ adminName }} <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人中心</el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { House, Menu, List, Setting, ArrowDown } from '@element-plus/icons-vue'

const router = useRouter()
const adminName = ref('管理员')

// 页面加载时从缓存拿用户名
onMounted(() => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
  if (userInfo.realName) {
    adminName.value = userInfo.realName
  }
})

const handleLogout = () => {
  localStorage.removeItem('userInfo')
  router.push('/login')
}
</script>

<style scoped>
.layout-container { height: 100vh; }
.el-aside { background-color: #304156; transition: width 0.3s; }
.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  background-color: #2b2f3a;
}
.el-menu { border-right: none; }
.el-header {
  background-color: #fff;
  color: #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e6e6e6;
  height: 60px;
}
.user-info { cursor: pointer; color: #409EFF; font-weight: bold; }
.el-main { background-color: #f0f2f5; padding: 20px; }
</style>