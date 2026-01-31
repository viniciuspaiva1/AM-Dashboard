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
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      <Card className="col-span-1 shadow-md">
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Evolução de Vendas
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={processedHistory}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                fontSize={10}
                tickFormatter={(str) =>
                  new Date(str).toLocaleDateString("pt-BR")
                }
              />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Vendas Totais"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

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
                data={data.charts.salesByCategory}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                nameKey="category"
              >
                {data.charts.salesByCategory.map((_: any, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
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
              <YAxis fontSize={12} />
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
