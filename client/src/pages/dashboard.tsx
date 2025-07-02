import { useLanguage } from "@/hooks/use-language";
import NavigationHeader from "@/components/navigation-header";
import DashboardStats from "@/components/dashboard-stats";
import PatientSearch from "@/components/patient-search";
import RecentVaccinations from "@/components/recent-vaccinations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { LayoutDashboard, Users, Syringe, Calendar, BarChart3 } from "lucide-react";

export default function Dashboard() {
  const { t } = useLanguage();

  const quickActions = [
    {
      title: "Gestion Patients",
      description: "Rechercher et gérer les dossiers patients",
      icon: Users,
      color: "bg-medical-blue",
      link: "/patients"
    },
    {
      title: "Vaccinations",
      description: "Enregistrer une nouvelle vaccination",
      icon: Syringe,
      color: "bg-sanitary-green",
      link: "/vaccinations"
    },
    {
      title: "Rendez-vous",
      description: "Planifier et gérer les appointments",
      icon: Calendar,
      color: "bg-yellow-600",
      link: "/appointments"
    },
    {
      title: "Rapports",
      description: "Consulter les statistiques et analyses",
      icon: BarChart3,
      color: "bg-purple-600",
      link: "/reports"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <LayoutDashboard className="text-medical-blue mr-3 h-7 w-7" />
            {t('dashboard.title')}
          </h1>
          <p className="text-clinical-gray mt-2">
            Vue d'ensemble de l'activité de vaccination
          </p>
        </div>

        <DashboardStats />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <PatientSearch />
          <RecentVaccinations />
        </div>

        <Card className="bg-white border border-gray-200">
          <CardHeader className="pb-6 border-b border-gray-200">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Actions rapides
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.link}>
                  <Button
                    variant="ghost"
                    className="w-full h-auto p-6 flex flex-col items-center text-center hover:bg-gray-50 border border-gray-200"
                  >
                    <div className={`${action.color} p-3 rounded-full mb-3`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">{action.title}</h3>
                    <p className="text-sm text-clinical-gray">{action.description}</p>
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
