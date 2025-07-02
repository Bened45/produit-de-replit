import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Download, Printer } from "lucide-react";

export default function QRCodeGenerator() {
  const { t } = useLanguage();
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [certificateData, setCertificateData] = useState<any>(null);

  // Generate QR code using a simple grid pattern for demonstration
  const generateQRCodeSVG = (data: string) => {
    const size = 200;
    const moduleSize = 4;
    const modules = size / moduleSize;
    
    // Simple pattern based on data hash
    const hash = data.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    let pattern = '';
    
    for (let y = 0; y < modules; y++) {
      for (let x = 0; x < modules; x++) {
        const shouldFill = (x + y + hash) % 3 === 0;
        if (shouldFill) {
          pattern += `<rect x="${x * moduleSize}" y="${y * moduleSize}" width="${moduleSize}" height="${moduleSize}" fill="black"/>`;
        }
      }
    }
    
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${size}" height="${size}" fill="white"/>
        ${pattern}
      </svg>
    `;
  };

  useEffect(() => {
    // Sample certificate data
    const sampleData = {
      certificateId: "VAC-2023-001587",
      patientName: "Jean Dupont",
      vaccineName: "COVID-19 - Pfizer",
      date: new Date().toLocaleDateString('fr-FR'),
      doctorName: "Dr. Sophie Martin",
    };
    
    setCertificateData(sampleData);
    setQrCodeData(JSON.stringify(sampleData));
  }, []);

  const downloadPDF = () => {
    // In a real application, this would generate and download a PDF
    console.log("Downloading PDF certificate...");
    alert("Fonctionnalité de téléchargement PDF à implémenter");
  };

  const printCertificate = () => {
    // In a real application, this would print the certificate
    console.log("Printing certificate...");
    window.print();
  };

  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader className="pb-6 border-b border-gray-200">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
          <QrCode className="text-purple-600 mr-2 h-5 w-5" />
          {t('qr.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 text-center">
        <div className="mb-6">
          <div className="inline-block p-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="w-48 h-48 bg-white border border-gray-200 rounded flex items-center justify-center mx-auto">
              {qrCodeData ? (
                <div 
                  className="w-full h-full"
                  dangerouslySetInnerHTML={{ 
                    __html: generateQRCodeSVG(qrCodeData) 
                  }} 
                />
              ) : (
                <QrCode className="text-gray-400 h-16 w-16" />
              )}
            </div>
          </div>
        </div>
        
        {certificateData && (
          <div className="space-y-2 mb-6">
            <p className="text-sm text-clinical-gray">
              {t('qr.patient')}: <span className="font-medium text-gray-900">{certificateData.patientName}</span>
            </p>
            <p className="text-sm text-clinical-gray">
              {t('qr.vaccine')}: <span className="font-medium text-gray-900">{certificateData.vaccineName}</span>
            </p>
            <p className="text-sm text-clinical-gray">
              {t('qr.date')}: <span className="font-medium text-gray-900">{certificateData.date}</span>
            </p>
            <p className="text-sm text-clinical-gray">
              {t('qr.certificate')}: <span className="font-medium text-gray-900">#{certificateData.certificateId}</span>
            </p>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={downloadPDF}
            className="flex-1 bg-medical-blue text-white hover:bg-blue-700 text-sm"
          >
            <Download className="mr-2 h-4 w-4" />
            {t('qr.downloadPDF')}
          </Button>
          <Button 
            onClick={printCertificate}
            className="flex-1 bg-gray-600 text-white hover:bg-gray-700 text-sm"
          >
            <Printer className="mr-2 h-4 w-4" />
            {t('qr.print')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
