import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

// 引入通用字体（可选，NaiveUI推荐）
import 'vfonts/Lato.css';
import 'vfonts/FiraCode.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');