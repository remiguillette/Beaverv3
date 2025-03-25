import { useAuth } from "@/hooks/use-auth";
import DashboardPanel from "@/components/DashboardPanel";
import { Shield, FileText, ArrowLeftRight } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();

  const defaultPanels = [
    {
      title: "Documentation Beavernet",
      description: "Accéder à la documentation de l'intranet",
      icon: <FileText className="h-12 w-12" />,
      linkTo: "/documentation",
      buttonText: "Accéder"
    },
    {
      title: "Pare-feu",
      description: "Gérez vos règles de pare-feu pour sécuriser votre réseau",
      icon: <Shield className="h-12 w-12" />,
      linkTo: "/firewall",
      buttonText: "Configurer le pare-feu"
    },
    {
      title: "Proxy",
      description: "Configurez les paramètres du proxy pour la redirection du trafic",
      icon: <ArrowLeftRight className="h-12 w-12" />,
      linkTo: "/proxy",
      buttonText: "Configurer le proxy"
    },
    {
      title: "BeaverCRM",
      description: "Gestion de la relation client",
      icon: <FileText className="h-12 w-12" />,
      linkTo: "http://0.0.0.0:5001",
      buttonText: "Accéder"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <FileText className="h-7 w-7 text-primary mr-2" />
        <h1 className="text-2xl font-semibold text-white">Tableau de bord</h1>
      </div>

      <p className="text-muted-foreground mb-6">
        Bienvenue sur l'intranet Beavernet, {user?.username}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {defaultPanels.map((panel, index) => (
          <DashboardPanel
            key={index}
            title={panel.title}
            description={panel.description}
            icon={panel.icon}
            linkTo={panel.linkTo}
            buttonText={panel.buttonText}
          />
        ))}
      </div>
    </div>
  );
}