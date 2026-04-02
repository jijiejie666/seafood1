<template>
  <div class="app-container">
    <el-card>
      <el-form :inline="true" :model="queryParams" class="demo-form-inline">
        <el-form-item label="核算期间">
          <el-input v-model="queryParams.period" placeholder="如: 2024-03" clearable />
        </el-form-item>
        <el-form-item label="海鲜ID">
          <el-input v-model="queryParams.seafoodId" placeholder="请输入海鲜ID" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Plus" type="success" @click="handleAdd">新增成本核算</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="costList" border v-loading="loading">
        <el-table-column prop="accountingId" label="核算ID" width="80" align="center" />
        <el-table-column prop="seafoodId" label="海鲜ID" width="100" align="center" />
        <el-table-column prop="period" label="核算期间" align="center" />
        <el-table-column prop="totalPurchaseCost" label="总采购成本">
          <template #default="scope">¥ {{ scope.row.totalPurchaseCost }}</template>
        </el-table-column>
        <el-table-column prop="totalDamageLoss" label="总损耗金额">
          <template #default="scope">¥ {{ scope.row.totalDamageLoss }}</template>
        </el-table-column>
        <el-table-column prop="avgCost" label="平均成本" align="center">
          <template #default="scope">
            <el-tag type="warning">¥ {{ scope.row.avgCost }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="180" align="center" />
        <el-table-column label="操作" width="120" align="center">
          <template #default="scope">
            <el-button link type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog title="新增成本核算" v-model="open" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="海鲜ID">
          <el-input-number v-model="form.seafoodId" :min="1" />
        </el-form-item>
        <el-form-item label="核算期间">
          <el-date-picker v-model="form.period" type="month" value-format="YYYY-MM" placeholder="选择月份" style="width: 100%" />
        </el-form-item>
        <el-form-item label="总采购成本">
          <el-input v-model="form.totalPurchaseCost" placeholder="0.00">
            <template #prefix>¥</template>
          </el-input>
        </el-form-item>
        <el-form-item label="总损耗金额">
          <el-input v-model="form.totalDamageLoss" placeholder="0.00">
            <template #prefix>¥</template>
          </el-input>
        </el-form-item>
        <el-form-item label="计算平均成本">
          <el-button type="info" size="small" @click="calculateAvg">点击自动计算</el-button>
          <div v-if="form.avgCost" style="margin-left: 10px; color: #E6A23C; font-weight: bold;">
            结果: ¥ {{ form.avgCost }}
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="open = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确认提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { costApi } from '@/api/cost'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const costList = ref([])
const open = ref(false)
const queryParams = reactive({ period: '', seafoodId: null })
const form = reactive({ seafoodId: null, period: '', totalPurchaseCost: 0, totalDamageLoss: 0, avgCost: 0 })

const loadData = async () => {
  loading.value = true
  const res = await costApi.getList({ ...queryParams })
  if (res.code === 1) costList.value = res.data
  loading.value = false
}

const handleQuery = () => loadData()

const handleAdd = () => {
  Object.assign(form, { seafoodId: null, period: '', totalPurchaseCost: 0, totalDamageLoss: 0, avgCost: 0 })
  open.value = true
}

// 自动计算逻辑：(采购成本 + 损耗) / 数量，这里简化为两项相加
const calculateAvg = () => {
  const total = parseFloat(form.totalPurchaseCost || 0) + parseFloat(form.totalDamageLoss || 0)
  form.avgCost = total.toFixed(2)
}

const submitForm = async () => {
  if (!form.avgCost) calculateAvg()
  const res = await costApi.add(form)
  if (res.code === 1) {
    ElMessage.success('核算成功')
    open.value = false
    loadData()
  }
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确定删除该核算记录吗？').then(async () => {
    await costApi.delete(row.accountingId)
    loadData()
  })
}

onMounted(loadData)
</script>