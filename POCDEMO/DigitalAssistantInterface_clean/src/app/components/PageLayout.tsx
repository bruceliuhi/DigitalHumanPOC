import { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, ChevronDown, ChevronUp, Volume2, VolumeX } from 'lucide-react';
import backgroundImage from '@/assets/ecaed0cd4b311eba7cd9af4c2b67b89b7d40a9df.png';
import { useLanguage } from '@/contexts/LanguageContext';

interface PageLayoutProps {
  children: ReactNode;
  title: string;
  voiceStatus?: 'idle' | 'listening' | 'thinking' | 'speaking';
  auditLogs?: Array<{ timestamp: string; event: string; data: any }>;
  onInterrupt?: () => void;
  showAuditPanel?: boolean;
}

export const PageLayout = ({ 
  children, 
  title, 
  voiceStatus = 'idle',
  auditLogs = [],
  onInterrupt,
  showAuditPanel = false
}: PageLayoutProps) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const statusTexts = {
    zh: {
      idle: '等待中',
      listening: '正在聆听...',
      thinking: '处理中...',
      speaking: '正在播报...',
      back: '返回',
      auditLog: '审计日志',
      copyJson: '复制 JSON',
    },
    yue: {
      idle: '等待中',
      listening: '正在聽緊...',
      thinking: '處理緊...',
      speaking: '正在播報...',
      back: '返回',
      auditLog: '審計日誌',
      copyJson: '複製 JSON',
    },
    en: {
      idle: 'Idle',
      listening: 'Listening...',
      thinking: 'Processing...',
      speaking: 'Speaking...',
      back: 'Back',
      auditLog: 'Audit Log',
      copyJson: 'Copy JSON',
    }
  };

  const texts = statusTexts[language];

  const copyToClipboard = () => {
    const jsonStr = JSON.stringify(auditLogs, null, 2);
    navigator.clipboard.writeText(jsonStr);
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-blue-50/30 overflow-hidden relative">
      <div
        className="relative w-[540px] h-[960px] rounded-[40px] overflow-hidden bg-cover bg-center"
        style={{
          transform: 'scale(calc(min(100vh / 960, 100vw / 540) * 0.95))',
          backgroundImage: `url(${backgroundImage})`,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)'
        }}
      >
        {/* Header */}
        <div 
          className="absolute top-0 left-0 right-0 z-20 p-4 flex items-center justify-between"
          style={{
            background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 100%)',
          }}
        >
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-200 active:scale-95"
            style={{
              background: 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '0.5px solid rgba(255, 255, 255, 0.3)',
            }}
          >
            <ArrowLeft className="w-4 h-4" style={{ color: 'rgba(255, 255, 255, 0.95)' }} />
            <span 
              className="text-sm font-medium"
              style={{ color: 'rgba(255, 255, 255, 0.95)' }}
            >
              {texts.back}
            </span>
          </button>

          <h2 
            className="text-base font-semibold"
            style={{
              color: 'rgba(255, 255, 255, 1)',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
            }}
          >
            {title}
          </h2>

          {/* Voice Status Indicator */}
          <div 
            className="px-3 py-2 rounded-full flex items-center gap-2"
            style={{
              background: 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '0.5px solid rgba(255, 255, 255, 0.3)',
            }}
          >
            {voiceStatus === 'speaking' ? (
              <Volume2 className="w-4 h-4" style={{ color: 'rgba(34, 197, 94, 0.9)' }} />
            ) : (
              <VolumeX className="w-4 h-4" style={{ color: 'rgba(255, 255, 255, 0.7)' }} />
            )}
            <span 
              className="text-xs font-medium"
              style={{ color: 'rgba(255, 255, 255, 0.95)' }}
            >
              {texts[voiceStatus]}
            </span>
          </div>
        </div>

        {/* Digital Man Container */}
        <div id="Digital-Man-Container" className="absolute inset-0 z-0" />

        {/* Main Content */}
        <div className="absolute inset-0 z-10 flex flex-col justify-end pb-20">
          {children}
        </div>

        {/* Foldable Audit Panel */}
        {showAuditPanel && (
          <div 
            className="absolute bottom-0 left-0 right-0 z-30 transition-all duration-300"
            style={{
              transform: isPanelOpen ? 'translateY(0)' : 'translateY(calc(100% - 40px))',
            }}
          >
            <div
              className="rounded-t-[24px] overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(40px) saturate(180%)',
                WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              {/* Panel Header */}
              <button
                onClick={() => setIsPanelOpen(!isPanelOpen)}
                className="w-full px-5 py-3 flex items-center justify-between"
              >
                <span 
                  className="text-sm font-semibold"
                  style={{ color: 'rgba(255, 255, 255, 0.95)' }}
                >
                  {texts.auditLog} ({auditLogs.length})
                </span>
                {isPanelOpen ? (
                  <ChevronDown className="w-5 h-5" style={{ color: 'rgba(255, 255, 255, 0.9)' }} />
                ) : (
                  <ChevronUp className="w-5 h-5" style={{ color: 'rgba(255, 255, 255, 0.9)' }} />
                )}
              </button>

              {/* Panel Content */}
              <div className="px-5 pb-5 max-h-[300px] overflow-y-auto">
                <div className="flex justify-end mb-2">
                  <button
                    onClick={copyToClipboard}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 active:scale-95"
                    style={{
                      background: 'rgba(255, 255, 255, 0.4)',
                      color: 'rgba(17, 24, 39, 0.9)',
                      border: '0.5px solid rgba(255, 255, 255, 0.3)',
                    }}
                  >
                    {texts.copyJson}
                  </button>
                </div>
                <pre 
                  className="text-xs p-3 rounded-lg overflow-x-auto font-mono"
                  style={{
                    background: 'rgba(17, 24, 39, 0.7)',
                    color: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  {JSON.stringify(auditLogs, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
