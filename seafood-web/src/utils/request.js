import axios from 'axios'
import { ElMessage } from 'element-plus'

// 1. 创建实例 (建议将 baseURL 改为 /api 以配合 Vite 代理)
const request = axios.create({
    // 如果你配置了 vite 代理，这里建议写 '/api'
    // 如果没配代理且直接跨域，就保留 'http://localhost:8080'
    baseURL: '', 
    timeout: 5000
})

// 2. 请求拦截器 (可选，以后加 Token 用)
request.interceptors.request.use(
    config => {
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// 3. 响应拦截器
request.interceptors.response.use(
    response => {
        const res = response.data
        // 兼容处理：后端 code 可能是数字 200 或字符串 "200"
        if (res.code == 1) {
            return res
        } else {
            ElMessage.error(res.msg || '服务器异常')
            return Promise.reject(new Error(res.msg || 'Error'))
        }
    },
    error => {
        console.error('网络请求错误:', error)
        ElMessage.error('网络连接失败，请检查后端是否启动')
        return Promise.reject(error)
    }
)

// 4. 关键点：导出名称必须与定义的变量名一致！
export default request