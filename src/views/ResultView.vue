<template>
  <div class="result-container" v-if="result">
    <div class="top-dashboard">
      <n-grid :x-gap="24" :y-gap="24" cols="1 800:2">
        
        <!-- 左侧：主要结论 -->
        <n-grid-item>
          <n-card class="result-card main-card">
            <div class="risk-display">
              <div class="chart-container" ref="gaugeRef"></div>
              <div class="risk-text">
                <div class="label">AI 评估风险等级</div>
                <div class="value" :class="riskColorClass">{{ result.risk_level }}</div>
                <div class="sub">置信度: {{ (result.confidence * 100).toFixed(1) }}%</div>
              </div>
            </div>
          </n-card>
        </n-grid-item>

        <!-- 右侧：模态贡献度 -->
        <n-grid-item>
          <n-card title="多模态决策贡献度 (TriMedTune)" class="result-card">
            <div class="chart-container" ref="radarRef"></div>
          </n-card>
        </n-grid-item>
      </n-grid>
    </div>

    <!-- 🌟 新增：可解释性视觉对比 (Grad-CAM) -->
    <n-grid :x-gap="24" :y-gap="24" cols="1 800:2" style="margin-top: 24px">
      <n-grid-item>
        <n-card title="原始医学影像输入 (Original Input)" class="result-card">
          <div style="height: 300px; display: flex; align-items: center; justify-content: center; background: #f3f4f6; border-radius: 8px; overflow: hidden;">
            <!-- 使用后端传来的 Base64，彻底规避浏览器 DICOM 不兼容问题 -->
            <img v-if="result.original_image_base64" 
                 :src="'data:image/png;base64,' + result.original_image_base64" 
                 style="max-width: 100%; max-height: 100%; object-fit: contain;" />
            <n-empty v-else description="无原始影像记录" />
          </div>
        </n-card>
      </n-grid-item>

      <!-- 修复右侧热力图 -->
      <n-grid-item>
        <n-card title="AI 决策关注区域 (Grad-CAM)" class="result-card">
          <template #header-extra><n-tag type="error" size="small">Heatmap</n-tag></template>
          <div style="height: 300px; display: flex; align-items: center; justify-content: center; background: #f3f4f6; border-radius: 8px; overflow: hidden; border: 2px solid #fee2e2;">
            <img v-if="result.grad_cam" 
                 :src="'data:image/png;base64,' + result.grad_cam" 
                 style="max-width: 100%; max-height: 100%; object-fit: contain;" />
            <n-empty v-else description="热力图生成失败或无影像输入" />
          </div>
        </n-card>
      </n-grid-item>
    </n-grid>

    <!-- 详情解释 -->
    <n-grid :x-gap="24" :y-gap="24" cols="1 800:3" style="margin-top: 24px">
      <n-grid-item span="2">
        <n-card title="AI 综合分析报告" class="result-card explanation-card">
          <template #header-extra>
            <n-tag type="success">MHKD-MVQA 生成</n-tag>
          </template>
          <p class="explanation-text">{{ result.explanation }}</p>
          
          <n-divider />
          
          <div class="findings">
            <h4>关键影像学征象 (Point, Detect, Count):</h4>
            <n-space>
              <n-tag v-for="tag in result.key_findings" :key="tag" type="warning" size="large" round>
                {{ tag }}
              </n-tag>
            </n-space>
          </div>
        </n-card>
      </n-grid-item>

      <n-grid-item span="1">
        <n-card title="数据可靠性评估" class="result-card">
           <div class="reliability-list">
             <div class="r-item">
               <span>影像质量</span>
               <n-progress type="line" :percentage="result.reliability.imaging * 100" status="info" />
             </div>
             <div class="r-item">
               <span>文本完整性</span>
               <n-progress type="line" :percentage="result.reliability.text * 100" status="warning" />
             </div>
             <div class="r-item">
               <span>因子一致性</span>
               <n-progress type="line" :percentage="result.reliability.risk * 100" status="success" />
             </div>
           </div>
           
           <n-button secondary type="primary" block style="margin-top: 40px" @click="$router.push('/')">
             返回重新分析
           </n-button>
        </n-card>
      </n-grid-item>
    </n-grid>
  </div>
  <div v-else class="empty-state">
    <n-empty description="暂无预测结果，请先上传数据">
      <template #extra>
        <n-button @click="$router.push('/')">去上传</n-button>
      </template>
    </n-empty>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, nextTick } from 'vue';
import { useDiagnosisStore } from '../stores/diagnosis';
import * as echarts from 'echarts';
import { NGrid, NGridItem, NCard, NTag, NDivider, NSpace, NProgress, NButton, NEmpty } from 'naive-ui';

const store = useDiagnosisStore();
const result = computed(() => store.result);
const gaugeRef = ref<HTMLElement | null>(null);
const radarRef = ref<HTMLElement | null>(null);

const riskColorClass = computed(() => {
  if (!result.value) return '';
  const level = result.value.risk_level;
  if (level === '极高危') return 'text-red';
  if (level === '高危') return 'text-orange';
  if (level === '中危') return 'text-yellow';
  return 'text-green';
});

const initCharts = () => {
  if (!result.value || !gaugeRef.value || !radarRef.value) return;

  const gaugeChart = echarts.init(gaugeRef.value);
  const prob = Number(result.value.prediction_prob.toFixed(3));
  
  let color = '#18a058';
  if (prob > 0.3) color = '#f0a020';
  if (prob > 0.6) color = '#d03050';
  if (prob > 0.85) color = '#d03050';

  gaugeChart.setOption({
    series: [{
      type: 'gauge',
      // 👇 已修复注释语法：强制定位在容器的正中心，稍微偏下，并缩小一点半径防止切边
      center: ['50%', '65%'], 
      radius: '90%',
      startAngle: 180,
      endAngle: 0,
      min: 0,
      max: 1,
      splitNumber: 5,
      itemStyle: { color: color },
      progress: { show: true, width: 30 },
      pointer: { show: false },
      axisLine: { lineStyle: { width: 30 } },
      axisTick: { show: false },
      splitLine: { length: 15, lineStyle: { width: 2, color: '#999' } },
      axisLabel: { distance: 25, color: '#999', fontSize: 12 },
      detail: {
        valueAnimation: true,
        formatter: function (value: number) {
          return value.toFixed(3);
        },
        color: '#333',
        fontSize: 42,
        offsetCenter: [0, '-15%']
      },
      data: [{ value: prob, name: '恶性概率' }],
      title: { offsetCenter: [0, '25%'], fontSize: 16 }
    }]
  });

  const radarChart = echarts.init(radarRef.value);
  const cont = result.value.contribution;
  
  radarChart.setOption({
    tooltip: { trigger: 'item' },
    legend: { top: '5%', left: 'center' },
    series: [
      {
        name: '模态贡献度',
        type: 'pie',
        // 👇 已修复注释语法：强制定位饼图中心，留出顶部 legend 的空间
        center: ['50%', '55%'], 
        radius: ['40%', '65%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        data: [
          { value: cont.imaging, name: '医学影像', itemStyle: { color: '#2080f0' } },
          { value: cont.llm_text, name: '临床文本', itemStyle: { color: '#f0a020' } },
          { value: cont.risk_model, name: '风险因子', itemStyle: { color: '#18a058' } }
        ]
      }
    ]
  });
  
  window.addEventListener('resize', () => {
    gaugeChart.resize();
    radarChart.resize();
  });
};

onMounted(() => {
  // 👇 已修复注释语法：增加 150ms 的延迟，确保外层容器完全布局完毕，彻底消除偏移
  setTimeout(() => {
    nextTick(() => {
      initCharts();
    });
  }, 150);
});
</script>

<style scoped>
.result-container {
  padding-bottom: 40px;
}
.result-card {
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.04);
  height: 100%;
}
.main-card {
  background: linear-gradient(145deg, #ffffff 0%, #f0f7ff 100%);
}
.chart-container {
  height: 300px;
  width: 100%;
}
.risk-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.risk-text {
  text-align: center;
  margin-top: -60px;
  z-index: 10;
}
.risk-text .label {
  font-size: 16px;
  color: #666;
}
.risk-text .value {
  font-size: 48px;
  font-weight: 800;
  line-height: 1.2;
}
.text-red { color: #d03050; text-shadow: 0 4px 12px rgba(208, 48, 80, 0.2); }
.text-orange { color: #f0a020; }
.text-yellow { color: #f0c020; }
.text-green { color: #18a058; }

.explanation-text {
  font-size: 16px;
  line-height: 1.8;
  color: #374151;
  background: #f9fafb;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid #2080f0;
}
.reliability-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 20px 0;
}
.r-item span {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #666;
}
.empty-state {
  margin-top: 100px;
}
</style>