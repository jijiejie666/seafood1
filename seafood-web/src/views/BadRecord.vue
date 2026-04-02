s<template>
  <div class="bad-record-container">
    <el-card class="filter-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="报损日期">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleSearch">查询</el-button>
          <el-button icon="Refresh" @click="resetSearch">重置</el-button>
          <el-button type="danger" icon="Plus" @click="handleAdd">新增报损登记</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin-top: 20px">
      <el-table :data="tableData" border stripe v-loading="loading" style="width: 100%">
        <el-table-column prop="damageId" label="单号" width="80" align="center" />
        <el-table-column prop="seafoodName" label="海鲜品种" min-width="120" />
        <el-table-column prop="quantity" label="报损数量" width="120" align="center">
          <template #default="scope">
            <span class="loss-num">- {{ scope.row.quantity }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="reason" label="报损原因" show-overflow-tooltip />
        <el-table-column prop="reportTime" label="上报时间" width="180" align="center" />
        <el-table-column prop="handlerName" label="操作人" width="120" align="center" />
        <el-table-column label="状态" width="100" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'warning'">
              {{ scope.row.status === 1 ? '已确认' : '待处理' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" title="新增报损登记" width="500px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="报损海鲜" prop="seafoodId">
          <el-select v-model="form.seafoodId" placeholder="请选择海鲜品种" style="width: 100%">
            <el-option
              v-for="item in seafoodOptions"
              :key="item.seafoodId"
              :label="item.name + ' (当前库存: ' + item.stockLower + ')'"
              :value="item.seafoodId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="报损数量" prop="quantity">
          <el-input-number v-model="form.quantity" :min="0.1" :precision="2" style="width: 100%" />
        </el-form-item>
        <el-form-item label="原因说明" prop="reason">
          <el-input v-model="form.reason" type="textarea" placeholder="请输入报损具体原因（如死亡、腐烂等）" rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { damageApi } from '@/api/damage'   // 稍后创建这个 API 文件
import { seafoodApi } from '@/api/seafood' // 复用之前的海鲜列表接口

// --- 数据定义 ---
const loading = ref(false)
const tableData = ref([])
const seafoodOptions = ref([])
const dialogVisible = ref(false)
const formRef = ref(null)

const searchForm = reactive({ dateRange: [] })

const form = reactive({
  seafoodId: null,
  quantity: 0,
  reason: '',
  status: 1 // 默认为已确认
})

const rules = {
  seafoodId: [{ required: true, message: '请选择海鲜', trigger: 'change' }],
  quantity: [{ required: true, message: '请输入报损数量', trigger: 'blur' }],
  reason: [{ required: true, message: '请填写原因', trigger: 'blur' }]
}

// --- 方法逻辑 ---

// 加载报损记录列表
const loadData = async () => {
  loading.value = true
  try {
    const res = await damageApi.getList()
    if (res.code === 1) {
      tableData.value = res.data
    }
  } catch (error) {
    console.error("加载报损列表失败", error)
  } finally {
    loading.value = false
  }
}

// 获取海鲜品种（供弹窗选择）
const fetchSeafoodOptions = async () => {
  const res = await seafoodApi.getList()
  if (res.code === 1) {
    seafoodOptions.value = res.data
  }
}

const handleSearch = () => { loadData() }
const resetSearch = () => { searchForm.dateRange = []; loadData() }

const handleAdd = () => {
  Object.assign(form, { 
    seafoodId: null, 
    quantity: 0, 
    reason: '', 
    status: 1,
    warehouseId: 1 // 补上这个字段
  })
  fetchSeafoodOptions()
  dialogVisible.value = true
}

const submitForm = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      const res = await damageApi.add(form)
      if (res.code === 1) {
        ElMessage.success('报损登记成功，库存已更新')
        dialogVisible.value = false
        loadData()
      }
    }
  })
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.bad-record-container { padding: 20px; }
.filter-card { margin-bottom: 20px; }
.loss-num { color: #f56c6c; font-weight: bold; }
</style>