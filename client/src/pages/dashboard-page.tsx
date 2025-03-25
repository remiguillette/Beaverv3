import React from 'react';

import DashboardPanel from '@/components/DashboardPanel';
import { FileText, Settings, Shield } from 'lucide-react';

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
      </div>
    </div>
  );
}