export const APP_CONFIG = {
  name: 'Capacita.ai',
  tagline: 'Precision Optimization for the Intelligent Enterprise',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  version: 'SYS_CORE_v3.1',
  standardWeeklyCapacityHours: 40,
  thresholds: {
    underutilizedMax: 0.70,  // < 70% (e.g. < 28h)
    balancedMax: 0.85,       // 70% - 85% (e.g. 28h - 34h)
    approachingMax: 1.00,    // 86% - 100% (e.g. 35h - 40h)
    overloadedMin: 1.001     // > 100% (e.g. > 40h)
  }
};
