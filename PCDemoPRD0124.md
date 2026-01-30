银行场景数字人 Demo（Digital Human Banking Demo）

1. 项目背景与目标
1.1 项目背景

本项目为银行场景下的 数字人 Demo / PoC 系统，通过 HTML5 前端 + 数字人 SDK + 语音交互能力，演示以下核心能力：

数字人语音交互（ASR + TTS）

任务型对话编排

风险分级与人机协同（Human-in-the-loop）

决策流程与审计留痕（Mock）

本系统 不接入真实银行核心系统、不处理真实业务数据，仅用于对外展示与概念验证。

1.2 项目目标

对外清晰演示 “数字人 + 银行业务流程” 的可行性

证明系统具备 风险控制意识，而非自由对话机器人

可通过后台完整讲解 一次对话内部的决策与控制过程

2. 系统整体架构（逻辑）
用户
 ↓（语音 / 触控）
H5 前端（数字人 UI）
 ↓
ASR（语音转文本）
 ↓
对话控制逻辑（Rule-based + LLM）
 ↓
风险评估 & 人机协同判断
 ↓
Mock 任务执行 / Mock API
 ↓
TTS（语音合成）
 ↓
数字人播报 + UI 状态展示
 ↓
审计事件上报
 ↓
后台管理端（PC）

3. 用户角色与系统角色
3.1 用户角色

普通用户（Demo 观众）

演示人员（销售 / 产品 / 管理层）

3.2 系统角色

AI 数字人：

角色定位：辅助者

不具备最终决策权

人工（Demo）：

角色定位：最终决策者

仅用于流程演示，不是真实坐席

4. 人机协同与风险控制（核心设计）
4.1 人机协同（Human-in-the-loop）
设计原则

AI 永远不做最终高风险决策

高风险场景必须演示“转人工”

转人工为 Demo 行为，不接真实人工系统

前端展示（H5）

固定状态标签（页面可见）：

🤖 AI 辅助处理中

⏳ 转人工中（Demo）

👤 已转人工（Demo）

触发转人工时：

数字人播报说明

UI 显示“转人工中（Demo）”状态卡

后台展示（PC）

决策流程中明确出现：

HITL Trigger 节点

Human Takeover 节点

显示：

转人工原因

接管后 AI 不再继续决策

4.2 风险分级逻辑（静态规则）
风险等级定义

Low：信息查询类（FAQ）

Medium：流程指引类（开户、预约）

High：涉及金钱、身份、法律等敏感内容

Demo 要求

至少演示一次风险升级（Low → Medium 或 Medium → High）

风险等级变化必须：

前端可见

后台可解释

前端展示（H5）

页面固定风险等级指示：

风险等级：Low / Medium / High


升级时显示提示：

当前问题涉及更高风险，系统已升级处理

后台展示（PC）

Risk Level 节点：

升级路径

触发规则标签

决策类型（Static Rule）

5. 决策流程与审计日志（Mock）
5.1 决策流程可视化（后台核心）

完整展示以下节点：

User Input

ASR Result

Risk Judgment

AI Decision

Risk Upgrade（如有）

HITL Trigger

Human Takeover

Mock API Call

TTS Speak

Session End

5.2 Mock 审计日志

不接真实业务数据

用于结构与流程说明

审计字段

Session ID

时间

Use Case

风险等级

是否转人工

决策摘要

展示方式

表格视图

JSON 视图（可导出）

6. 功能需求（Use Cases）
6.1 Use Case 1｜信用卡智能预审
目标

演示任务型对话 + 风控前置 + Mock Case 建立。

流程

启动提示

三个固定问题（是 / 否）

初步结果判断

建立 PreApprovalCaseID（Mock API）

验收重点

问题顺序不可变

必须生成 CaseID

后台可追溯整个流程

6.2 Use Case 2｜开户 / 分行预约
目标

演示数字人作为前台分流器，不接核心系统也有价值。

流程

启动

选择服务类型

选择时间（Mock）

确认并生成预约号

验收重点

必须有确认页

必须展示预约成功结果

6.3 Use Case 3｜银行智能服务问答（FAQ 受控）
目标

演示 受控知识库 AI，而非自由对话模型。

交互原则

只允许从固定 FAQ JSON 输出

不允许自由生成

未命中 → 兜底并引导转人工（Demo）

前端 UI

FAQ 快捷入口（20 条，分组）

语音输入（ASR）

可选文本输入

回答区（文本 + 数字人播报）

来源标签：FAQ / Fallback

FAQ 规模

约 20 条

每条包含：

id

q

keywords

a

验收重点

任意 FAQ 可点击并播报

任意非 FAQ 问题必须兜底

后台必须记录：

faqId 或 fallback

7. 后台管理端（PC Web）
7.1 定位

Demo 讲解后台

决策与风险可解释

非运营后台

7.2 页面一｜会话列表（Sessions）

展示内容：

会话列表

筛选（时间 / Use Case / 结果）

关键结果（CaseID / FAQ ID）

用途：

快速定位某次 Demo

7.3 页面二｜会话详情 / 流程回放（核心）

三栏布局：

左：流程时间线

中：节点详情（结构化 + JSON）

右：会话总览

必须展示：

决策节点

风险变化

转人工

Mock API 调用

支持：

单步回放（加分）

7.4 页面三｜API Calls（可选）

展示 Mock API 调用记录

可从 Session 跳转

7.5 页面四｜FAQ Library（可选）

只读 FAQ 列表

用于展示“受控知识库”

8. 数据与接口（Demo 级）
8.1 统一审计事件模型
{
  "eventId": "uuid",
  "sessionId": "uuid",
  "timestamp": "ISO8601",
  "useCase": "preapproval | appointment | faq",
  "type": "INPUT | ASR | DECISION | RISK | API | TTS | HITL | END",
  "payload": {}
}

9. 非功能需求

Demo 级性能即可

无生产级安全要求

不存储真实用户信息