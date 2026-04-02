<template>
  <div class="common-layout">
    <el-container class="layout-container">
      <el-aside width="220px" class="aside">
        <div class="logo">海鲜仓储管理系统</div>
        <el-menu
          active-text-color="#ffd04b"
          background-color="#304156"
          class="el-menu-vertical"
          default-active="1"
          text-color="#fff"
          router
        >
          <el-menu-item index="/home">
            <el-icon><House /></el-icon>
            <span>首页概览</span>
          </el-menu-item>
          <el-sub-menu index="2">
            <template #title>
              <el-icon><Box /></el-icon>
              <span>库存管理</span>
            </template>
            <el-menu-item index="/stock-in">入库管理</el-menu-item>
            <el-menu-item index="/inventory">实时库存</el-menu-item>
          </el-sub-menu>
          <el-menu-item index="/supplier">
            <el-icon><User /></el-icon>
            <span>供应商管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header class="header">
          <div class="breadcrumb">首页 / 库存管理</div>
          <div class="user-info">
            <el-dropdown>
              <span class="el-dropdown-link">管理员 <el-icon><ArrowDown /></el-icon></span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>个人中心</el-dropdown-item>
                  <el-dropdown-item divided>退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>

        <el-main class="main-content">
          <router-view /> </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.layout-container { height: 100vh; }
.aside { background-color: #304156; color: white; }
.logo { height: 60px; line-height: 60px; text-align: center; font-weight: bold; font-size: 18px; border-bottom: 1px solid #1f2d3d; }
.header { border-bottom: 1px solid #dcdfe6; display: flex; align-items: center; justify-content: space-between; }
.main-content { background-color: #f0f2f5; }
</style>