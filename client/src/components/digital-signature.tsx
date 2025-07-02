import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PenTool, Eraser, FileText } from "lucide-react";

export default function DigitalSignature() {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);
  
  const doctorInfo = {
    name: "Dr. Sophie Martin",
    license: "Ordre des Médecins #123456",
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = 128;
    
    // Set drawing style
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const rect = canvas?.getBoundingClientRect();
    if (!canvas || !rect) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const rect = canvas?.getBoundingClientRect();
    if (!canvas || !rect) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSigned(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
  };

  const signCertificate = () => {
    if (!hasSigned) {
      alert("Veuillez signer avant de valider le certificat");
      return;
    }
    
    // In a real application, this would save the signature and associate it with the certificate
    console.log("Signing certificate...");
    alert("Certificat signé avec succès!");
  };

  const previewCertificate = () => {
    // In a real application, this would show a preview of the complete certificate
    console.log("Previewing certificate...");
    alert("Fonctionnalité de prévisualisation à implémenter");
  };

  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader className="pb-6 border-b border-gray-200">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
          <PenTool className="text-indigo-600 mr-2 h-5 w-5" />
          {t('signature.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('signature.doctorSignature')}
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
            <canvas
              ref={canvasRef}
              className="w-full h-32 bg-white border border-gray-200 rounded cursor-crosshair"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-gray-900">{doctorInfo.name}</p>
            <p className="text-xs text-clinical-gray">{doctorInfo.license}</p>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={clearSignature}
            className="text-clinical-gray hover:text-gray-700"
          >
            <Eraser className="mr-1 h-4 w-4" />
            {t('signature.clear')}
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={signCertificate}
            className="flex-1 bg-indigo-600 text-white hover:bg-indigo-700 text-sm"
            disabled={!hasSigned}
          >
            <PenTool className="mr-2 h-4 w-4" />
            {t('signature.sign')}
          </Button>
          <Button 
            onClick={previewCertificate}
            className="flex-1 bg-gray-600 text-white hover:bg-gray-700 text-sm"
          >
            <FileText className="mr-2 h-4 w-4" />
            {t('signature.preview')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
