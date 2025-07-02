import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Wifi, WifiOff } from "lucide-react";
import { API_CONFIG } from "@/lib/api-config";

export default function ApiStatus() {
  const [isConnected, setIsConnected] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkApiConnection = async () => {
    setIsChecking(true);
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
        signal: AbortSignal.timeout(5000) // Timeout de 5 secondes
      });
      
      setIsConnected(response.ok);
      setLastCheck(new Date());
    } catch (error) {
      setIsConnected(false);
      setLastCheck(new Date());
      console.warn('API non disponible:', error);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkApiConnection();
    // Vérifier la connexion toutes les 30 secondes
    const interval = setInterval(checkApiConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-medium text-gray-900 flex items-center justify-between">
          Statut de l'API
          <Button
            variant="ghost"
            size="sm"
            onClick={checkApiConnection}
            disabled={isChecking}
            className="h-6 w-6 p-0"
          >
            {isChecking ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-medical-blue"></div>
            ) : (
              <Wifi className="h-4 w-4" />
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-700">Connecté</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-gray-700">Mode Local</span>
              </>
            )}
          </div>
          <Badge variant={isConnected ? "default" : "secondary"}>
            {isConnected ? "API" : "Local"}
          </Badge>
        </div>
        
        <div className="mt-2 text-xs text-clinical-gray">
          URL: {API_CONFIG.BASE_URL}
          {lastCheck && (
            <div>
              Dernière vérif: {lastCheck.toLocaleTimeString()}
            </div>
          )}
        </div>

        {!isConnected && (
          <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
            <div className="font-medium text-yellow-800 mb-1">Mode développement</div>
            <div className="text-yellow-700">
              L'application fonctionne avec des données locales. 
              Configurez VITE_API_BASE_URL pour connecter votre serveur.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}