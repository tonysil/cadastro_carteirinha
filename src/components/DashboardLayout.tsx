import { Outlet, Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Logout realizado com sucesso",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Erro ao fazer logout",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex gap-4">
              
              <Link
                to="/registro"
                className="text-sm font-medium hover:text-primary"
              >
                Registro
              </Link>
              <Link
                to="/associados"
                className="text-sm font-medium hover:text-primary"
              >
                Associados
              </Link>
              <Link
                to="/carteirinha/1"
                className="text-sm font-medium hover:text-primary"
              >
                Imprimir Carteirinha
              </Link>
              <Link
                to="/editor-carteirinha"
                className="text-sm font-medium hover:text-primary"
              >
                Editor Carteirinha
              </Link>
              
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;