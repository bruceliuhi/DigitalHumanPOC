import { useNavigate } from 'react-router';
import backgroundImage from 'figma:asset/ecaed0cd4b311eba7cd9af4c2b67b89b7d40a9df.png';
import { CreditCard, Calendar, MessageCircle, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Home = () => {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();

  const texts = {
    zh: {
      greeting: '您好，我是您的智能助理',
      subtitle: '请选择您需要的语言',
      service1Title: '信用卡智能预审',
      service1Desc: '快速评估您的信用卡申请资格',
      service2Title: '开户 / 分行预约',
      service2Desc: '快速预约开户、预约临柜',
      service3Title: '银行智能服务问答',
      service3Desc: '智能问答文件、检索问题',
    },
    yue: {
      greeting: '你好，我係你嘅智能助理',
      subtitle: '請揀你需要嘅語言',
      service1Title: '信用卡智能預審',
      service1Desc: '快速評估你嘅信用卡申請資格',
      service2Title: '開戶 / 分行預約',
      service2Desc: '快速預約開戶、預約臨櫃',
      service3Title: '銀行智能服務問答',
      service3Desc: '智能問答文件、檢索問題',
    },
    en: {
      greeting: 'Hello, I am your AI Assistant',
      subtitle: 'Please select your language',
      service1Title: 'Credit Card Pre-approval',
      service1Desc: 'Assess your eligibility quickly',
      service2Title: 'Account Opening',
      service2Desc: 'Book account & branch services',
      service3Title: 'Banking Q&A',
      service3Desc: 'AI-powered banking answers',
    }
  };

  const currentTexts = texts[language];

  return (
    <div className="flex justify-center items-center w-screen h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-blue-50/30 overflow-hidden relative">
      <div
        id="Digital-Man"
        className="relative w-[540px] h-[960px] rounded-[40px] overflow-hidden bg-cover bg-center"
        style={{
          transform: 'scale(calc(min(100vh / 960, 100vw / 540) * 0.95))',
          backgroundImage: `url(${backgroundImage})`,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)'
        }}
      >
        {/* 标题和副标题 */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 text-center z-10">
          <h1 
            className="text-[1.5rem] font-semibold mb-2"
            style={{
              color: 'rgba(255, 255, 255, 1)',
              textShadow: '0 2px 12px rgba(0, 0, 0, 0.5), 0 0 2px rgba(0, 0, 0, 0.8), 0 1px 4px rgba(0, 0, 0, 0.6), 1px 1px 0 rgba(0, 0, 0, 0.4), -1px -1px 0 rgba(0, 0, 0, 0.4)',
              letterSpacing: '-0.01em',
              fontWeight: '700'
            }}
          >
            {currentTexts.greeting}
          </h1>
          <div className="flex items-center justify-center gap-2.5">
            <p 
              className="text-[0.9rem]"
              style={{
                color: 'rgba(255, 255, 255, 1)',
                textShadow: '0 1px 6px rgba(0, 0, 0, 0.5), 0 0 1px rgba(0, 0, 0, 0.8), 1px 1px 0 rgba(0, 0, 0, 0.3), -1px -1px 0 rgba(0, 0, 0, 0.3)',
                letterSpacing: '0.01em',
                fontWeight: '600'
              }}
            >
              {currentTexts.subtitle}
            </p>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'zh' | 'yue' | 'en')}
              className="px-3 py-1.5 rounded-full text-[0.75rem] font-medium cursor-pointer transition-all duration-200 focus:outline-none appearance-none bg-[length:7px] bg-[right_0.6rem_center] bg-no-repeat"
              style={{
                background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(250, 250, 252, 0.92))',
                color: 'rgba(17, 24, 39, 0.95)',
                border: '0.5px solid rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(30px) saturate(200%)',
                WebkitBackdropFilter: 'blur(30px) saturate(200%)',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1), 0 0.5px 1px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.1)',
                backgroundImage: `linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(250, 250, 252, 0.92)), url("data:image/svg+xml,%3Csvg width='7' height='5' viewBox='0 0 7 5' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L3.5 3.5L6 1' stroke='%2374797d' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                paddingRight: '2rem',
                fontWeight: '500',
                letterSpacing: '0.005em'
              }}
            >
              <option value="zh">普通话</option>
              <option value="yue">粤语</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        {/* 服务卡片 */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[480px] flex flex-col gap-2.5 z-10">
          <button
            className="p-3.5 rounded-[22px] flex items-center gap-3 transition-all duration-200 group active:scale-[0.98]"
            onClick={() => navigate('/credit-card')}
            style={{
              background: 'rgba(85, 90, 102, 0.32)',
              backdropFilter: 'blur(40px) saturate(180%)',
              WebkitBackdropFilter: 'blur(40px) saturate(180%)',
              border: '0.5px solid rgba(255, 255, 255, 0.18)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15), inset 0 0.5px 0.5px rgba(255, 255, 255, 0.1)'
            }}
          >
            <div 
              className="w-[46px] h-[46px] rounded-[13px] flex items-center justify-center flex-shrink-0"
              style={{
                background: 'rgba(255, 255, 255, 0.18)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '0.5px solid rgba(255, 255, 255, 0.15)'
              }}
            >
              <CreditCard className="w-[22px] h-[22px]" style={{ color: 'rgba(218, 165, 32, 0.95)' }} />
            </div>
            <div className="flex-1 text-left min-w-0">
              <h3 
                className="text-[0.9rem] font-semibold mb-0.5 leading-tight"
                style={{
                  color: 'rgba(255, 255, 255, 0.98)',
                  letterSpacing: '-0.02em',
                  fontWeight: '600'
                }}
              >
                {currentTexts.service1Title}
              </h3>
              <p 
                className="text-[0.72rem] leading-snug opacity-75"
                style={{
                  color: 'rgba(255, 255, 255, 0.85)',
                  letterSpacing: '-0.01em',
                  fontWeight: '400'
                }}
              >
                {currentTexts.service1Desc}
              </p>
            </div>
            <ChevronRight 
              className="w-[18px] h-[18px] opacity-40 group-hover:translate-x-0.5 group-hover:opacity-60 transition-all flex-shrink-0" 
              style={{ color: 'rgba(255, 255, 255, 1)' }} 
            />
          </button>

          <button
            className="p-3.5 rounded-[22px] flex items-center gap-3 transition-all duration-200 group active:scale-[0.98]"
            onClick={() => navigate('/appointment')}
            style={{
              background: 'rgba(85, 90, 102, 0.32)',
              backdropFilter: 'blur(40px) saturate(180%)',
              WebkitBackdropFilter: 'blur(40px) saturate(180%)',
              border: '0.5px solid rgba(255, 255, 255, 0.18)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15), inset 0 0.5px 0.5px rgba(255, 255, 255, 0.1)'
            }}
          >
            <div 
              className="w-[46px] h-[46px] rounded-[13px] flex items-center justify-center flex-shrink-0"
              style={{
                background: 'rgba(255, 255, 255, 0.18)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '0.5px solid rgba(255, 255, 255, 0.15)'
              }}
            >
              <Calendar className="w-[22px] h-[22px]" style={{ color: 'rgba(100, 149, 237, 0.95)' }} />
            </div>
            <div className="flex-1 text-left min-w-0">
              <h3 
                className="text-[0.9rem] font-semibold mb-0.5 leading-tight"
                style={{
                  color: 'rgba(255, 255, 255, 0.98)',
                  letterSpacing: '-0.02em',
                  fontWeight: '600'
                }}
              >
                {currentTexts.service2Title}
              </h3>
              <p 
                className="text-[0.72rem] leading-snug opacity-75"
                style={{
                  color: 'rgba(255, 255, 255, 0.85)',
                  letterSpacing: '-0.01em',
                  fontWeight: '400'
                }}
              >
                {currentTexts.service2Desc}
              </p>
            </div>
            <ChevronRight 
              className="w-[18px] h-[18px] opacity-40 group-hover:translate-x-0.5 group-hover:opacity-60 transition-all flex-shrink-0" 
              style={{ color: 'rgba(255, 255, 255, 1)' }} 
            />
          </button>

          <button
            className="p-3.5 rounded-[22px] flex items-center gap-3 transition-all duration-200 group active:scale-[0.98]"
            onClick={() => navigate('/faq')}
            style={{
              background: 'rgba(85, 90, 102, 0.32)',
              backdropFilter: 'blur(40px) saturate(180%)',
              WebkitBackdropFilter: 'blur(40px) saturate(180%)',
              border: '0.5px solid rgba(255, 255, 255, 0.18)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15), inset 0 0.5px 0.5px rgba(255, 255, 255, 0.1)'
            }}
          >
            <div 
              className="w-[46px] h-[46px] rounded-[13px] flex items-center justify-center flex-shrink-0"
              style={{
                background: 'rgba(255, 255, 255, 0.18)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '0.5px solid rgba(255, 255, 255, 0.15)'
              }}
            >
              <MessageCircle className="w-[22px] h-[22px]" style={{ color: 'rgba(72, 187, 170, 0.95)' }} />
            </div>
            <div className="flex-1 text-left min-w-0">
              <h3 
                className="text-[0.9rem] font-semibold mb-0.5 leading-tight"
                style={{
                  color: 'rgba(255, 255, 255, 0.98)',
                  letterSpacing: '-0.02em',
                  fontWeight: '600'
                }}
              >
                {currentTexts.service3Title}
              </h3>
              <p 
                className="text-[0.72rem] leading-snug opacity-75"
                style={{
                  color: 'rgba(255, 255, 255, 0.85)',
                  letterSpacing: '-0.01em',
                  fontWeight: '400'
                }}
              >
                {currentTexts.service3Desc}
              </p>
            </div>
            <ChevronRight 
              className="w-[18px] h-[18px] opacity-40 group-hover:translate-x-0.5 group-hover:opacity-60 transition-all flex-shrink-0" 
              style={{ color: 'rgba(255, 255, 255, 1)' }} 
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;