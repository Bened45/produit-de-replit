import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PatientForm from "@/components/patient-form";
import { Search, Plus, Syringe, UserPlus } from "lucide-react";
import type { Patient } from "@shared/schema";

export default function PatientSearch() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [showPatientForm, setShowPatientForm] = useState(false);

  const { data: patients, isLoading } = useQuery<Patient[]>({
    queryKey: ['/api/patients/search', searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];
      const response = await fetch(`/api/patients/search?q=${encodeURIComponent(searchQuery)}`);
      return response.json();
    },
    enabled: searchQuery.trim().length > 0,
  });

  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader className="pb-6 border-b border-gray-200">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
          <Search className="text-medical-blue mr-2 h-5 w-5" />
          {t('patients.search')}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-4">
          <div className="relative">
            <Input
              type="text"
              placeholder={t('patients.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-medical-blue"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-clinical-gray h-4 w-4" />
          </div>
        </div>
        
        {/* Search Results */}
        {searchQuery && (
          <div className="mb-4 max-h-40 overflow-y-auto">
            {isLoading ? (
              <div className="text-sm text-clinical-gray">Recherche...</div>
            ) : patients && patients.length > 0 ? (
              <div className="space-y-2">
                {patients.map((patient) => (
                  <div
                    key={patient.id}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="font-medium text-gray-900">
                      {patient.firstName} {patient.lastName}
                    </div>
                    <div className="text-sm text-clinical-gray">
                      {patient.socialSecurityNumber}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-clinical-gray">Aucun patient trouvé</div>
            )}
          </div>
        )}
        
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={() => setShowPatientForm(true)}
            className="flex-1 bg-medical-blue text-white hover:bg-blue-700 text-sm"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            {t('patients.newPatient')}
          </Button>
          <Button className="flex-1 bg-sanitary-green text-white hover:bg-green-700 text-sm">
            <Syringe className="mr-2 h-4 w-4" />
            {t('patients.quickVaccination')}
          </Button>
        </div>
      </CardContent>
      
      {/* Formulaire de nouveau patient */}
      <PatientForm 
        open={showPatientForm} 
        onOpenChange={setShowPatientForm} 
      />
    </Card>
  );
}
