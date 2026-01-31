import React, { useEffect, useRef } from 'react';
import { useDigitalHuman } from '@/contexts/DigitalHumanContext';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';

// 如果没有 shadcn/ui，定义简单组件
const SimpleButton = ({ children, onClick, variant, className }: any) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 rounded text-white ${variant === 'destructive' ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} ${className}`}
    >
        {children}
    </button>
);

const DigitalHuman = () => {
    const { connected, currentASR, currentReply, initializeDigitalHuman, sendInput, reset, vm } = useDigitalHuman();
    const containerRef = useRef<HTMLDivElement>(null);
    const videoContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // 初始化 SDK
        initializeDigitalHuman();
    }, []);

    // 监听 DigitalMan 的视频元素挂载
    // DigitalMan SDK 通常会自己创建 video 元素，我们需要确保它挂载到正确位置
    // 在 Context 中初始化时，它可能已经寻找 id='Digital-Man' 的元素了
    // 所以我们在 return 中必须提供这个 id

    return (
        <div className="flex h-screen bg-slate-50 items-center justify-center gap-8 p-4">
            {/* 数字人容器 */}
            {/* 背景图片需求：主页背景图片要换成DEMO中真正数字人形象 */}
            {/* 这里我们把数字人渲染层作为主要展示，背景可以是静态图，但 SDK 会覆盖 */}
            <div
                id="Digital-Man"
                ref={videoContainerRef}
                className="w-[540px] h-[960px] bg-black rounded-lg shadow-2xl overflow-hidden relative"
            >
                {/* 这里 DigitalMan SDK 会插入 video/canvas */}
                {!vm && (
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                        Loading Digital Human...
                    </div>
                )}
            </div>

            {/* 控制面板 */}
            <Card className="w-[400px] h-auto shadow-xl bg-white/90 backdrop-blur">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        🤖 银行助手
                        <Badge variant={connected ? "default" : "destructive"}>
                            {connected ? 'Online' : 'Offline'}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">

                    <div className="space-y-4">
                        <div className="bg-slate-100 p-3 rounded-md">
                            <span className="text-xs font-bold text-slate-500 block mb-1">🔌 Server Connection</span>
                            <span className={`text-sm font-semibold ${connected ? 'text-green-600' : 'text-red-500'}`}>
                                {connected ? '已连接' : '断开 (连接中...)'}
                            </span>
                        </div>

                        <div className="bg-slate-100 p-3 rounded-md min-h-[80px]">
                            <span className="text-xs font-bold text-slate-500 block mb-1">👂 用户说 (User Input)</span>
                            <p className="text-sm text-slate-800">{currentASR || '...'}</p>
                        </div>

                        <div className="bg-slate-100 p-3 rounded-md min-h-[80px]">
                            <span className="text-xs font-bold text-slate-500 block mb-1">🤖 数字人答 (Assistant Reply)</span>
                            <p className="text-sm text-slate-800">{currentReply || '...'}</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <SimpleButton onClick={() => sendInput('开始信用卡预审')}>
                            🛠 手动触发：信用卡预审
                        </SimpleButton>
                        <SimpleButton onClick={() => sendInput('开始预约')} className="bg-indigo-500 hover:bg-indigo-600">
                            📅 手动触发：预约
                        </SimpleButton>
                        <SimpleButton onClick={() => reset()} variant="destructive">
                            🛑 打断 / 重置
                        </SimpleButton>
                    </div>

                </CardContent>
            </Card>
        </div>
    );
};

export default DigitalHuman;
