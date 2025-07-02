import { useLanguage } from "@/hooks/use-language";
import NavigationHeader from "@/components/navigation-header";
import AppointmentCalendar from "@/components/appointment-calendar";
import { Calendar } from "lucide-react";

export default function Appointments() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Calendar className="text-yellow-600 mr-3 h-7 w-7" />
            {t('nav.appointments')}
          </h1>
          <p className="text-clinical-gray mt-2">
            Planification et gestion des rendez-vous de vaccination
          </p>
        </div>

        <AppointmentCalendar />
      </div>
    </div>
  );
}