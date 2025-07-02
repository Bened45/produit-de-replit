import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Syringe, Users, Calendar, Tag, TrendingUp } from "lucide-react";
import type { DashboardStats } from "@/types/api";

export default function DashboardStats() {
  const { t } = useLanguage();
  
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/dashboard/stats'],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-8 w-16" />
                </div>
                <Skeleton className="h-12 w-12 rounded-full" />
              </div>
              <div className="mt-4 flex items-center">
                <Skeleton className="h-4 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statsData = [
    {
      title: t('dashboard.vaccinationsToday'),
      value: stats?.todayVaccinations || 0,
      icon: Syringe,
      iconBg: 'bg-light-green',
      iconColor: 'text-sanitary-green',
      change: '+12%',
      changeLabel: t('dashboard.vsYesterday'),
      changeColor: 'text-sanitary-green',
    },
    {
      title: t('dashboard.activePatients'),
      value: stats?.activePatients || 0,
      icon: Users,
      iconBg: 'bg-light-blue',
      iconColor: 'text-medical-blue',
      change: '+5%',
      changeLabel: t('dashboard.thisMonth'),
      changeColor: 'text-sanitary-green',
    },
    {
      title: t('dashboard.upcomingAppointments'),
      value: stats?.upcomingAppointments || 0,
      icon: Calendar,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      change: null,
      changeLabel: t('dashboard.next7Days'),
      changeColor: 'text-clinical-gray',
    },
    {
      title: t('dashboard.certificatesGenerated'),
      value: stats?.certificatesGenerated || 0,
      icon: Tag,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      change: '+8%',
      changeLabel: t('dashboard.thisWeek'),
      changeColor: 'text-sanitary-green',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat, index) => (
        <Card key={index} className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-clinical-gray">{stat.title}</p>
                <p className="text-3xl font-semibold text-gray-900">
                  {stat.value.toLocaleString()}
                </p>
              </div>
              <div className={`${stat.iconBg} p-3 rounded-full`}>
                <stat.icon className={`${stat.iconColor} h-6 w-6`} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              {stat.change && (
                <>
                  <TrendingUp className={`${stat.changeColor} h-4 w-4 mr-1`} />
                  <span className={`${stat.changeColor} font-medium`}>
                    {stat.change}
                  </span>
                </>
              )}
              <span className={`${stat.changeColor} ml-2`}>
                {stat.changeLabel}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
