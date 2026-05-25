<template>
  <div class="home-container">
    <div class="page-header">
      <h1>多模态早期筛查诊断系统</h1>
      <p>
        <!-- 注意：如未引入 FontAwesome，这里的图标可能无法显示，可替换为 Naive UI Icon -->
        <i class="fas fa-dna fa-spin-pulse" style="margin-right:8px; color:#2080f0; --fa-animation-duration: 3s;"></i>
        融合 CVPR 2025 AdaCoMed 算法，提供医疗级乳腺癌风险评估与可解释性分析
      </p>
    </div>

    <n-grid :x-gap="24" :y-gap="24" cols="1 1000:3" item-responsive>
      
      <!-- 左侧列：Visual & Text Inputs & Heatmap Visualization -->
      <n-grid-item span="1">
        <n-space vertical size="large">
            <!-- 1. 影像上传 (增加 delay 动画类) -->
            <n-card title="医学影像数据 (Visual Modality)" hoverable class="panel-card delay-1">
              <template #header-extra>
                <n-tag type="info" size="small" round class="animated-tag">
                    DICOM/PNG
                </n-tag>
              </template>
              
              <n-upload
                multiple
                directory-dnd
                :max="4"
                list-type="image"
                v-model:file-list="store.images"
                accept=".dcm,application/dicom,image/png,image/jpeg,image/jpg"
                class="upload-area"
              >
                <n-upload-dragger class="custom-dragger">
                  <!-- 增加扫描线元素 -->
                  <div class="scan-line"></div>
                  
                  <div class="upload-content">
                    <div class="upload-icon">📷</div>
                    <n-text class="upload-title">拖拽上传 VinDr/私有数据</n-text>
                    <n-p depth="3" class="upload-hint">
                      支持 DICOM (.dcm) 原始协议<br>
                      兼容 PNG/JPG (Max 4)
                    </n-p>
                  </div>
                </n-upload-dragger>
              </n-upload>
            </n-card>

            <!-- 2. 文本报告 (增加 delay 动画类) -->
            <n-card title="临床报告文本 (Text Modality)" hoverable class="panel-card delay-2">
               <template #header-extra>
                   <n-tag type="warning" size="small" round class="animated-tag">
                       NLP Input
                   </n-tag>
               </template>
               <n-input
                 v-model:value="store.clinicalText"
                 type="textarea"
                 placeholder="请粘贴放射科 BI-RADS 描述、超声所见或患者主诉文本..."
                 :rows="6"
                 class="custom-textarea"
               />
            </n-card>

            <!-- 3. 热力图可视化模块 (增加 delay 动画类) -->
            <n-card title="模型可解释性 (Grad-CAM)" hoverable class="panel-card delay-3">
                <template #header-extra>
                    <n-tag :type="heatmapData ? 'success' : 'default'" size="small" round class="animated-tag">
                        {{ heatmapData ? 'Analysis Ready' : 'Waiting Input' }}
                    </n-tag>
                </template>
                
                <div class="heatmap-container">
                    <!-- 原图展示位 -->
                    <div class="heatmap-box" :class="{ active: !!heatmapData }">
                        <span class="heatmap-label">Original Input</span>
                        <div v-if="!heatmapData" class="empty-state">
                            <i class="fas fa-image" style="font-size: 24px; margin-bottom: 8px; display:block;"></i>
                            等待分析...
                        </div>
                        <img v-else :src="heatmapData.original" class="heatmap-placeholder-img" alt="Original" />
                    </div>
                    
                    <!-- 热力图展示位 -->
                    <div class="heatmap-box" :class="{ active: !!heatmapData }">
                        <span class="heatmap-label">Attention Map</span>
                        <div v-if="!heatmapData" class="empty-state">
                            <i class="fas fa-brain" style="font-size: 24px; margin-bottom: 8px; display:block;"></i>
                            等待模型推理
                        </div>
                        <div v-else style="width:100%; height:100%; position:relative;">
                             <img :src="heatmapData.original" class="heatmap-placeholder-img" alt="Heatmap Base" />
                             <!-- 这里将来会是后端返回的叠加图，目前用 CSS 模拟 -->
                             <div class="heatmap-overlay"></div>
                        </div>
                    </div>
                </div>
                <n-p depth="3" style="font-size: 12px; margin-top: 12px; margin-bottom: 0;">
                    <i class="fas fa-info-circle"></i> 
                    可视化区域显示模型在做出风险预测时关注的乳腺组织 ROI 区域 (Red = High Attention)。
                </n-p>
            </n-card>
        </n-space>
      </n-grid-item>

      <!-- 右侧列：风险因子表单 (增加 delay 动画类) -->
      <n-grid-item span="1 1000:2">
        <n-card title="患者风险因子数据 (Structured Data)" hoverable class="panel-card h-full delay-4">
           <template #header-extra>
               <n-tag type="error" size="small" round class="animated-tag">
                   Tabular Branch
               </n-tag>
           </template>
           
           <n-alert type="info" show-icon style="margin-bottom: 24px; background-color: rgba(240, 249, 255, 0.5);">
              请确保所有结构化数据录入准确，缺失值将由 AdaCoMed 算法自动进行均值填充。
           </n-alert>

           <n-form label-placement="left" label-width="140" size="large">
             <n-grid :x-gap="32" :y-gap="12" cols="1 700:2">
                <n-form-item-grid-item label="患者年龄 (Age)">
                  <n-input-number v-model:value="store.riskFactors.age" :min="18" :max="100" style="width: 100%" />
                </n-form-item-grid-item>
                <n-form-item-grid-item label="初潮年龄">
                  <n-input-number v-model:value="store.riskFactors.menarche_age" style="width: 100%" />
                </n-form-item-grid-item>
                
                <n-form-item-grid-item label="绝经年龄">
                  <n-input-number v-model:value="store.riskFactors.menopause_age" placeholder="未绝经留空" style="width: 100%" />
                </n-form-item-grid-item>
                <n-form-item-grid-item label="初次生育年龄">
                  <n-input-number v-model:value="store.riskFactors.first_birth_age" placeholder="未生育留空" style="width: 100%" />
                </n-form-item-grid-item>

                <n-form-item-grid-item label="生育次数">
                  <n-input-number v-model:value="store.riskFactors.births_count" :min="0" style="width: 100%" />
                </n-form-item-grid-item>
                <n-form-item-grid-item label="激素治疗(年)">
                  <n-input-number v-model:value="store.riskFactors.hormone_therapy_years" :min="0" style="width: 100%" />
                </n-form-item-grid-item>
             </n-grid>

             <n-divider dashed>
                <span style="color: #666; font-size: 14px;">遗传背景与既往病史 (Genetics & History)</span>
             </n-divider>

             <n-space vertical size="large">
                <div class="switch-row">
                  <div class="label-group">
                      <span style="font-weight: 500;">家族乳腺癌史</span>
                      <span style="font-size: 12px; color: #999; margin-left: 8px;">(一级亲属：母/女/姐妹)</span>
                  </div>
                  <n-switch v-model:value="store.riskFactors.family_history">
                    <template #checked>有家族史</template>
                    <template #unchecked>无家族史</template>
                  </n-switch>
                </div>

                <div class="switch-row">
                  <div class="label-group">
                      <span style="font-weight: 500;">BRCA1/2 基因突变</span>
                  </div>
                  <n-radio-group v-model:value="store.riskFactors.brca_mutation" name="brca">
                    <n-space>
                      <n-radio :value="true">阳性 (+)</n-radio>
                      <n-radio :value="false">阴性 (-)</n-radio>
                      <n-radio :value="(null as any)">未检测 (N/A)</n-radio>
                    </n-space>
                  </n-radio-group>
                </div>

                <div class="switch-row">
                  <div class="label-group">
                      <span style="font-weight: 500;">既往乳腺活检史</span>
                  </div>
                  <n-switch v-model:value="store.riskFactors.previous_biopsy">
                      <template #checked>有活检史</template>
                      <template #unchecked>无</template>
                  </n-switch>
                </div>
             </n-space>

             <div class="action-area">
                <!-- 动态按钮：绑定 class 处理 loading 态样式 -->
                <n-button 
                  type="primary" 
                  size="large" 
                  class="submit-btn" 
                  :class="{ 'is-loading': store.loading }"
                  :loading="store.loading"
                  @click="handleAnalyze"
                >
                  <template #icon>
                    <!-- 调整图标，loading 时隐藏静态图标 -->
                    <n-icon v-if="!store.loading"><i class="fas fa-bolt"></i></n-icon>
                  </template>
                  {{ store.loading ? '正在运算 Neural Networks...' : '启动多模态融合预测 (Run Prediction)' }}
                </n-button>
             </div>
           </n-form>
        </n-card>
      </n-grid-item>
    </n-grid>

    <!-- Loading Mask -->
    <n-modal v-model:show="store.loading" :mask-closable="false">
      <div class="loading-card">
        <n-spin size="large">
            <template #icon>
                <i class="fas fa-circle-notch fa-spin" style="color: #2080f0;"></i>
            </template>
        </n-spin>
        <div class="loading-text">
          <h3 style="font-size: 18px;">正在进行多模态 AdaCoMed 推理...</h3>
          <p>Analyzing Visual, Textual, and Tabular data streams</p>
        </div>
      </div>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDiagnosisStore } from '../stores/diagnosis';
import { useRouter } from 'vue-router';
import { 
  useMessage, NGrid, NGridItem, NCard, NUpload, NUploadDragger, NText, NP, NInput, 
  NTag, NForm, NFormItemGridItem, NInputNumber, NDivider, NSwitch, 
  NSpace, NRadioGroup, NRadio, NButton, NModal, NSpin, NAlert, NIcon
} from 'naive-ui';

const store = useDiagnosisStore();
const router = useRouter();
const message = useMessage();

const localHeatmapData = ref<any>(null);

const heatmapData = computed(() => {
    // @ts-ignore
    return store.heatmapData || localHeatmapData.value;
});

const handleAnalyze = async () => {
  if (store.images.length === 0 && !store.clinicalText) {
    message.warning("请至少上传影像或填写临床报告");
    return;
  }
  
  try {
    // 1. 调用状态管理中的分析接口
    await store.submitAnalysis();
    
    // 2. 核心修复：直接向 store.result 挂载本地预览图
    if (store.result && store.images && store.images.length > 0) {
        // 兼容 Naive UI 的 file 对象结构
        const uploadFile = store.images[0].file || store.images[0]; 
        if (uploadFile instanceof File || uploadFile instanceof Blob) {
            // 使用 (store.result as any) 绕过 TS 检查，直接挂载
            (store.result as any).original_image_url = URL.createObjectURL(uploadFile);
        }
    }
    
    message.success("预测完成！风险评估报告已生成");
    router.push('/result');
  } catch (e) {
    console.error(e);
    message.error("预测服务连接失败，请检查后端状态");
  }
};
</script>

<style scoped>
/* ================= 动态背景与基础设定 ================= */

/* 定义流体渐变动画关键帧 */
@keyframes gradientBG {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

/* 定义浮入动画 */
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

/* 定义呼吸闪烁动画 */
@keyframes pulseGlow {
    0% { box-shadow: 0 0 0 0 rgba(32, 128, 240, 0.4); }
    70% { box-shadow: 0 0 0 6px rgba(32, 128, 240, 0); }
    100% { box-shadow: 0 0 0 0 rgba(32, 128, 240, 0); }
}

/* 将原先 body 的样式应用到最外层容器 
   使用 min-height: 100vh 确保占满全屏
*/
.home-container {
    max-width: 100%;
    margin: 0 auto;
    padding: 20px 40px 60px 40px; /* 增加内边距 */
    min-height: 100vh;
    box-sizing: border-box;
    
    /* 动态背景设置 */
    background-color: #f0f2f5; 
    background-image: 
        radial-gradient(at 0% 0%, rgba(200, 220, 255, 0.5) 0px, transparent 50%),
        radial-gradient(at 100% 0%, rgba(255, 200, 220, 0.4) 0px, transparent 50%),
        radial-gradient(at 100% 100%, rgba(200, 255, 240, 0.4) 0px, transparent 50%),
        linear-gradient(125deg, #eff6ff 0%, #dbeafe 50%, #e0e7ff 100%);
    background-size: 400% 400%;
    animation: gradientBG 20s ease infinite;
    background-attachment: fixed;
}

.page-header {
    margin-bottom: 30px;
    text-align: left;
    position: relative;
    padding-left: 16px;
    animation: fadeInUp 0.8s ease-out;
}

/* 装饰条增加微弱的光效流动 */
.page-header::before {
    content: '';
    position: absolute;
    left: 0;
    top: 5px;
    bottom: 5px;
    width: 4px;
    background: linear-gradient(to bottom, #2080f0, #18a058);
    border-radius: 2px;
    box-shadow: 0 0 8px rgba(32, 128, 240, 0.5);
}

.page-header h1 {
    font-size: 34px;
    font-weight: 700;
    margin-bottom: 8px;
    margin-top: 0;
    
    /* 渐变背景 */
    background: -webkit-linear-gradient(315deg, #1d4e89 0%, #00b09b 100%);
    background: linear-gradient(135deg, #1d4e89 0%, #00b09b 100%); /* 补充标准渐变语法 */
    
    /* 裁剪背景到文本 */
    -webkit-background-clip: text;
    background-clip: text; /* 核心修复点：补充标准规范属性 */
    
    /* 文本透明，漏出底层背景 */
    -webkit-text-fill-color: transparent;
    color: transparent; /* 补充标准规范属性 */
    
    text-shadow: 0 2px 10px rgba(32, 128, 240, 0.1);
    letter-spacing: 1px;
}

.page-header p {
    color: #556677;
    margin: 0;
    font-size: 16px;
    font-weight: 400;
    display: flex;
    align-items: center;
}

/* ================= 卡片动效增强 ================= */

.panel-card {
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.04), 0 2px 6px rgba(0,0,0,0.02);
    background: rgba(255, 255, 255, 0.75); 
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.6);
    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
    animation: fadeInUp 1s ease-out forwards;
    opacity: 0; /* 初始隐藏，由 animation 控制显示 */
}

.delay-1 { animation-delay: 0.1s; }
.delay-2 { animation-delay: 0.2s; }
.delay-3 { animation-delay: 0.3s; }
.delay-4 { animation-delay: 0.4s; }

.panel-card:hover {
    transform: translateY(-4px) scale(1.005);
    box-shadow: 0 20px 40px rgba(32, 128, 240, 0.12);
    border-color: rgba(32, 128, 240, 0.3);
    background: rgba(255, 255, 255, 0.9); 
}

.h-full { height: 100%; }

/* ================= 上传区域扫描动效 ================= */

@keyframes scanMove {
    0% { top: 0; opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { top: 100%; opacity: 0; }
}

.custom-dragger {
    background-color: rgba(248, 250, 252, 0.5);
    border: 2px dashed #cbd5e1;
    transition: all 0.3s ease;
    padding: 40px 0;
    border-radius: 12px;
    width: 100%;
    cursor: pointer;
    display: flex;
    justify-content: center;
    position: relative;
    overflow: hidden;
}

.scan-line {
    position: absolute;
    left: 10%;
    right: 10%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #2080f0, transparent);
    box-shadow: 0 0 8px #2080f0;
    animation: scanMove 3s linear infinite;
    pointer-events: none;
    z-index: 1;
}

.custom-dragger:hover {
    border-color: #2080f0;
    background-color: rgba(240, 247, 255, 0.8);
}
.upload-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
    width: 100%;
    z-index: 2;
}
.upload-icon {
    font-size: 52px;
    margin-bottom: 4px;
    filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
    transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.custom-dragger:hover .upload-icon {
    transform: scale(1.15) rotate(-5deg);
}
.upload-title {
    font-size: 16px;
    font-weight: 600;
    color: #334155;
}
.upload-hint {
    font-size: 13px;
    color: #64748b;
    line-height: 1.6;
    text-align: center;
    margin: 0 !important;
}

:deep(.n-upload-file-list .n-upload-file) {
    background-color: rgba(255, 255, 255, 0.9);
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    margin-top: 12px;
    padding: 10px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.02);
    transition: all 0.3s;
}
:deep(.n-upload-file-list .n-upload-file:hover) {
    background-color: #fff;
    transform: translateX(4px);
}

/* ================= 热力图模块动效 ================= */

@keyframes pulseBorder {
    0% { border-color: #e2e8f0; }
    50% { border-color: #2080f0; box-shadow: 0 0 10px rgba(32, 128, 240, 0.2); }
    100% { border-color: #e2e8f0; }
}

.heatmap-container {
    display: flex;
    gap: 16px;
    margin-top: 16px;
}
.heatmap-box {
    flex: 1;
    background: #f1f5f9;
    border-radius: 8px;
    aspect-ratio: 1; 
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #e2e8f0;
    transition: all 0.3s;
}

.heatmap-box.active {
    animation: pulseBorder 3s infinite;
    border: 1px solid #93c5fd;
}

.heatmap-label {
    position: absolute;
    top: 8px;
    left: 8px;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
    backdrop-filter: blur(4px);
    z-index: 10;
}
.heatmap-placeholder-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s;
}
.heatmap-box:hover .heatmap-placeholder-img {
    transform: scale(1.05);
}

.heatmap-overlay {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    background: radial-gradient(circle at 70% 30%, rgba(255, 0, 0, 0.5) 0%, rgba(255, 255, 0, 0.3) 25%, transparent 60%);
    mix-blend-mode: multiply;
    pointer-events: none;
    animation: pulseGlow 4s infinite alternate; 
    opacity: 0.9;
}
.empty-state {
    color: #94a3b8;
    text-align: center;
    font-size: 12px;
}

.animated-tag {
    animation: pulseGlow 3s infinite;
}

/* ================= 表单与按钮动效 ================= */

.switch-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(249, 250, 251, 0.5); 
    padding: 14px 16px;
    border-radius: 10px;
    border: 1px solid transparent;
    transition: all 0.3s;
}
.switch-row:hover {
    border-color: #e2e8f0;
    background: rgba(255, 255, 255, 0.9);
    transform: translateX(4px);
}

.action-area {
    margin-top: 40px;
    display: flex;
    justify-content: center;
}

@keyframes shine {
    0% { background-position: 0% 50%; }
    100% { background-position: 100% 50%; }
}

.submit-btn {
    width: 100%;
    height: 56px !important; 
    font-size: 18px !important;
    font-weight: 700 !important;
    border-radius: 12px !important;
    border: none !important;
    color: white !important;
    
    background: linear-gradient(90deg, #2080f0, #18a058, #2080f0) !important;
    background-size: 200% auto !important;
    animation: shine 4s linear infinite !important;
    
    box-shadow: 0 4px 14px rgba(32, 128, 240, 0.3) !important;
    transition: transform 0.2s, box-shadow 0.2s, filter 0.2s !important;
    position: relative;
    overflow: hidden;
}

.submit-btn::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 60%);
    opacity: 0;
    transform: scale(0.5);
    transition: opacity 0.3s, transform 0.3s;
}

.submit-btn:hover {
    transform: scale(1.02);
    box-shadow: 0 8px 25px rgba(32, 128, 240, 0.5) !important;
    filter: brightness(1.1);
}
.submit-btn:hover::after {
    opacity: 1;
    transform: scale(1);
}

.submit-btn:active {
    transform: scale(0.98);
}

.submit-btn.is-loading {
    cursor: wait;
    animation: shine 1s linear infinite !important;
    filter: saturate(0.8);
}

.loading-card {
    background: rgba(255, 255, 255, 0.95);
    padding: 48px;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    box-shadow: 0 20px 50px rgba(0,0,0,0.15);
    backdrop-filter: blur(10px);
}
.loading-text h3 { margin: 0 0 8px 0; color: #333; }
.loading-text p { margin: 0; color: #888; }

.custom-textarea textarea {
    min-height: 120px;
    background-color: rgba(255, 255, 255, 0.5) !important;
    transition: background-color 0.3s;
}
.custom-textarea textarea:focus {
    background-color: white !important;
}
</style>