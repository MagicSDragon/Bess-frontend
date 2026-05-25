import { defineStore } from 'pinia';
import api from '../api';
import { UploadFileInfo } from 'naive-ui';

// 类型定义
export interface RiskFactors {
  age: number | null;
  menarche_age: number | null;
  menopause_age: number | null;
  first_birth_age: number | null;
  births_count: number | null;
  family_history: boolean;
  brca_mutation: boolean | null; // null 表示未知/未测
  previous_biopsy: boolean;
  hormone_therapy_years: number;
}

export interface PredictionResult {
  prediction_prob: number;
  risk_level: string;
  confidence: number;
  reliability: { imaging: number; text: number; risk: number };
  contribution: { imaging: number; llm_text: number; risk_model: number };
  explanation: string;
  key_findings: string[];
  timestamp: string;
  original_image_url?: string; 
  grad_cam?: string;
  original_image_base64?: string;
}

export const useDiagnosisStore = defineStore('diagnosis', {
  state: () => ({
    // 输入状态
    images: [] as UploadFileInfo[],
    clinicalText: '',
    riskFactors: {
      age: 45,
      menarche_age: 13,
      menopause_age: null,
      first_birth_age: null,
      births_count: 0,
      family_history: false,
      brca_mutation: null,
      previous_biopsy: false,
      hormone_therapy_years: 0
    } as RiskFactors,
    
    // 结果状态
    result: null as PredictionResult | null,
    loading: false,
    history: [] as PredictionResult[] // 简单历史记录
  }),

  actions: {
    async submitAnalysis() {
      this.loading = true;
      try {
        const formData = new FormData();

        // 1. 处理图片
        this.images.forEach((fileInfo) => {
          if (fileInfo.file) {
            formData.append('images', fileInfo.file);
          }
        });

        // 2. 处理文本
        formData.append('clinical_text', this.clinicalText);

        // 3. 处理JSON风险因子
        formData.append('risk_factors_json', JSON.stringify(this.riskFactors));

        // 发送请求
        const response = await api.post('/api/v1/prediction/multimodal', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        this.result = response.data;
        
        // 存入本地历史 (Mock)
        this.saveHistory(response.data);
        
        return true;
      } catch (error) {
        console.error('Prediction Failed:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    saveHistory(data: PredictionResult) {
      const historyItem = { ...data };
      const currentHistory = JSON.parse(localStorage.getItem('bess_history') || '[]');
      currentHistory.unshift(historyItem);
      localStorage.setItem('bess_history', JSON.stringify(currentHistory));
      this.history = currentHistory;
    },
    
    loadHistory() {
      this.history = JSON.parse(localStorage.getItem('bess_history') || '[]');
    }
  }
});