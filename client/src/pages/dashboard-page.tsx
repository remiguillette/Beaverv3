import { useAuth } from "@/hooks/use-auth";
import DashboardPanel from "@/components/DashboardPanel";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Shield, FileText, ArrowLeftRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const panelSchema = z.object({
  title: z.string().min(1, { message: "Le titre est requis" }),
  description: z.string().min(1, { message: "La description est requise" }),
  url: z.string().min(1, { message: "L'URL est requise" })
});

type PanelFormValues = z.infer<typeof panelSchema>;

export default function DashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: savedPanels = [] } = useQuery({
    queryKey: ['panneaux'],
    queryFn: async () => {
      const response = await apiRequest.get('/api/panneaux');
      return response.data;
    }
  });
  const [panels, setPanels] = useState<PanelFormValues[]>(savedPanels);

  const form = useForm<PanelFormValues>({
    resolver: zodResolver(panelSchema),
    defaultValues: {
      title: "",
      description: "",
      url: ""
    }
  });

  const addPanelMutation = useMutation({
    mutationFn: async (data: PanelFormValues) => {
      try {
        const response = await apiRequest.post('/api/panneaux', data);
        if (!response.data) {
          throw new Error("Pas de données reçues du serveur");
        }
        return response.data;
      } catch (error) {
        console.error("Erreur lors de l'ajout du panneau:", error);
        throw new Error("Échec de la sauvegarde du panneau");
      }
    },
    onSuccess: (data) => {
      setPanels(currentPanels => [...currentPanels, data]);
      setIsDialogOpen(false);
      form.reset();
      queryClient.invalidateQueries(['panneaux']);
      toast({
        title: "Panneau ajouté",
        description: "Le panneau a été ajouté avec succès",
        variant: "success"
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la sauvegarde",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: PanelFormValues) => {
    addPanelMutation.mutate(data);
  };

  // Default panels
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
    }
  ];

  // Custom panels from user
  const customPanels = panels.map(panel => ({
    title: panel.title,
    description: panel.description,
    icon: <FileText className="h-12 w-12" />,
    linkTo: panel.url,
    buttonText: "Accéder"
  }));

  // Combine default and custom panels
  const allPanels = [...defaultPanels, ...customPanels];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <FileText className="h-7 w-7 text-primary mr-2" />
          <h1 className="text-2xl font-semibold text-white">Tableau de bord</h1>
        </div>
        
        <Button onClick={() => setIsDialogOpen(true)} className="bg-primary hover:bg-primary/90 text-white">
          <Plus className="h-5 w-5 mr-1" />
          Ajouter un panneau
        </Button>
      </div>
      
      <p className="text-muted-foreground mb-6">
        Bienvenue sur l'intranet Beavernet, {user?.username}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allPanels.map((panel, index) => (
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau panneau</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre</FormLabel>
                    <FormControl>
                      <Input placeholder="Titre du panneau" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Description du panneau" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input placeholder="http://example.com" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" className="bg-primary">
                  Ajouter
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
