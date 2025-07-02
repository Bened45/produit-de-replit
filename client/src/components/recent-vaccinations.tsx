import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { History, Syringe, Clock } from "lucide-react";
import type { EnrichedVaccination } from "@/types/api";

export default function RecentVaccinations() {
  const { t } = useLanguage();
  
  const { data: vaccinations, isLoading } = useQuery<EnrichedVaccination[]>({
    queryKey: ['/api/vaccinations/recent'],
    queryFn: async () => {
      const response = await fetch('/api/vaccinations/recent?limit=5');
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <Card className="bg-white border border-gray-200">
        <CardHeader className="pb-6 border-b border-gray-200">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
            <History className="text-sanitary-green mr-2 h-5 w-5" />
            {t('recent.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (vaccination: EnrichedVaccination) => {
    const now = new Date();
    const vaccinationDate = vaccination.administeredAt ? new Date(vaccination.administeredAt) : null;
    
    if (!vaccinationDate) {
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          {t('appointments.pending')}
        </Badge>
      );
    }
    
    const diffHours = (now.getTime() - vaccinationDate.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 1) {
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          {t('appointments.inProgress')}
        </Badge>
      );
    }
    
    return (
      <Badge variant="secondary" className="bg-green-100 text-green-800">
        {t('appointments.completed')}
      </Badge>
    );
  };

  const formatTime = (date: Date | null) => {
    if (!date) return '--:--';
    return new Date(date).toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader className="pb-6 border-b border-gray-200">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
          <History className="text-sanitary-green mr-2 h-5 w-5" />
          {t('recent.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {vaccinations && vaccinations.length > 0 ? (
            vaccinations.map((vaccination) => (
              <div 
                key={vaccination.id}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-light-green rounded-full flex items-center justify-center">
                    <Syringe className="text-sanitary-green h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {vaccination.patient ? 
                        `${vaccination.patient.firstName} ${vaccination.patient.lastName}` : 
                        'Patient inconnu'
                      }
                    </p>
                    <p className="text-sm text-clinical-gray">
                      {vaccination.vaccine?.name || 'Vaccin inconnu'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-clinical-gray">
                    {formatTime(vaccination.administeredAt)}
                  </p>
                  {getStatusBadge(vaccination)}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Clock className="mx-auto h-12 w-12 text-clinical-gray mb-4" />
              <p className="text-clinical-gray">Aucune vaccination récente</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
