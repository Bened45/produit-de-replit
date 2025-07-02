import { useLanguage } from "@/hooks/use-language";
import NavigationHeader from "@/components/navigation-header";
import DashboardStats from "@/components/dashboard-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, FileText, TrendingUp } from "lucide-react";

export default function Reports() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="text-purple-600 mr-3 h-7 w-7" />
            {t('nav.reports')}
          </h1>
          <p className="text-clinical-gray mt-2">
            Rapports et analyses statistiques des vaccinations
          </p>
        </div>

        <DashboardStats />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-white border border-gray-200">
            <CardHeader className="pb-6 border-b border-gray-200">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                <TrendingUp className="text-sanitary-green mr-2 h-5 w-5" />
                Tendances mensuelles
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <TrendingUp className="mx-auto h-12 w-12 text-clinical-gray mb-4" />
                <p className="text-clinical-gray">Graphiques à implémenter</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardHeader className="pb-6 border-b border-gray-200">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                <FileText className="text-medical-blue mr-2 h-5 w-5" />
                Rapports exportables
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-clinical-gray mb-4" />
                <p className="text-clinical-gray">Exports PDF/Excel à venir</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}