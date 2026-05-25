<template>
  <div class="history-container animate-fade-up">
    <n-card title="诊断历史记录" class="table-card">
      <n-data-table
        :columns="columns"
        :data="store.history"
        :pagination="pagination"
        :bordered="false"
      />
    </n-card>
  </div>
</template>

<script setup lang="ts">
// 🚨 致命修复：必须引入 h 函数！
import { onMounted, h } from 'vue'; 
import { useDiagnosisStore } from '../stores/diagnosis';
import { NCard, NDataTable, NTag } from 'naive-ui';

const store = useDiagnosisStore();

const columns = [
  {
    title: '诊断时间',
    key: 'timestamp',
    render: (row: any) => new Date(row.timestamp).toLocaleString()
  },
  {
    title: '风险等级',
    key: 'risk_level',
    render(row: any) {
      const type = row.risk_level === '极高危' ? 'error' : row.risk_level === '高危' ? 'warning' : 'success';
      // 这里用到了 h，所以顶部必须 import
      return h(NTag, { type, bordered: false }, { default: () => row.risk_level });
    }
  },
  {
    title: '恶性概率',
    key: 'prediction_prob',
    render: (row: any) => (row.prediction_prob * 100).toFixed(1) + '%'
  },
  {
    title: '关键发现',
    key: 'key_findings',
    render: (row: any) => {
      // 增加安全校验，防止没数据时报错
      if (!row.key_findings || !Array.isArray(row.key_findings)) return '暂无';
      return row.key_findings.slice(0, 2).join(', ') + (row.key_findings.length > 2 ? '...' : '');
    }
  }
];

const pagination = { pageSize: 10 };

onMounted(() => {
  store.loadHistory();
});
</script>

<style scoped>
.history-container {
  padding: 20px 0;
}

.table-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
}

/* 🌟 丝滑浮现动画 */
.animate-fade-up {
  animation: fadeInUp 0.5s ease-out forwards;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>