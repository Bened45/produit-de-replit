import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/use-language";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Syringe, Save, QrCode, Loader2 } from "lucide-react";
import { z } from "zod";
import type { Vaccine, Patient } from "@shared/schema";

const vaccinationFormSchema = z.object({
  // Patient info
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom de famille est requis"),
  dateOfBirth: z.string().min(1, "La date de naissance est requise"),
  socialSecurityNumber: z.string().min(1, "Le numéro de sécurité sociale est requis"),
  phone: z.string().optional(),
  
  // Vaccination details
  vaccineId: z.string().min(1, "Le type de vaccin est requis"),
  lotNumber: z.string().min(1, "Le numéro de lot est requis"),
  expirationDate: z.string().min(1, "La date d'expiration est requise"),
  injectionSite: z.string().min(1, "Le site d'injection est requis"),
  dosage: z.string().optional(),
  notes: z.string().optional(),
});

type VaccinationFormData = z.infer<typeof vaccinationFormSchema>;

export default function VaccinationForm() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [lastVaccination, setLastVaccination] = useState<any>(null);

  const form = useForm<VaccinationFormData>({
    resolver: zodResolver(vaccinationFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      socialSecurityNumber: "",
      phone: "",
      vaccineId: "",
      lotNumber: "",
      expirationDate: "",
      injectionSite: "",
      dosage: "",
      notes: "",
    },
  });

  const { data: vaccines } = useQuery<Vaccine[]>({
    queryKey: ['/api/vaccines'],
  });

  const createPatientMutation = useMutation({
    mutationFn: async (patientData: any) => {
      const response = await apiRequest('POST', '/api/patients', patientData);
      return response.json();
    },
    onSuccess: (patient) => {
      setCurrentPatient(patient);
      queryClient.invalidateQueries({ queryKey: ['/api/patients'] });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la création du patient",
        variant: "destructive",
      });
    },
  });

  const createVaccinationMutation = useMutation({
    mutationFn: async (vaccinationData: any) => {
      const response = await apiRequest('POST', '/api/vaccinations', vaccinationData);
      return response.json();
    },
    onSuccess: (vaccination) => {
      setLastVaccination(vaccination);
      queryClient.invalidateQueries({ queryKey: ['/api/vaccinations'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      toast({
        title: "Succès",
        description: t('success.saved'),
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de l'enregistrement de la vaccination",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: VaccinationFormData) => {
    try {
      let patient = currentPatient;
      
      // Create patient if not exists
      if (!patient) {
        const patientData = {
          firstName: data.firstName,
          lastName: data.lastName,
          dateOfBirth: data.dateOfBirth,
          socialSecurityNumber: data.socialSecurityNumber,
          phone: data.phone || null,
          email: null,
          address: null,
        };
        
        patient = await createPatientMutation.mutateAsync(patientData);
      }
      
      // Create vaccination
      const vaccinationData = {
        patientId: patient.id,
        vaccineId: parseInt(data.vaccineId),
        doctorId: 1, // Default doctor for now
        lotNumber: data.lotNumber,
        expirationDate: data.expirationDate,
        injectionSite: data.injectionSite,
        dosage: data.dosage || null,
        notes: data.notes || null,
      };
      
      await createVaccinationMutation.mutateAsync(vaccinationData);
      
    } catch (error) {
      console.error('Vaccination submission error:', error);
    }
  };

  const generateQRCode = () => {
    if (!lastVaccination) {
      toast({
        title: "Erreur",
        description: "Aucune vaccination à certifier",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Succès",
      description: t('success.generated'),
      variant: "default",
    });
  };

  const injectionSites = [
    { value: "deltoid-left", label: t('injectionSite.deltoidLeft') },
    { value: "deltoid-right", label: t('injectionSite.deltoidRight') },
    { value: "thigh-left", label: t('injectionSite.thighLeft') },
    { value: "thigh-right", label: t('injectionSite.thighRight') },
  ];

  return (
    <Card className="bg-white border border-gray-200 mb-8">
      <CardHeader className="pb-6 border-b border-gray-200">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
          <Syringe className="text-sanitary-green mr-2 h-5 w-5" />
          {t('vaccination.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Patient Information */}
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-4">
                {t('vaccination.patientInfo')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('vaccination.lastName')} *</FormLabel>
                      <FormControl>
                        <Input placeholder="Dupont" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('vaccination.firstName')} *</FormLabel>
                      <FormControl>
                        <Input placeholder="Jean" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('vaccination.dateOfBirth')} *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <FormField
                  control={form.control}
                  name="socialSecurityNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('vaccination.ssn')} *</FormLabel>
                      <FormControl>
                        <Input placeholder="1 85 03 75 116 001 23" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('vaccination.phone')}</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="06 12 34 56 78" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Vaccination Details */}
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-4">
                {t('vaccination.vaccinationDetails')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="vaccineId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('vaccination.vaccineType')} *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('vaccination.selectVaccine')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {vaccines?.map((vaccine) => (
                            <SelectItem key={vaccine.id} value={vaccine.id.toString()}>
                              {vaccine.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lotNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('vaccination.lotNumber')} *</FormLabel>
                      <FormControl>
                        <Input placeholder="FF2589" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expirationDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('vaccination.expirationDate')} *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <FormField
                  control={form.control}
                  name="injectionSite"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('vaccination.injectionSite')} *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('vaccination.selectSite')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {injectionSites.map((site) => (
                            <SelectItem key={site.value} value={site.value}>
                              {site.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dosage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('vaccination.dosage')}</FormLabel>
                      <FormControl>
                        <Input placeholder="0.5 mL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Notes and Actions */}
            <div>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('vaccination.notes')}</FormLabel>
                    <FormControl>
                      <Textarea 
                        rows={3} 
                        placeholder={t('vaccination.notesPlaceholder')}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Button 
                  type="submit" 
                  className="flex-1 bg-medical-blue text-white hover:bg-blue-700"
                  disabled={createPatientMutation.isPending || createVaccinationMutation.isPending}
                >
                  {(createPatientMutation.isPending || createVaccinationMutation.isPending) ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  {t('vaccination.save')}
                </Button>
                <Button 
                  type="button" 
                  onClick={generateQRCode}
                  className="flex-1 bg-sanitary-green text-white hover:bg-green-700"
                  disabled={!lastVaccination}
                >
                  <QrCode className="mr-2 h-4 w-4" />
                  {t('vaccination.generateQR')}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
