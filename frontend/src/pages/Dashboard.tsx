// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { MetricCards } from "@/components/MetricCards";
import { DashboardCharts } from "@/components/DashboardCharts";
import api from "@/services/api";
import {
  DashboardFilters,
  type FilterState,
} from "@/components/DashboardFilters";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const [apiData, setApiData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadingReq, setLoadingReq] = useState(false);
  const [options, setOptions] = useState<any>(null);
  const [currentFilters, setCurrentFilters] = useState<FilterState>({
    courseIds: [],
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get("/dashboard/options");
        setOptions(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleFilterApply = async (newFilters: FilterState) => {
    setLoadingReq(true);
    try {
      const response = await api.get("/dashboard", {
        params: newFilters,
      });
      setCurrentFilters(newFilters);
      setApiData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingReq(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      <Header />
      <main className="container mx-auto p-8 space-y-8">
        {/* Passamos os filtros atuais para o componente iniciar com eles preenchidos */}
        <DashboardFilters
          onApply={handleFilterApply}
          options={options}
          setFilters={setCurrentFilters}
          filters={currentFilters}
        />

        {loadingReq ? (
          <div>
            <Loader2 className="animate-spin w-12 h-12 text-blue-500" />
          </div>
        ) : (
          <>
            {apiData && (
              <MetricCards
                summary={apiData?.summary}
                leadsStatus={apiData?.leadsStatus}
              />
            )}
            {apiData && <DashboardCharts data={apiData} />}
          </>
        )}
      </main>
    </div>
  );
}
