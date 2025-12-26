import { Stock, StockDetail, TargetPrice, Dividend, IPO, Broker, CapitalIncrease, FinancialResult } from './types';

export const MOCK_STOCKS: Stock[] = [
  { code: 'THYAO', name: 'Türk Hava Yolları', price: 298.50, changeRate: 1.25, volume: '2.8 Mr', sector: 'Ulaştırma' },
  { code: 'TUPRS', name: 'Tüpraş', price: 156.40, changeRate: -0.50, volume: '1.2 Mr', sector: 'Kimya & Petrol' },
  { code: 'KCHOL', name: 'Koç Holding', price: 182.10, changeRate: 0.85, volume: '850 Mn', sector: 'Holding' },
  { code: 'ASELS', name: 'Aselsan', price: 62.15, changeRate: 0.45, volume: '950 Mn', sector: 'Savunma' },
  { code: 'GARAN', name: 'Garanti Bankası', price: 112.40, changeRate: 2.10, volume: '1.5 Mr', sector: 'Bankacılık' },
  { code: 'AKBNK', name: 'Akbank', price: 69.55, changeRate: 0.80, volume: '800 Mn', sector: 'Bankacılık' },
  { code: 'EREGL', name: 'Ereğli Demir Çelik', price: 48.20, changeRate: -0.50, volume: '600 Mn', sector: 'Metal' },
  { code: 'BIMAS', name: 'BİM Mağazalar', price: 485.00, changeRate: 1.10, volume: '320 Mn', sector: 'Perakende' },
];

export const MOCK_BROKERS: Broker[] = [
  { 
    id: 1, 
    name: 'Deniz Yatırım', 
    reportCount: 142, 
    successRate: 72.5,
    averageReturn: 48.2,
    accuracyHistory: [
        { month: 'Haz', rate: 65 }, { month: 'Tem', rate: 68 }, { month: 'Ağu', rate: 70 },
        { month: 'Eyl', rate: 67 }, { month: 'Eki', rate: 74 }, { month: 'Kas', rate: 72 }
    ],
    sectorAccuracy: [
        { sector: 'Bankacılık', accuracy: 85, count: 24 },
        { sector: 'Ulaştırma', accuracy: 78, count: 18 },
        { sector: 'Gıda', accuracy: 62, count: 12 },
        { sector: 'Enerji', accuracy: 55, count: 15 }
    ],
    distribution: { buy: 82, hold: 48, sell: 12 },
    recentActivity: [
        { stockCode: 'THYAO', action: 'Upgrade', oldRating: 'Tut', newRating: 'Al', date: 'Bugün' },
        { stockCode: 'TUPRS', action: 'Price Revision', newRating: 'Al', date: 'Dün' },
        { stockCode: 'GARAN', action: 'Upgrade', oldRating: 'Sat', newRating: 'Tut', date: '3 gün önce' }
    ]
  },
  { 
    id: 2, 
    name: 'İş Yatırım', 
    reportCount: 210, 
    successRate: 68.4,
    averageReturn: 42.1,
    accuracyHistory: [
        { month: 'Haz', rate: 60 }, { month: 'Tem', rate: 62 }, { month: 'Ağu', rate: 65 },
        { month: 'Eyl', rate: 66 }, { month: 'Eki', rate: 68 }, { month: 'Kas', rate: 68 }
    ],
    sectorAccuracy: [
        { sector: 'Sanayi', accuracy: 82, count: 45 },
        { sector: 'Teknoloji', accuracy: 70, count: 30 },
        { sector: 'Perakende', accuracy: 75, count: 22 }
    ],
    distribution: { buy: 120, hold: 75, sell: 15 },
    recentActivity: [
        { stockCode: 'EREGL', action: 'Downgrade', oldRating: 'Al', newRating: 'Tut', date: 'Bugün' },
        { stockCode: 'BIMAS', action: 'New', newRating: 'Al', date: '2 gün önce' }
    ]
  },
  { 
    id: 3, 
    name: 'Yapı Kredi Yatırım', 
    reportCount: 185, 
    successRate: 65.2,
    averageReturn: 38.5,
    accuracyHistory: [
        { month: 'Haz', rate: 58 }, { month: 'Tem', rate: 60 }, { month: 'Ağu', rate: 62 },
        { month: 'Eyl', rate: 63 }, { month: 'Eki', rate: 64 }, { month: 'Kas', rate: 65 }
    ],
    sectorAccuracy: [
        { sector: 'Holding', accuracy: 88, count: 20 },
        { sector: 'Bankacılık', accuracy: 72, count: 32 },
        { sector: 'Çimento', accuracy: 58, count: 12 }
    ],
    distribution: { buy: 95, hold: 70, sell: 20 },
    recentActivity: [
        { stockCode: 'KCHOL', action: 'Upgrade', oldRating: 'Tut', newRating: 'Al', date: 'Bugün' }
    ]
  }
];

export const MOCK_FINANCIAL_RESULTS: FinancialResult[] = [
  { code: 'THYAO', company: 'Türk Hava Yolları', period: '2024/12', expectedDate: '01.03.2025', status: 'Bekleniyor', expectedProfit: '12.5 Mr ₺' },
  { code: 'TUPRS', company: 'Tüpraş', period: '2024/12', expectedDate: '15.02.2025', status: 'Bekleniyor', expectedProfit: '8.2 Mr ₺' },
  { code: 'EREGL', company: 'Ereğli Demir Çelik', period: '2024/12', expectedDate: '10.02.2025', status: 'Açıklandı', actualProfit: '4.5 Mr ₺', actualDate: '10.02.2025', changeVsLastYear: 12.4 },
  { code: 'GARAN', company: 'Garanti Bankası', period: '2024/12', expectedDate: '05.02.2025', status: 'Açıklandı', actualProfit: '22.1 Mr ₺', actualDate: '05.02.2025', changeVsLastYear: 45.2 },
  { code: 'SISE', company: 'Şişecam', period: '2024/12', expectedDate: '20.02.2025', status: 'Bekleniyor', expectedProfit: '5.1 Mr ₺' },
  { code: 'KCHOL', company: 'Koç Holding', period: '2024/12', expectedDate: '28.02.2025', status: 'Bekleniyor', expectedProfit: '18.4 Mr ₺' },
];

export const MOCK_STOCK_DETAIL: StockDetail = {
  ...MOCK_STOCKS[0],
  high: 302.50,
  low: 294.00,
  marketCap: '412.5 Mr ₺',
  peRatio: 3.85,
  pbRatio: 0.95,
  lastUpdate: '15 Aralık 2025',
  description: 'Türk Hava Yolları A.O., Türkiye\'nin bayrak taşıyıcı havayolu şirketidir.',
  financials: { roe: 28.5, grossMargin: 22.5, netMargin: 15.4 }
};

export const MOCK_TARGET_PRICES: TargetPrice[] = [
  {
    stockCode: 'THYAO',
    stockName: 'Türk Hava Yolları',
    currentPrice: 298.50,
    averageTarget: 445.50,
    highestTarget: 480.00,
    lowestTarget: 390.00,
    analystCount: 14,
    recommendations: { buy: 12, hold: 2, sell: 0 },
    reports: [
        { brokerName: 'HSBC', date: '10.12.2024', targetPrice: 450.00, recommendation: 'Al' },
        { brokerName: 'BofA', date: '05.12.2024', targetPrice: 480.00, recommendation: 'Al' },
    ]
  }
];

export const MOCK_DIVIDENDS: Dividend[] = [
  { code: 'THYAO', company: 'Türk Hava Yolları', amount: 2.50, yield: 3.2, recordDate: '15.01.2024', paymentDate: '25.01.2024' }
];

export const MOCK_IPOS: IPO[] = [
  { 
    code: 'ZERGY', 
    company: 'Zeray Gayrimenkul Yatırım Ortaklığı A.Ş.', 
    price: 13.00, 
    dates: '10-11-12 Aralık 2025', 
    status: 'Yeni', 
    lotCount: '156,800,000', 
    distributionType: 'Eşit Dağıtım'
  }
];

export const MOCK_DRAFT_IPOS: IPO[] = [
    { 
      code: 'FORTE', 
      company: 'Forte Bilişim Teknolojileri A.Ş.', 
      price: 0, 
      dates: 'Açıklanacak', 
      status: 'Yeni', 
      lotCount: '22,000,000', 
      distributionType: 'Eşit Dağıtım'
    }
];

export const MOCK_CAPITAL_INCREASES: CapitalIncrease[] = [
  { code: 'SASA', company: 'SASA Polyester Sanayi A.Ş.', type: 'Bedelsiz', rate: 700, date: '12.12.2024', status: 'SPK Başvuru' }
];