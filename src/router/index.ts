import { createRouter, createWebHashHistory } from 'vue-router';

// 🚀 核心修复：使用 () => import(...) 实现路由懒加载
// 这样打包时，Vite 会把每个页面单独打包成一个小 js 文件，点击时才会秒级加载
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
    { path: '/result', name: 'result', component: () => import('../views/ResultView.vue') },
    { path: '/history', name: 'history', component: () => import('../views/HistoryView.vue') },
    { path: '/about', name: 'about', component: () => import('../views/AboutView.vue') },
  ]
});

export default router;