<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <div class="login-header">
          <h2>海鲜仓库管理系统</h2>
          <p>Seafood WMS System</p>
        </div>
      </template>
      
      <el-form :model="loginForm" :rules="rules" ref="loginRef">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="账号" prefix-icon="User" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="密码" prefix-icon="Lock" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login-btn" @click="handleLogin" :loading="loading">
            登 录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import request from '../utils/request' 

const router = useRouter()
const loading = ref(false)
const loginRef = ref(null)

const loginForm = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const handleLogin = () => {
  loginRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const res = await request.post('/api/user/login', loginForm)
        ElMessage.success('登录成功')
        localStorage.setItem('userInfo', JSON.stringify(res.data))
        router.push('/home')
      } catch (error) {
        console.error('登录请求失败', error)
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1d2b3a 0%, #304156 100%);
}
.login-card { width: 400px; }
.login-header { text-align: center; }
.login-btn { width: 100%; }
</style>