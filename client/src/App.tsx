import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import { ProtectedRoute } from "./lib/protected-route";
import DashboardPage from "@/pages/dashboard-page";
import FirewallPage from "@/pages/firewall-page";
import ProxyPage from "@/pages/proxy-page";
import ProfilePage from "@/pages/profile-page";
import { AuthProvider } from "./hooks/use-auth";
import Layout from "@/pages/layout";

function Router() {
  return (
    <Switch>
      <Route path="/auth">
        <AuthPage />
      </Route>
      <ProtectedRoute path="/" component={DashboardPage} />
      <ProtectedRoute path="/firewall" component={FirewallPage} />
      <ProtectedRoute path="/proxy" component={ProxyPage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Layout>
          <Router />
        </Layout>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
