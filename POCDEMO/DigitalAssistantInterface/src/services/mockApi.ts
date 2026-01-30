// Mock API for Credit Card Pre-Approval
export interface PreApprovalRequest {
  sessionId: string;
  answers: {
    ageInRange: boolean;
    hasStableIncome: boolean;
    hasLocalId: boolean;
  };
  channel: string;
  language: string;
}

export interface PreApprovalResponse {
  status: 'created' | 'failed';
  PreApprovalCaseID?: string;
  error?: string;
}

export interface AppointmentRequest {
  sessionId: string;
  serviceType: 'account_opening' | 'loan_consultation' | 'wealth_management' | 'other';
  slot: string;
  channel: string;
}

export interface AppointmentResponse {
  status: 'confirmed' | 'failed';
  appointmentId?: string;
  error?: string;
}

// Mock delay to simulate network request
const mockDelay = (ms: number = 800) => new Promise(resolve => setTimeout(resolve, ms));

// Generate mock case ID
const generateCaseId = () => {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
  const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `PA-${dateStr}-${randomNum}`;
};

// Generate mock appointment ID
const generateAppointmentId = () => {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
  const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `AP-${dateStr}-${randomNum}`;
};

// Mock Pre-Approval API
export const createPreApprovalCase = async (
  request: PreApprovalRequest
): Promise<PreApprovalResponse> => {
  console.log('Mock API: Creating pre-approval case', request);
  
  await mockDelay();

  // Simulate 95% success rate
  if (Math.random() > 0.95) {
    return {
      status: 'failed',
      error: '系统繁忙，请稍后重试'
    };
  }

  return {
    status: 'created',
    PreApprovalCaseID: generateCaseId()
  };
};

// Mock Appointment API
export const createAppointment = async (
  request: AppointmentRequest
): Promise<AppointmentResponse> => {
  console.log('Mock API: Creating appointment', request);
  
  await mockDelay();

  // Simulate 95% success rate
  if (Math.random() > 0.95) {
    return {
      status: 'failed',
      error: '预约失败，请稍后重试'
    };
  }

  return {
    status: 'confirmed',
    appointmentId: generateAppointmentId()
  };
};

// Mock available appointment slots
export const getAvailableSlots = async (serviceType: string) => {
  await mockDelay(500);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 2);
  
  const dayAfterThat = new Date();
  dayAfterThat.setDate(dayAfterThat.getDate() + 3);

  return [
    {
      id: '1',
      datetime: tomorrow.toISOString(),
      displayTime: `${tomorrow.getMonth() + 1}月${tomorrow.getDate()}日 10:00`,
      available: true
    },
    {
      id: '2',
      datetime: dayAfter.toISOString(),
      displayTime: `${dayAfter.getMonth() + 1}月${dayAfter.getDate()}日 14:00`,
      available: true
    },
    {
      id: '3',
      datetime: dayAfterThat.toISOString(),
      displayTime: `${dayAfterThat.getMonth() + 1}月${dayAfterThat.getDate()}日 16:00`,
      available: true
    }
  ];
};
