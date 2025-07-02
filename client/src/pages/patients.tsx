import { useLanguage } from "@/hooks/use-language";
import NavigationHeader from "@/components/navigation-header";
import PatientSearch from "@/components/patient-search";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function Patients() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Users className="text-medical-blue mr-3 h-7 w-7" />
            {t('nav.patients')}
          </h1>
          <p className="text-clinical-gray mt-2">
            Recherche et gestion des dossiers patients
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PatientSearch />
          
          <Card className="bg-white border border-gray-200">
            <CardHeader className="pb-6 border-b border-gray-200">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Patients récents
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <Users className="mx-auto h-12 w-12 text-clinical-gray mb-4" />
                <p className="text-clinical-gray">Aucun patient récent</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}