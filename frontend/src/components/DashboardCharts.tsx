// src/components/DashboardCharts.tsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  AreaChart,
  Area,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChartCourses } from "./LineChartCourses";

// Cores consistentes (paleta Slate/Blue moderna)
const COLORS = ["#3b82f6", "#8b5cf6", "#06b6d4", "#f59e0b", "#10b981"];

interface ChartProps {
  data: any; // Aqui você passaria o JSON da sua API
}

export function DashboardCharts({ data }: ChartProps) {
  // 1. Tratamento para o Gráfico de Linha/Área (Agrupando vendas por data)
  // Transformamos o salesHistory em um array linear ordenado por data
  const processedHistory = data.charts.salesHistory
    .flatMap((course: any) => course.data)
    .reduce((acc: any[], curr: any) => {
      const existing = acc.find((item) => item.date === curr.date);
      if (existing) {
        existing.value += curr.value;
      } else {
        acc.push({ ...curr });
      }
      return acc;
    }, [])
    .sort(
      (a: any, b: any) =>
        new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

  const enhancedPieData = data.charts.salesByCategory.map(
    (entry: any, index: any) => ({
      ...entry,
      fill: COLORS[index % COLORS.length], // Injeta a cor diretamente no objeto
    }),
  );

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
      {/* 1. GRÁFICO DE BARRAS - Vendas por Curso */}
      <Card className="col-span-1 shadow-md border-muted">
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Receita por Curso
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.charts.salesByCourse}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
              />
              <XAxis dataKey="name" hide />
              <YAxis fontSize={12} tickFormatter={(value) => `R$${value}`} />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Bar
                dataKey="totalRevenue"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                name="Receita"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 2. GRÁFICO DE LINHA - Evolução Histórica */}

      <LineChartCourses salesHistory={data.charts.salesHistory} />

      {/* 3. GRÁFICO DE PIZZA - Categorias */}
      <Card className="col-span-1 shadow-md">
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Distribuição por Categoria
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={enhancedPieData} // Usando os dados já com a cor injetada
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                nameKey="category"
                stroke="none"
                // O Recharts 3.x/4.x reconhece a chave 'fill' dentro do objeto de cada item do array 'data'
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 4. GRÁFICO DE ÁREA - Tendência com Preenchimento */}
      <Card className="col-span-1 shadow-md">
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Tendência de Receita
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={processedHistory}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" hide />
              <YAxis fontSize={12} tickFormatter={(val) => `R$ ${val}`} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#06b6d4"
                fillOpacity={1}
                fill="url(#colorValue)"
                name="Tendência"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
