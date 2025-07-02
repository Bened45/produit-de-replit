// Configuration pour l'API externe
export const API_CONFIG = {
  // URL de base de votre serveur API (FastAPI/LND)
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 
    (import.meta.env.MODE === 'production' 
      ? 'https://votre-serveur-api.com' 
      : 'http://localhost:8000'), // Port par défaut FastAPI
  
  // Endpoints de l'API
  ENDPOINTS: {
    // Authentication
    AUTH: {
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      VERIFY: '/auth/verify'
    },
    
    // Patients
    PATIENTS: {
      LIST: '/patients',
      CREATE: '/patients',
      GET: (id: number) => `/patients/${id}`,
      UPDATE: (id: number) => `/patients/${id}`,
      SEARCH: '/patients/search'
    },
    
    // Vaccines
    VACCINES: {
      LIST: '/vaccines',
      CREATE: '/vaccines',
      GET: (id: number) => `/vaccines/${id}`
    },
    
    // Vaccinations
    VACCINATIONS: {
      LIST: '/vaccinations',
      CREATE: '/vaccinations',
      GET: (id: number) => `/vaccinations/${id}`,
      BY_PATIENT: (patientId: number) => `/patients/${patientId}/vaccinations`,
      RECENT: '/vaccinations/recent',
      GENERATE_QR: (id: number) => `/vaccinations/${id}/qr-code`,
      SIGN: (id: number) => `/vaccinations/${id}/sign`
    },
    
    // Appointments
    APPOINTMENTS: {
      LIST: '/appointments',
      CREATE: '/appointments',
      GET: (id: number) => `/appointments/${id}`,
      UPDATE: (id: number) => `/appointments/${id}`,
      BY_DATE: '/appointments/by-date',
      UPCOMING: '/appointments/upcoming'
    },
    
    // Dashboard & Reports
    DASHBOARD: {
      STATS: '/dashboard/stats',
      ACTIVITY: '/dashboard/activity'
    },
    
    // Lightning Network
    LIGHTNING: {
      NODE_INFO: '/lightning/info',
      SIGN_MESSAGE: '/lightning/sign',
      VERIFY_SIGNATURE: '/lightning/verify'
    }
  },
  
  // Headers par défaut
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Helper pour construire les URLs complètes
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper pour les requêtes authentifiées avec token
export const getAuthHeaders = (token?: string): Record<string, string> => {
  const headers: Record<string, string> = { ...API_CONFIG.DEFAULT_HEADERS };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};