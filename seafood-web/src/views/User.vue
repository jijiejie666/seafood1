<template>
  <div class="app-container">
    <el-card>
      <el-form :inline="true" :model="queryParams" class="demo-form-inline">
        <el-form-item label="员工姓名">
          <el-input v-model="queryParams.realName" placeholder="请输入真实姓名" clearable />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="queryParams.role" placeholder="全部角色" clearable>
            <el-option label="管理员" value="admin" />
            <el-option label="库管员" value="warehouse" />
            <el-option label="采购员" value="purchaser" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Plus" type="success" @click="handleAdd">新增员工</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="userList" border v-loading="loading">
        <el-table-column prop="userId" label="ID" width="80" align="center" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="realName" label="真实姓名" />
        <el-table-column prop="phone" label="联系电话" />
        <el-table-column prop="role" label="角色" align="center">
          <template #default="scope">
            <el-tag>{{ scope.row.role }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="scope">
            <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" @change="handleStatusChange(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template #default="scope">
            <el-button link type="primary" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog :title="title" v-model="open" width="500px">
      <el-form ref="userRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入登录账号" :disabled="!!form.userId" />
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="form.realName" placeholder="请输入员工真实姓名" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role" placeholder="请选择角色" style="width: 100%">
            <el-option label="管理员" value="admin" />
            <el-option label="库管员" value="warehouse" />
            <el-option label="采购员" value="purchaser" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="open = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { userApi } from '@/api/user'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const userList = ref([])
const open = ref(false)
const title = ref('')
const queryParams = reactive({ realName: '', role: '' })
const form = reactive({ userId: null, username: '', realName: '', phone: '', role: '', status: 1 })
const handleQuery = () => {
  loadData();
}

const loadData = async () => {
loading.value = true
  const res = await userApi.getList({ ...queryParams }) // 这里加个解构更保险
  if (res.code === 1) {
    userList.value = res.data
  }
  loading.value = false
}

const handleAdd = () => {
  Object.assign(form, { userId: null, username: '', realName: '', phone: '', role: 'warehouse', status: 1 })
  title.value = '新增员工信息'
  open.value = true
}

const submitForm = async () => {
  const res = form.userId ? await userApi.update(form) : await userApi.add(form)
  if (res.code === 1) {
    ElMessage.success('操作成功')
    open.value = false
    loadData()
  }
}
// 打开编辑弹窗
const handleUpdate = (row) => {
  // 1. 重置表单，防止残留数据
  resetForm()
  // 2. 将当前行数据克隆到 form 对象中
  // 使用展开运算符 { ...row } 是为了解构，防止修改弹窗时直接影响表格数据
  Object.assign(form, { ...row })
  // 3. 设置弹窗标题并打开
  title.value = '修改员工信息'
  open.value = true
}
// 建议增加一个重置表单的方法，保持代码整洁
const resetForm = () => {
  Object.assign(form, {
    userId: null,
    username: '',
    realName: '',
    phone: '',
    role: '',
    status: 1
  })
}
const handleDelete = (row) => {
  ElMessageBox.confirm('确定删除该员工吗？').then(async () => {
    await userApi.delete(row.userId)
    loadData()
  })
}
const handleStatusChange = async (row) => {
  try {
    const res = await userApi.update({
      userId: row.userId,
      status: row.status
    })
    if (res.code === 1) {
      ElMessage.success('状态更新成功')
    } else {
      // 如果后端失败，把前端开关状态切回去
      row.status = row.status === 1 ? 0 : 1
      ElMessage.error(res.msg || '状态更新失败')
    }
  } catch (error) {
    row.status = row.status === 1 ? 0 : 1
    ElMessage.error('网络错误')
  }
}
onMounted(loadData)
</script>