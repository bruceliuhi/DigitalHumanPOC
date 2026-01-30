const WebSocket = require('ws');
const http = require('http');
const WaliAdapter = require('./wali-adapter');
const Orchestrator = require('./orchestrator');

const PORT = 18080;
const server = http.createServer();
const wss = new WebSocket.Server({ server });

// 全局状态机实例 (PoC 简化：单例)
const orchestrator = new Orchestrator();
// 瓦力适配器实例
const wali = new WaliAdapter();

// 1. 启动瓦力连接 (连接本机端口转发的 39999)
// 注意：如果瓦力在局域网其他IP，请修改这里
const WALI_URL = 'ws://127.0.0.1:39999';
console.log(`🔌 Connecting to Wali Sensor at ${WALI_URL}...`);
wali.connect(WALI_URL);

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
