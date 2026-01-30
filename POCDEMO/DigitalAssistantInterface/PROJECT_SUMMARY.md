# 银行助手数字人项目 - 完整代码清单

## 📋 项目概述

这是一个完整的银行数字人助手应用，使用 **React 18 + TypeScript + Tailwind CSS v4 + React Router** 技术栈构建。

### 核心特性
- ✅ **三语言支持**：简体中文（普通话）、繁体中文（粤语）、英语
- ✅ **Apple iOS 设计风格**：玻璃拟态效果、大圆角、柔和配色
- ✅ **三大服务模块**：
  1. 信用卡智能预审（4步流程）
  2. 开户/分行预约（4步流程+成功页）
  3. 银行智能服务问答（20条FAQ知识库）
- ✅ **转人工状态系统**：AI/转人工中/已转人工 状态显示

---

## 📁 完整文件结构

```
/
├── src/
│   ├── app/
│   │   ├── App.tsx                           # 主入口组件
│   │   ├── routes.ts                         # 路由配置
│   │   ├── components/
│   │   │   ├── PageLayout.tsx               # 页面布局组件（返回按钮+审计日志面板）
│   │   │   ├── figma/
│   │   │   │   └── ImageWithFallback.tsx    # 图片fallback组件（系统保护文件）
│   │   │   └── ui/                          # Shadcn UI 组件库
│   │   │       ├── button.tsx
│   │   │       ├── input.tsx
│   │   │       └── ... (40+组件)
│   │   └── pages/
│   │       ├── Home.tsx                     # 首页 - 三个服务卡片
│   │       ├── CreditCardPreApproval.tsx    # 信用卡智能预审（4步流程）
│   │       ├── Appointment.tsx              # 开户/分行预约（4步流程+成功页）
│   │       └── FAQ.tsx                      # 银行智能服务问答（20条FAQ+转人工系统）
│   │
│   ├── contexts/
│   │   └── LanguageContext.tsx              # 全局语言上下文（zh/yue/en）
│   │
│   ├── data/
│   │   └── faqData.ts                       # FAQ数据（20条+关键词匹配逻辑）
│   │
│   ├── services/
│   │   └── mockApi.ts                       # Mock API服务（信用卡/预约）
│   │
│   ├── styles/
│   │   ├── index.css                        # 样式入口
│   │   ├── fonts.css                        # 字体定义
│   │   ├── tailwind.css                     # Tailwind基础样式
│   │   └── theme.css                        # 主题样式（Apple风格）
│   │
│   └── utils/
│       └── DigitalMan.js                    # 数字人工具类（预留）
│
├── package.json                              # 依赖配置
├── vite.config.ts                            # Vite配置（@别名映射）
├── postcss.config.mjs                        # PostCSS配置
└── PROJECT_SUMMARY.md                        # 本文档
```

---

## 🔑 关键文件说明

### 1. 入口文件

**`/src/app/App.tsx`** - 应用主入口
```tsx
import { RouterProvider } from 'react-router';
import { router } from '@/app/routes';
import { LanguageProvider } from '@/contexts/LanguageContext';

export default function App() {
  return (
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>
  );
}
```

### 2. 路由配置

**`/src/app/routes.ts`** - React Router Data Mode
```tsx
import { createBrowserRouter } from 'react-router';
import Home from '@/app/pages/Home';
import CreditCardPreApproval from '@/app/pages/CreditCardPreApproval';
import Appointment from '@/app/pages/Appointment';
import FAQ from '@/app/pages/FAQ';

export const router = createBrowserRouter([
  { path: '/', Component: Home },
  { path: '/credit-card', Component: CreditCardPreApproval },
  { path: '/appointment', Component: Appointment },
  { path: '/faq', Component: FAQ },
]);
```

### 3. 语言上下文

**`/src/contexts/LanguageContext.tsx`** - 全局语言管理
- 支持三种语言：`'zh' | 'yue' | 'en'`
- 使用 `useLanguage()` Hook 访问和切换语言

### 4. 核心页面

#### 首页 - `/src/app/pages/Home.tsx`
- 数字人背景图
- 语言选择器（普通话/粤语/English）
- 三个服务卡片（iOS锁屏通知风格）

#### 信用卡智能预审 - `/src/app/pages/CreditCardPreApproval.tsx`
- 4个步骤：介绍 → 3个问题 → 结果展示
- 模拟语音交互（"是"/"否"）
- Mock API集成（`createPreApprovalCase`）

#### 开户/分行预约 - `/src/app/pages/Appointment.tsx`
- 4个步骤：介绍 → 选服务 → 选时间 → 确认 → 成功页
- 4种服务类型：开户、贷款咨询、理财咨询、其他
- Mock API集成（`createAppointment`, `getAvailableSlots`）

#### 银行智能服务问答 - `/src/app/pages/FAQ.tsx` ⭐ 核心功能
- **20条FAQ知识库**（三语言支持）
- **转人工状态系统**：
  - 状态徽章（AI辅助/转人工中/已转人工）
  - 转人工状态卡片
  - 自动语音播报
- **双输入模式**：语音 / 文字切换
- **审计日志**：记录所有交互事件

### 5. FAQ数据

**`/src/data/faqData.ts`** - 20条FAQ + 匹配逻辑
- 每条FAQ包含：
  - `id`: 唯一标识
  - `q`, `qZh`, `qYue`, `qEn`: 问题（三语言）
  - `a`, `aZh`, `aYue`, `aEn`: 答案（三语言）
  - `keywords`: 关键词数组（用于匹配）
- `matchFAQ()`: 关键词匹配函数
- `FALLBACK_ANSWER`: 未匹配时触发转人工

### 6. Mock API服务

**`/src/services/mockApi.ts`**
- `createPreApprovalCase()`: 创建信用卡预审案件
- `createAppointment()`: 创建预约
- `getAvailableSlots()`: 获取可用时间段
- 95%成功率模拟 + 网络延迟

### 7. 公共组件

**`/src/app/components/PageLayout.tsx`**
- 统一的页面布局
- 返回按钮（三语言）
- 审计日志面板（可展开/复制JSON）
- 语音状态显示

---

## 🎨 设计风格

### Apple iOS 风格特征
- **玻璃拟态**：`backdrop-filter: blur(40px)` + 70-85%透明度
- **大圆角**：16-22px border-radius
- **去饱和色系**：中性灰 + 柔和蓝色强调色
- **柔和阴影**：`box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15)`
- **微妙边框**：`border: 0.5px solid rgba(255, 255, 255, 0.18)`
- **平滑过渡**：`transition: all 0.2s ease`
- **点击缩放**：`active:scale-[0.98]`

### 服务卡片配色
- 信用卡：金色 `rgba(218, 165, 32, 0.95)`
- 预约：蓝色 `rgba(59, 130, 246, 0.95)`
- 问答：青色 `rgba(34, 211, 238, 0.95)`

### 转人工状态配色
- AI辅助：蓝色 `rgba(59, 130, 246, 0.85)`
- 转人工中：黄色 `rgba(251, 191, 36, 0.85)`
- 已转人工：绿色 `rgba(16, 185, 129, 0.85)`

---

## 🌐 多语言支持

### 完整的三语言覆盖

#### 1. FAQ数据（20条）
- ✅ 所有问题和答案都有 `zh`, `yue`, `en` 版本
- ✅ 关键词也支持多语言匹配

#### 2. 所有页面UI文本
- ✅ 页面标题
- ✅ 按钮文本
- ✅ 提示信息
- ✅ 状态文本
- ✅ 表单标签

#### 3. 转人工系统
- ✅ 状态徽章文本
- ✅ 转人工播报消息
- ✅ 状态卡片文本

### 语言对应关系
| 代码 | 语言 | 示例 |
|------|------|------|
| `zh` | 简体中文（普通话） | "点击语音提问" |
| `yue` | 繁体中文（粤语） | "撳語音提問" |
| `en` | English | "Tap to speak" |

---

## 📦 依赖清单

### 核心依赖
```json
{
  "react": "18.3.1",
  "react-dom": "18.3.1",
  "react-router": "^7.13.0",
  "lucide-react": "0.487.0",
  "tailwindcss": "4.1.12",
  "@tailwindcss/vite": "4.1.12",
  "vite": "6.3.5"
}
```

### UI组件库
- **Radix UI**: 40+ 无障碍组件
- **Shadcn UI**: 基于Radix的组件集合
- **Material UI**: @mui/material + icons

### 工具库
- **motion**: 动画库（Framer Motion的新版本）
- **date-fns**: 日期处理
- **react-hook-form**: 表单管理
- **sonner**: Toast通知

---

## 🚀 运行指南

### 1. 安装依赖
```bash
pnpm install
# 或
npm install
```

### 2. 启动开发服务器
```bash
pnpm dev
# 或
npm run dev
```

### 3. 构建生产版本
```bash
pnpm build
# 或
npm run build
```

---

## 🧪 测试转人工功能

### 测试步骤
1. 启动应用，进入首页
2. 点击"银行智能服务问答"卡片
3. 观察顶部蓝色状态徽章：**"🤖 AI 辅助处理中"**
4. 点击"切换到文字"按钮
5. 输入一个不在FAQ知识库中的问题，例如：
   - "我想买股票"
   - "帮我办理护照"
   - "今天天气怎么样"
6. 观察转人工流程：
   - ⏳ 状态徽章变黄色："转人工中（Demo）"
   - 💬 数字人回复转人工消息
   - 📋 显示黄色转人工状态卡片
   - ✅ 2秒后状态徽章变绿色："已转人工（Demo）"

### 测试FAQ匹配
输入以下问题应命中FAQ（不会转人工）：
- "开户需要什么文件"
- "年龄限制"
- "存钱怎么办"
- "信用卡申请资格"
- "网银怎么开通"

---

## 📊 审计日志

每个页面都会记录用户交互事件，可在右上角展开"审计日志"面板查看：

### FAQ页面日志事件
- `FAQ_PAGE_LOADED`: 页面加载
- `FAQ_BUTTON_CLICKED`: 点击FAQ按钮
- `FAQ_TEXT_MATCHED`: 文字输入命中FAQ
- `FAQ_TRANSFER_TO_HUMAN`: 触发转人工
- `VOICE_INPUT_STARTED`: 开始语音输入
- `VOICE_INPUT_COMPLETED`: 语音识别完成

### 信用卡页面日志事件
- `PAGE_LOADED`: 页面加载
- `USER_ANSWER`: 用户回答问题
- `APPROVAL_RESULT`: 预审结果
- `API_CASE_CREATED`: 案件创建成功

### 预约页面日志事件
- `PAGE_LOADED`: 页面加载
- `SERVICE_SELECTED`: 选择服务类型
- `TIMESLOT_SELECTED`: 选择时间段
- `APPOINTMENT_CONFIRMED`: 预约确认成功

---

## 🔧 关键技术点

### 1. Vite配置
```ts
// vite.config.ts
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),  // 使用@别名导入
  },
}
```

### 2. Tailwind v4配置
```css
/* src/styles/index.css */
@import './fonts.css';
@import './tailwind.css';  /* Tailwind基础样式 */
@import './theme.css';     /* 自定义主题 */
```

### 3. 图片导入
```tsx
// Figma资源使用特殊scheme
import backgroundImage from 'figma:asset/xxx.png';

// 新图片使用ImageWithFallback组件
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
```

### 4. 路由导航
```tsx
// 使用react-router（不是react-router-dom）
import { useNavigate } from 'react-router';

const navigate = useNavigate();
navigate('/faq');
```

---

## ✅ 完整性检查清单

### 核心文件（必需）
- [x] `/src/app/App.tsx` - 入口组件
- [x] `/src/app/routes.ts` - 路由配置
- [x] `/src/contexts/LanguageContext.tsx` - 语言上下文
- [x] `/package.json` - 依赖配置
- [x] `/vite.config.ts` - Vite配置

### 页面组件（必需）
- [x] `/src/app/pages/Home.tsx` - 首页
- [x] `/src/app/pages/CreditCardPreApproval.tsx` - 信用卡预审
- [x] `/src/app/pages/Appointment.tsx` - 预约服务
- [x] `/src/app/pages/FAQ.tsx` - FAQ问答（含转人工系统）

### 数据与服务（必需）
- [x] `/src/data/faqData.ts` - 20条FAQ数据
- [x] `/src/services/mockApi.ts` - Mock API服务

### 公共组件（必需）
- [x] `/src/app/components/PageLayout.tsx` - 页面布局
- [x] `/src/app/components/figma/ImageWithFallback.tsx` - 图片组件（系统保护）

### 样式文件（必需）
- [x] `/src/styles/index.css` - 样式入口
- [x] `/src/styles/fonts.css` - 字体定义
- [x] `/src/styles/tailwind.css` - Tailwind基础
- [x] `/src/styles/theme.css` - 主题样式

### Figma资源（必需）
- [x] 数字人背景图：`figma:asset/ecaed0cd4b311eba7cd9af4c2b67b89b7d40a9df.png`

---

## 🎯 功能完成度

### ✅ 已完成的功能
1. **首页**
   - [x] 数字人背景
   - [x] 语言切换器（3种语言）
   - [x] 三个服务卡片（iOS风格）

2. **信用卡智能预审**
   - [x] 4步流程（介绍→3个问题→结果）
   - [x] 三语言支持
   - [x] Mock API集成
   - [x] 成功/失败状态展示
   - [x] 审计日志

3. **开户/分行预约**
   - [x] 4步流程 + 成功页
   - [x] 4种服务类型选择
   - [x] 时间段选择
   - [x] 三语言支持
   - [x] Mock API集成
   - [x] 审计日志

4. **银行智能服务问答**
   - [x] 20条FAQ知识库（三语言）
   - [x] 关键词匹配逻辑
   - [x] 语音/文字双输入模式
   - [x] **转人工状态系统**：
     - [x] 状态徽章（AI/转人工中/已转人工）
     - [x] 转人工播报消息（三语言）
     - [x] 转人工状态卡片（三语言）
     - [x] 自动状态流转
   - [x] 审计日志

5. **全局功能**
   - [x] 三语言无缝切换
   - [x] 统一的返回按钮
   - [x] 审计日志面板（可展开/复制）
   - [x] Apple iOS设计风格

---

## 🎨 设计规范总结

### 视觉风格
- **设计语言**：Apple iOS系统风格
- **主色调**：去饱和中性灰
- **强调色**：柔和蓝色（信用卡）、金色（预审）、青色（问答）
- **透明度**：70-85%
- **圆角**：16-22px
- **模糊效果**：backdrop-filter: blur(40px)

### 交互反馈
- **点击缩放**：`active:scale-[0.98]`
- **过渡动画**：`transition: all 0.2s ease`
- **禁用状态**：`disabled:opacity-50`
- **悬停效果**：微妙的透明度变化

### 文字风格
- **标题**：font-weight: 600-700, font-size: 0.9-1.5rem
- **正文**：font-weight: 400-500, font-size: 0.72-0.85rem
- **微文本**：font-weight: 400, font-size: 0.65-0.7rem
- **阴影**：text-shadow for 背景图上的文字

---

## 📝 注意事项

### 系统保护文件（禁止修改）
- `/src/app/components/figma/ImageWithFallback.tsx`
- `/pnpm-lock.yaml`

### 导入规范
- ✅ 使用 `@` 别名：`import { X } from '@/app/...`
- ✅ 使用 `react-router`：`import { useNavigate } from 'react-router'`
- ❌ 不要使用相对路径：`import { X } from '../../...'`
- ❌ 不要使用 `react-router-dom`

### Tailwind v4注意事项
- ✅ 使用内联类名覆盖默认样式
- ✅ 不使用字体大小类（text-xl等），使用内联style
- ❌ 不创建 `tailwind.config.js`（使用CSS配置）

---

## 🔮 未来扩展方向

### 可集成的功能
1. **腾讯云数字人SDK**
   - WebSocket连接
   - 实时语音识别（ASR）
   - 实时语音合成（TTS）
   - 数字人动画同步

2. **后端服务器**
   - Node.js + WebSocket
   - 实际的业务API
   - 数据库持久化
   - 会话管理

3. **高级功能**
   - 语音打断功能
   - 实时字幕显示
   - 情绪识别
   - 多轮对话上下文

---

## 📞 支持信息

### 技术栈版本
- React: 18.3.1
- TypeScript: 5.x
- Tailwind CSS: 4.1.12
- React Router: 7.13.0
- Vite: 6.3.5

### 浏览器兼容性
- Chrome 90+
- Safari 14+
- Firefox 88+
- Edge 90+

---

## ✨ 项目亮点

1. **完整的三语言支持**：覆盖所有UI文本和数据
2. **Apple级设计质量**：玻璃拟态+大圆角+柔和配色
3. **转人工状态系统**：完整的状态流转和视觉反馈
4. **审计日志系统**：记录所有用户交互
5. **模块化架构**：清晰的文件组织和代码复用
6. **Mock API完整**：可独立运行，无需后端
7. **响应式设计**：540x960移动端尺寸优化

---

**✅ 代码已完整，可以直接运行！**

所有核心功能已实现，包括最新的转人工状态系统。
项目结构清晰，代码规范，易于维护和扩展。
