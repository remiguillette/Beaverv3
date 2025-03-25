import React from 'react';

import DashboardPanel from '@/components/DashboardPanel';
import { FileText, Settings, Shield, ArrowRight, Mail, ScanLine, Car } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">Tableau de bord</h1>
      <p className="text-gray-500 mb-6">Bienvenue sur Beavernet remiguillette</p>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <DashboardPanel
          title="BeaverDoc"
          description="Accéder à la documentation de BeaverDoc"
          icon={<FileText className="w-8 h-8" />}
          linkTo="/doc"
          buttonText="Accéder"
        />
        <DashboardPanel
          title="BeaverCRM"
          description="Gestion de la relation client"
          icon={<Settings className="w-8 h-8" />}
          linkTo="/crm"
          buttonText="Accéder"
        />
        <DashboardPanel
          title="BeaverLaw"
          description="Contrôle Animalier"
          icon={<Shield className="w-8 h-8" />}
          linkTo="http://0.0.0.0:5002"
          buttonText="Accéder"
        />
        <DashboardPanel
          title="BeaverPatch"
          description="Système de Répartition CAD"
          icon={<ArrowRight className="w-8 h-8" />}
          linkTo="http://0.0.0.0:5003"
          buttonText="Accéder"
        />
        <DashboardPanel
          title="BeaverMail"
          description="Messagerie sécurisée"
          icon={<Mail className="w-8 h-8" />}
          linkTo="mailto:"
          buttonText="Accéder"
        />
        <DashboardPanel
          title="BeaverPlate"
          description="Lecture automatisée de plaques d'immatriculation (LAPI)"
          icon={<ScanLine className="w-8 h-8" />}
          linkTo="http://0.0.0.0:5003"
          buttonText="Accéder"
        />
        <DashboardPanel
          title="BeaverDrive"
          description="Vérification du permis de conduire"
          icon={<Car className="w-8 h-8" />}
          linkTo="https://www.dlc.rus.mto.gov.on.ca/dlc/fr/entrer-renseignements"
          buttonText="Accéder"
        />
      </div>
    </div>
  );
}