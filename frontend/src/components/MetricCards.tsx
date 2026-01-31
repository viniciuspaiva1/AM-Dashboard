// src/components/MetricCards.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Ticket, TrendingUp } from "lucide-react";

interface MetricCardsProps {
  summary: {
    totalRevenue: number;
    totalSales: number;
    averageTicket: number;
  };
}

export function MetricCards({ summary }: MetricCardsProps) {
  // Formatador para Moeda Brasileira
  const formatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const metrics = [
    {
      title: "Receita Total",
      value: formatter.format(summary.totalRevenue),
      icon: <DollarSign className="h-4 w-4 text-emerald-500" />,
      description: "+12.5% em relação ao mês passado",
    },
    {
      title: "Total de Vendas",
      value: summary.totalSales.toString(),
      icon: <ShoppingCart className="h-4 w-4 text-blue-500" />,
      description: "30 vendas confirmadas",
    },
    {
      title: "Ticket Médio",
      value: formatter.format(summary.averageTicket),
      icon: <Ticket className="h-4 w-4 text-purple-500" />,
      description: "Valor médio por aluno",
    },
    {
      title: "Taxa de Conversão",
      value: "4.8%", // Valor exemplo (poderia vir da API)
      icon: <TrendingUp className="h-4 w-4 text-orange-500" />,
      description: "Leads vs Vendas",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <Card key={index} className="shadow-sm border-muted/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {metric.title}
            </CardTitle>
            {metric.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {metric.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
