
import React from 'react';

import DashboardPanel from '@/components/DashboardPanel';
import { FileText, Settings } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">Tableau de bord</h1>
      <h2 className="text-xl mb-2">Bienvenue sur Beavernet</h2>
      <p className="text-gray-500 mb-6">remiguillette</p>
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
      </div>
    </div>
  );
}
