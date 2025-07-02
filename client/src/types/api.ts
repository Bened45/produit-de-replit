export interface DashboardStats {
  todayVaccinations: number;
  activePatients: number;
  upcomingAppointments: number;
  certificatesGenerated: number;
}

export interface EnrichedVaccination {
  id: number;
  patientId: number;
  vaccineId: number;
  doctorId: number;
  lotNumber: string;
  expirationDate: string;
  injectionSite: string;
  dosage: string | null;
  notes: string | null;
  certificateId: string | null;
  qrCodeData: string | null;
  signature: string | null;
  administeredAt: Date | null;
  patient?: {
    id: number;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    socialSecurityNumber: string;
    phone: string | null;
    email: string | null;
    address: string | null;
    createdAt: Date | null;
  };
  vaccine?: {
    id: number;
    name: string;
    manufacturer: string;
    type: string;
    description: string | null;
    isActive: boolean | null;
  };
}

export interface EnrichedAppointment {
  id: number;
  patientId: number;
  doctorId: number;
  appointmentDate: Date;
  appointmentType: string;
  status: string;
  notes: string | null;
  createdAt: Date | null;
  patient?: {
    id: number;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    socialSecurityNumber: string;
    phone: string | null;
    email: string | null;
    address: string | null;
    createdAt: Date | null;
  };
}
