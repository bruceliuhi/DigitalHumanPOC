import { useState, useEffect, useRef } from 'react';
import { PageLayout } from '@/app/components/PageLayout';
import { faqData, matchFAQ, FALLBACK_ANSWER, FAQ as FAQType } from '@/data/faqData';
import { MessageCircle, Mic, Send, Keyboard } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  faqId?: string;
  isTransferring?: boolean;
}

type HandlerStatus = 'ai' | 'transferring' | 'human';

const FAQ = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const { language } = useLanguage();
  const [voiceStatus, setVoiceStatus] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
  const [auditLogs, setAuditLogs] = useState<Array<{ timestamp: string; event: string; data: any }>>([]);
  const [showQuickFAQs, setShowQuickFAQs] = useState(true);
  const [inputMode, setInputMode] = useState<'voice' | 'text'>('voice');
  const [handlerStatus, setHandlerStatus] = useState<HandlerStatus>('ai');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addAuditLog = (event: string, data: any) => {
    const log = {
      timestamp: new Date().toISOString(),
      event,
      data
    };
    setAuditLogs(prev => [...prev, log]);
  };

  useEffect(() => {
    addAuditLog('FAQ_PAGE_LOADED', { totalFAQs: faqData.length });
  }, []);

  const texts = {
    zh: {
      title: '银行智能服务问答',
      quickFAQTitle: '常见问题',
      inputPlaceholder: '输入您的问题...',
      voiceButton: '点击语音提问',
      sendButton: '发送',
      emptyState: '请选择下方问题或语音提问',
      switchToText: '切换到文字',
      switchToVoice: '切换到语音',
      statusAI: '🤖 AI 辅助处理中',
      statusTransferring: '⏳ 转人工中（Demo）',
      statusHuman: '👤 已转人工（Demo）',
      transferMessage: '这个问题需要由人工协助处理，我正在为你转接专员。',
      transferCard1: '转人工中（Demo）',
      transferCard2: '当前问题已交由人工处理',
      viewAllFAQs: '查看全部',
      listening: '正在聆听...',
      thinking: '识别中...',
    },
    yue: {
      title: '銀行智能服務問答',
      quickFAQTitle: '常見問題',
      inputPlaceholder: '輸入你嘅問題...',
      voiceButton: '撳語音提問',
      sendButton: '發送',
      emptyState: '請揀下面嘅問題或者語音提問',
      switchToText: '切換到文字',
      switchToVoice: '切換到語音',
      statusAI: '🤖 AI 輔助處理中',
      statusTransferring: '⏳ 轉人工中（Demo）',
      statusHuman: '👤 已轉人工（Demo）',
      transferMessage: '呢個問題需要人工協助處理，我正在幫你轉接專員。',
      transferCard1: '轉人工中（Demo）',
      transferCard2: '當前問題已交由人工處理',
      viewAllFAQs: '睇晒全部',
      listening: '聽緊你講...',
      thinking: '識別中...',
    },
    en: {
      title: 'Banking Q&A',
      quickFAQTitle: 'Frequently Asked Questions',
      inputPlaceholder: 'Enter your question...',
      voiceButton: 'Tap to speak',
      sendButton: 'Send',
      emptyState: 'Select a question below or ask by voice',
      switchToText: 'Switch to Text',
      switchToVoice: 'Switch to Voice',
      statusAI: '🤖 AI Assistance',
      statusTransferring: '⏳ Transferring (Demo)',
      statusHuman: '👤 Human Agent (Demo)',
      transferMessage: 'This question requires human assistance. I am transferring you to an agent.',
      transferCard1: 'Transferring (Demo)',
      transferCard2: 'Your question has been transferred to a human agent',
      viewAllFAQs: 'View All',
      listening: 'Listening...',
      thinking: 'Processing...',
    }
  };

  const t = texts[language];

  // Helper function to get localized FAQ text
  const getFAQQuestion = (faq: FAQType) => {
    if (language === 'zh') return faq.qZh || faq.q;
    if (language === 'yue') return faq.qYue || faq.q;
    if (language === 'en') return faq.qEn || faq.q;
    return faq.q;
  };

  const getFAQAnswer = (faq: FAQType) => {
    if (language === 'zh') return faq.aZh || faq.a;
    if (language === 'yue') return faq.aYue || faq.a;
    if (language === 'en') return faq.aEn || faq.a;
    return faq.a;
  };

  // 显示前3个FAQ作为快捷入口
  const quickFAQs = faqData.slice(0, 3);

  const handleFAQClick = (faq: FAQType) => {
    // 用户消息
    const userMessage: Message = {
      role: 'user',
      content: getFAQQuestion(faq),
    };

    // 助手回答
    const assistantMessage: Message = {
      role: 'assistant',
      content: getFAQAnswer(faq),
      faqId: faq.id,
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setShowQuickFAQs(false);

    // 审计日志
    addAuditLog('FAQ_BUTTON_CLICKED', {
      faqId: faq.id,
      question: faq.q,
      answer: faq.a,
      decision: faq.id,
      matchType: 'button_click'
    });

    // 模拟TTS播报
    setVoiceStatus('speaking');
    setTimeout(() => {
      setVoiceStatus('idle');
    }, 2000);
  };

  const handleTextInput = (text: string) => {
    if (!text.trim()) return;

    // 用户消息
    const userMessage: Message = {
      role: 'user',
      content: text,
    };

    // 匹配FAQ
    const matchResult = matchFAQ(text);

    if (matchResult.matched && matchResult.faq) {
      // 命中FAQ
      const assistantMessage: Message = {
        role: 'assistant',
        content: getFAQAnswer(matchResult.faq),
        faqId: matchResult.faq.id,
      };

      setMessages(prev => [...prev, userMessage, assistantMessage]);

      addAuditLog('FAQ_TEXT_MATCHED', {
        userInput: text,
        faqId: matchResult.faq.id,
        question: matchResult.faq.q,
        answer: matchResult.faq.a,
        decision: matchResult.decision,
        matchType: 'text_input'
      });

      // 模拟TTS播报
      setVoiceStatus('speaking');
      setTimeout(() => {
        setVoiceStatus('idle');
      }, 2000);
    } else {
      // 未命中 - 触发转人工
      setMessages(prev => [...prev, userMessage]);
      
      // 开始转人工流程
      setHandlerStatus('transferring');
      
      // 数字人播报转人工消息
      const transferringMessage: Message = {
        role: 'assistant',
        content: t.transferMessage,
      };
      
      setTimeout(() => {
        setMessages(prev => [...prev, transferringMessage]);
        
        // 显示转人工状态卡片
        const transferCard: Message = {
          role: 'system',
          content: `${t.transferCard1}\n${t.transferCard2}`,
          isTransferring: true,
        };
        
        setTimeout(() => {
          setMessages(prev => [...prev, transferCard]);
          
          // 模拟转人工完成
          setTimeout(() => {
            setHandlerStatus('human');
          }, 2000);
        }, 1000);
      }, 500);

      addAuditLog('FAQ_TRANSFER_TO_HUMAN', {
        userInput: text,
        decision: matchResult.decision,
        reason: matchResult.reason,
      });

      // 模拟TTS播报
      setVoiceStatus('speaking');
      setTimeout(() => {
        setVoiceStatus('idle');
      }, 3000);
    }

    setShowQuickFAQs(false);
    setInputText('');
  };

  const handleVoiceInput = () => {
    // 模拟语音输入
    setVoiceStatus('listening');
    addAuditLog('VOICE_INPUT_STARTED', {});

    // 模拟ASR识别
    setTimeout(() => {
      setVoiceStatus('thinking');
      
      // 模拟识别到的文本
      const simulatedASR = '開戶需要準備哪些文件？';
      
      setTimeout(() => {
        handleTextInput(simulatedASR);
        addAuditLog('VOICE_INPUT_COMPLETED', { asrResult: simulatedASR });
      }, 500);
    }, 1500);
  };

  const renderContent = () => {
    return (
      <div className="px-6 flex flex-col h-full pt-20">
        {/* Handler Status Badge - Always Visible */}
        <div className="mb-3 flex justify-center">
          <div
            className="px-4 py-2 rounded-full transition-all duration-300"
            style={{
              background: handlerStatus === 'ai' 
                ? 'rgba(59, 130, 246, 0.85)'
                : handlerStatus === 'transferring'
                ? 'rgba(251, 191, 36, 0.85)'
                : 'rgba(16, 185, 129, 0.85)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            <span 
              className="text-xs font-medium"
              style={{ color: 'rgba(255, 255, 255, 0.98)' }}
            >
              {handlerStatus === 'ai' && t.statusAI}
              {handlerStatus === 'transferring' && t.statusTransferring}
              {handlerStatus === 'human' && t.statusHuman}
            </span>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-3">
          {messages.length === 0 && showQuickFAQs && (
            <div className="text-center py-8">
              <MessageCircle 
                className="w-12 h-12 mx-auto mb-3 opacity-60" 
                style={{ color: 'rgba(255, 255, 255, 0.8)' }} 
              />
              <p 
                className="text-sm opacity-75"
                style={{ color: 'rgba(255, 255, 255, 0.85)' }}
              >
                {t.emptyState}
              </p>
            </div>
          )}

          {messages.map((msg, idx) => {
            // 转人工状态卡片
            if (msg.role === 'system' && msg.isTransferring) {
              return (
                <div key={idx} className="flex justify-center">
                  <div
                    className="max-w-[85%] px-5 py-4 rounded-[18px] text-center"
                    style={{
                      background: 'rgba(251, 191, 36, 0.2)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: '1px solid rgba(251, 191, 36, 0.4)',
                      boxShadow: '0 4px 16px rgba(251, 191, 36, 0.15)',
                    }}
                  >
                    <p 
                      className="text-sm font-semibold mb-1"
                      style={{ color: 'rgba(255, 255, 255, 0.98)' }}
                    >
                      {t.transferCard1}
                    </p>
                    <p 
                      className="text-xs"
                      style={{ color: 'rgba(255, 255, 255, 0.85)' }}
                    >
                      {t.transferCard2}
                    </p>
                  </div>
                </div>
              );
            }

            // 普通消息
            return (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className="max-w-[80%] px-4 py-3 rounded-[18px]"
                  style={{
                    background: msg.role === 'user' 
                      ? 'rgba(59, 130, 246, 0.9)'
                      : 'rgba(255, 255, 255, 0.3)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
                  }}
                >
                  <p 
                    className="text-sm leading-relaxed whitespace-pre-line"
                    style={{ 
                      color: msg.role === 'user' 
                        ? 'rgba(255, 255, 255, 0.98)' 
                        : 'rgba(255, 255, 255, 0.95)' 
                    }}
                  >
                    {msg.content}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick FAQ Buttons */}
        {showQuickFAQs && (
          <div className="mb-4">
            <h3 
              className="text-sm font-semibold mb-3 text-center"
              style={{ color: 'rgba(255, 255, 255, 0.95)' }}
            >
              {t.quickFAQTitle}
            </h3>
            <div className="space-y-2">
              {quickFAQs.map((faq) => (
                <button
                  key={faq.id}
                  onClick={() => handleFAQClick(faq)}
                  className="w-full p-3 rounded-[16px] text-left transition-all duration-200 active:scale-[0.98]"
                  style={{
                    background: 'rgba(255, 255, 255, 0.25)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
                  }}
                >
                  <p 
                    className="text-sm font-medium"
                    style={{ color: 'rgba(255, 255, 255, 0.95)' }}
                  >
                    {getFAQQuestion(faq)}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        {inputMode === 'voice' ? (
          // Voice Mode - 只显示大语音按钮
          <div className="flex flex-col gap-2">
            <button
              onClick={handleVoiceInput}
              disabled={voiceStatus !== 'idle'}
              className="w-full py-4 rounded-[20px] flex items-center justify-center gap-3 transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
              style={{
                background: voiceStatus === 'listening' 
                  ? 'rgba(239, 68, 68, 0.9)' 
                  : 'rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(40px) saturate(180%)',
                WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              }}
            >
              <Mic 
                className="w-6 h-6" 
                style={{ 
                  color: voiceStatus === 'listening' 
                    ? 'rgba(255, 255, 255, 0.98)' 
                    : 'rgba(255, 255, 255, 0.9)' 
                }} 
              />
              <span 
                className="text-sm font-medium"
                style={{ 
                  color: voiceStatus === 'listening' 
                    ? 'rgba(255, 255, 255, 0.98)' 
                    : 'rgba(255, 255, 255, 0.95)' 
                }}
              >
                {voiceStatus === 'listening' ? t.listening : 
                 voiceStatus === 'thinking' ? t.thinking : 
                 t.voiceButton}
              </span>
            </button>
            <button
              onClick={() => setInputMode('text')}
              className="text-xs py-2 rounded-[14px] transition-all duration-200 active:scale-[0.98]"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                color: 'rgba(255, 255, 255, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <Keyboard className="w-4 h-4 inline-block mr-1" />
              {t.switchToText}
            </button>
          </div>
        ) : (
          // Text Mode - 显示文字输入框
          <div className="flex flex-col gap-2">
            <div
              className="p-3 rounded-[20px] flex items-center gap-2"
              style={{
                background: 'rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(40px) saturate(180%)',
                WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              }}
            >
              {/* Text Input */}
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleTextInput(inputText);
                  }
                }}
                placeholder={t.inputPlaceholder}
                className="flex-1 bg-transparent outline-none text-sm"
                style={{
                  color: 'rgba(255, 255, 255, 0.95)',
                }}
                autoFocus
              />

              {/* Send Button */}
              <button
                onClick={() => handleTextInput(inputText)}
                disabled={!inputText.trim()}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 disabled:opacity-50"
                style={{
                  background: 'rgba(59, 130, 246, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <Send className="w-5 h-5" style={{ color: 'rgba(255, 255, 255, 0.95)' }} />
              </button>
            </div>
            <button
              onClick={() => setInputMode('voice')}
              className="text-xs py-2 rounded-[14px] transition-all duration-200 active:scale-[0.98]"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                color: 'rgba(255, 255, 255, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <Mic className="w-4 h-4 inline-block mr-1" />
              {t.switchToVoice}
            </button>
          </div>
        )}

        {/* All FAQs List (Collapsible) */}
        {!showQuickFAQs && messages.length > 0 && (
          <div className="mt-3">
            <details className="group">
              <summary 
                className="cursor-pointer text-xs text-center py-2"
                style={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                {t.viewAllFAQs} {faqData.length} {language === 'zh' ? '个问题' : language === 'yue' ? '個問題' : 'Questions'}
              </summary>
              <div className="mt-2 space-y-2 max-h-[200px] overflow-y-auto">
                {faqData.map((faq) => (
                  <button
                    key={faq.id}
                    onClick={() => handleFAQClick(faq)}
                    className="w-full p-2.5 rounded-[14px] text-left transition-all duration-200 active:scale-[0.98]"
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    <p 
                      className="text-xs font-medium"
                      style={{ color: 'rgba(255, 255, 255, 0.9)' }}
                    >
                      {getFAQQuestion(faq)}
                    </p>
                  </button>
                ))}
              </div>
            </details>
          </div>
        )}
      </div>
    );
  };

  return (
    <PageLayout 
      title={t.title}
      voiceStatus={voiceStatus}
      auditLogs={auditLogs}
      showAuditPanel={false}
    >
      <div className="h-[calc(100vh-200px)] flex flex-col">
        {renderContent()}
      </div>
    </PageLayout>
  );
};

export default FAQ;