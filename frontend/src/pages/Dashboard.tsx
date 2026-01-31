// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Header } from "@/components/Header";
import { MetricCards } from "@/components/MetricCards";
import { DashboardCharts } from "@/components/DashboardCharts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/services/api";

export default function Dashboard() {
  const [apiData, setApiData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // const response = await api.get("/dashboard-data");
        setApiData({
          summary: {
            totalRevenue: 2235,
            totalSales: 30,
            averageTicket: 74.5,
          },
          charts: {
            salesByCourse: [
              {
                name: "3º Ano Médio - Foco Vestibular",
                totalRevenue: 600,
                count: 5,
              },
              {
                name: "6º Ano - Completo",
                totalRevenue: 360,
                count: 8,
              },
              {
                name: "1º Ano Médio",
                totalRevenue: 360,
                count: 4,
              },
              {
                name: "2º Ano Médio",
                totalRevenue: 270,
                count: 3,
              },
              {
                name: "9º Ano - Intensivo",
                totalRevenue: 220,
                count: 4,
              },
            ],
            salesByCategory: [
              {
                category: "Ensino Médio",
                value: 1230,
              },
              {
                category: "Ensino Fundamental II",
                value: 805,
              },
              {
                category: "Pré-Enem e Cursinhos",
                value: 200,
              },
            ],
            leadsStatus: [
              {
                status: "lost",
                count: 20,
              },
              {
                status: "in_progress",
                count: 13,
              },
              {
                status: "converted",
                count: 15,
              },
              {
                status: "new",
                count: 12,
              },
            ],
            salesHistory: [
              {
                name: "9º Ano - Intensivo",
                data: [
                  {
                    date: "2025-08-03",
                    value: 55,
                  },
                  {
                    date: "2025-11-23",
                    value: 55,
                  },
                  {
                    date: "2025-12-05",
                    value: 55,
                  },
                  {
                    date: "2026-01-23",
                    value: 55,
                  },
                ],
              },
              {
                name: "1º Ano Médio",
                data: [
                  {
                    date: "2025-08-07",
                    value: 90,
                  },
                  {
                    date: "2025-08-23",
                    value: 90,
                  },
                  {
                    date: "2025-08-25",
                    value: 90,
                  },
                  {
                    date: "2025-11-14",
                    value: 90,
                  },
                ],
              },
              {
                name: "7º Ano - Completo",
                data: [
                  {
                    date: "2025-08-12",
                    value: 45,
                  },
                  {
                    date: "2025-09-01",
                    value: 45,
                  },
                  {
                    date: "2025-10-09",
                    value: 45,
                  },
                ],
              },
              {
                name: "3º Ano Médio - Foco Vestibular",
                data: [
                  {
                    date: "2025-08-17",
                    value: 120,
                  },
                  {
                    date: "2025-08-25",
                    value: 120,
                  },
                  {
                    date: "2025-09-03",
                    value: 120,
                  },
                  {
                    date: "2025-12-30",
                    value: 120,
                  },
                  {
                    date: "2026-01-17",
                    value: 120,
                  },
                ],
              },
              {
                name: "6º Ano - Completo",
                data: [
                  {
                    date: "2025-09-03",
                    value: 45,
                  },
                  {
                    date: "2025-09-05",
                    value: 45,
                  },
                  {
                    date: "2025-10-10",
                    value: 45,
                  },
                  {
                    date: "2025-11-26",
                    value: 45,
                  },
                  {
                    date: "2025-12-10",
                    value: 45,
                  },
                  {
                    date: "2026-01-18",
                    value: 45,
                  },
                  {
                    date: "2026-01-19",
                    value: 45,
                  },
                  {
                    date: "2026-01-26",
                    value: 45,
                  },
                ],
              },
              {
                name: "8º Ano - Completo",
                data: [
                  {
                    date: "2025-10-20",
                    value: 45,
                  },
                  {
                    date: "2025-12-28",
                    value: 45,
                  },
                ],
              },
              {
                name: "2º Ano Médio",
                data: [
                  {
                    date: "2025-10-26",
                    value: 90,
                  },
                  {
                    date: "2026-01-03",
                    value: 90,
                  },
                  {
                    date: "2026-01-15",
                    value: 90,
                  },
                ],
              },
              {
                name: "Extensivo ENEM 2026",
                data: [
                  {
                    date: "2026-01-24",
                    value: 200,
                  },
                ],
              },
            ],
          },
        });
      } catch (error) {
        console.error("Erro ao buscar dados", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

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

      <main className="container mx-auto p-4 md:p-8 space-y-8 max-w-7xl">
        {/* Seção de Filtros */}
        <Card className="p-6 shadow-sm bg-white dark:bg-slate-900 border-none">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="start-date">Início</Label>
              <Input type="date" id="start-date" />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="end-date">Fim</Label>
              <Input type="date" id="end-date" />
            </div>
            <div className="flex gap-2">
              <Button>Aplicar Filtros</Button>
              <Button variant="outline">Limpar</Button>
            </div>
          </div>
        </Card>

        {/* Renderiza as Métricas se houver dados */}
        {apiData && <MetricCards summary={apiData.summary} />}

        {/* Renderiza os Gráficos se houver dados */}
        {apiData && <DashboardCharts data={apiData} />}
      </main>
    </div>
  );
}
