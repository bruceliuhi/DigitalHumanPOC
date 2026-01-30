import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { PageLayout } from '@/app/components/PageLayout';
import { createAppointment, getAvailableSlots } from '@/services/mockApi';
import { CreditCard, Building2, TrendingUp, HelpCircle, CheckCircle, XCircle, Loader2, Calendar, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

type Step = 'intro' | 'selectService' | 'selectTime' | 'confirm' | 'creating' | 'success' | 'error';
type ServiceType = 'account_opening' | 'loan_consultation' | 'wealth_management' | 'other';

interface TimeSlot {
  id: string;
  datetime: string;
  displayTime: string;
  available: boolean;
}

const Appointment = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [step, setStep] = useState<Step>('intro');
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [appointmentId, setAppointmentId] = useState<string>('');
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
      title: '开户 / 分行预约',
      introTitle: '我可以协助你预约开户或分行服务',
      startButton: '开始预约',
      selectServiceTitle: '请选择服务类型',
      serviceAccountOpening: '开户',
      serviceAccountOpeningDesc: '开立新账户',
      serviceLoanConsultation: '贷款咨询',
      serviceLoanConsultationDesc: '个人/企业贷款',
      serviceWealthManagement: '财富管理',
      serviceWealthManagementDesc: '理财规划服务',
      serviceOther: '其他',
      serviceOtherDesc: '其他银行服务',
      selectTimeTitle: '请选择预约时间',
      confirmTitle: '确认预约信息',
      serviceTypeLabel: '服务类型',
      appointmentTimeLabel: '预约时间',
      confirmButton: '确认预约',
      creating: '正在创建预约...',
      successTitle: '✓ 预约成功',
      successMessage: '请于指定时间到分行',
      appointmentIdLabel: '预约编号',
      backHome: '返回首页',
      retry: '重试',
      errorTitle: '× 预约失败',
    },
    yue: {
      title: '開戶 / 分行預約',
      introTitle: '我可以協助你預約開戶或分行服務',
      startButton: '開始預約',
      selectServiceTitle: '請揀服務類型',
      serviceAccountOpening: '開戶',
      serviceAccountOpeningDesc: '開立新賬戶',
      serviceLoanConsultation: '貸款咨詢',
      serviceLoanConsultationDesc: '個人/企業貸款',
      serviceWealthManagement: '財富管理',
      serviceWealthManagementDesc: '理財規劃服務',
      serviceOther: '其他',
      serviceOtherDesc: '其他銀行服務',
      selectTimeTitle: '請揀預約時間',
      confirmTitle: '確認預約信息',
      serviceTypeLabel: '服務類型',
      appointmentTimeLabel: '預約時間',
      confirmButton: '確認預約',
      creating: '正在創建預約...',
      successTitle: '✓ 預約成功',
      successMessage: '請於指定時間到分行',
      appointmentIdLabel: '預約編號',
      backHome: '返回主頁',
      retry: '重試',
      errorTitle: '× 預約失敗',
    },
    en: {
      title: 'Account Opening / Branch Appointment',
      introTitle: 'I can help you book account opening or branch services',
      startButton: 'Start Booking',
      selectServiceTitle: 'Please select service type',
      serviceAccountOpening: 'Account Opening',
      serviceAccountOpeningDesc: 'Open new account',
      serviceLoanConsultation: 'Loan Consultation',
      serviceLoanConsultationDesc: 'Personal/Business loans',
      serviceWealthManagement: 'Wealth Management',
      serviceWealthManagementDesc: 'Financial planning',
      serviceOther: 'Other',
      serviceOtherDesc: 'Other banking services',
      selectTimeTitle: 'Please select appointment time',
      confirmTitle: 'Confirm Appointment',
      serviceTypeLabel: 'Service Type',
      appointmentTimeLabel: 'Appointment Time',
      confirmButton: 'Confirm Appointment',
      creating: 'Creating appointment...',
      successTitle: '✓ Appointment Confirmed',
      successMessage: 'Please arrive at the branch on time',
      appointmentIdLabel: 'Appointment ID',
      backHome: 'Back to Home',
      retry: 'Retry',
      errorTitle: '× Booking Failed',
    }
  };

  const t = texts[language];

  const serviceOptions = [
    {
      type: 'account_opening' as ServiceType,
      icon: CreditCard,
      title: t.serviceAccountOpening,
      desc: t.serviceAccountOpeningDesc,
      color: 'rgba(218, 165, 32, 0.95)',
    },
    {
      type: 'loan_consultation' as ServiceType,
      icon: Building2,
      title: t.serviceLoanConsultation,
      desc: t.serviceLoanConsultationDesc,
      color: 'rgba(100, 149, 237, 0.95)',
    },
    {
      type: 'wealth_management' as ServiceType,
      icon: TrendingUp,
      title: t.serviceWealthManagement,
      desc: t.serviceWealthManagementDesc,
      color: 'rgba(34, 197, 94, 0.95)',
    },
    {
      type: 'other' as ServiceType,
      icon: HelpCircle,
      title: t.serviceOther,
      desc: t.serviceOtherDesc,
      color: 'rgba(147, 51, 234, 0.95)',
    },
  ];

  const handleServiceSelect = async (serviceType: ServiceType) => {
    setSelectedService(serviceType);
    addAuditLog('SERVICE_SELECTED', { serviceType });
    
    // Load available slots
    setStep('selectTime');
    addAuditLog('STEP_CHANGED', { from: 'selectService', to: 'selectTime' });
    
    try {
      const slots = await getAvailableSlots(serviceType);
      setAvailableSlots(slots);
      addAuditLog('SLOTS_LOADED', { slots });
    } catch (error) {
      console.error('Failed to load slots:', error);
      addAuditLog('SLOTS_LOAD_ERROR', { error: String(error) });
    }
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    addAuditLog('SLOT_SELECTED', { slot });
    setStep('confirm');
    addAuditLog('STEP_CHANGED', { from: 'selectTime', to: 'confirm' });
  };

  const handleConfirm = async () => {
    if (!selectedService || !selectedSlot) return;

    setStep('creating');
    addAuditLog('CONFIRM_APPOINTMENT_INITIATED', { service: selectedService, slot: selectedSlot });

    try {
      const sessionId = `session-${Date.now()}`;
      const response = await createAppointment({
        sessionId,
        serviceType: selectedService,
        slot: selectedSlot.datetime,
        channel: 'H5',
      });

      if (response.status === 'confirmed' && response.appointmentId) {
        setAppointmentId(response.appointmentId);
        setStep('success');
        addAuditLog('APPOINTMENT_SUCCESS', { appointmentId: response.appointmentId });
      } else {
        setErrorMessage(response.error || '未知错误');
        setStep('error');
        addAuditLog('APPOINTMENT_FAILED', { error: response.error });
      }
    } catch (error) {
      setErrorMessage('网络错误，请稍后重试');
      setStep('error');
      addAuditLog('APPOINTMENT_ERROR', { error: String(error) });
    }
  };

  const getServiceDisplayName = () => {
    const service = serviceOptions.find(s => s.type === selectedService);
    return service ? service.title : '';
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
                setStep('selectService');
                addAuditLog('BOOKING_STARTED', {});
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

    // Step 2: Select Service (4-grid layout)
    if (step === 'selectService') {
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
            <h3 
              className="text-center text-lg mb-5 font-semibold"
              style={{ color: 'rgba(255, 255, 255, 0.95)' }}
            >
              {t.selectServiceTitle}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {serviceOptions.map((service) => {
                const Icon = service.icon;
                return (
                  <button
                    key={service.type}
                    onClick={() => handleServiceSelect(service.type)}
                    className="p-4 rounded-[18px] flex flex-col items-center gap-2 transition-all duration-200 active:scale-[0.95]"
                    style={{
                      background: 'rgba(255, 255, 255, 0.25)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{
                        background: 'rgba(255, 255, 255, 0.3)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                      }}
                    >
                      <Icon className="w-6 h-6" style={{ color: service.color }} />
                    </div>
                    <div className="text-center">
                      <p 
                        className="text-sm font-semibold mb-0.5"
                        style={{ color: 'rgba(255, 255, 255, 0.98)' }}
                      >
                        {service.title}
                      </p>
                      <p 
                        className="text-xs opacity-75"
                        style={{ color: 'rgba(255, 255, 255, 0.85)' }}
                      >
                        {service.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    // Step 3: Select Time
    if (step === 'selectTime') {
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
            <h3 
              className="text-center text-lg mb-5 font-semibold"
              style={{ color: 'rgba(255, 255, 255, 0.95)' }}
            >
              {t.selectTimeTitle}
            </h3>
            <div className="flex flex-col gap-3">
              {availableSlots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => handleSlotSelect(slot)}
                  className="p-4 rounded-[18px] flex items-center gap-3 transition-all duration-200 active:scale-[0.98]"
                  style={{
                    background: 'rgba(255, 255, 255, 0.25)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: 'rgba(255, 255, 255, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    <Clock className="w-5 h-5" style={{ color: 'rgba(59, 130, 246, 0.95)' }} />
                  </div>
                  <div className="flex-1 text-left">
                    <p 
                      className="text-base font-semibold"
                      style={{ color: 'rgba(255, 255, 255, 0.98)' }}
                    >
                      {slot.displayTime}
                    </p>
                  </div>
                  <div
                    className="px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: 'rgba(34, 197, 94, 0.2)',
                      color: 'rgba(34, 197, 94, 0.95)',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                    }}
                  >
                    可预约
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Step 4: Confirm
    if (step === 'confirm') {
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
            <h3 
              className="text-center text-lg mb-5 font-semibold"
              style={{ color: 'rgba(255, 255, 255, 0.95)' }}
            >
              {t.confirmTitle}
            </h3>
            
            {/* Service Type */}
            <div 
              className="p-4 rounded-[16px] mb-3"
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <p 
                className="text-sm opacity-75 mb-1"
                style={{ color: 'rgba(255, 255, 255, 0.85)' }}
              >
                {t.serviceTypeLabel}
              </p>
              <p 
                className="text-base font-semibold"
                style={{ color: 'rgba(255, 255, 255, 0.98)' }}
              >
                {getServiceDisplayName()}
              </p>
            </div>

            {/* Appointment Time */}
            <div 
              className="p-4 rounded-[16px] mb-6"
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <p 
                className="text-sm opacity-75 mb-1"
                style={{ color: 'rgba(255, 255, 255, 0.85)' }}
              >
                {t.appointmentTimeLabel}
              </p>
              <p 
                className="text-base font-semibold"
                style={{ color: 'rgba(255, 255, 255, 0.98)' }}
              >
                {selectedSlot?.displayTime}
              </p>
            </div>

            <button
              onClick={handleConfirm}
              className="w-full py-3.5 rounded-[18px] text-base font-semibold transition-all duration-200 active:scale-[0.97]"
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                color: 'rgba(17, 24, 39, 0.95)',
                border: '0.5px solid rgba(255, 255, 255, 0.5)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              }}
            >
              {t.confirmButton}
            </button>
          </div>
        </div>
      );
    }

    // Creating
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
                {t.appointmentIdLabel}
              </p>
              <p 
                className="text-lg font-mono font-semibold"
                style={{ color: 'rgba(255, 255, 255, 0.98)' }}
              >
                {appointmentId}
              </p>
            </div>
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
                {t.serviceTypeLabel}
              </p>
              <p 
                className="text-base font-semibold mb-2"
                style={{ color: 'rgba(255, 255, 255, 0.98)' }}
              >
                {getServiceDisplayName()}
              </p>
              <p 
                className="text-sm opacity-75 mb-1"
                style={{ color: 'rgba(255, 255, 255, 0.85)' }}
              >
                {t.appointmentTimeLabel}
              </p>
              <p 
                className="text-base font-semibold"
                style={{ color: 'rgba(255, 255, 255, 0.98)' }}
              >
                {selectedSlot?.displayTime}
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
              onClick={() => setStep('confirm')}
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

export default Appointment;