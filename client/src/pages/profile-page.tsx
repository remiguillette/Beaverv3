import { useAuth } from "@/hooks/use-auth";
import { User, Shield, ArrowLeftRight, Camera, Mail, Key } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import BeaverLogo from "@/components/BeaverLogo";
import { CustomTooltip } from "@/components/ui/tooltip";

const profileUpdateSchema = z.object({
  email: z.string().email({ message: "Email invalide" }).optional(),
  newPassword: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères" }).or(z.string().length(0)),
  confirmPassword: z.string().or(z.string().length(0))
}).refine((data) => {
  if (data.newPassword || data.confirmPassword) {
    return data.newPassword === data.confirmPassword;
  }
  return true;
}, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type ProfileUpdateFormValues = z.infer<typeof profileUpdateSchema>;

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<ProfileUpdateFormValues>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      email: user?.email || "",
      newPassword: "",
      confirmPassword: ""
    }
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileUpdateFormValues) => {
      const res = await apiRequest("PATCH", "/api/user", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Profil mis à jour",
        description: "Votre profil a été mis à jour avec succès",
      });
      form.reset({
        email: user?.email || "",
        newPassword: "",
        confirmPassword: ""
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Erreur lors de la mise à jour du profil: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: ProfileUpdateFormValues) => {
    updateProfileMutation.mutate(data);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <User className="h-7 w-7 text-primary mr-2" />
        <h1 className="text-2xl font-semibold text-white">Modifier votre profil</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="bg-card border-border">
            <CardContent className="p-5">
              <div className="flex flex-col items-center">
                <div className="mb-4 relative">
                  <div className="h-28 w-28 rounded-full overflow-hidden bg-secondary border-2 border-primary">
                    <BeaverLogo className="h-full w-full text-primary" />
                  </div>
                  <Button 
                    className="absolute bottom-0 right-0 bg-primary hover:bg-primary/90 text-white rounded-full p-2"
                    size="icon"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                
                <h2 className="text-xl font-semibold text-white">{user?.username}</h2>
                <p className="text-muted-foreground text-sm">{user?.email || "admin@beavernet.local"}</p>
                
                <div className="bg-secondary rounded px-3 py-1 text-xs font-medium text-primary mt-2">
                  Administrateur
                </div>
                
                <p className="text-muted-foreground text-sm mt-4">Membre depuis 23/03/2025</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Nouveau mot de passe
                          <CustomTooltip text="Laissez vide pour conserver votre mot de passe actuel">
                            <Mail className="h-4 w-4 inline ml-1 text-muted-foreground" />
                          </CustomTooltip>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="Laissez vide pour conserver votre mot de passe actuel" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmer le mot de passe</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 mt-2" 
                    disabled={updateProfileMutation.isPending}
                  >
                    {updateProfileMutation.isPending ? "Mise à jour en cours..." : "Mise à jour"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border mt-6">
            <CardHeader>
              <CardTitle>Sécurité</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-white font-medium mb-2">Pare-feu</h3>
                  <p className="text-muted-foreground text-sm mb-3">Configurez vos règles de pare-feu pour protéger votre réseau.</p>
                  <Link href="/firewall">
                    <a className="inline-flex items-center px-3 py-2 border border-primary text-primary bg-transparent hover:bg-primary hover:text-white rounded-md transition-colors text-sm">
                      <Shield className="h-4 w-4 mr-1" />
                      Gérer le pare-feu
                    </a>
                  </Link>
                </div>
                
                <div>
                  <h3 className="text-white font-medium mb-2">Proxy</h3>
                  <p className="text-muted-foreground text-sm mb-3">Configurez les paramètres du proxy pour la redirection du trafic.</p>
                  <Link href="/proxy">
                    <a className="inline-flex items-center px-3 py-2 border border-primary text-primary bg-transparent hover:bg-primary hover:text-white rounded-md transition-colors text-sm">
                      <ArrowLeftRight className="h-4 w-4 mr-1" />
                      Gérer le proxy
                    </a>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
