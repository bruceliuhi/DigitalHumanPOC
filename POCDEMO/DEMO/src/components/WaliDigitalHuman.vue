<template>
  <section class="container">
    <!-- 数字人挂载容器 -->
    <div id="Digital-Man"></div>

    <div class="main">
      <h2>🤖 银行助手 (Server Mode / UC1)</h2>
      
      <!-- 状态面板 -->
      <div class="status-panel">
         <div class="status-item">
             <span class="label">🔌 Server:</span>
             <span :class="connected ? 'connected' : 'disconnected'">
                {{ connected ? '已连接' : '断开 (尝试连接 127.0.0.1:18080...)' }}
             </span>
         </div>
         <div class="status-item">
             <span class="label">👂 用户说:</span>
             <div class="content">{{ currentASR }}</div>
         </div>
         <div class="status-item">
             <span class="label">🤖 数字人答:</span>
             <div class="content">{{ currentReply }}</div>
         </div>
         <div class="status-item">
             <span class="label">🛠️ Init Status:</span>
             <div class="content" :style="{ color: initStatus.includes('Failed') ? 'red' : 'blue' }">
                 {{ initStatus }}
             </div>
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
const initStatus = ref('Waiting...')

// 数字人配置
// (已使用用户提供的 Key 和 URL)
const DM_CONFIG = {
    appkey: '486da5fd9397a2bedb1ed3a2c15e89be',
    appsecret: '864fbc28339cb8882560997adbd92845',
    licenseUrl: 'https://1251097609.trtcube-license.cn/license/v2/1251097609_1/v_cube.license',
    figure_id: '35967f5', 
    voice_id: '10a1120', 
    mobile: '13436983578', 
    name: 'ServerModeSession_' + Date.now(),
    voice_volume: 10,
    voice_speed: 5
}

onMounted(async () => {
  console.log('🚀 [WaliDigitalHuman] onMounted started');
  initStatus.value = '🚀 onMounted started';
  console.log('📝 [WaliDigitalHuman] Config:', JSON.stringify(DM_CONFIG));

  // 1. 初始化数字人
  try {
    console.log('⏳ [WaliDigitalHuman] Creating DigitalMan instance...');
    initStatus.value = '⏳ Creating Instance...';
    VM = new DigitalMan(DM_CONFIG)
    
    console.log('⏳ [WaliDigitalHuman] Calling _initializer()...');
    initStatus.value = '⏳ Initializing SDK...';
    
    await VM._initializer()
    console.log('✅ [WaliDigitalHuman] 数字人 Ready (_initializer completed)');
    initStatus.value = '✅ Init Success';
  } catch (e) {
    console.error('❌ [WaliDigitalHuman] Digital Man Init Failed:', e);
    initStatus.value = '❌ Init Failed: ' + e.message;
    // 尝试打印更详细的错误堆栈
    if (e.stack) console.error(e.stack);
  }

  // 2. 连接 Node 后端
  connectServer();
})

onUnmounted(() => {
    if (ws) ws.close();
    if (VM) VM._closeConnection();
})

function connectServer() {
    console.log('🔌 [WS] Attempting to connect to ws://127.0.0.1:18080...');
    ws = new WebSocket('ws://127.0.0.1:18080'); // 连接本地 Node 服务
    
    ws.onopen = () => {
        connected.value = true;
        console.log('✅ [WS] Connected to Orchestrator');
    };
    
    ws.onerror = (e) => {
        console.error('❌ [WS] Connection Error:', e);
    };
    
    ws.onmessage = async (event) => {
        try {
            const msg = JSON.parse(event.data);
            
            // 类型分发
            if (msg.type === 'dialogue.reply') {
                if (msg.asrText) currentASR.value = msg.asrText; // 更新用户说的话
                
                // 播报回复
                if (msg.assistantText) {
                    currentReply.value = msg.assistantText;
                    await playAudio(msg.assistantText);
                }
            } else if (msg.type === 'asr.final') {
                // 如果后端单独推 ASR
                currentASR.value = msg.text;
            }
        } catch (e) {
            console.error('WS Message Error:', e);
        }
    };
    
    ws.onclose = () => {
        connected.value = false;
        // console.log('WS Closed, retrying...');
        setTimeout(connectServer, 3000);
    };
    
    ws.onerror = (e) => {
        // console.warn('WS Error (Backend not running?)');
    };
}

// 播报逻辑
async function playAudio(text) {
    if (!VM) return;
    try {
        console.log(`Speaking: ${text}`);
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
    if (VM) VM._interrupt(); // 前端先停嘴
    
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'ui.input', text }));
    } else {
        console.warn('Backend not connected');
    }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  height: 100vh;
  justify-content: center;
  align-items: center;
  gap: 20px;
  background: #f0f2f5;
  font-family: sans-serif;
}

#Digital-Man {
  width: 540px;  /* 1080/2 */
  height: 960px; /* 1920/2 */
  background: #000;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  overflow: hidden;
}

.main {
  width: 400px;
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

h2 {
    margin: 0;
    font-size: 1.2rem;
    color: #333;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
}

.status-panel {
    background: #f8f9fa;
    padding: 15px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.status-item {
    display: flex;
    flex-direction: column;
}

.label {
    font-weight: bold;
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 4px;
}

.content {
    color: #333;
    line-height: 1.4;
    min-height: 1.4em;
}

.connected { color: #28a745; font-weight: bold; }
.disconnected { color: #dc3545; font-weight: bold; }

.btn-box {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 10px;
}

.btn {
    padding: 12px;
    background: #1890ff;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 16px;
    transition: background 0.3s;
}
.btn:hover { background: #40a9ff; }

.btn.warning {
    background: #ff4d4f;
}
.btn.warning:hover { background: #ff7875; }
</style>
