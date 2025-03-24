import { useState } from "react";
import { ArrowLeftRight, Info, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomTooltip } from "@/components/ui/tooltip";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const proxyConfigSchema = z.object({
  sourcePort: z.string().min(1, { message: "Le port source est requis" }),
  destinationIp: z.string().min(1, { message: "L'IP de destination est requise" }),
  destinationPort: z.string().min(1, { message: "Le port de destination est requis" }),
  protocol: z.string().min(1, { message: "Le protocole est requis" }),
  description: z.string().optional()
});

type ProxyConfigFormValues = z.infer<typeof proxyConfigSchema>;
type ProxyConfig = ProxyConfigFormValues & { id: string };

export default function ProxyPage() {
  const { toast } = useToast();
  const [selectedConfigId, setSelectedConfigId] = useState<string | null>(null);

  const { data: configs = [], isLoading } = useQuery<ProxyConfig[]>({
    queryKey: ["/api/proxy/configs"],
    refetchOnWindowFocus: false,
  });

  const form = useForm<ProxyConfigFormValues>({
    resolver: zodResolver(proxyConfigSchema),
    defaultValues: {
      sourcePort: "",
      destinationIp: "",
      destinationPort: "",
      protocol: "TCP",
      description: ""
    }
  });

  const addConfigMutation = useMutation({
    mutationFn: async (data: ProxyConfigFormValues) => {
      const res = await apiRequest("POST", "/api/proxy/configs", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Configuration ajoutée",
        description: "La configuration du proxy a été ajoutée avec succès",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/proxy/configs"] });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Erreur lors de l'ajout de la configuration: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const deleteConfigMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/proxy/configs/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Configuration supprimée",
        description: "La configuration du proxy a été supprimée avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/proxy/configs"] });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Erreur lors de la suppression de la configuration: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: ProxyConfigFormValues) => {
    addConfigMutation.mutate(data);
  };

  const handleDelete = () => {
    if (selectedConfigId) {
      deleteConfigMutation.mutate(selectedConfigId);
      setSelectedConfigId(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <ArrowLeftRight className="h-7 w-7 text-primary mr-2" />
        <h1 className="text-2xl font-semibold text-white">Gestion du Proxy</h1>
      </div>
      
      <p className="text-muted-foreground mb-6">
        Configurez les redirections de trafic réseau
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add New Configuration Form */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Ajouter une nouvelle configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="sourcePort"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Port Source
                        <CustomTooltip text="Port d'écoute sur ce serveur">
                          <Info className="h-4 w-4 inline ml-1 text-muted-foreground" />
                        </CustomTooltip>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="ex: 8080" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="destinationIp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        IP Destination
                        <CustomTooltip text="Adresse IP vers laquelle rediriger le trafic">
                          <Info className="h-4 w-4 inline ml-1 text-muted-foreground" />
                        </CustomTooltip>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="ex: 192.168.1.10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="destinationPort"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Port Destination
                        <CustomTooltip text="Port sur le serveur de destination">
                          <Info className="h-4 w-4 inline ml-1 text-muted-foreground" />
                        </CustomTooltip>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="ex: 80" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="protocol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Protocole</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un protocole" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="TCP">TCP</SelectItem>
                          <SelectItem value="UDP">UDP</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optionnel)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Description de cette règle de redirection" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90" 
                  disabled={addConfigMutation.isPending}
                >
                  {addConfigMutation.isPending ? "Ajout en cours..." : "Ajouter Configuration"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        {/* Current Configurations */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Configurations de proxy actuelles</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <p>Chargement des configurations...</p>
              </div>
            ) : configs.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center text-muted-foreground">
                  <Info className="h-12 w-12 mx-auto mb-3 text-muted" />
                  <p className="mb-1">Aucune configuration de proxy</p>
                  <p className="text-sm">Ajoutez une nouvelle configuration en utilisant le formulaire.</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Port Source</TableHead>
                      <TableHead>IP Destination</TableHead>
                      <TableHead>Port Destination</TableHead>
                      <TableHead>Protocol</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {configs.map((config) => (
                      <TableRow key={config.id}>
                        <TableCell>{config.sourcePort}</TableCell>
                        <TableCell>{config.destinationIp}</TableCell>
                        <TableCell>{config.destinationPort}</TableCell>
                        <TableCell>{config.protocol}</TableCell>
                        <TableCell>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-500 hover:text-red-700"
                                onClick={() => setSelectedConfigId(config.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-card">
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Êtes-vous sûr de vouloir supprimer cette configuration ? Cette action ne peut pas être annulée.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={handleDelete}>
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
