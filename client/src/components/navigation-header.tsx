import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Hospital } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function NavigationHeader() {
  const { t, language, changeLanguage } = useLanguage();
  const [notificationCount] = useState(3);

  const languageOptions = [
    { value: 'fr', label: '🇫🇷 Français', flag: '🇫🇷' },
    { value: 'en', label: '🇺🇸 English', flag: '🇺🇸' },
    { value: 'es', label: '🇪🇸 Español', flag: '🇪🇸' },
  ];

  const navigationItems = [
    { key: 'dashboard', label: t('nav.dashboard'), active: true },
    { key: 'patients', label: t('nav.patients'), active: false },
    { key: 'appointments', label: t('nav.appointments'), active: false },
    { key: 'reports', label: t('nav.reports'), active: false },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Hospital className="text-medical-blue text-2xl mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">
                {t('dashboard.title')}
              </h1>
            </div>
            <nav className="hidden md:ml-8 md:flex md:space-x-8">
              {navigationItems.map((item) => (
                <a
                  key={item.key}
                  href={`#${item.key}`}
                  className={`px-1 pt-1 pb-4 text-sm font-medium ${
                    item.active
                      ? 'text-medical-blue border-b-2 border-medical-blue'
                      : 'text-clinical-gray hover:text-gray-700'
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <Select value={language} onValueChange={changeLanguage}>
              <SelectTrigger className="w-[140px] bg-gray-50 border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-clinical-gray" />
              {notificationCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs rounded-full"
                >
                  {notificationCount}
                </Badge>
              )}
            </Button>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <img 
                className="h-8 w-8 rounded-full" 
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100" 
                alt="Dr. Sophie Martin" 
              />
              <div className="text-sm">
                <p className="font-medium text-gray-900">Dr. Sophie Martin</p>
                <p className="text-clinical-gray">Médecin Chef</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
