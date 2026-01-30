const WebSocket = require('ws');
const EventEmitter = require('events');

class WaliAdapter extends EventEmitter {
    constructor() {
        super();
        this.ws = null;
    }

    connect(url) {
        try {
            this.ws = new WebSocket(url);

            this.ws.on('open', () => {
                console.log('✅ Connected to Wali Sensor');
            });

            this.ws.on('message', (data) => {
                try {
                    // Node ws 返回的是 Buffer
                    const str = data.toString();
                    // 忽略二进制流 (音频/视频帧)
                    if (!str.startsWith('{')) return;

                    const msg = JSON.parse(str);

                    if (msg.action === 'asr' && msg.data) {
                        this.handleASR(msg.data);
                    }
                } catch (e) {
                    // console.debug('Parse error or binary frame'); 
                }
            });

            this.ws.on('error', (e) => {
                console.error(`❌ Wali Connection Error: ${e.message}`);
                console.log('   (Is adb forward running?)');
            });

            this.ws.on('close', () => {
                console.log('⚠️ Wali Disconnected, retrying in 3s...');
                setTimeout(() => this.connect(url), 3000);
            });

        } catch (err) {
            console.error('WebSocket Init Error:', err);
            setTimeout(() => this.connect(url), 3000);
        }
    }

    handleASR(data) {
        // data 可能已经是对象，也可能是 JSON 字符串
        const payload = (typeof data === 'string') ? JSON.parse(data) : data;

        if (payload.text && payload.text.ws) {
            let sentence = '';
            payload.text.ws.forEach(wsItem => {
                wsItem.cw.forEach(cwItem => {
                    sentence += cwItem.w;
                });
            });

            // pgs === 'rpl' 代表这句话最终确定 (Right PLace?)
            // 讯飞/瓦力协议中，rpl 通常表示“替换/最终结果”
            if (payload.text.pgs === 'rpl') {
                this.emit('asr', sentence);
            }
        }
    }
}

module.exports = WaliAdapter;
