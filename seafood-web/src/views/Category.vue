<template>
  <div class="category-container">
    <el-card>
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="品类名称">
          <el-input v-model="searchForm.name" placeholder="请输入品类名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="loadData">查询</el-button>
          <el-button icon="Plus" type="success" @click="handleAdd">新增品类</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" border style="width: 100%; margin-top: 20px" v-loading="loading">
        <el-table-column prop="categoryId" label="编号" width="100" align="center" />
        <el-table-column prop="name" label="品类名称" />
        <el-table-column prop="parentId" label="上级编号" width="120" align="center" />
        <el-table-column label="操作" width="200" align="center">
          <template #default="scope">
            <el-button size="small" type="primary" link @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" link @click="handleDelete(scope.row.categoryId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="400px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="品类名称" required>
          <el-input v-model="form.name" placeholder="如：贝类、鱼类" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { categoryApi } from '@/api/category'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const tableData = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('')
const searchForm = reactive({ name: '' })
const form = reactive({ categoryId: null, name: '', parentId: 0 })

const loadData = async () => {
  loading.value = true
  try {
    const res = await categoryApi.getList()
    if (res.code === 1) {
      tableData.value = res.data
    }
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  dialogTitle.value = '新增品类'
  Object.assign(form, { categoryId: null, name: '', parentId: 0 })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑品类'
  Object.assign(form, row)
  dialogVisible.value = true
}

const submitForm = async () => {
  if (!form.name) return ElMessage.warning('名称不能为空')
  const res = form.categoryId ? await categoryApi.update(form) : await categoryApi.add(form)
  if (res.code === 1) {
    ElMessage.success('保存成功')
    dialogVisible.value = false
    loadData()
  }
}

const handleDelete = (id) => {
  ElMessageBox.confirm('确定删除该品类吗？', '提asd示', { type: 'warning' }).then(async () => {
    const res = await categoryApi.deleteById(id)
    if (res.code === 1) {
      ElMessage.success('删除成功')
      loadData()
    }
  })
}

onMounted(() => { loadData() })
</script>