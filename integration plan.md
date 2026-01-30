实施计划 - 将 DEMO 集成到 DigitalAssistantInterface
目标描述
目标是分析 DEMO 的功能并确保其在 DigitalAssistantInterface 中得到体现。这包括移植组件、逻辑，并确保利用 POCDEMO 的内容。界面和文档将使用中文。

需要用户审查
 确认要移植的具体 DEMO 功能。
 审查 DEMO 和 DigitalAssistantInterface 之间的差异。
拟议变更
DigitalAssistantInterface
 安装依赖：axios, uuid, crypto-js, three, tcplayer.js。
 将 
DigitalMan.js
 从 DEMO/src/utils 复制到 
src/utils/DigitalMan.js
。
 在 src/contexts/DigitalHumanContext.tsx 中创建 DigitalHumanContext 或 hook。
 在 src/components/DigitalHuman/ 中创建 DigitalHuman 组件。
 集成到 
src/app/routes.ts
 和 
src/app/App.tsx
（或新页面）。
验证计划
自动化测试
 在 DigitalAssistantInterface 中运行 npm run dev 并验证其启动。
 用户手动验证界面。
 
UI/UX调整
 主页背景图片要换成 DEMO 中真正数字人形象。