<template>
  <div class="stock-out-container">
    <el-card class="search-box">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="出库单号">
          <el-input v-model="searchForm.orderNo" placeholder="请输入单号" clearable />
        </el-form-item>
        <el-form-item label="海鲜名称">
          <el-input v-model="searchForm.seafoodName" placeholder="请输入海鲜名" clearable />
        </el-form-item>
        <el-form-item label="出库日期">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            @change="handleDateChange"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleSearch">查询</el-button>
          <el-button icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin-top: 20px">
      <el-table :data="tableData" border stripe style="width: 100%" v-loading="loading">
        <el-table-column prop="orderNo" label="出库单号" width="180" align="center" />
        <el-table-column prop="seafoodName" label="海鲜品种" min-width="120" />
        <el-table-column prop="categoryName" label="分类" width="100" />
        <el-table-column prop="outQuantity" label="出库数量" width="120" align="right">
          <template #default="scope">
            <span style="font-weight: bold; color: #f56c6c">- {{ scope.row.outQuantity }} {{ scope.row.unit }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="outType" label="出库类型" width="120" align="center">
          <template #default="scope">
            <el-tag :type="getOutTypeTag(scope.row.outType)">
              {{ scope.row.outType }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="handler" label="操作员" width="120" />
        <el-table-column prop="createTime" label="出库时间" width="180" align="center" />
        <el-table-column prop="remark" label="备注" show-overflow-tooltip />
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { stockApi } from '../api/stock' // 假设你定义了库存接口

// --- 数据定义 ---
const loading = ref(false)
const tableData = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const dateRange = ref([])

const searchForm = reactive({
  orderNo: '',
  seafoodName: '',
  beginTime: '',
  endTime: ''
})

// --- 逻辑处理 ---

// 获取出库类型样式
const getOutTypeTag = (type) => {
  const map = {
    '销售出库': 'success',
    '损耗出库': 'danger',
    '调拨出库': 'warning',
    '退货出库': 'info'
  }
  return map[type] || ''
}

// 处理日期选择
const handleDateChange = (val) => {
  if (val) {
    searchForm.beginTime = val[0]
    searchForm.endTime = val[1]
  } else {
    searchForm.beginTime = ''
    searchForm.endTime = ''
  }
}

// 加载出库数据
const loadData = async () => {
  loading.value = true
  try {
    const params = {
      ...searchForm,
      pageNum: currentPage.value,
      pageSize: pageSize.value
    }
    const res = await stockApi.getStockOutList(params)
    if (res && res.code === 1) {
      tableData.value = res.data.records
      total.value = res.data.total
    }
  } catch (error) {
    console.error("加载出库记录失败", error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadData()
}

const resetSearch = () => {
  searchForm.orderNo = ''
  searchForm.seafoodName = ''
  searchForm.beginTime = ''
  searchForm.endTime = ''
  dateRange.value = []
  handleSearch()
}

const handleSizeChange = (val) => {
  pageSize.value = val
  loadData()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  loadData()
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.stock-out-container {
  padding: 10px;
}
.search-box {
  background-color: #fff;
}
.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>