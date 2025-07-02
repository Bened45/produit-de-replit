import { useLanguage } from "@/hooks/use-language";
import NavigationHeader from "@/components/navigation-header";
import DashboardStats from "@/components/dashboard-stats";
import PatientSearch from "@/components/patient-search";
import RecentVaccinations from "@/components/recent-vaccinations";
import VaccinationForm from "@/components/vaccination-form";
import QRCodeGenerator from "@/components/qr-code-generator";
import DigitalSignature from "@/components/digital-signature";
import AppointmentCalendar from "@/components/appointment-calendar";

export default function Dashboard() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardStats />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <PatientSearch />
          <RecentVaccinations />
        </div>
        
        <VaccinationForm />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <QRCodeGenerator />
          <DigitalSignature />
        </div>
        
        <AppointmentCalendar />
      </div>
    </div>
  );
}
