import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { PageLayout } from '@/app/components/PageLayout';
import { createPreApprovalCase } from '@/services/mockApi';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

type Step = 'intro' | 'q1' | 'q2' | 'q3' | 'result' | 'creating' | 'success' | 'error';

interface Answers {
  ageInRange?: boolean;
  hasStableIncome?: boolean;
  hasLocalId?: boolean;
}

const CreditCardPreApproval = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [step, setStep] = useState<Step>('intro');
  const [answers, setAnswers] = useState<Answers>({});
  const [caseId, setCaseId] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [voiceStatus, setVoiceStatus] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
  const [auditLogs, setAuditLogs] = useState<Array<{ timestamp: string; event: string; data: any }>>([]);

  const addAuditLog = (event: string, data: any) => {
    const log = {
      timestamp: new Date().toISOString(),
      event,
      data
    };
    setAuditLogs(prev => [...prev, log]);
  };

  useEffect(() => {
    addAuditLog('PAGE_LOADED', { step: 'intro' });
  }, []);

  const texts = {
    zh: {
      title: '信用卡智能预审',
      introTitle: '我可以帮你快速评估信用卡申请资格',
      startButton: '开始评估',
      q1: '请问你的年龄是否介于 20–65 岁？',
      q2: '是否目前有稳定收入？',
      q3: '是否持有本地身份证件？',
      yes: '是',
      no: '否',
      voiceHint: '可说 "是" 或 "否"',
      retryHint: '我没有听清，请说是或否',
      passTitle: '✓ 符合初步申请条件',
      passMessage: '根据你提供的资料，你符合初步申请条件',
      failTitle: '× 可能暂不符合条件',
      failMessage: '根据你提供的资料，你可能暂不符合申请条件，可由专人协助评估',
      createButton: '建立申请记录',
      creating: '正在建立记录...',
      successTitle: '✓ 已建立申请记录',
      successMessage: '专人将跟进处理',
      caseIdLabel: '申请编号',
      backHome: '返回首页',
      retry: '重试',
      errorTitle: '× 建立失败',
    },
    yue: {
      title: '信用卡智能預審',
      introTitle: '我可以幫你快速評估信用卡申請資格',
      startButton: '開始評估',
      q1: '請問你嘅年齡係唔係介於 20–65 歲？',
      q2: '係唔係目前有穩定收入？',
      q3: '係唔係持有本地身份證件？',
      yes: '係',
      no: '唔係',
      voiceHint: '可以講 "係" 或 "唔係"',
      retryHint: '我冇聽清楚，請講係定唔係',
      passTitle: '✓ 符合初步申請條件',
      passMessage: '根據你提供嘅資料，你符合初步申請條件',
      failTitle: '× 可能暫時唔符合條件',
      failMessage: '根據你提供嘅資料，你可能暫時唔符合申請條件，可由專人協助評估',
      createButton: '建立申請記錄',
      creating: '正在建立記錄...',
      successTitle: '✓ 已建立申請記錄',
      successMessage: '專人將跟進處理',
      caseIdLabel: '申請編號',
      backHome: '返回主頁',
      retry: '重試',
      errorTitle: '× 建立失敗',
    },
    en: {
      title: 'Credit Card Pre-Approval',
      introTitle: 'I can help you quickly assess your credit card eligibility',
      startButton: 'Start Assessment',
      q1: 'Is your age between 20 and 65?',
      q2: 'Do you currently have a stable income?',
      q3: 'Do you hold a local ID?',
      yes: 'Yes',
      no: 'No',
      voiceHint: 'You can say "Yes" or "No"',
      retryHint: 'I didn\'t catch that, please say yes or no',
      passTitle: '✓ You Meet the Initial Requirements',
      passMessage: 'Based on the information provided, you meet the initial application requirements',
      failTitle: '× May Not Meet Requirements',
      failMessage: 'Based on the information provided, you may not meet the requirements. Our staff can assist with further assessment',
      createButton: 'Create Application Record',
      creating: 'Creating record...',
      successTitle: '✓ Application Record Created',
      successMessage: 'Our staff will follow up',
      caseIdLabel: 'Application ID',
      backHome: 'Back to Home',
      retry: 'Retry',
      errorTitle: '× Creation Failed',
    }
  };

  const t = texts[language];

  const handleAnswer = (answer: boolean, questionKey: keyof Answers) => {
    const newAnswers = { ...answers, [questionKey]: answer };
    setAnswers(newAnswers);
    addAuditLog('ANSWER_RECORDED', { question: questionKey, answer });

    // Move to next step
    if (step === 'q1') {
      setStep('q2');
      addAuditLog('STEP_CHANGED', { from: 'q1', to: 'q2' });
    } else if (step === 'q2') {
      setStep('q3');
      addAuditLog('STEP_CHANGED', { from: 'q2', to: 'q3' });
    } else if (step === 'q3') {
      setStep('result');
      addAuditLog('STEP_CHANGED', { from: 'q3', to: 'result' });
      addAuditLog('RESULT_CALCULATED', { answers: newAnswers, passed: checkPassed(newAnswers) });
    }
  };

  const checkPassed = (ans: Answers = answers): boolean => {
    return ans.ageInRange === true && ans.hasStableIncome === true && ans.hasLocalId === true;
  };

  const handleCreateCase = async () => {
    setStep('creating');
    addAuditLog('CREATE_CASE_INITIATED', { answers });

    try {
      const sessionId = `session-${Date.now()}`;
      const response = await createPreApprovalCase({
        sessionId,
        answers: {
          ageInRange: answers.ageInRange || false,
          hasStableIncome: answers.hasStableIncome || false,
          hasLocalId: answers.hasLocalId || false,
        },
        channel: 'H5',
        language: language === 'zh' ? 'zh-TW' : language === 'yue' ? 'zh-HK' : 'en-US',
      });

      if (response.status === 'created' && response.PreApprovalCaseID) {
        setCaseId(response.PreApprovalCaseID);
        setStep('success');
        addAuditLog('CREATE_CASE_SUCCESS', { caseId: response.PreApprovalCaseID });
      } else {
        setErrorMessage(response.error || '未知错误');
        setStep('error');
        addAuditLog('CREATE_CASE_FAILED', { error: response.error });
      }
    } catch (error) {
      setErrorMessage('网络错误，请稍后重试');
      setStep('error');
      addAuditLog('CREATE_CASE_ERROR', { error: String(error) });
    }
  };

  const renderContent = () => {
    // Step 1: Intro
    if (step === 'intro') {
      return (
        <div className="px-6">
          <div
            className="p-6 rounded-[24px]"
            style={{
              background: 'rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(40px) saturate(180%)',
              WebkitBackdropFilter: 'blur(40px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            }}
          >
            <p 
              className="text-center text-lg mb-6"
              style={{ color: 'rgba(255, 255, 255, 0.95)' }}
            >
              {t.introTitle}
            </p>
            <button
              onClick={() => {
                setStep('q1');
                addAuditLog('ASSESSMENT_STARTED', {});
              }}
              className="w-full py-3.5 rounded-[18px] text-base font-semibold transition-all duration-200 active:scale-[0.97]"
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                color: 'rgba(17, 24, 39, 0.95)',
                border: '0.5px solid rgba(255, 255, 255, 0.5)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              }}
            >
              {t.startButton}
            </button>
          </div>
        </div>
      );
    }

    // Step 2: Questions
    if (step === 'q1' || step === 'q2' || step === 'q3') {
      const questionMap = {
        q1: { text: t.q1, key: 'ageInRange' as keyof Answers },
        q2: { text: t.q2, key: 'hasStableIncome' as keyof Answers },
        q3: { text: t.q3, key: 'hasLocalId' as keyof Answers },
      };

      const question = questionMap[step];

      return (
        <div className="px-6">
          <div
            className="p-6 rounded-[24px]"
            style={{
              background: 'rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(40px) saturate(180%)',
              WebkitBackdropFilter: 'blur(40px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            }}
          >
            <p 
              className="text-center text-lg mb-4"
              style={{ color: 'rgba(255, 255, 255, 0.95)' }}
            >
              {question.text}
            </p>
            <p 
              className="text-center text-sm mb-6 opacity-75"
              style={{ color: 'rgba(255, 255, 255, 0.85)' }}
            >
              {t.voiceHint}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleAnswer(true, question.key)}
                className="flex-1 py-3.5 rounded-[18px] text-base font-semibold transition-all duration-200 active:scale-[0.97]"
                style={{
                  background: 'rgba(34, 197, 94, 0.9)',
                  color: 'rgba(255, 255, 255, 0.98)',
                  border: '0.5px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
                }}
              >
                {t.yes}
              </button>
              <button
                onClick={() => handleAnswer(false, question.key)}
                className="flex-1 py-3.5 rounded-[18px] text-base font-semibold transition-all duration-200 active:scale-[0.97]"
                style={{
                  background: 'rgba(239, 68, 68, 0.9)',
                  color: 'rgba(255, 255, 255, 0.98)',
                  border: '0.5px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                }}
              >
                {t.no}
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Step 3: Result
    if (step === 'result') {
      const passed = checkPassed();

      return (
        <div className="px-6">
          <div
            className="p-6 rounded-[24px]"
            style={{
              background: 'rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(40px) saturate(180%)',
              WebkitBackdropFilter: 'blur(40px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            }}
          >
            <div className="flex items-center justify-center mb-4">
              {passed ? (
                <CheckCircle className="w-16 h-16" style={{ color: 'rgba(34, 197, 94, 0.9)' }} />
              ) : (
                <XCircle className="w-16 h-16" style={{ color: 'rgba(239, 68, 68, 0.9)' }} />
              )}
            </div>
            <h3 
              className="text-center text-xl font-bold mb-3"
              style={{ color: 'rgba(255, 255, 255, 0.98)' }}
            >
              {passed ? t.passTitle : t.failTitle}
            </h3>
            <p 
              className="text-center text-base mb-6"
              style={{ color: 'rgba(255, 255, 255, 0.9)' }}
            >
              {passed ? t.passMessage : t.failMessage}
            </p>
            {passed && (
              <button
                onClick={handleCreateCase}
                className="w-full py-3.5 rounded-[18px] text-base font-semibold transition-all duration-200 active:scale-[0.97]"
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  color: 'rgba(17, 24, 39, 0.95)',
                  border: '0.5px solid rgba(255, 255, 255, 0.5)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                }}
              >
                {t.createButton}
              </button>
            )}
          </div>
        </div>
      );
    }

    // Step 4: Creating
    if (step === 'creating') {
      return (
        <div className="px-6">
          <div
            className="p-6 rounded-[24px] flex flex-col items-center"
            style={{
              background: 'rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(40px) saturate(180%)',
              WebkitBackdropFilter: 'blur(40px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            }}
          >
            <Loader2 className="w-12 h-12 mb-4 animate-spin" style={{ color: 'rgba(59, 130, 246, 0.9)' }} />
            <p 
              className="text-center text-lg"
              style={{ color: 'rgba(255, 255, 255, 0.95)' }}
            >
              {t.creating}
            </p>
          </div>
        </div>
      );
    }

    // Success
    if (step === 'success') {
      return (
        <div className="px-6">
          <div
            className="p-6 rounded-[24px]"
            style={{
              background: 'rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(40px) saturate(180%)',
              WebkitBackdropFilter: 'blur(40px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            }}
          >
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="w-16 h-16" style={{ color: 'rgba(34, 197, 94, 0.9)' }} />
            </div>
            <h3 
              className="text-center text-xl font-bold mb-3"
              style={{ color: 'rgba(255, 255, 255, 0.98)' }}
            >
              {t.successTitle}
            </h3>
            <div 
              className="p-4 rounded-lg mb-4"
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <p 
                className="text-sm opacity-75 mb-1"
                style={{ color: 'rgba(255, 255, 255, 0.85)' }}
              >
                {t.caseIdLabel}
              </p>
              <p 
                className="text-lg font-mono font-semibold"
                style={{ color: 'rgba(255, 255, 255, 0.98)' }}
              >
                {caseId}
              </p>
            </div>
            <p 
              className="text-center text-base mb-6"
              style={{ color: 'rgba(255, 255, 255, 0.9)' }}
            >
              {t.successMessage}
            </p>
            <button
              onClick={() => navigate('/')}
              className="w-full py-3.5 rounded-[18px] text-base font-semibold transition-all duration-200 active:scale-[0.97]"
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                color: 'rgba(17, 24, 39, 0.95)',
                border: '0.5px solid rgba(255, 255, 255, 0.5)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              }}
            >
              {t.backHome}
            </button>
          </div>
        </div>
      );
    }

    // Error
    if (step === 'error') {
      return (
        <div className="px-6">
          <div
            className="p-6 rounded-[24px]"
            style={{
              background: 'rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(40px) saturate(180%)',
              WebkitBackdropFilter: 'blur(40px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            }}
          >
            <div className="flex items-center justify-center mb-4">
              <XCircle className="w-16 h-16" style={{ color: 'rgba(239, 68, 68, 0.9)' }} />
            </div>
            <h3 
              className="text-center text-xl font-bold mb-3"
              style={{ color: 'rgba(255, 255, 255, 0.98)' }}
            >
              {t.errorTitle}
            </h3>
            <p 
              className="text-center text-base mb-6"
              style={{ color: 'rgba(255, 255, 255, 0.9)' }}
            >
              {errorMessage}
            </p>
            <button
              onClick={() => setStep('result')}
              className="w-full py-3.5 rounded-[18px] text-base font-semibold transition-all duration-200 active:scale-[0.97]"
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                color: 'rgba(17, 24, 39, 0.95)',
                border: '0.5px solid rgba(255, 255, 255, 0.5)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              }}
            >
              {t.retry}
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <PageLayout 
      title={t.title}
      voiceStatus={voiceStatus}
      auditLogs={auditLogs}
    >
      {renderContent()}
    </PageLayout>
  );
};

export default CreditCardPreApproval;