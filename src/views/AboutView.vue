<template>
  <div class="about-container">
    <div class="about-header animate-fade-up">
      <h1 class="main-title">BESS</h1>
      <h2 class="sub-title">Breast Cancer Early Screening System</h2>
      <p class="tagline">基于多模态大模型的下一代乳腺癌智能早筛平台</p>
    </div>

    <div class="content-grid">
      <div class="tech-section">
        <h3 class="section-title">核心技术支撑 (Core Technologies)</h3>
        <p class="section-desc">
          本项目深度融合了 2025 年计算机视觉与医学影像领域的最新顶会成果，实现了从单一模态向多模态协作推理的跨越。
        </p>

        <div class="tech-card tech-stagger-1">
          <div class="card-header">
            <span class="number">01</span>
            <span class="badge">CVPR</span>
          </div>
          <div class="card-title">AdaCoMed: Adaptive Co-training for Medical Vision-Language Models</div>
          <div class="card-year">2025</div>
        </div>

        <div class="tech-card tech-stagger-2">
          <div class="card-header">
            <span class="number">02</span>
            <span class="badge">DIPCA</span>
          </div>
          <div class="card-title">TriMedTune: Tri-Branch Independent Inference for Risk Assessment</div>
          <div class="card-year">2025</div>
        </div>

        <div class="tech-card tech-stagger-3">
          <div class="card-header">
            <span class="number">03</span>
            <span class="badge">JBHI</span>
          </div>
          <div class="card-title">MHKD-MVQA: Hierarchical Knowledge Distillation in Medical VQA</div>
          <div class="card-year">2025</div>
        </div>

        <div class="tech-card tech-stagger-4">
          <div class="card-header">
            <span class="number">04</span>
            <span class="badge">EMBC</span>
          </div>
          <div class="card-title">Point, Detect, Count: Multi-task Understanding in Mammography</div>
          <div class="card-year">2025</div>
        </div>

        <div class="tech-card tech-stagger-5">
          <div class="card-header">
            <span class="number">05</span>
            <span class="badge">IEEE TCCI</span>
          </div>
          <div class="card-title">Review of Multimodal Medical Image Fusion Techniques</div>
          <div class="card-year">2025</div>
        </div>

        <div class="tech-card tech-stagger-6">
          <div class="card-header">
            <span class="number">06</span>
            <span class="badge">IoT</span>
          </div>
          <div class="card-title">Large Multimodal Models for Gastrointestinal Tumor Detection</div>
          <div class="card-year">2025</div>
        </div>
      </div>

      <div class="team-section">
        <h3 class="section-title">项目团队 (Team)</h3>
        
        <div class="team-card stagger-1">
          <div class="avatar">
            <svg viewBox="0 0 24 24" width="32" height="32" stroke="#2080f0" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
          </div>
          <div class="info">
            <div class="role">项目负责人</div>
            <div class="name">徐正坤</div>
            <div class="desc">
              北京邮电大学人工智能学院 智能医学工程专业。负责 BESS 系统架构全栈开发、核心算法模型复现与多模态数据融合优化。
            </div>
          </div>
        </div>

        <div class="team-card stagger-2">
          <div class="avatar">
            <svg viewBox="0 0 24 24" width="32" height="32" stroke="#2080f0" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
          </div>
          <div class="info">
            <div class="role">指导教师</div>
            <div class="name">侯瑞</div>
            <div class="desc">
              北京邮电大学预聘副教授 / 硕、博导。主要研究方向为医学图像智能分析与多模态大模型融合。为本项目提供医学影像大模型构建、跨模态语义理解及可解释性评估的理论指导与支持。
            </div>
          </div>
        </div>

        <div class="team-card stagger-3">
          <div class="avatar">
            <svg viewBox="0 0 24 24" width="32" height="32" stroke="#2080f0" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
          </div>
          <div class="info">
            <div class="role">临床医学顾问</div>
            <div class="name">特邀专家</div>
            <div class="desc">
              三甲附属医院乳腺外科资深主治医师。出于临床数据双盲测试与隐私保护协议。负责提供真实临床诊疗先验知识及 BI-RADS 标准的验证校准。
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// AboutView 静态页面
</script>

<style scoped>
.about-container {
  padding: 20px 0;
  animation: fadeInUp 0.8s ease-out forwards;
}

.about-header {
  text-align: center;
  margin-bottom: 60px;
}

.main-title {
  font-size: 64px;
  color: #2080f0;
  margin: 0;
  font-weight: 800;
  letter-spacing: 2px;
}

.sub-title {
  font-size: 24px;
  color: #4b5563;
  margin: 10px 0;
  font-weight: 600;
}

.tagline {
  font-size: 16px;
  color: #6b7280;
  margin-top: 10px;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: start;
}

.section-title {
  font-size: 20px;
  color: #111827;
  margin-bottom: 20px;
  font-weight: 700;
}

.section-desc {
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 30px;
}

/* 论文卡片样式 */
.tech-card {
  background: white;
  border-left: 4px solid #2080f0;
  padding: 20px;
  border-radius: 0 8px 8px 0;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.03);
  transition: transform 0.3s;
}

.tech-card:hover {
  transform: translateX(5px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.number {
  font-size: 24px;
  color: #e5e7eb;
  font-weight: 800;
}

.badge {
  background: #eff6ff;
  color: #2080f0;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.card-title {
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
}

.card-year {
  font-size: 13px;
  color: #9ca3af;
}

/* 团队卡片样式 */
.team-card {
  background: white;
  display: flex;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);
  gap: 20px;
  align-items: flex-start;
}

.avatar {
  background: #eff6ff;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  flex-shrink: 0;
}

.info .role {
  font-size: 13px;
  color: #2080f0;
  font-weight: 700;
  margin-bottom: 4px;
}

.info .name {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 10px;
}

.sub-name {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.info .desc {
  font-size: 14px;
  color: #4b5563;
  line-height: 1.6;
}

/* 🌟 核心动画逻辑：丝滑交错浮现 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 全局进场 */
.animate-fade-up {
  animation: fadeInUp 0.6s ease-out both;
}

/* 团队卡片阶梯动画 */
.stagger-1 { animation: fadeInUp 0.6s ease-out 0.1s both; }
.stagger-2 { animation: fadeInUp 0.6s ease-out 0.2s both; }
.stagger-3 { animation: fadeInUp 0.6s ease-out 0.3s both; }

/* 论文卡片阶梯动画 */
.tech-stagger-1 { animation: fadeInUp 0.6s ease-out 0.1s both; }
.tech-stagger-2 { animation: fadeInUp 0.6s ease-out 0.15s both; }
.tech-stagger-3 { animation: fadeInUp 0.6s ease-out 0.2s both; }
.tech-stagger-4 { animation: fadeInUp 0.6s ease-out 0.25s both; }
.tech-stagger-5 { animation: fadeInUp 0.6s ease-out 0.3s both; }
.tech-stagger-6 { animation: fadeInUp 0.6s ease-out 0.35s both; }

</style>