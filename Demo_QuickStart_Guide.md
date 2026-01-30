# 数字人 Demo快速启动配置指南

> **文档目标**: 基于 `DEMO/DEMO` 项目，构建**轻量级 Node.js 后端**来接管瓦力 ASR 和业务逻辑（状态机），实现信用卡预审演示场景。
> **架构模式**: 方案 B (Server-Based Architecture) - 后端做"大脑"，前端做"手眼"。
> **适用范围**: `/Volumes/Users/bruce/AI/DigitalHumanPOC/DEMO/DEMO` 项目

---

## 🏗 1. 架构调整概览

我们将从“前端直连瓦力”调整为“后端中转”模式，增强演示的稳定性和可扩展性。

### 1.1 数据链路图 
```mermaid
graph LR
    Wali[瓦力传感器] -- WS/TCP --> Server[Node.js 轻后端]
    Server -- asr.final --> H5[前端页面]
    Server -- dialogue.reply --> H5
    H5 -- _streamCommand() --> DH[数字人 SDK]
    
    subgraph Server Logic
        Adapter[Wali Adapter]
        FSM[Orchestrator (UC1 状态机)]
        Log[Audit/Log]
    end
```

### 1.2 核心职责
*   **Wali (硬件)**: 负责采集语音，推送识别结果给 Server。
*   **Server (Node.js)**: 
    *   **Adapter**: 解析瓦力协议。
    *   **Orchestrator**: 维护 UC1 信用卡预审状态机 (IDLE -> AGE -> INCOME -> ID -> DONE)。
    *   **Socket**: 将 `asr.final` (用户说了什么) 和 `dialogue.reply` (数字人该说什么) 推送给前端。
*   **FrontEnd (Vue)**: 
    *   **DigitalMan**: 负责播报 Server 下发的文本。
    *   **UI**: 展示 ASR 状态和对话内容。
    *   **Input**: 发送“手动触发”或“打断”指令给 Server。

---

## 📂 2. Step 0: 项目结构准备

在 `DEMO/DEMO` 根目录下，新增 `server` 目录：

```text
DEMO/DEMO/
├── server/             # [新增] 轻后端
│   ├── package.json
│   └── src/
│       ├── index.js           # 入口 (Socket Server)
│       ├── wali-adapter.js    # 瓦力连接与解析
│       ├── orchestrator.js    # UC1 业务状态机
│       └── store.js           # 简单的 Session 存储
├── src/                # [原有] 前端
│   ├── components/
│   │   └── WaliDigitalHuman.vue  # [修改] 改为连接 Server
│   └── App.vue
└── package.json
```

---

## ⚙️ 3. Step 1: 后端实现 (Node.js)

### 3.1 初始化后端
```bash
cd /Volumes/Users/bruce/AI/DigitalHumanPOC/DEMO/DEMO
mkdir server && cd server
npm init -y
npm install ws express cors
```

### 3.2 实现入口 (server/src/index.js)
负责 WebSocket 服务，处理前端连接。

```javascript
/* server/src/index.js */
const WebSocket = require('ws');
const http = require('http');
const WaliAdapter = require('./wali-adapter');
const Orchestrator = require('./orchestrator');

const PORT = 8080;
const server = http.createServer();
const wss = new WebSocket.Server({ server });

// 全局状态机实例 (PoC 简化：单例)
const orchestrator = new Orchestrator();
// 瓦力适配器实例
const wali = new WaliAdapter();

// 1. 启动瓦力连接 (作为客户端去连瓦力，或瓦力连过来，视瓦力模式而定)
// 假设瓦力是 Server 模式，我们在 127.0.0.1:39999
wali.connect('ws://127.0.0.1:39999'); 

// 2. 监听瓦力 ASR 消息 -> 转发给 Orchestrator
wali.on('asr', (text) => {
    console.log(`[Wali] ASR: ${text}`);
    // 收到语音 -> 状态机处理 -> 拿到回复
    const reply = orchestrator.processInput(text);
    broadcastToH5(reply);
});

// 3. 监听 H5 前端连接
wss.on('connection', (ws) => {
    console.log('✅ H5 Client Connected');
    
    ws.on('message', (message) => {
        try {
            const msg = JSON.parse(message);
            // 处理前端按钮点击 (手动触发/重置)
            if (msg.type === 'ui.input') {
                console.log(`[UI] Input: ${msg.text}`);
                const reply = orchestrator.processInput(msg.text); // 直接复用语音处理逻辑
                broadcastToH5(reply);
            }
        } catch (e) { console.error(e); }
    });

    // 发送初始状态
    ws.send(JSON.stringify({ type: 'session.created', sessionId: 'poc-session-01' }));
});

function broadcastToH5(reply) {
    if (!reply) return;
    
    const payload = JSON.stringify(reply); // { type: 'dialogue.reply', ... }
    
    // 广播给所有H5客户端
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
        }
    });
}

server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

### 3.3 实现业务状态机 (server/src/orchestrator.js)
核心业务逻辑：负责信用卡的流程跳转。

```javascript
/* server/src/orchestrator.js */
class Orchestrator {
    constructor() {
        this.state = 'IDLE'; // IDLE, ASK_AGE, ASK_INCOME, ASK_ID, DONE
    }

    processInput(text) {
        // 1. 构造 ASR 回传消息 (先告诉前端刚才说了啥)
        // 实际场景可能分开推，这里简化
        const asrMsg = { type: 'asr.final', text };
        
        let responseText = null;

        // 2. 状态机逻辑
        // 全局重置指令
        if (text.includes('重置') || text.includes('reset')) {
            this.state = 'IDLE';
            responseText = "会话已重置。";
        }
        // 触发指令
        else if (['信用卡', '办卡', '开始'].some(k => text.includes(k))) {
            this.state = 'ASK_AGE';
            responseText = "您好，我是智能理财顾问。我可以帮您快速评估信用卡申请资格。首先，请问您的年龄是否介于 20 到 65 岁之间？";
        }
        // 状态：询问年龄
        else if (this.state === 'ASK_AGE') {
            if (['是', '对', '20'].some(k => text.includes(k))) {
                this.state = 'ASK_INCOME';
                responseText = "好的。接下来，请问您目前是否有稳定的收入来源？";
            } else {
                this.state = 'IDLE';
                responseText = "抱歉，目前由于年龄限制，您可能暂时无法申请。";
            }
        }
        // 状态：询问收入
        else if (this.state === 'ASK_INCOME') {
            if (['有', '是'].some(k => text.includes(k))) {
                this.state = 'ASK_ID';
                responseText = "收到。最后确认一下，您是否持有本地身份证？";
            } else {
                this.state = 'IDLE';
                responseText = "了解了，感谢您的咨询。";
            }
        }
        // 状态：询问 ID
        else if (this.state === 'ASK_ID') {
             if (['有', '是'].some(k => text.includes(k))) {
                 const caseId = 'PRE-' + Math.floor(Math.random() * 10000);
                 this.state = 'IDLE';
                 responseText = `恭喜您，根据初步评估，您符合申请条件。已为您建立申请档案，编号为 ${caseId}。`;
             } else {
                 this.state = 'IDLE';
                 responseText = "好的，感谢您的配合。";
             }
        }
        
        // 如果没有命中任何状态，返回 null (或者兜底回复)
        if (!responseText) return null;

        return {
            type: 'dialogue.reply',
            asrText: text, // 顺便带回去方便前端显示
            assistantText: responseText,
            state: this.state
        };
    }
}

module.exports = Orchestrator;
```

### 3.4 实现瓦力适配器 (server/src/wali-adapter.js)
把原前端的 `WaliClient` 逻辑搬过来，用 `ws` 库。

```javascript
/* server/src/wali-adapter.js */
const WebSocket = require('ws');
const EventEmitter = require('events');

class WaliAdapter extends EventEmitter {
    constructor() {
        super();
        this.ws = null;
    }

    connect(url) {
        this.ws = new WebSocket(url);
        
        this.ws.on('open', () => console.log('✅ Connected to Wali Sensor'));
        
        this.ws.on('message', (data) => {
            try {
                // Node ws 返回的是 Buffer，可能需要 toString
                const str = data.toString(); 
                const msg = JSON.parse(str);
                
                if (msg.action === 'asr' && msg.data) {
                    this.handleASR(msg.data);
                }
            } catch (e) { /* ignore binary/ping */ }
        });

        this.ws.on('error', (e) => console.error('Wali Error:', e.message));
        this.ws.on('close', () => setTimeout(() => this.connect(url), 3000));
    }

    handleASR(data) {
        // 简单解析，同样找 pgs==='rpl'
        // 注意：实际数据结构需参考 ASR_Hardware.md
        if (data.text && data.text.ws) {
            let sentence = '';
            data.text.ws.forEach(ws => ws.cw.forEach(cw => sentence += cw.w));
            
            if (data.text.pgs === 'rpl') {
                this.emit('asr', sentence); // 触发事件给 index.js
            }
        }
    }
}

module.exports = WaliAdapter;
```

---

## 🎨 4. Step 2: 前端改造 (Vue)

### 4.1 修改组件 `src/components/WaliDigitalHuman.vue`

前端完全“脑残化”，只负责显示和播放。

```vue
<template>
  <section class="container">
    <div id="Digital-Man"></div>

    <div class="main">
      <h2>🤖 银行助手 (Server Mode / UC1)</h2>
      
      <!-- 状态面板 -->
      <div class="status-panel">
         <div class="status-item">
             <span class="label">� Server:</span>
             <span :class="connected ? 'connected' : 'disconnected'">{{ connected ? '已连接' : '断开' }}</span>
         </div>
         <div class="status-item">
             <span class="label">👂 用户说:</span>
             <div class="content">{{ currentASR }}</div>
         </div>
         <div class="status-item">
             <span class="label">🤖 数字人答:</span>
             <div class="content">{{ currentReply }}</div>
         </div>
      </div>

      <div class="btn-box">
        <button class="btn" @click="sendInput('开始信用卡预审')">🛠 手动触发流程</button>
        <button class="btn warning" @click="sendInput('重置')">🛑 打断/重置</button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { DigitalMan } from '../utils/DigitalMan.js'
import { ref, onMounted, onUnmounted } from 'vue'

let VM = null
let ws = null

const connected = ref(false)
const currentASR = ref('')
const currentReply = ref('')

// 数字人配置 (必填)
const DM_CONFIG = {
    appkey: ' 486da5fd9397a2bedb1ed3a2c15e89be',
    appsecret: '864fbc28339cb8882560997adbd92845',
    // ⚠️ 注意：licenseUrl 是一个以 .license 结尾的链接，不是 License Key 或 Token。
    // 请在腾讯云控制台 -> 云点播 -> 播放器 License 管理中查看 "License URL"。
    licenseUrl: 'https://1251097609.trtcube-license.cn/license/v2/1251097609_1/v_cube.license', 
    figure_id: '35967f5', 
    voice_id: '112e21', // 音色ID
    mobile: '13436983578',
    name: 'ServerModeSession（xinghetest）_' + Date.now(),
    voice_volume: 10,
    voice_speed: 5
}

onMounted(async () => {
  // 1. 初始化数字人
  VM = new DigitalMan(DM_CONFIG)
  await VM._initializer()
  console.log('✅ 数字人 Ready');

  // 2. 连接 Node 后端
  connectServer();
})

onUnmounted(() => {
    if (ws) ws.close();
    if (VM) VM._closeConnection();
})

function connectServer() {
    ws = new WebSocket('ws://localhost:8080'); // 连接本地 Node 服务
    
    ws.onopen = () => {
        connected.value = true;
        console.log('Connected to Orchestrator');
    };
    
    ws.onmessage = async (event) => {
        const msg = JSON.parse(event.data);
        
        // 类型分发
        if (msg.type === 'dialogue.reply') {
            if (msg.asrText) currentASR.value = msg.asrText; // 更新用户说的话
            
            // 播报回复
            if (msg.assistantText) {
                currentReply.value = msg.assistantText;
                await playAudio(msg.assistantText);
            }
        }
    };
    
    ws.onclose = () => {
        connected.value = false;
        setTimeout(connectServer, 3000);
    };
}

// 播报逻辑
async function playAudio(text) {
    try {
        // 先打断当前（可选，视需求）
        // await VM._interrupt(); 
        
        // 发送流式指令
        await VM._streamCommand(text);
        // 重要：强制结束本句，防止 SDK 挂起
        await VM._streamEnd(); 
    } catch (e) {
        console.error('Play Error:', e);
    }
}

// 发送指令给 Server
function sendInput(text) {
    if (text === '重置') VM._interrupt(); // 前端先停嘴
    
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'ui.input', text }));
    }
}
</script>

<style scoped>
/* 样式保持原样即可，略 */
.container { display: flex; height: 100vh; justify-content: center; align-items: center; gap: 20px; background: #f0f2f5; }
#Digital-Man { width: 540px; height: 960px; background: #000; border-radius: 12px; }
.main { width: 400px; background: white; padding: 24px; border-radius: 12px; }
.status-panel { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; }
.status-item { margin-bottom: 10px; }
.label { font-weight: bold; color: #666; margin-right: 5px; }
.content { color: #333; margin-top: 4px; line-height: 1.4; }
.connected { color: green; } .disconnected { color: red; }
.btn-box { display: flex; flex-direction: column; gap: 10px; }
.btn { padding: 12px; background: #1890ff; color: white; border: none; border-radius: 6px; cursor: pointer; }
.btn.warning { background: #ff4d4f; }
</style>
```

---

## 🚀 5. 运行验证 (3个进程)

为了跑通整个流程，你需要按顺序启动：

1.  **启动瓦力传感器**:
    *   连接 USB，确认 `adb devices`。
    *   执行端口映射：`adb forward tcp:39999 tcp:39999`。

2.  **启动 Node 后端**:
    ```bash
    cd server
    node src/index.js
    # 输出: 🚀 Server running on http://localhost:8080
    # 输出: ✅ Connected to Wali Sensor (如果瓦力正常)
    ```

3.  **启动 Vue 前端**:
    ```bash
    cd ..
    npm run dev
    # 输出: Local: http://localhost:5173/
    ```

4.  **交互测试**:
    *   浏览器访问 `http://localhost:5173/`。
    *   **手动测试**: 点击 "🛠 手动触发"，数字人应播报欢迎语。
    *   **语音测试**: 对瓦力说话，观察 Server 控制台日志以及前端状态面板变化。

---
*文档生成时间: 2026-01-22 (Solution B)*
