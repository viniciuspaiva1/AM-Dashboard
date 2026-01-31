// src/pages/Dashboard.tsx
import { useAuth } from "../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, DollarSign, TrendingUp, BarChart3, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Dashboard() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b bg-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-primary rounded-lg" />
          <span className="font-bold text-xl">NexusData</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Olá, {user?.name}</span>
          <Button variant="ghost" size="icon" onClick={signOut}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="p-6 space-y-8 max-w-7xl mx-auto">
        {/* Seção de Filtros */}
        <Card className="p-4 flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px] space-y-2">
            <Label>Data de Início</Label>
            <Input type="date" />
          </div>
          <div className="flex gap-2">
            <Button>Aplicar Filtros</Button>
            <Button variant="outline">Limpar</Button>
          </div>
        </Card>

        {/* Métricas */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Receita Total"
            value="R$ 45.231,89"
            icon={<DollarSign />}
            color="text-green-600"
          />
          <MetricCard
            title="Novos Usuários"
            value="+2,350"
            icon={<Users />}
            color="text-blue-600"
          />
          <MetricCard
            title="Vendas"
            value="+12,234"
            icon={<TrendingUp />}
            color="text-purple-600"
          />
          <MetricCard
            title="Conversão"
            value="4.3%"
            icon={<BarChart3 />}
            color="text-orange-600"
          />
        </div>

        {/* Gráficos Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="h-[300px] flex items-center justify-center">
            Gráfico de Vendas (Placeholder)
          </Card>
          <Card className="h-[300px] flex items-center justify-center">
            Gráfico de Usuários (Placeholder)
          </Card>
          <Card className="h-[300px] flex items-center justify-center">
            Distribuição Regional (Placeholder)
          </Card>
          <Card className="h-[300px] flex items-center justify-center">
            Metas Mensais (Placeholder)
          </Card>
        </div>
      </main>
    </div>
  );
}

function MetricCard({ title, value, icon, color }: any) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <span className={color}>{icon}</span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
