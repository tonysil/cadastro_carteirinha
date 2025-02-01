import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";

const ADMIN_EMAIL = "tony.sill@gmail.com";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Acesso Negado",
          description: "Por favor, faça login para acessar esta página.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      // Check if the logged user is the admin
      if (session.user.email !== ADMIN_EMAIL) {
        toast({
          title: "Acesso Restrito",
          description: "Esta página é restrita apenas para administradores.",
          variant: "destructive",
        });
        navigate("/");
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session || session.user.email !== ADMIN_EMAIL) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  return <>{children}</>;
};

export default ProtectedRoute;