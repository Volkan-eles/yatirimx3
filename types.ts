export interface Stock {
  code: string;
  name: string;
  price: number;
  changeRate: number;
  volume: string;
  sector: string;
  description?: string;
}

export interface StockDetail extends Stock {
  high: number;
  low: number;
  marketCap: string;
  peRatio: number; // F/K
  pbRatio: number; // PD/DD
  dividendYield?: number;
  lastUpdate: string;
  financials: {
    roe: number; // Özkaynak Karlılığı
    grossMargin: number;
    netMargin: number;
  };
}

export interface TargetPrice {
  stockCode: string;
  stockName: string;
  currentPrice: number;
  averageTarget: number;
  highestTarget: number;
  lowestTarget: number;
  analystCount: number;
  recommendations: {
    buy: number;
    hold: number;
    sell: number;
  };
  reports: AnalystReport[];
}

export interface AnalystReport {
  brokerName: string;
  date: string;
  targetPrice: number;
  recommendation: 'Al' | 'Tut' | 'Sat' | 'Endeks Üstü';
}

export interface Dividend {
  code: string;
  company: string;
  amount: number;
  yield: number;
  recordDate: string;
  paymentDate: string;
}

export interface IPO {
  code: string;
  company: string;
  price: number;
  dates: string;
  status: 'Yeni' | 'Yakında' | 'Tamamlandı';
  lotCount: string;
  distributionType: string; // Eşit or Oransal
  broker?: string;
  market?: string;
  firstTradeDate?: string;
  floatingRate?: string;
  fundUsage?: string[];
  lockup?: string[];
  distributionDetails?: {
    category: string;
    count: string;
    lot: string;
    ratio: string;
  }[];
}

export interface Broker {
  id: number;
  name: string;
  reportCount: number;
  successRate: number;
  averageReturn: number;
  accuracyHistory: { month: string; rate: number }[];
  sectorAccuracy: { sector: string; accuracy: number; count: number }[];
  distribution: {
    buy: number;
    hold: number;
    sell: number;
  };
  recentActivity: {
    stockCode: string;
    action: 'Upgrade' | 'Downgrade' | 'New' | 'Price Revision';
    oldRating?: string;
    newRating: string;
    date: string;
  }[];
}

export interface CapitalIncrease {
  code: string;
  company: string;
  type: 'Bedelli' | 'Bedelsiz' | 'Tahsisli';
  rate: number; // Percentage
  date: string;
  status: 'Onaylandı' | 'SPK Başvuru' | 'Taslak' | 'Tamamlandı';
  description?: string;
}

export interface FinancialResult {
  code: string;
  company: string;
  period: string;
  expectedDate: string;
  actualDate?: string;
  expectedProfit?: string;
  actualProfit?: string;
  status: 'Bekleniyor' | 'Açıklandı';
  changeVsLastYear?: number;
}