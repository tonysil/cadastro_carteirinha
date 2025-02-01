import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SearchTable from "@/components/associates/SearchTable";

const SearchCard = () => {
  const { data: associates, isLoading } = useQuery({
    queryKey: ["associates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("associates")
        .select("id, name, rg, cpf, company")
        .order("name");

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-muted rounded w-1/3"></div>
          <div className="h-[400px] bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Pesquisar Carteirinha</h1>
      <SearchTable associates={associates || []} />
    </div>
  );
};

export default SearchCard;