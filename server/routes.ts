import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { 
  insertPatientSchema, insertVaccinationSchema, insertAppointmentSchema,
  type Patient, type Vaccination, type Appointment, type Vaccine
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Patients
  app.get("/api/patients/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.json([]);
      }
      const patients = await storage.searchPatients(query);
      res.json(patients);
    } catch (error) {
      res.status(500).json({ error: "Failed to search patients" });
    }
  });

  app.get("/api/patients/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const patient = await storage.getPatient(id);
      if (!patient) {
        return res.status(404).json({ error: "Patient not found" });
      }
      res.json(patient);
    } catch (error) {
      res.status(500).json({ error: "Failed to get patient" });
    }
  });

  app.post("/api/patients", async (req, res) => {
    try {
      const validatedData = insertPatientSchema.parse(req.body);
      
      // Check if patient already exists
      const existing = await storage.getPatientBySSN(validatedData.socialSecurityNumber);
      if (existing) {
        return res.status(400).json({ error: "Patient with this social security number already exists" });
      }
      
      const patient = await storage.createPatient(validatedData);
      res.status(201).json(patient);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid patient data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create patient" });
    }
  });

  // Vaccines
  app.get("/api/vaccines", async (req, res) => {
    try {
      const vaccines = await storage.getAllVaccines();
      res.json(vaccines);
    } catch (error) {
      res.status(500).json({ error: "Failed to get vaccines" });
    }
  });

  // Vaccinations
  app.post("/api/vaccinations", async (req, res) => {
    try {
      const validatedData = insertVaccinationSchema.parse(req.body);
      
      // Generate certificate ID
      const certificateId = `VAC-${new Date().getFullYear()}-${String(Math.random()).substring(2, 8)}`;
      
      // Generate QR code data (simplified)
      const qrCodeData = JSON.stringify({
        certificateId,
        patientId: validatedData.patientId,
        vaccineId: validatedData.vaccineId,
        administeredAt: new Date().toISOString(),
        lotNumber: validatedData.lotNumber
      });
      
      const vaccination = await storage.createVaccination({
        ...validatedData,
        certificateId,
        qrCodeData
      });
      
      res.status(201).json(vaccination);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid vaccination data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create vaccination" });
    }
  });

  app.get("/api/vaccinations/recent", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const vaccinations = await storage.getRecentVaccinations(limit);
      
      // Enrich with patient and vaccine data
      const enrichedVaccinations = await Promise.all(
        vaccinations.map(async (vaccination) => {
          const patient = await storage.getPatient(vaccination.patientId);
          const vaccine = await storage.getVaccine(vaccination.vaccineId);
          return {
            ...vaccination,
            patient,
            vaccine
          };
        })
      );
      
      res.json(enrichedVaccinations);
    } catch (error) {
      res.status(500).json({ error: "Failed to get recent vaccinations" });
    }
  });

  app.get("/api/vaccinations/patient/:patientId", async (req, res) => {
    try {
      const patientId = parseInt(req.params.patientId);
      const vaccinations = await storage.getVaccinationsByPatient(patientId);
      
      // Enrich with vaccine data
      const enrichedVaccinations = await Promise.all(
        vaccinations.map(async (vaccination) => {
          const vaccine = await storage.getVaccine(vaccination.vaccineId);
          return {
            ...vaccination,
            vaccine
          };
        })
      );
      
      res.json(enrichedVaccinations);
    } catch (error) {
      res.status(500).json({ error: "Failed to get patient vaccinations" });
    }
  });

  // Appointments
  app.post("/api/appointments", async (req, res) => {
    try {
      const validatedData = insertAppointmentSchema.parse(req.body);
      const appointment = await storage.createAppointment(validatedData);
      res.status(201).json(appointment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid appointment data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create appointment" });
    }
  });

  app.get("/api/appointments/upcoming", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const appointments = await storage.getUpcomingAppointments(limit);
      
      // Enrich with patient data
      const enrichedAppointments = await Promise.all(
        appointments.map(async (appointment) => {
          const patient = await storage.getPatient(appointment.patientId);
          return {
            ...appointment,
            patient
          };
        })
      );
      
      res.json(enrichedAppointments);
    } catch (error) {
      res.status(500).json({ error: "Failed to get upcoming appointments" });
    }
  });

  app.get("/api/appointments/date/:date", async (req, res) => {
    try {
      const date = req.params.date;
      const appointments = await storage.getAppointmentsByDate(date);
      
      // Enrich with patient data
      const enrichedAppointments = await Promise.all(
        appointments.map(async (appointment) => {
          const patient = await storage.getPatient(appointment.patientId);
          return {
            ...appointment,
            patient
          };
        })
      );
      
      res.json(enrichedAppointments);
    } catch (error) {
      res.status(500).json({ error: "Failed to get appointments for date" });
    }
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const todayVaccinations = await storage.getRecentVaccinations(100);
      const todayCount = todayVaccinations.filter(v => 
        v.administeredAt && v.administeredAt.toISOString().split('T')[0] === today
      ).length;
      
      const activePatients = Array.from((storage as any).patients.values()).length;
      const upcomingAppointments = await storage.getUpcomingAppointments(7);
      const certificatesGenerated = todayVaccinations.filter(v => v.certificateId).length;
      
      res.json({
        todayVaccinations: todayCount,
        activePatients,
        upcomingAppointments: upcomingAppointments.length,
        certificatesGenerated
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to get dashboard stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
