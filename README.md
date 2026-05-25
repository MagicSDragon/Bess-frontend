#  BESS Frontend

## 乳腺癌多模态智能早筛系统 · 前端控制台

> **B**reast Cancer **E**arly **S**creening **S**ystem — 融合影像、文本与结构化风险因子的多模态 AI 推理前端，支持 Grad-CAM 可解释性热力图与 ECharts 多维数据可视化。

---

## 项目简介

BESS Frontend 是乳腺癌多模态早期风险预测系统（BESS）的前端控制台。系统接收三类异构临床数据——**医学影像**（DICOM / PNG / JPEG）、**临床自由文本报告**（BI-RADS 描述 / 超声所见 / 患者主诉）以及**结构化风险因子**（年龄、初潮/绝经年龄、BRCA 突变状态、家族史等 9 项指标），通过 HTTP `multipart/form-data` 协议提交至后端多模态推理引擎，并将返回的恶性概率、风险等级、模态贡献度、AI 解释性报告及 Grad-CAM 注意力热力图在前端进行可视化呈现。

项目后端算法参考 CVPR 2025 AdaCoMed、TriMedTune 三支路独立推理、MHKD-MVQA 层次化知识蒸馏等前沿学术成果，前端负责构建完整的交互闭环——从数据录入、推理调度、结果分析到历史追溯。

---

## 核心技术栈

| 类别 | 技术 / 库 | 版本 | 用途 |
|------|-----------|------|------|
| **框架** | Vue 3 (Composition API) | `^3.3.11` | UI 框架，全量 `<script setup>` 语法 |
| **语言** | TypeScript | `^5.3.3` | 严格模式，全量类型覆盖 |
| **构建** | Vite | `^5.0.10` | 极速 HMR 开发服务器与生产构建 |
| **路由** | Vue Router | `^4.2.5` | Hash 模式路由 + 懒加载代码分割 |
| **状态管理** | Pinia | `^2.1.7` | 诊断数据流集中管理 |
| **UI 组件库** | Naive UI | `^2.35.0` | 60+ 组件（Upload、DataTable、Gauge 等） |
| **数据可视化** | ECharts | `^5.4.3` | 仪表盘（Gauge）与环形饼图（贡献度） |
| **HTTP 客户端** | Axios | `^1.6.2` | API 请求，60s 超时适配 AI 推理 |
| **字体** | vfonts | `^0.0.3` | Lato（正文）+ Fira Code（等宽） |
| **编译检查** | vue-tsc | `^1.8.25` | Vue SFC 类型校验 |

---

## 项目目录结构

```
Bess-Frontend/
├── index.html                          # SPA 入口 HTML (lang=zh-CN)
├── package.json                        # 依赖清单与脚本
├── tsconfig.json                       # TypeScript 编译配置 (strict)
├── tsconfig.node.json                  # Vite 构建工具的 TS 配置
├── vite.config.ts                      # Vite 配置 (端口 3000, /api 代理至 :8000)
├── dist/                               # 生产构建产物 (已 Tree-shaking + 代码分割)
│   ├── index.html
│   └── assets/                         # 按路由分割的 JS/CSS chunk + 字体
│
└── src/
    ├── main.ts                         # 应用入口：挂载 Pinia → Router → App
    ├── App.vue                         # 根布局：顶部导航栏 (Logo + Nav) + <router-view>
    ├── env.d.ts                        # TS 环境声明 (*.vue 模块 + Vite 类型)
    │
    ├── api/
    │   └── index.ts                    # Axios 实例 (baseURL='', timeout=60000ms)
    │
    ├── router/
    │   └── index.ts                    # Hash 路由表 (4 条路由，全部懒加载)
    │
    ├── stores/
    │   └── diagnosis.ts                # Pinia Store: 影像/文本/因子 → submitAnalysis → 结果 & 历史
    │
    ├── components/
    │   └── AppProvider.vue             # Naive UI 全局 Provider 包裹器 (Config + Message + Dialog + LoadingBar)
    │
    └── views/
        ├── HomeView.vue                # 主页：多模态数据录入表单 + Grad-CAM 热力图预览区
        ├── ResultView.vue              # 结果页：ECharts 仪表盘 + 环形贡献度图 + 原图/热力图对比 + AI 分析报告
        ├── HistoryView.vue             # 历史页：基于 Naive UI DataTable 的诊断历史记录 (localStorage)
        └── AboutView.vue               # 关于页：核心技术论文陈列 + 项目团队介绍
```

---

## 核心功能模块

### 1. 多模态数据录入（HomeView）

首页采用响应式三列栅格布局（≥1000px 展开），左侧承载影像与文本输入，右侧承载结构化表单，形成三类模态数据的统一入口：

- **医学影像上传（Visual）**：支持 DICOM `.dcm`、PNG、JPEG 格式，拖拽上传 / 目录拖放，最多 4 张。上传区域带有扫描线动画，hover 时图标的缩放旋转交互反馈。
- **临床文本报告（Text）**：自由文本输入框，接收 BI-RADS 描述、超声所见或患者主诉，作为 NLP 分支的输入。
- **结构化风险因子（Tabular）**：包含 9 项 Gail/Tyrer-Cuzick 模型中常见的乳腺癌风险因素——年龄、初潮年龄、绝经年龄、初次生育年龄、生育次数、激素治疗年限、家族乳腺癌史（一级亲属）、BRCA1/2 基因突变状态（阳性/阴性/未检测）、既往乳腺活检史。缺失值由后端 AdaCoMed 算法自动均值填充。

提交按钮具有流动渐变色光效动画，推理过程中弹出模态遮罩层，显示 "正在进行多模态 AdaCoMed 推理..." 等待状态。

### 2. 智能可视化分析大屏（ResultView）

推理完成后跳转至结果页，以仪表盘 + 饼图 + 影像对比 + 分析报告的四象限布局呈现 AI 推理结论：

- **恶性概率仪表盘（ECharts Gauge）**：半圆弧形仪表，180° 起止，按风险阈值自动切换颜色（绿→黄→橙→红），指针隐藏仅显示进度弧，中央渲染概率数值动画。
- **多模态贡献度环形图（TriMedTune Donut）**：展示影像（蓝色）、临床文本（橙色）、风险因子（绿色）三种模态在最终决策中的相对贡献比例。
- **原始影像 vs. Grad-CAM 热力图对比**：左右并排展示后端返回的 Base64 原始影像与 Grad-CAM 注意力叠加图，直观呈现模型关注的 ROI 区域。
- **AI 综合分析报告**：展示 MHKD-MVQA 生成的自然语言解释文本，并以 NTag 标签列出关键影像学征象（Point, Detect, Count）。
- **数据可靠性评估**：三组 Naive UI Progress 进度条分别展示影像质量、文本完整性、因子一致性的评分。

### 3. 诊断历史追溯（HistoryView）

每次成功推理的结果自动序列化至 `localStorage`（key: `bess_history`），在历史页面通过 Naive UI DataTable 以分页表格形式呈现。风险等级列通过 Vue `h()` 渲染函数动态生成 NTag 组件，实现颜色编码（极高危=红色 / 高危=橙色 / 其他=绿色）。关键发现列截取前两项展示，超出部分用省略号折叠。

### 4. 关于页 · 学术与技术背景（AboutView）

以双栏布局展示项目的学术支撑与团队构成。左侧列举 6 篇来自 CVPR、DIPCA、JBHI、EMBC、IEEE TCCI、IoT 等 2025 年顶会/期刊的核心论文，每篇以带有蓝色左边框的卡片呈现，hover 时右移交互动效。右侧展示项目负责人（北京邮电大学 AI 学院）、指导教师（BUPT 副教授/博导）以及临床医学顾问（三甲医院特邀专家）三位团队成员。

---

## 快速启动指南

### 环境要求

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x（或等效的 pnpm / yarn）

### 本地开发

```bash
# 1. 克隆仓库
git clone <your-repo-url>
cd Bess-Frontend

# 2. 安装依赖
npm install

# 3. 启动开发服务器 (默认 http://localhost:3000)
npm run dev
```

开发服务器已配置 Vite Proxy：所有 `/api` 前缀的请求自动转发至 `http://127.0.0.1:8000`（即后端 FastAPI 服务默认地址）。如需修改代理目标，编辑 [vite.config.ts](vite.config.ts) 中 `server.proxy` 字段。

### 生产构建

```bash
# 编译并输出至 dist/ 目录
npm run build

# 本地预览生产构建
npm run preview
```

生产构建产物位于 `dist/` 目录，可直接部署至任意静态文件服务器（Nginx、Caddy、S3 + CDN 等）。Axios 实例的 `baseURL` 为空字符串，因此前端期望与后端同源部署；若前后端不同源，请修改 [src/api/index.ts](src/api/index.ts) 中的 `baseURL` 或在反向代理层处理跨域。

---

## 后端 API 契约

| 项目 | 说明 |
|------|------|
| **端点** | `POST /api/v1/prediction/multimodal` |
| **Content-Type** | `multipart/form-data` |
| **字段** | `images` (File[], 可选), `clinical_text` (string, 可选), `risk_factors_json` (string, JSON 序列化的 RiskFactors 对象) |
| **超时** | 60000ms |
| **响应体** | `PredictionResult` JSON（包含 `prediction_prob`, `risk_level`, `confidence`, `contribution`, `explanation`, `key_findings`, `reliability`, `original_image_base64`, `grad_cam` 等字段） |

---

## 医疗免责声明

### 中文

> **本项目（BESS）及其包含的算法、模型、前端交互界面与可视化输出，仅供学术研究、技术交流与教育目的使用，不构成任何形式的专业医疗建议、诊断或治疗方案。**
>
> 任何个人或机构在使用本系统时，不得将其输出结果作为医疗决策的直接或间接依据。乳腺疾病的筛查、诊断与治疗必须在具备执业资质的医疗机构中，由专业医师结合完整的临床检查、实验室检验及影像学资料作出综合判断。
>
> 对于因依赖本系统输出结果而导致的任何直接或间接损失、误诊、延迟诊断或不良临床结局，项目作者及贡献者不承担任何法律责任。

### English

> **The BESS project (including all associated algorithms, models, frontend interfaces, and visual outputs) is intended strictly for academic research, educational purposes, and technical demonstration. It is NOT a substitute for professional medical advice, diagnosis, or treatment.**
>
> No individual or institution should use the output of this system as a direct or indirect basis for medical decision-making. Breast disease screening, diagnosis, and treatment must be conducted at qualified medical institutions by licensed physicians, incorporating comprehensive clinical examinations, laboratory tests, and imaging studies.
>
> The developers and contributors assume no liability for any direct or indirect damages, misdiagnosis, delayed diagnosis, or adverse clinical outcomes resulting from reliance on the outputs of this system.

---

## 开源许可证

本项目基于 [MIT License](https://opensource.org/licenses/MIT) 开源。

```
MIT License

Copyright (c) 2025 BESS Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
