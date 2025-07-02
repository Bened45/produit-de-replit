import { API_CONFIG, buildApiUrl, getAuthHeaders } from './api-config';
import type { 
  Patient, 
  Vaccine, 
  Vaccination, 
  Appointment,
  InsertPatient,
  InsertVaccine,
  InsertVaccination,
  InsertAppointment
} from '../../../shared/schema';
import type { DashboardStats, EnrichedVaccination, EnrichedAppointment } from '../types/api';

// Helper pour les erreurs API
class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Helper pour les requêtes
async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = buildApiUrl(endpoint);
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers
    },
    credentials: 'include'
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new ApiError(response.status, errorText || response.statusText);
    }

    // Gestion des réponses vides (204 No Content)
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error(`Erreur de connexion: ${error instanceof Error ? error.message : 'Inconnue'}`);
  }
}

// API Client pour les patients
export const patientsApi = {
  // Récupérer tous les patients
  getAll: (): Promise<Patient[]> => 
    apiRequest(API_CONFIG.ENDPOINTS.PATIENTS.LIST),

  // Créer un nouveau patient
  create: (data: InsertPatient): Promise<Patient> =>
    apiRequest(API_CONFIG.ENDPOINTS.PATIENTS.CREATE, {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  // Récupérer un patient par ID
  getById: (id: number): Promise<Patient> =>
    apiRequest(API_CONFIG.ENDPOINTS.PATIENTS.GET(id)),

  // Mettre à jour un patient
  update: (id: number, data: Partial<InsertPatient>): Promise<Patient> =>
    apiRequest(API_CONFIG.ENDPOINTS.PATIENTS.UPDATE(id), {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  // Rechercher des patients
  search: (query: string): Promise<Patient[]> =>
    apiRequest(`${API_CONFIG.ENDPOINTS.PATIENTS.SEARCH}?q=${encodeURIComponent(query)}`)
};

// API Client pour les vaccins
export const vaccinesApi = {
  // Récupérer tous les vaccins
  getAll: (): Promise<Vaccine[]> =>
    apiRequest(API_CONFIG.ENDPOINTS.VACCINES.LIST),

  // Créer un nouveau vaccin
  create: (data: InsertVaccine): Promise<Vaccine> =>
    apiRequest(API_CONFIG.ENDPOINTS.VACCINES.CREATE, {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  // Récupérer un vaccin par ID
  getById: (id: number): Promise<Vaccine> =>
    apiRequest(API_CONFIG.ENDPOINTS.VACCINES.GET(id))
};

// API Client pour les vaccinations
export const vaccinationsApi = {
  // Récupérer toutes les vaccinations
  getAll: (): Promise<EnrichedVaccination[]> =>
    apiRequest(API_CONFIG.ENDPOINTS.VACCINATIONS.LIST),

  // Créer une nouvelle vaccination
  create: (data: InsertVaccination): Promise<Vaccination> =>
    apiRequest(API_CONFIG.ENDPOINTS.VACCINATIONS.CREATE, {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  // Récupérer une vaccination par ID
  getById: (id: number): Promise<EnrichedVaccination> =>
    apiRequest(API_CONFIG.ENDPOINTS.VACCINATIONS.GET(id)),

  // Récupérer les vaccinations d'un patient
  getByPatient: (patientId: number): Promise<EnrichedVaccination[]> =>
    apiRequest(API_CONFIG.ENDPOINTS.VACCINATIONS.BY_PATIENT(patientId)),

  // Récupérer les vaccinations récentes
  getRecent: (limit?: number): Promise<EnrichedVaccination[]> =>
    apiRequest(`${API_CONFIG.ENDPOINTS.VACCINATIONS.RECENT}${limit ? `?limit=${limit}` : ''}`),

  // Générer un code QR pour une vaccination
  generateQR: (id: number): Promise<{ qrCode: string }> =>
    apiRequest(API_CONFIG.ENDPOINTS.VACCINATIONS.GENERATE_QR(id), {
      method: 'POST'
    }),

  // Signer numériquement une vaccination
  sign: (id: number, signature: string): Promise<Vaccination> =>
    apiRequest(API_CONFIG.ENDPOINTS.VACCINATIONS.SIGN(id), {
      method: 'POST',
      body: JSON.stringify({ signature })
    })
};

// API Client pour les rendez-vous
export const appointmentsApi = {
  // Récupérer tous les rendez-vous
  getAll: (): Promise<EnrichedAppointment[]> =>
    apiRequest(API_CONFIG.ENDPOINTS.APPOINTMENTS.LIST),

  // Créer un nouveau rendez-vous
  create: (data: InsertAppointment): Promise<Appointment> =>
    apiRequest(API_CONFIG.ENDPOINTS.APPOINTMENTS.CREATE, {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  // Récupérer un rendez-vous par ID
  getById: (id: number): Promise<EnrichedAppointment> =>
    apiRequest(API_CONFIG.ENDPOINTS.APPOINTMENTS.GET(id)),

  // Mettre à jour un rendez-vous
  update: (id: number, data: Partial<InsertAppointment>): Promise<Appointment> =>
    apiRequest(API_CONFIG.ENDPOINTS.APPOINTMENTS.UPDATE(id), {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  // Récupérer les rendez-vous par date
  getByDate: (date: string): Promise<EnrichedAppointment[]> =>
    apiRequest(`${API_CONFIG.ENDPOINTS.APPOINTMENTS.BY_DATE}?date=${date}`),

  // Récupérer les prochains rendez-vous
  getUpcoming: (limit?: number): Promise<EnrichedAppointment[]> =>
    apiRequest(`${API_CONFIG.ENDPOINTS.APPOINTMENTS.UPCOMING}${limit ? `?limit=${limit}` : ''}`)
};

// API Client pour le dashboard
export const dashboardApi = {
  // Récupérer les statistiques du dashboard
  getStats: (): Promise<DashboardStats> =>
    apiRequest(API_CONFIG.ENDPOINTS.DASHBOARD.STATS),

  // Récupérer l'activité récente
  getActivity: (): Promise<any[]> =>
    apiRequest(API_CONFIG.ENDPOINTS.DASHBOARD.ACTIVITY)
};

// API Client pour Lightning Network
export const lightningApi = {
  // Récupérer les informations du nœud
  getNodeInfo: (): Promise<any> =>
    apiRequest(API_CONFIG.ENDPOINTS.LIGHTNING.NODE_INFO),

  // Signer un message avec la clé privée du nœud
  signMessage: (message: string): Promise<{ signature: string }> =>
    apiRequest(API_CONFIG.ENDPOINTS.LIGHTNING.SIGN_MESSAGE, {
      method: 'POST',
      body: JSON.stringify({ message })
    }),

  // Vérifier une signature
  verifySignature: (message: string, signature: string, pubkey: string): Promise<{ valid: boolean }> =>
    apiRequest(API_CONFIG.ENDPOINTS.LIGHTNING.VERIFY_SIGNATURE, {
      method: 'POST',
      body: JSON.stringify({ message, signature, pubkey })
    })
};