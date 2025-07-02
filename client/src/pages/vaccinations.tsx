import { useLanguage } from "@/hooks/use-language";
import NavigationHeader from "@/components/navigation-header";
import VaccinationForm from "@/components/vaccination-form";
import RecentVaccinations from "@/components/recent-vaccinations";
import QRCodeGenerator from "@/components/qr-code-generator";
import DigitalSignature from "@/components/digital-signature";
import { Syringe } from "lucide-react";

export default function Vaccinations() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Syringe className="text-sanitary-green mr-3 h-7 w-7" />
            Vaccinations
          </h1>
          <p className="text-clinical-gray mt-2">
            Enregistrement et certification des vaccinations
          </p>
        </div>

        <div className="space-y-8">
          <VaccinationForm />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <QRCodeGenerator />
            <DigitalSignature />
          </div>
          
          <RecentVaccinations />
        </div>
      </div>
    </div>
  );
}