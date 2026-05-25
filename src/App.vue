<template>
  <AppProvider>
    <div class="app-layout">
      <header class="navbar">
        <div class="logo">
          <span class="logo-icon">🧬</span>
          <span class="logo-text">BESS <span class="subtitle">Intelligent Screening</span></span>
        </div>
        <nav>
          <router-link to="/" active-class="active">多模态分析</router-link>
          <router-link to="/history" active-class="active">诊断历史</router-link>
          <router-link to="/about" active-class="active">核心技术</router-link>
        </nav>
      </header>

      <main class="content">
        <router-view />
      </main>
    </div>
  </AppProvider>
</template>

<script setup lang="ts">
import AppProvider from './components/AppProvider.vue';
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  height: 64px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  z-index: 100;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
}

.subtitle {
  font-size: 14px;
  font-weight: 400;
  color: #6b7280;
  margin-left: 8px;
}

nav a {
  margin-left: 30px;
  text-decoration: none;
  color: #4b5563;
  font-weight: 500;
  transition: all 0.3s;
  padding: 8px 16px;
  border-radius: 6px;
}

nav a:hover, nav a.active {
  color: #2080f0;
  background: #eef6ff;
}

.content {
  flex: 1;
  padding: 24px 40px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

/* 已安全移除底部的 .fade 动画样式，保持代码极简 */
</style>