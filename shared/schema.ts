import { pgTable, text, serial, integer, boolean, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("doctor"),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  licenseNumber: text("license_number"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  dateOfBirth: date("date_of_birth").notNull(),
  socialSecurityNumber: text("social_security_number").notNull().unique(),
  phone: text("phone"),
  email: text("email"),
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const vaccines = pgTable("vaccines", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  manufacturer: text("manufacturer").notNull(),
  type: text("type").notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true),
});

export const vaccinations = pgTable("vaccinations", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => patients.id).notNull(),
  vaccineId: integer("vaccine_id").references(() => vaccines.id).notNull(),
  doctorId: integer("doctor_id").references(() => users.id).notNull(),
  lotNumber: text("lot_number").notNull(),
  expirationDate: date("expiration_date").notNull(),
  injectionSite: text("injection_site").notNull(),
  dosage: text("dosage"),
  notes: text("notes"),
  certificateId: text("certificate_id").unique(),
  qrCodeData: text("qr_code_data"),
  signature: text("signature"),
  administeredAt: timestamp("administered_at").defaultNow(),
});

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => patients.id).notNull(),
  doctorId: integer("doctor_id").references(() => users.id).notNull(),
  appointmentDate: timestamp("appointment_date").notNull(),
  appointmentType: text("appointment_type").notNull(),
  status: text("status").notNull().default("scheduled"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
  firstName: true,
  lastName: true,
  licenseNumber: true,
});

export const insertPatientSchema = createInsertSchema(patients).pick({
  firstName: true,
  lastName: true,
  dateOfBirth: true,
  socialSecurityNumber: true,
  phone: true,
  email: true,
  address: true,
});

export const insertVaccineSchema = createInsertSchema(vaccines).pick({
  name: true,
  manufacturer: true,
  type: true,
  description: true,
  isActive: true,
});

export const insertVaccinationSchema = createInsertSchema(vaccinations).pick({
  patientId: true,
  vaccineId: true,
  doctorId: true,
  lotNumber: true,
  expirationDate: true,
  injectionSite: true,
  dosage: true,
  notes: true,
  certificateId: true,
  qrCodeData: true,
  signature: true,
});

export const insertAppointmentSchema = createInsertSchema(appointments).pick({
  patientId: true,
  doctorId: true,
  appointmentDate: true,
  appointmentType: true,
  status: true,
  notes: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Patient = typeof patients.$inferSelect;
export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type Vaccine = typeof vaccines.$inferSelect;
export type InsertVaccine = z.infer<typeof insertVaccineSchema>;
export type Vaccination = typeof vaccinations.$inferSelect;
export type InsertVaccination = z.infer<typeof insertVaccinationSchema>;
export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
