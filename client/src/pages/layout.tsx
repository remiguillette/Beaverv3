import { ReactNode, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { 
  ChevronDown, 
  LogOut, 
  User,
  LayoutDashboard,
  ArrowLeftRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [showSuccessAlert, setShowSuccessAlert] = useState(true);

  // Si l'utilisateur n'est pas connecté, on retourne directement les enfants
  if (!user) {
    return <>{children}</>;
  }

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <nav className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-17">
            <div className="flex items-center">
              <div className="flex items-center">
                <img src="/Beavernet.png" alt="Beavernet" className="h-20 w-30 mr-2" />
                <span className="text-primary font-semibold text-lg">Beavernet</span>
              </div>
            </div>

            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center">
                    <div className="h-8 w-8 rounded-full overflow-hidden bg-secondary border border-border mr-2">
                      <img src="/Beavernet.png" alt="Beavernet" className="h-full w-full object-cover" />
                    </div>
                    <span className="text-muted-foreground">{user.username}</span>
                    <ChevronDown className="ml-1 h-5 w-5 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Déconnexion</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      {showSuccessAlert && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-4">
          <Alert className="bg-green-900 bg-opacity-20 border-green-800">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-white flex items-center justify-between">
              <span>Connexion réussie!</span>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-4 w-4 text-green-200 hover:text-white p-0"
                onClick={() => setShowSuccessAlert(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      )}

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-card py-4 border-t border-border mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button type="button" className="text-muted-foreground hover:text-white">
                <span className="sr-only">Documentation</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>
              <button type="button" className="text-muted-foreground hover:text-white">
                <span className="sr-only">Support</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}