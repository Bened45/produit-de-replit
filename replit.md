# VacciCare - Medical Vaccination Management System

## Overview

VacciCare is a comprehensive medical vaccination management system designed for healthcare professionals to manage patient records, track vaccinations, generate digital certificates, and schedule appointments. The application provides a multilingual interface (French, English, Spanish) with a focus on medical workflow efficiency and regulatory compliance.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with custom medical-themed color palette
- **Forms**: React Hook Form with Zod validation
- **Internationalization**: Custom i18n implementation with localStorage persistence

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: PostgreSQL-based session storage
- **API Design**: RESTful API with comprehensive error handling

### Build System
- **Bundler**: Vite for frontend development and building
- **TypeScript**: Strict configuration with path mapping
- **Development**: Hot module replacement and runtime error overlay
- **Production**: Optimized builds with tree shaking

## Key Components

### Database Schema
The system uses a well-structured PostgreSQL schema with the following entities:
- **Users**: Healthcare professionals with role-based access
- **Patients**: Patient demographics and contact information
- **Vaccines**: Vaccine catalog with manufacturer details
- **Vaccinations**: Vaccination records linking patients, vaccines, and doctors
- **Appointments**: Scheduling system for future vaccinations

### Core Features
1. **Patient Management**: Search, create, and update patient records
2. **Vaccination Recording**: Digital vaccination certificates with QR codes
3. **Appointment Scheduling**: Calendar-based appointment management
4. **Dashboard Analytics**: Real-time statistics and recent activity
5. **Digital Signatures**: Canvas-based signature capture for legal compliance
6. **Certificate Generation**: QR code generation for vaccination verification

### UI Component System
- Comprehensive design system based on Radix UI primitives
- Medical-themed color palette with accessibility considerations
- Responsive design with mobile-first approach
- Form components with built-in validation and error handling

## Data Flow

1. **Authentication Flow**: User login creates authenticated sessions stored in PostgreSQL
2. **Patient Search**: Real-time search with debounced queries to minimize database load
3. **Vaccination Process**: Form submission → validation → database storage → certificate generation
4. **Dashboard Updates**: Real-time statistics queries with optimistic updates
5. **Appointment Management**: CRUD operations with calendar visualization

## External Dependencies

### Frontend Dependencies
- **UI Framework**: React 18, Wouter for routing
- **Component Library**: Radix UI primitives, shadcn/ui components
- **Data Fetching**: TanStack Query for server state
- **Form Handling**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS, class-variance-authority
- **Date Handling**: date-fns for date manipulation

### Backend Dependencies
- **Server**: Express.js with TypeScript
- **Database**: Drizzle ORM, Neon Database serverless PostgreSQL
- **Session**: connect-pg-simple for PostgreSQL session storage
- **Validation**: Zod for runtime type checking and validation

### Development Tools
- **Build Tool**: Vite with React plugin
- **Database Migrations**: Drizzle Kit for schema management
- **Development Environment**: Replit integration with runtime error overlay

## Deployment Strategy

### Development Environment
- Local development with Vite dev server
- Hot module replacement for rapid development
- In-memory storage fallback for development without database

### Production Build
- Vite builds optimized frontend assets
- esbuild compiles server-side TypeScript to ESM
- Static assets served from Express with proper caching headers

### Database Strategy
- PostgreSQL via Neon Database for production scalability
- Database migrations managed through Drizzle Kit
- Connection pooling and serverless compatibility

### Environment Configuration
- Environment-based configuration for database connections
- Secure handling of sensitive credentials
- Production-optimized builds with tree shaking

## Changelog

Changelog:
- July 02, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.