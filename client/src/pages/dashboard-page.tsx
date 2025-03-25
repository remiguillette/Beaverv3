
import React from 'react';
import { Grid } from '@/components/ui/grid';
import DashboardPanel from '@/components/DashboardPanel';
import { FileText, Settings } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <Grid className="gap-4 grid-cols-1 md:grid-cols-2">
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
      </Grid>
    </div>
  );
}
