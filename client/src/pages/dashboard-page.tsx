import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Users } from "lucide-react";

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold text-white mb-6">Tableau de bord</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card border-border p-6 hover:border-primary transition-colors cursor-pointer" onClick={() => navigate("/doc")}>
          <div className="flex flex-col items-center text-center">
            <FileText className="h-12 w-12 text-primary mb-4" />
            <h2 className="text-xl font-medium mb-2">BeaverDoc</h2>
            <p className="text-muted-foreground">Accéder à la documentation de BeaverDoc</p>
            <Button variant="link" className="mt-4">Accéder</Button>
          </div>
        </Card>

        <Card className="bg-card border-border p-6 hover:border-primary transition-colors cursor-pointer" onClick={() => navigate("/crm")}>
          <div className="flex flex-col items-center text-center">
            <Users className="h-12 w-12 text-primary mb-4" />
            <h2 className="text-xl font-medium mb-2">BeaverCRM</h2>
            <p className="text-muted-foreground">Gestion de la relation client</p>
            <Button variant="link" className="mt-4">Accéder</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}