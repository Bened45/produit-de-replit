import { 
  users, patients, vaccines, vaccinations, appointments,
  type User, type InsertUser, type Patient, type InsertPatient,
  type Vaccine, type InsertVaccine, type Vaccination, type InsertVaccination,
  type Appointment, type InsertAppointment
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Patients
  getPatient(id: number): Promise<Patient | undefined>;
  getPatientBySSN(ssn: string): Promise<Patient | undefined>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  updatePatient(id: number, patient: Partial<InsertPatient>): Promise<Patient>;
  searchPatients(query: string): Promise<Patient[]>;
  
  // Vaccines
  getVaccine(id: number): Promise<Vaccine | undefined>;
  getAllVaccines(): Promise<Vaccine[]>;
  createVaccine(vaccine: InsertVaccine): Promise<Vaccine>;
  
  // Vaccinations
  getVaccination(id: number): Promise<Vaccination | undefined>;
  createVaccination(vaccination: InsertVaccination): Promise<Vaccination>;
  getVaccinationsByPatient(patientId: number): Promise<Vaccination[]>;
  getRecentVaccinations(limit?: number): Promise<Vaccination[]>;
  
  // Appointments
  getAppointment(id: number): Promise<Appointment | undefined>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  getAppointmentsByDate(date: string): Promise<Appointment[]>;
  getUpcomingAppointments(limit?: number): Promise<Appointment[]>;
  updateAppointment(id: number, appointment: Partial<InsertAppointment>): Promise<Appointment>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private patients: Map<number, Patient> = new Map();
  private vaccines: Map<number, Vaccine> = new Map();
  private vaccinations: Map<number, Vaccination> = new Map();
  private appointments: Map<number, Appointment> = new Map();
  
  private userIdCounter = 1;
  private patientIdCounter = 1;
  private vaccineIdCounter = 1;
  private vaccinationIdCounter = 1;
  private appointmentIdCounter = 1;

  constructor() {
    // Initialize with some default vaccines
    this.initializeDefaultVaccines();
  }

  private initializeDefaultVaccines() {
    const defaultVaccines = [
      { name: "COVID-19 - Pfizer/BioNTech", manufacturer: "Pfizer", type: "mRNA", description: "Vaccin COVID-19 à ARN messager", isActive: true },
      { name: "COVID-19 - Moderna", manufacturer: "Moderna", type: "mRNA", description: "Vaccin COVID-19 à ARN messager", isActive: true },
      { name: "Grippe saisonnière", manufacturer: "Sanofi", type: "inactivated", description: "Vaccin antigrippal inactivé", isActive: true },
      { name: "Hépatite B", manufacturer: "GSK", type: "recombinant", description: "Vaccin contre l'hépatite B", isActive: true },
      { name: "Rougeole-Oreillons-Rubéole (ROR)", manufacturer: "Merck", type: "live_attenuated", description: "Vaccin trivalent vivant atténué", isActive: true },
    ];

    defaultVaccines.forEach(vaccine => {
      const id = this.vaccineIdCounter++;
      this.vaccines.set(id, { ...vaccine, id });
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  // Patients
  async getPatient(id: number): Promise<Patient | undefined> {
    return this.patients.get(id);
  }

  async getPatientBySSN(ssn: string): Promise<Patient | undefined> {
    return Array.from(this.patients.values()).find(patient => patient.socialSecurityNumber === ssn);
  }

  async createPatient(insertPatient: InsertPatient): Promise<Patient> {
    const id = this.patientIdCounter++;
    const patient: Patient = { 
      ...insertPatient, 
      id, 
      createdAt: new Date()
    };
    this.patients.set(id, patient);
    return patient;
  }

  async updatePatient(id: number, updateData: Partial<InsertPatient>): Promise<Patient> {
    const patient = this.patients.get(id);
    if (!patient) {
      throw new Error('Patient not found');
    }
    const updatedPatient = { ...patient, ...updateData };
    this.patients.set(id, updatedPatient);
    return updatedPatient;
  }

  async searchPatients(query: string): Promise<Patient[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.patients.values()).filter(patient => 
      patient.firstName.toLowerCase().includes(lowercaseQuery) ||
      patient.lastName.toLowerCase().includes(lowercaseQuery) ||
      patient.socialSecurityNumber.includes(query)
    );
  }

  // Vaccines
  async getVaccine(id: number): Promise<Vaccine | undefined> {
    return this.vaccines.get(id);
  }

  async getAllVaccines(): Promise<Vaccine[]> {
    return Array.from(this.vaccines.values()).filter(vaccine => vaccine.isActive);
  }

  async createVaccine(insertVaccine: InsertVaccine): Promise<Vaccine> {
    const id = this.vaccineIdCounter++;
    const vaccine: Vaccine = { ...insertVaccine, id };
    this.vaccines.set(id, vaccine);
    return vaccine;
  }

  // Vaccinations
  async getVaccination(id: number): Promise<Vaccination | undefined> {
    return this.vaccinations.get(id);
  }

  async createVaccination(insertVaccination: InsertVaccination): Promise<Vaccination> {
    const id = this.vaccinationIdCounter++;
    const vaccination: Vaccination = { 
      ...insertVaccination, 
      id, 
      administeredAt: new Date()
    };
    this.vaccinations.set(id, vaccination);
    return vaccination;
  }

  async getVaccinationsByPatient(patientId: number): Promise<Vaccination[]> {
    return Array.from(this.vaccinations.values()).filter(vaccination => vaccination.patientId === patientId);
  }

  async getRecentVaccinations(limit = 10): Promise<Vaccination[]> {
    return Array.from(this.vaccinations.values())
      .sort((a, b) => new Date(b.administeredAt!).getTime() - new Date(a.administeredAt!).getTime())
      .slice(0, limit);
  }

  // Appointments
  async getAppointment(id: number): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = this.appointmentIdCounter++;
    const appointment: Appointment = { 
      ...insertAppointment, 
      id, 
      createdAt: new Date()
    };
    this.appointments.set(id, appointment);
    return appointment;
  }

  async getAppointmentsByDate(date: string): Promise<Appointment[]> {
    const targetDate = new Date(date);
    return Array.from(this.appointments.values()).filter(appointment => {
      const appointmentDate = new Date(appointment.appointmentDate);
      return appointmentDate.toDateString() === targetDate.toDateString();
    });
  }

  async getUpcomingAppointments(limit = 10): Promise<Appointment[]> {
    const now = new Date();
    return Array.from(this.appointments.values())
      .filter(appointment => new Date(appointment.appointmentDate) >= now)
      .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())
      .slice(0, limit);
  }

  async updateAppointment(id: number, updateData: Partial<InsertAppointment>): Promise<Appointment> {
    const appointment = this.appointments.get(id);
    if (!appointment) {
      throw new Error('Appointment not found');
    }
    const updatedAppointment = { ...appointment, ...updateData };
    this.appointments.set(id, updatedAppointment);
    return updatedAppointment;
  }
}

export const storage = new MemStorage();
