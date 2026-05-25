import axios from 'axios';

const api = axios.create({
  // ⚠️ 注释掉 baseURL 或设为 ''。因为打包后前后端同源，直接发相对路径 '/api/v1/...' 即可
  baseURL: '', 
  timeout: 60000, // AI 推理可能较慢，设置长超时（这个保留，非常好）
});

export default api;