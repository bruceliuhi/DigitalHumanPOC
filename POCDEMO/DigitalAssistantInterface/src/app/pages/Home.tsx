import { useNavigate } from 'react-router';
import { CreditCard, Calendar, MessageCircle, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDigitalHuman } from '@/contexts/DigitalHumanContext';
import { useEffect, useState } from 'react';

const Home = () => {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const { initializeDigitalHuman, error, connected, currentASR, currentReply, sendInput } = useDigitalHuman();
  const [debugMsg, setDebugMsg] = useState('');

  useEffect(() => {
    // 寤惰繜鍒濆鍖栵紝纭繚 DOM 鍏冪礌宸茬粡瀹屽叏鎸傝浇
    const timer = setTimeout(async () => {
      console.log('Delayed Start: Initializing Digital Human...');
      await initializeDigitalHuman();
    }, 1000); // 1绉掑欢杩?
    return () => clearTimeout(timer);
  }, []);

  const handleForcePlay = () => {
    const video = document.querySelector('video');
    if (video) {
      video.muted = false;
      video.play()
        .then(() => setDebugMsg('Video playing...'))
        .catch(e => setDebugMsg('Play error: ' + e.message));
    } else {
      setDebugMsg('No video element found');
    }
  };

  const texts = {
    zh: {
      greeting: '鎮ㄥソ锛屾垜鏄偍鐨勬櫤鑳藉姪鐞?,
      subtitle: '璇烽€夋嫨鎮ㄩ渶瑕佺殑璇█',
      service1Title: '淇＄敤鍗℃櫤鑳介瀹?,
      service1Desc: '蹇€熻瘎浼版偍鐨勪俊鐢ㄥ崱鐢宠璧勬牸',
      service2Title: '寮€鎴?/ 鍒嗚棰勭害',
      service2Desc: '蹇€熼绾﹀紑鎴枫€侀绾︿复鏌?,
      service3Title: '閾惰鏅鸿兘鏈嶅姟闂瓟',
      service3Desc: '鏅鸿兘闂瓟鏂囦欢銆佹绱㈤棶棰?,
    },
    yue: {
      greeting: '浣犲ソ锛屾垜淇備綘鍢呮櫤鑳藉姪鐞?,
      subtitle: '璜嬫弨浣犻渶瑕佸槄瑾炶█',
      service1Title: '淇＄敤鍗℃櫤鑳介爯瀵?,
      service1Desc: '蹇€熻浼颁綘鍢呬俊鐢ㄥ崱鐢宠珛璩囨牸',
      service2Title: '闁嬫埗 / 鍒嗚闋愮磩',
      service2Desc: '蹇€熼爯绱勯枊鎴躲€侀爯绱勮嚚娅?,
      service3Title: '閵€琛屾櫤鑳芥湇鍕欏晱绛?,
      service3Desc: '鏅鸿兘鍟忕瓟鏂囦欢銆佹绱㈠晱椤?,
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
      service3Title: '馃彟 Account Mgmt',
      service3Desc: "Transfers, remittances and security"
    }
  };

  const currentTexts = texts[language];

  return (
    <div className="flex justify-center items-center w-screen h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-blue-50/30 overflow-hidden relative">

      {/* 閿欒鎻愮ず - 姘歌繙鏄剧ず鍦ㄦ渶涓婂眰 */}
      {error && (
        <div className="absolute top-0 left-0 w-full bg-red-600 text-white p-4 z-[9999] text-center font-bold font-mono">
          馃毃 SDK Error: {error}
        </div>
      )}

      {/* 璋冭瘯闈㈡澘 */}
      <div className="absolute top-4 right-4 z-[9999] bg-black/80 text-white p-4 rounded-lg text-xs font-mono max-w-[300px]">
        <div className="mb-2 font-bold text-yellow-400">馃敡 Debug Panel</div>
        <div>Status: {connected ? '馃煝 Connected' : '馃敶 Disconnected'}</div>
        <div className="my-2 border-t border-gray-600 pt-2">
          <button onClick={handleForcePlay} className="bg-blue-600 px-2 py-1 rounded mr-2 mb-2">
            鈻讹笍 寮哄埗鎾斁瑙嗛
          </button>
          <button onClick={() => sendInput('浣犲ソ')} className="bg-green-600 px-2 py-1 rounded mb-2">
            馃挰 鍙戦€?浣犲ソ"
          </button>
        </div>
        {debugMsg && <div className="text-red-300">Log: {debugMsg}</div>}
        <div className="mt-2 text-gray-400">User: {currentASR || '-'}</div>
        <div className="mt-1 text-green-400">AI: {currentReply || '-'}</div>
      </div>

      <div
        id="Digital-Man"
        className="relative rounded-[40px] overflow-hidden bg-black"
        style={{
          width: '540px',
          height: '960px',
          // transform: 'scale(calc(min(100vh / 960, 100vw / 540) * 0.95))', // 鏆傛椂娉ㄩ噴鎺夌缉鏀撅紝鎺掗櫎鍧愭爣璁＄畻骞叉壈
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)'
        }}
      >
        {/* 鏍囬鍜屽壇鏍囬 */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 text-center z-10 w-full px-4">
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
              <option value="zh">鏅€氳瘽</option>
              <option value="yue">绮よ</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        {/* 鏈嶅姟鍗＄墖 */}
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

