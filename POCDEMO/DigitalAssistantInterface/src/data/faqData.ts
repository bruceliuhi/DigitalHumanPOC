export interface FAQ {
  id: string;
  q: string;
  keywords: string[];
  a: string;
  qZh?: string;  // 简体中文
  qYue?: string; // 繁体中文（粤语）
  qEn?: string;  // 英文
  aZh?: string;
  aYue?: string;
  aEn?: string;
}

export const faqData: FAQ[] = [
  {
    id: "faq_open_account_docs",
    q: "開戶需要準備哪些文件？",
    qZh: "开户需要准备哪些文件？",
    qYue: "開戶需要準備邊啲文件？",
    qEn: "What documents do I need to open an account?",
    keywords: ["開戶", "文件", "資料", "證件", "开户", "documents"],
    a: "一般需要有效身分證件、住址證明及相關申請資料，實際要求以分行規定為準。",
    aZh: "一般需要有效身份证件、住址证明及相关申请资料，实际要求以分行规定为准。",
    aYue: "一般需要有效身份證件、住址證明及相關申請資料，實際要求以分行規定為準。",
    aEn: "Generally, you need a valid ID, proof of address, and relevant application documents. Actual requirements are subject to branch regulations.",
  },
  {
    id: "faq_open_account_age",
    q: "開戶有年齡限制嗎？",
    qZh: "开户有年龄限制吗？",
    qYue: "開戶有冇年齡限制？",
    qEn: "Is there an age requirement for opening an account?",
    keywords: ["年齡", "幾歲", "未成年", "年龄", "age"],
    a: "一般需年滿法定年齡方可自行開戶，未滿法定年齡需由法定代理人陪同。",
    aZh: "一般需年满法定年龄方可自行开户，未满法定年龄需由法定代理人陪同。",
    aYue: "一般需年滿法定年齡先可以自己開戶，未滿法定年齡需要由法定代理人陪同。",
    aEn: "Generally, you must be of legal age to open an account independently. Minors require a legal guardian to accompany them.",
  },
  {
    id: "faq_open_account_time",
    q: "我想存钱，怎么办理？",
    qZh: "我想存钱，怎么办理？",
    qYue: "我想存錢，點樣辦理？",
    qEn: "I want to deposit money, how do I proceed?",
    keywords: ["存钱", "现金", "储蓄办理", "存錢", "deposit"],
    a: "存钱需要到柜台办理，已转人工请稍后。",
    aZh: "存钱需要到柜台办理，已转人工请稍后。",
    aYue: "存錢需要到櫃檯辦理，已轉人工請稍後。",
    aEn: "Deposit service is available at the counter. Transferring to an agent, please wait.",
  },
  {
    id: "faq_branch_business_hours",
    q: "分行的營業時間是？",
    qZh: "分行的营业时间是？",
    qYue: "分行嘅營業時間係？",
    qEn: "What are the branch operating hours?",
    keywords: ["營業時間", "幾點", "開門", "關門", "营业时间", "hours"],
    a: "一般分行營業時間為平日上午至下午，實際時間請以各分行公告為準。",
    aZh: "一般分行营业时间为平日上午至下午，实际时间请以各分行公告为准。",
    aYue: "一般分行營業時間為平日上午至下午，實際時間請以各分行公告為準。",
    aEn: "Branch hours are generally weekday mornings to afternoons. Please check with individual branches for exact hours.",
  },
  {
    id: "faq_branch_weekend",
    q: "週末有開放分行服務嗎？",
    qZh: "周末有开放分行服务吗？",
    qYue: "週末有冇開放分行服務？",
    qEn: "Are branches open on weekends?",
    keywords: ["週末", "假日", "星期六", "星期天", "周末", "weekend"],
    a: "部分分行於週末提供有限度服務，建議提前查詢或預約。",
    aZh: "部分分行于周末提供有限度服务，建议提前查询或预约。",
    aYue: "部分分行喺週末提供有限度服務，建議提前查詢或者預約。",
    aEn: "Some branches offer limited services on weekends. We recommend checking or making an appointment in advance.",
  },
  {
    id: "faq_credit_card_apply_condition",
    q: "申請信用卡需要符合什麼條件？",
    qZh: "申请信用卡需要符合什么条件？",
    qYue: "申請信用卡需要符合咩條件？",
    qEn: "What are the requirements for applying for a credit card?",
    keywords: ["信用卡", "申請條件", "資格", "申请条件", "credit card"],
    a: "一般需具備穩定收入、符合年齡要求並持有有效身分證件。",
    aZh: "一般需具备稳定收入、符合年龄要求并持有有效身份证件。",
    aYue: "一般需具備穩定收入、符合年齡要求並持有有效身份證件。",
    aEn: "Generally, you need a stable income, meet age requirements, and have a valid ID.",
  },
  {
    id: "faq_credit_card_annual_fee",
    q: "信用卡年費如何計算？",
    qZh: "信用卡年费如何计算？",
    qYue: "信用卡年費點樣計算？",
    qEn: "How is the credit card annual fee calculated?",
    keywords: ["信用卡", "年費", "年费", "annual fee"],
    a: "信用卡年費依卡別不同而有所差異，部分卡片符合條件可享免年費優惠。",
    aZh: "信用卡年费依卡别不同而有所差异，部分卡片符合条件可享免年费优惠。",
    aYue: "信用卡年費依卡別不同而有所差異，部分卡片符合條件可享免年費優惠。",
    aEn: "Annual fees vary by card type. Some cards offer fee waivers with qualifying conditions.",
  },
  {
    id: "faq_credit_card_bill_date",
    q: "信用卡帳單日是什麼時候？",
    qZh: "信用卡账单日是什么时候？",
    qYue: "信用卡帳單日係幾時？",
    qEn: "When is the credit card billing date?",
    keywords: ["帳單日", "結帳日", "账单日", "billing date"],
    a: "帳單日依各卡片設定而異，詳細資訊可於帳單或客服查詢。",
    aZh: "账单日依各卡片设定而异，详细信息可于账单或客服查询。",
    aYue: "帳單日依各卡片設定而異，詳細資訊可於帳單或者客服查詢。",
    aEn: "Billing dates vary by card. Please check your statement or contact customer service for details.",
  },
  {
    id: "faq_credit_card_repayment",
    q: "信用卡可以怎麼繳款？",
    qZh: "信用卡可以怎么缴款？",
    qYue: "信用卡可以點樣繳款？",
    qEn: "How can I make credit card payments?",
    keywords: ["繳款", "還款", "付款", "缴款", "payment"],
    a: "可透過自動扣款、轉帳或臨櫃方式繳納信用卡款項。",
    aZh: "可通过自动扣款、转账或临柜方式缴纳信用卡款项。",
    aYue: "可透過自動扣款、轉帳或者臨櫃方式繳納信用卡款項。",
    aEn: "You can pay via automatic debit, transfer, or at the counter.",
  },
  {
    id: "faq_loan_service",
    q: "銀行有哪些貸款服務？",
    qZh: "银行有哪些贷款服务？",
    qYue: "銀行有邊啲貸款服務？",
    qEn: "What loan services does the bank offer?",
    keywords: ["貸款", "借款", "贷款", "loan"],
    a: "本行提供多元貸款服務，包含個人貸款、房屋貸款等，實際方案以專人說明為準。",
    aZh: "本行提供多元贷款服务，包含个人贷款、房屋贷款等，实际方案以专人说明为准。",
    aYue: "本行提供多元貸款服務，包含個人貸款、房屋貸款等，實際方案以專人說明為準。",
    aEn: "We offer various loan services including personal loans and mortgages. Actual plans are subject to advisor consultation.",
  },
  {
    id: "faq_loan_apply_docs",
    q: "申請貸款需要準備什麼資料？",
    qZh: "申请贷款需要准备什么资料？",
    qYue: "申請貸款需要準備咩資料？",
    qEn: "What documents are needed for a loan application?",
    keywords: ["貸款", "文件", "資料", "贷款", "loan documents"],
    a: "一般需提供身分證明、收入證明及相關申請文件。",
    aZh: "一般需提供身份证明、收入证明及相关申请文件。",
    aYue: "一般需提供身份證明、收入證明及相關申請文件。",
    aEn: "Generally, you need to provide ID, proof of income, and relevant application documents.",
  },
  {
    id: "faq_wealth_management",
    q: "什麼是財富管理服務？",
    qZh: "什么是财富管理服务？",
    qYue: "咩係財富管理服務？",
    qEn: "What is wealth management service?",
    keywords: ["財富管理", "理財", "财富管理", "wealth management"],
    a: "財富管理服務由專業人員依客戶需求提供資產配置與理財建議。",
    aZh: "财富管理服务由专业人员依客户需求提供资产配置与理财建议。",
    aYue: "財富管理服務由專業人員依客戶需求提供資產配置與理財建議。",
    aEn: "Wealth management service provides asset allocation and financial advice tailored to customer needs by professionals.",
  },
  {
    id: "faq_foreign_currency_exchange",
    q: "可以在分行兌換外幣嗎？",
    qZh: "可以在分行兑换外币吗？",
    qYue: "可唔可以喺分行兌換外幣？",
    qEn: "Can I exchange foreign currency at the branch?",
    keywords: ["外幣", "兌換", "換匯", "外币", "currency exchange"],
    a: "部分分行提供外幣兌換服務，實際幣別與額度以分行公告為準。",
    aZh: "部分分行提供外币兑换服务，实际币别与额度以分行公告为准。",
    aYue: "部分分行提供外幣兌換服務，實際幣別與額度以分行公告為準。",
    aEn: "Some branches offer foreign currency exchange. Available currencies and limits are subject to branch announcements.",
  },
  {
    id: "faq_lost_card",
    q: "信用卡遺失該怎麼辦？",
    qZh: "信用卡丢失该怎么办？",
    qYue: "信用卡唔見咗點算？",
    qEn: "What should I do if my credit card is lost?",
    keywords: ["遺失", "掛失", "不見", "丢失", "lost card"],
    a: "請盡快聯絡客服或前往分行辦理掛失，以保障帳戶安全。",
    aZh: "请尽快联络客服或前往分行办理挂失，以保障账户安全。",
    aYue: "請盡快聯絡客服或者去分行辦理掛失，以保障帳戶安全。",
    aEn: "Please contact customer service or visit a branch immediately to report the loss to protect your account security.",
  },
  {
    id: "faq_change_personal_info",
    q: "如何更新個人資料？",
    qZh: "如何更新个人资料？",
    qYue: "點樣更新個人資料？",
    qEn: "How do I update my personal information?",
    keywords: ["修改資料", "更新資料", "修改资料", "update info"],
    a: "可攜帶相關證明文件至分行辦理個人資料更新。",
    aZh: "可携带相关证明文件至分行办理个人资料更新。",
    aYue: "可攜帶相關證明文件去分行辦理個人資料更新。",
    aEn: "You can bring relevant proof documents to the branch to update your personal information.",
  },
  {
    id: "faq_online_banking",
    q: "如何申請網路銀行服務？",
    qZh: "如何申请网上银行服务？",
    qYue: "點樣申請網上銀行服務？",
    qEn: "How do I apply for online banking service?",
    keywords: ["網路銀行", "線上銀行", "网上银行", "online banking"],
    a: "可於分行或依指示完成網路銀行申請流程。",
    aZh: "可于分行或依指示完成网上银行申请流程。",
    aYue: "可喺分行或者依指示完成網上銀行申請流程。",
    aEn: "You can apply at a branch or follow the instructions to complete the online banking application process.",
  },
  {
    id: "faq_transfer_limit",
    q: "轉帳有金額限制嗎？",
    qZh: "转账有金额限制吗？",
    qYue: "轉帳有冇金額限制？",
    qEn: "Is there a transfer limit?",
    keywords: ["轉帳", "限額", "转账", "transfer limit"],
    a: "轉帳金額限制依帳戶類型及設定而異。",
    aZh: "转账金额限制依账户类型及设定而异。",
    aYue: "轉帳金額限制依帳戶類型及設定而異。",
    aEn: "Transfer limits vary by account type and settings.",
  },
  {
    id: "faq_account_closure",
    q: "如何辦理帳戶銷戶？",
    qZh: "如何办理账户销户？",
    qYue: "點樣辦理帳戶銷戶？",
    qEn: "How do I close my account?",
    keywords: ["銷戶", "關戶", "销户", "close account"],
    a: "請攜帶身分證件至原開戶分行辦理帳戶銷戶。",
    aZh: "请携带身份证件至原开户分行办理账户销户。",
    aYue: "請攜帶身份證件去原開戶分行辦理帳戶銷戶。",
    aEn: "Please bring your ID to the original account-opening branch to close your account.",
  },
  {
    id: "faq_service_language",
    q: "銀行服務支援哪些語言？",
    qZh: "银行服务支持哪些语言？",
    qYue: "銀行服務支援邊啲語言？",
    qEn: "What languages does the bank support?",
    keywords: ["語言", "英文", "普通話", "粵語", "语言", "language"],
    a: "本行服務支援多種語言，實際以現場與系統提供為準。",
    aZh: "本行服务支持多种语言，实际以现场与系统提供为准。",
    aYue: "本行服務支援多種語言，實際以現場與系統提供為準。",
    aEn: "Our services support multiple languages. Actual availability depends on location and system provision.",
  },
  {
    id: "faq_customer_service",
    q: "如何聯絡銀行客服？",
    qZh: "如何联络银行客服？",
    qYue: "點樣聯絡銀行客服？",
    qEn: "How do I contact customer service?",
    keywords: ["客服", "聯絡方式", "联络方式", "customer service"],
    a: "可透過客服專線或前往分行洽詢。",
    aZh: "可通过客服专线或前往分行洽询。",
    aYue: "可透過客服專線或者去分行查詢。",
    aEn: "You can contact us via the customer service hotline or visit a branch.",
  },
];

// 严格的FAQ匹配逻辑
export const matchFAQ = (
  userInput: string,
): {
  matched: boolean;
  faq?: FAQ;
  decision: string;
  reason?: string;
} => {
  if (!userInput || userInput.trim() === "") {
    return {
      matched: false,
      decision: "fallback",
      reason: "empty_input",
    };
  }

  const input = userInput.trim();

  // 1. 精确匹配问题
  for (const faq of faqData) {
    if (faq.q === input) {
      return {
        matched: true,
        faq,
        decision: faq.id,
      };
    }
  }

  // 2. Keyword包含匹配（命中任一即可）
  for (const faq of faqData) {
    for (const keyword of faq.keywords) {
      if (input.includes(keyword)) {
        return {
          matched: true,
          faq,
          decision: faq.id,
        };
      }
    }
  }

  // 3. 未命中 - 兜底
  return {
    matched: false,
    decision: "fallback",
    reason: "no_faq_matched",
  };
};

// 固定兜底话术
export const FALLBACK_ANSWER =
  "这个问题需要人工协助，我可以帮你转接（Demo）。";