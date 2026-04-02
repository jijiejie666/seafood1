<template>
  <div class="product-container">
    <el-card class="search-box">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="海鲜名称">
          <el-input v-model="searchForm.name" placeholder="请输入名称" clearable @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item label="种类">
          <el-select v-model="searchForm.categoryId" placeholder="请选择" style="width: 150px" clearable>
            <el-option 
              v-for="item in categoryOptions" 
              :key="item.categoryId" 
              :label="item.name" 
              :value="item.categoryId" 
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleSearch">查询</el-button>
          <el-button icon="Plus" type="success" @click="handleAdd">新增入库</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin-top: 20px">
  <el-table :data="tableData" border stripe style="width: 100%" v-loading="loading">
    <el-table-column prop="seafoodId" label="编号" width="80" align="center" />
    <el-table-column prop="name" label="海鲜品种" />
    <el-table-column prop="categoryName" label="分类" width="120" />
    <el-table-column prop="spec" label="规格" width="120" />
    
    <el-table-column prop="salePrice" label="参考售价" width="120">
      <template #default="scope">￥{{ scope.row.salePrice }}</template>
    </el-table-column>

    <el-table-column label="库存状态" width="120">
      <template #default="scope">
        <el-tooltip :content="scope.row.stockLower < 10 ? '库存偏低' : '库存正常'" placement="top">
          <el-tag :type="scope.row.stockLower < 10 ? 'danger' : 'success'" effect="dark">
            {{ scope.row.stockLower }} {{ scope.row.unit || '斤' }}
          </el-tag>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="200" align="center">
      <template #default="scope">
        <el-button size="small" type="primary" link @click="handleEdit(scope.row)">编辑</el-button>
        <el-button size="small" type="danger" link @click="handleDelete(scope.row.seafoodId)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="海鲜名称" required>
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="所属分类" required>
          <el-select v-model="form.categoryId" placeholder="请选择分类" style="width: 100%">
            <el-option 
              v-for="item in categoryOptions" 
              :key="item.categoryId" 
              :label="item.name" 
              :value="item.categoryId" 
            />
          </el-select>
        </el-form-item>
        <el-form-item label="规格">
          <el-input v-model="form.spec" placeholder="如：500g-700g" />
        </el-form-item>
        <el-form-item label="单位">
          <el-input v-model="form.unit" placeholder="斤 / 份 / 个" />
        </el-form-item>
        <el-form-item label="售价">
          <el-input-number v-model="form.salePrice" :min="0" :precision="2" style="width: 100%" />
        </el-form-item>
        <el-form-item label="当前数量">
          <el-input-number v-model="form.stockLower" :min="0" style="width: 100%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveProduct">确定保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { seafoodApi } from '../api/seafood'
import { categoryApi } from '../api/category'

// --- 数据定义 ---
const loading = ref(false)
const tableData = ref([])
const categoryOptions = ref([]) 
const dialogVisible = ref(false)
const dialogTitle = ref('新增海鲜')
const formRef = ref(null) // 用于表单校验重置

const searchForm = reactive({ name: '', categoryId: null })

// 初始化一个空白表单模版
const initialForm = {
  seafoodId: null, 
  name: '', 
  categoryId: null, 
  spec: '',
  unit: '斤', 
  purchasePrice: 0, 
  salePrice: 0, 
  stockUpper: 100, 
  stockLower: 0
}
const form = reactive({ ...initialForm })

// --- 核心方法 ---

// 0. 加载分类列表
const loadCategories = async () => {
  try {
    const res = await categoryApi.getList()
    // 注意：根据你之前的响应结构，判断 res.code
    if (res && res.code == 1) {
      // 如果后端返回的是分页对象，用 res.data.records；如果是列表，用 res.data
      categoryOptions.value = Array.isArray(res.data) ? res.data : (res.data.records || [])
    }
  } catch (error) {
    console.error("加载分类失败", error)
  }
}

// 1. 获取海鲜列表
const loadData = async () => {
  loading.value = true
  try {
    const res = await seafoodApi.getList(searchForm)
    if (res && res.code == 1) {
      // 兼容 MyBatis-Plus 分页结果和普通 List 结果
      const data = res.data.records || res.data
      tableData.value = Array.isArray(data) ? data : []
    }
  } catch (error) {
    ElMessage.error("数据加载失败")
  } finally {
    loading.value = false
  }
}

const handleSearch = () => { loadData() }

// 重置搜索
const resetSearch = () => {
  searchForm.name = ''
  searchForm.categoryId = null
  loadData()
}

// 2. 新增处理
const handleAdd = () => {
  dialogTitle.value = '新增入库'
  // 彻底重置表单对象
  Object.assign(form, initialForm)
  dialogVisible.value = true
}

// 3. 编辑处理
const handleEdit = (row) => {
  dialogTitle.value = '修改信息'
  dialogVisible.value = true
  // 延迟赋值，确保 DOM 渲染完成（可选）
  nextTick(() => {
    Object.assign(form, row)
  })
}

// 4. 保存提交
const saveProduct = async () => {
  // 1. 校验
  if (!form.name.trim()) return ElMessage.warning('海鲜名称不能为空')
  if (!form.categoryId) return ElMessage.warning('请选择所属分类')

  loading.value = true
  try {
    // 2. 根据是否存在 seafoodId 判断是调用 update 还是 save
    let res;
    if (form.seafoodId) {
      // 执行修改
      res = await seafoodApi.updateSeafood(form) 
    } else {
      // 执行新增
      res = await seafoodApi.save(form)
    }
      
    // 3. 处理结果
    if (res && res.code == 1) {
      ElMessage.success('操作成功')
      dialogVisible.value = false
      loadData() // 刷新列表
    } else {
      ElMessage.error(res.msg || '操作失败')
    }
  } catch (error) {
    console.error("保存异常", error)
    ElMessage.error("系统响应异常")
  } finally {
    loading.value = false
  }
}

// 5. 删除处理
const handleDelete = (id) => {
  ElMessageBox.confirm(
    '此操作将永久删除该记录，是否继续？',
    '危险操作提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error',
    }
  ).then(async () => {
    try {
      const res = await seafoodApi.deleteById(id) // 确保 API 中方法名一致
      if (res && res.code == 1) {
        ElMessage.success('删除成功')
        loadData()
      }
    } catch (error) {
      ElMessage.error("删除失败，可能存在关联单据")
    }
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// --- 初始化 ---
onMounted(() => {
  loadCategories() 
  loadData()      
})
</script>