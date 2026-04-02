<template>
  <div class="app-container" style="padding: 20px;">
    <el-card>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <b style="font-size: 18px;">采购订单管理</b>
        <el-button type="primary" icon="Plus" @click="dialogVisible = true">新增采购入库</el-button>
      </div>

      <el-table :data="tableData" border stripe v-loading="loading">
        <el-table-column prop="orderId" label="单号" width="80" align="center" />
        <el-table-column prop="planTitle" label="所属计划" show-overflow-tooltip />
        <el-table-column prop="seafoodName" label="采购品种" />
        <el-table-column prop="quantity" label="采购数量" width="120" align="center" />
        <el-table-column prop="totalAmount" label="总金额" width="120">
          <template #default="scope">
            <span style="color: #67c23a; font-weight: bold;">￥{{ scope.row.totalAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderStatus" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.orderStatus === 1 ? 'success' : 'info'">
              {{ scope.row.orderStatus === 1 ? '已完成' : '采购中' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" title="登记采购订单" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="采购海鲜">
          <el-select v-model="form.seafoodId" placeholder="选择品种" style="width: 100%">
            <el-option v-for="s in seafoods" :key="s.seafoodId" :label="s.name" :value="s.seafoodId" />
          </el-select>
        </el-form-item>
        <el-form-item label="采购数量">
          <el-input-number v-model="form.quantity" :min="1" style="width: 100%" />
        </el-form-item>
        <el-form-item label="总金额">
          <el-input v-model="form.totalAmount" type="number" placeholder="请输入本次采购花费" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确认入库</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { purchaseApi } from '@/api/purchase'
import { seafoodApi } from '@/api/seafood'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const tableData = ref([])
const seafoods = ref([])
const dialogVisible = ref(false)
const form = reactive({ seafoodId: null, quantity: 0, totalAmount: 0, orderStatus: 1, planId: 1 })

const loadData = async () => {
  loading.value = true
  const res = await purchaseApi.getList()
  if (res.code === 1) tableData.value = res.data
  loading.value = false
}

const submitForm = async () => {
  const res = await purchaseApi.add(form)
  if (res.code === 1) {
    ElMessage.success('采购记录已生成，库存已增加')
    dialogVisible.value = false
    loadData()
  }
}

onMounted(async () => {
  loadData()
  const sRes = await seafoodApi.getList()
  if (sRes.code === 1) seafoods.value = sRes.data
})
</script>