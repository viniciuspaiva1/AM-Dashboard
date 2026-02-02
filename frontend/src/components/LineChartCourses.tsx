// src/components/charts/LineChartCourses.tsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LineChartProps {
  salesHistory: any[];
}

export function LineChartCourses({ salesHistory }: LineChartProps) {
  // 1. EXTRAIR TODAS AS DATAS ÚNICAS E ORDENAR
  const allDates = Array.from(
    new Set(
      salesHistory.flatMap((course) => course.data.map((d: any) => d.date)),
    ),
  ).sort();

  const chartData = allDates.map((date) => {
    const entry: any = { date };

    salesHistory.forEach((course) => {
      const salesOnThisDay = course.data.filter((d: any) => d.date === date);

      entry[course.name] = salesOnThisDay.length;
    });

    return entry;
  });

  // 3. PALETA DE CORES DINÂMICA (Tailwind/Moderno)
  const colors = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#f97316",
    "#14b8a6",
    "#6366f1",
  ];

  return (
    <Card className="shadow-md border-muted">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Vendas por Curso
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e2e8f0"
            />
            <XAxis
              dataKey="date"
              fontSize={11}
              tickFormatter={(str) =>
                new Date(str).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                })
              }
            />
            <YAxis
              fontSize={12}
              tickFormatter={(val) => `${val}`}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            />
            <Legend />

            {/* 4. GERAR LINHAS DINAMICAMENTE */}
            {salesHistory.map((course, index) => (
              <Line
                key={course.name}
                type="monotone"
                dataKey={course.name}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                connectNulls // Conecta os pontos se um curso não tiver venda em uma data específica
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
