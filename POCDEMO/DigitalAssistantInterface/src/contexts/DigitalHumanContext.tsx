import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

// 瀹氫箟 DigitalMan 绫诲瀷 (鏃㈢劧娌℃湁 TS 瀹氫箟锛屾垜浠敤 any 鎴栫畝鍗曞畾涔?
// 瀹為檯椤圭洰涓簲璇ユ湁 types/DigitalMan.d.ts
type DigitalManInstance = any;

interface DigitalHumanContextType {
  connected: boolean;
  currentASR: string;
  currentReply: string;
  initializeDigitalHuman: (force?: boolean) => Promise<void>;
  sendInput: (text: string) => void;
  reset: () => void;
  vm: DigitalManInstance | null;
  error: string | null;
}

const DigitalHumanContext = createContext<DigitalHumanContextType | undefined>(undefined);

// 閰嶇疆 (浠?DEMO 绉绘)
// 娉ㄦ剰锛氬疄闄呯敓浜х幆澧冭繖浜涘簲璇ュ湪鐜鍙橀噺涓?const DM_CONFIG = {
  appkey: '486da5fd9397a2bedb1ed3a2c15e89be',
  appsecret: '864fbc28339cb8882560997adbd92845',
  licenseUrl: 'https://1251097609.trtcube-license.cn/license/v2/1251097609_1/v_cube.license',
  figure_id: '35967f5',
  voice_id: '10a1120',
  mobile: '13436983578',
  name: 'ServerModeSession_' + Date.now(),
  voice_volume: 10,
  voice_speed: 5
};

export function DigitalHumanProvider({ children }: { children: React.ReactNode }) {
  const [connected, setConnected] = useState(false);
  const [currentASR, setCurrentASR] = useState('');
  const [currentReply, setCurrentReply] = useState('');
  const [error, setError] = useState<string | null>(null);
  const vmRef = useRef<DigitalManInstance | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const isInitializing = useRef(false);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      if (vmRef.current && vmRef.current._closeConnection) {
        vmRef.current._closeConnection();
      }
      vmRef.current = null;
      isInitializing.current = false;
    };
  }, []);

  const initializeDigitalHuman = async (force = false) => {
    if (!force && (isInitializing.current || vmRef.current)) {
      console.log('鏁板瓧浜哄凡鍦ㄥ垵濮嬪寲鎴栧凡灏辩华锛岃烦杩囥€?);
      return;
    }
    if (force) {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      if (vmRef.current && vmRef.current._closeConnection) {
        vmRef.current._closeConnection();
      }
      vmRef.current = null;
    }
    isInitializing.current = true;
    setError(null); //娓呴櫎涔嬪墠鐨勯敊璇?
    console.log('姝ｅ湪鍒濆鍖栨暟瀛椾汉...');
    try {
      // 鍔ㄦ€佸鍏ワ紝閬垮厤鏈嶅姟绔覆鏌撻棶棰?(濡傛灉鐢?Next.js) 鎴?纭繚鍦ㄥ鎴风鎵ц
      // 杩欓噷鍋囪 DigitalMan.js 鏄?ES module
      const { DigitalMan } = await import('../utils/DigitalMan.js');

      const vm = new DigitalMan(DM_CONFIG);
      await vm._initializer();
      vmRef.current = vm;
      console.log('鉁?鏁板瓧浜哄噯澶囧氨缁?);

      // 鍒濆鍖栧悗杩炴帴鍚庣
      connectServer();
    } catch (e: any) {
      console.error('鏁板瓧浜哄垵濮嬪寲澶辫触:', e);
      setError(e.message || String(e));
    } finally {
      isInitializing.current = false;
    }
  };

  const connectServer = () => {
    if (wsRef.current) return;

    const ws = new WebSocket('ws://localhost:18080'); // 杩炴帴鏈湴 Node 鏈嶅姟
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      console.log('宸茶繛鎺ュ埌缂栨帓鍣?(Orchestrator)');
    };

    ws.onmessage = async (event: MessageEvent) => {
      try {
        const msg = JSON.parse(event.data);

        // 绫诲瀷鍒嗗彂
        if (msg.type === 'dialogue.reply') {
          if (msg.asrText) setCurrentASR(msg.asrText); // 鏇存柊鐢ㄦ埛璇寸殑璇?
          // 鎾姤鍥炲
          if (msg.assistantText) {
            setCurrentReply(msg.assistantText);
            await playAudio(msg.assistantText);
          }
        } else if (msg.type === 'asr.final') {
          // 濡傛灉鍚庣鍗曠嫭鎺?ASR
          setCurrentASR(msg.text);
        }
      } catch (e) {
        console.error('WS 娑堟伅閿欒:', e);
      }
    };

    ws.onclose = () => {
      setConnected(false);
      wsRef.current = null;
      // 閲嶈繛閫昏緫鍙互鏀惧湪杩欓噷
      setTimeout(connectServer, 3000);
    };

    ws.onerror = () => {
      // 閿欒澶勭悊
    };
  };

  const playAudio = async (text: string) => {
    if (!vmRef.current) return;
    try {
      console.log(`姝ｅ湪鎾姤: ${text}`);
      // 鍙戦€佹祦寮忔寚浠?      await vmRef.current._streamCommand(text);
      // 閲嶈锛氬己鍒剁粨鏉熸湰鍙ワ紝闃叉 SDK 鎸傝捣
      await vmRef.current._streamEnd();
    } catch (e) {
      console.error('鎾斁閿欒:', e);
    }
  };

  const sendInput = (text: string) => {
    if (vmRef.current && vmRef.current._interrupt) {
      try {
        vmRef.current._interrupt();
      } catch (e) { console.warn("Interrupt failed", e) }
    }

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'ui.input', text }));
    } else {
      console.warn('鍚庣鏈繛鎺?);
    }
  };

  const reset = () => {
    sendInput('閲嶇疆');
  };

  return (
    <DigitalHumanContext.Provider value={{
      connected,
      currentASR,
      currentReply,
      initializeDigitalHuman,
      sendInput,
      reset,
      vm: vmRef.current,
      error
    }}>
      {children}
    </DigitalHumanContext.Provider>
  );
}

export function useDigitalHuman() {
  const context = useContext(DigitalHumanContext);
  if (context === undefined) {
    throw new Error('useDigitalHuman must be used within a DigitalHumanProvider');
  }
  return context;
}




