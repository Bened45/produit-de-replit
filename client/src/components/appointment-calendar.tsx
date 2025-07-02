import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import type { EnrichedAppointment } from "@/types/api";

export default function AppointmentCalendar() {
  const { t } = useLanguage();
  const [currentDate, setCurrentDate] = useState(new Date());
  const todayDateStr = new Date().toISOString().split('T')[0];
  
  const { data: todayAppointments } = useQuery<EnrichedAppointment[]>({
    queryKey: ['/api/appointments/date', todayDateStr],
  });

  const { data: upcomingAppointments } = useQuery<EnrichedAppointment[]>({
    queryKey: ['/api/appointments/upcoming'],
  });

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const isToday = (day: number | null) => {
    if (!day) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <Badge className="bg-green-100 text-green-800 text-xs">
            {t('appointments.confirmed')}
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-700 text-xs">
            {t('appointments.pending')}
          </Badge>
        );
      case 'completed':
        return (
          <Badge className="bg-blue-100 text-blue-800 text-xs">
            {t('appointments.completed')}
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 text-xs">
            {status}
          </Badge>
        );
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const days = getDaysInMonth(currentDate);

  return (
    <Card className="bg-white border border-gray-200 mt-8">
      <CardHeader className="pb-6 border-b border-gray-200 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
          <Calendar className="text-yellow-600 mr-2 h-5 w-5" />
          {t('appointments.title')}
        </CardTitle>
        <Button className="bg-medical-blue text-white hover:bg-blue-700 text-sm">
          <Plus className="mr-2 h-4 w-4" />
          {t('appointments.newAppointment')}
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar View */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-md font-medium text-gray-900 capitalize">
                {formatMonthYear(currentDate)}
              </h3>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={previousMonth}
                  className="p-2 text-clinical-gray hover:text-gray-700 hover:bg-gray-100"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextMonth}
                  className="p-2 text-clinical-gray hover:text-gray-700 hover:bg-gray-100"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map((day) => (
                <div key={day} className="p-2 text-xs font-medium text-clinical-gray text-center">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => (
                <div
                  key={index}
                  className={`p-2 text-sm text-center relative ${
                    day === null
                      ? 'text-clinical-gray'
                      : isToday(day)
                      ? 'text-white bg-medical-blue rounded font-medium'
                      : 'text-gray-900 hover:bg-gray-100 cursor-pointer rounded'
                  }`}
                >
                  {day}
                  {day === 15 && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-sanitary-green rounded-full"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Today's Appointments */}
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-4">
              {t('appointments.today')} - {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
            </h3>
            <div className="space-y-3">
              {todayAppointments && todayAppointments.length > 0 ? (
                todayAppointments.map((appointment) => (
                  <div key={appointment.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-medical-blue">
                        {formatTime(appointment.appointmentDate)}
                      </span>
                      {getStatusBadge(appointment.status)}
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {appointment.patient ? 
                        `${appointment.patient.firstName} ${appointment.patient.lastName}` : 
                        'Patient inconnu'
                      }
                    </p>
                    <p className="text-xs text-clinical-gray">
                      {appointment.appointmentType}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-clinical-gray mb-4" />
                  <p className="text-clinical-gray">Aucun rendez-vous aujourd'hui</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
