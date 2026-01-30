import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

// 定义 DigitalMan 类型 (既然没有 TS 定义，我们用 any 或简单定义)
// 实际项目中应该有 types/DigitalMan.d.ts
type DigitalManInstance = any;

interface DigitalHumanContextType {
  connected: boolean;
  currentASR: string;
  currentReply: string;
  initializeDigitalHuman: () => Promise<void>;
  sendInput: (text: string) => void;
  reset: () => void;
  vm: DigitalManInstance | null;
}

const DigitalHumanContext = createContext<DigitalHumanContextType | undefined>(undefined);

// 配置 (从 DEMO 移植)
// 注意：实际生产环境这些应该在环境变量中
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
};

export function DigitalHumanProvider({ children }: { children: React.ReactNode }) {
  const [connected, setConnected] = useState(false);
  const [currentASR, setCurrentASR] = useState('');
  const [currentReply, setCurrentReply] = useState('');
  const vmRef = useRef<DigitalManInstance | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // 组件卸载时清理
    return () => {
      if (wsRef.current) wsRef.current.close();
      if (vmRef.current && vmRef.current._closeConnection) {
        vmRef.current._closeConnection();
      }
    };
  }, []);

  const initializeDigitalHuman = async () => {
    console.log('正在初始化数字人...');
    try {
      // 动态导入，避免服务端渲染问题 (如果用 Next.js) 或 确保在客户端执行
      // 这里假设 DigitalMan.js 是 ES module
      const { DigitalMan } = await import('../utils/DigitalMan.js');

      const vm = new DigitalMan(DM_CONFIG);
      await vm._initializer();
      vmRef.current = vm;
      console.log('✅ 数字人准备就绪');

      // 初始化后连接后端
      connectServer();
    } catch (e) {
      console.error('数字人初始化失败:', e);
    }
  };

  const connectServer = () => {
    if (wsRef.current) return;

    const ws = new WebSocket('ws://localhost:18080'); // 连接本地 Node 服务
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      console.log('已连接到编排器 (Orchestrator)');
    };

    ws.onmessage = async (event: MessageEvent) => {
      try {
        const msg = JSON.parse(event.data);

        // 类型分发
        if (msg.type === 'dialogue.reply') {
          if (msg.asrText) setCurrentASR(msg.asrText); // 更新用户说的话

          // 播报回复
          if (msg.assistantText) {
            setCurrentReply(msg.assistantText);
            await playAudio(msg.assistantText);
          }
        } else if (msg.type === 'asr.final') {
          // 如果后端单独推 ASR
          setCurrentASR(msg.text);
        }
      } catch (e) {
        console.error('WS 消息错误:', e);
      }
    };

    ws.onclose = () => {
      setConnected(false);
      wsRef.current = null;
      // 重连逻辑可以放在这里
      setTimeout(connectServer, 3000);
    };

    ws.onerror = () => {
      // 错误处理
    };
  };

  const playAudio = async (text: string) => {
    if (!vmRef.current) return;
    try {
      console.log(`正在播报: ${text}`);
      // 发送流式指令
      await vmRef.current._streamCommand(text);
      // 重要：强制结束本句，防止 SDK 挂起
      await vmRef.current._streamEnd();
    } catch (e) {
      console.error('播放错误:', e);
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
      console.warn('后端未连接');
    }
  };

  const reset = () => {
    sendInput('重置');
  };

  return (
    <DigitalHumanContext.Provider value={{
      connected,
      currentASR,
      currentReply,
      initializeDigitalHuman,
      sendInput,
      reset,
      vm: vmRef.current
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
