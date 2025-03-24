import { useState, useEffect } from "react";
import { Shield, Info, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
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

const firewallRuleSchema = z.object({
  port: z.string().min(1, { message: "Le port est requis" }),
  protocol: z.string().min(1, { message: "Le protocole est requis" }),
  action: z.string().min(1, { message: "L'action est requise" }),
  sourceIp: z.string().optional(),
  destinationIp: z.string().optional(),
  description: z.string().optional()
});

type FirewallRuleFormValues = z.infer<typeof firewallRuleSchema>;
type FirewallRule = FirewallRuleFormValues & { id: string };

export default function FirewallPage() {
  const { toast } = useToast();
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);

  const { data: rules = [], isLoading } = useQuery<FirewallRule[]>({
    queryKey: ["/api/firewall/rules"],
    refetchOnWindowFocus: false,
  });

  const form = useForm<FirewallRuleFormValues>({
    resolver: zodResolver(firewallRuleSchema),
    defaultValues: {
      port: "",
      protocol: "TCP",
      action: "ACCEPT",
      sourceIp: "",
      destinationIp: "",
      description: ""
    }
  });

  const addRuleMutation = useMutation({
    mutationFn: async (data: FirewallRuleFormValues) => {
      const res = await apiRequest("POST", "/api/firewall/rules", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Règle ajoutée",
        description: "La règle de pare-feu a été ajoutée avec succès",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/firewall/rules"] });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Erreur lors de l'ajout de la règle: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const deleteRuleMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/firewall/rules/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Règle supprimée",
        description: "La règle de pare-feu a été supprimée avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/firewall/rules"] });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Erreur lors de la suppression de la règle: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: FirewallRuleFormValues) => {
    addRuleMutation.mutate(data);
  };

  const handleDelete = () => {
    if (selectedRuleId) {
      deleteRuleMutation.mutate(selectedRuleId);
      setSelectedRuleId(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Shield className="h-7 w-7 text-primary mr-2" />
        <h1 className="text-2xl font-semibold text-white">Gestion du Pare-feu</h1>
      </div>
      
      <p className="text-muted-foreground mb-6">
        Configurez les règles du pare-feu pour sécuriser votre réseau
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add New Rule Form */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Ajouter une nouvelle règle</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="port"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Port
                        <CustomTooltip text="Entrez le numéro de port à autoriser ou bloquer (ex: 80, 443, 22)">
                          <Info className="h-4 w-4 inline ml-1 text-muted-foreground" />
                        </CustomTooltip>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="1-65535" {...field} />
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
                          <SelectItem value="ICMP">ICMP</SelectItem>
                          <SelectItem value="ALL">TOUS</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="action"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Action
                        <CustomTooltip text="Choisissez si vous souhaitez autoriser ou bloquer le trafic">
                          <Info className="h-4 w-4 inline ml-1 text-muted-foreground" />
                        </CustomTooltip>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez une action" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ACCEPT">Autoriser</SelectItem>
                          <SelectItem value="DROP">Bloquer</SelectItem>
                          <SelectItem value="REJECT">Rejeter</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="sourceIp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        IP Source (Optionnel)
                        <CustomTooltip text="Adresse IP source (laissez vide pour toutes les sources)">
                          <Info className="h-4 w-4 inline ml-1 text-muted-foreground" />
                        </CustomTooltip>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="ex: 192.168.1.1" {...field} />
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
                      <FormLabel>IP Destination (Optionnel)</FormLabel>
                      <FormControl>
                        <Input placeholder="ex: 192.168.1.1" {...field} />
                      </FormControl>
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
                        <Textarea placeholder="Description de cette règle" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90" 
                  disabled={addRuleMutation.isPending}
                >
                  {addRuleMutation.isPending ? "Ajout en cours..." : "Ajouter Règle"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        {/* Current Rules */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Règles de pare-feu actuelles</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <p>Chargement des règles...</p>
              </div>
            ) : rules.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center text-muted-foreground">
                  <Info className="h-12 w-12 mx-auto mb-3 text-muted" />
                  <p className="mb-1">Aucune règle de pare-feu configurée</p>
                  <p className="text-sm">Ajoutez une nouvelle règle en utilisant le formulaire.</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Port</TableHead>
                      <TableHead>Protocol</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rules.map((rule) => (
                      <TableRow key={rule.id}>
                        <TableCell>{rule.port}</TableCell>
                        <TableCell>{rule.protocol}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            rule.action === 'ACCEPT' ? 'bg-green-100 text-green-800' : 
                            rule.action === 'DROP' ? 'bg-red-100 text-red-800' : 
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {rule.action === 'ACCEPT' ? 'Autoriser' : 
                             rule.action === 'DROP' ? 'Bloquer' : 'Rejeter'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-500 hover:text-red-700"
                                onClick={() => setSelectedRuleId(rule.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-card">
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Êtes-vous sûr de vouloir supprimer cette règle ? Cette action ne peut pas être annulée.
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
