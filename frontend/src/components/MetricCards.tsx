// src/components/MetricCards.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Ticket, TrendingUp } from "lucide-react";

interface LeadStatus {
  status: string;
  count: number;
}
interface MetricCardsProps {
  summary: {
    totalRevenue: number;
    totalSales: number;
    averageTicket: number;
  };
  leadsStatus: LeadStatus[];
}

export function MetricCards({ summary, leadsStatus }: MetricCardsProps) {
  // Formatador para Moeda Brasileira
  const formatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const totalLeads: number = leadsStatus.reduce(
    (acc, lead) => acc + lead.count,
    0,
  );
  const convertedLeads: number =
    leadsStatus.find((lead) => lead.status === "converted")?.count ?? 0;

  const metrics = [
    {
      title: "Receita Total",
      value: formatter.format(summary.totalRevenue),
      icon: <DollarSign className="h-4 w-4 " />,
      description: "Total recebido no mês",
      bgColor: "#3fcc8c",
    },
    {
      title: "Total de Vendas",
      value: summary.totalSales.toString(),
      icon: <ShoppingCart className="h-4 w-4 text-blue-500" />,
      description: "",
      bgColor: "#d6a080",
    },
    {
      title: "Ticket Médio",
      value: formatter.format(summary.averageTicket),
      icon: <Ticket className="h-4 w-4 text-purple-500" />,
      description: "Valor médio por aluno",
      bgColor: "#b7c4f0",
    },
    {
      title: "Taxa de conversão",
      value: `${new Intl.NumberFormat("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0)}%`,
      icon: <TrendingUp className="h-4 w-4 text-orange-500" />,
      description: "Taxa de Leads Convertidos",
      bgColor: "#e0f09e",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <Card
          key={index}
          className="shadow-sm border-muted/60"
          style={{ backgroundColor: metric.bgColor }}
        >
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
