import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/services/api";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CheckCircle2,
  Rocket,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const loginSchema = z.object({
  email: z.email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await api.post("/auth/login", data);
      signIn(response.data.user, response.data.access_token);
      localStorage.setItem("@App:token", response.data.access_token);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      alert("Falha no login. Verifique suas credenciais.");
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* LADO ESQUERDO: Propaganda (70% em Desktop, oculto em Mobile) */}
      <div className="hidden lg:flex lg:w-[70%] bg-slate-950 relative overflow-hidden flex-col justify-between p-12">
        {/* Background Decorativo - Gradiente e Blur */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px]" />

        {/* Logo superior */}
        <div className="relative z-10 flex items-center gap-2 text-white">
          <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/40">
            <LayoutDashboard className="h-6 w-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight">
            AM-Dashboard
          </span>
        </div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-6xl font-extrabold text-white leading-tight mb-6">
            Gerencie sua escola com{" "}
            <span className="text-slate-500">a mentoria certa para você.</span>
          </h1>
          <p className="text-slate-400 text-xl mb-10">
            A plataforma completa para análise de dados educacionais, conversão
            de leads e gestão de receita em tempo real.
          </p>

          <div className="grid grid-cols-2 gap-6">
            <Feature icon={<Rocket />} text="Performance em Tempo Real" />
            <Feature icon={<CheckCircle2 />} text="Relatórios Automatizados" />
            <Feature
              icon={<ShieldCheck />}
              text="Segurança de Dados Bancários"
            />
          </div>
        </div>

        {/* Rodapé do lado esquerdo */}
        <div className="relative z-10 text-slate-500 text-sm">
          © GitHub: viniciuspaiva1. Todos os direitos reservados.
        </div>
      </div>

      <div className="w-full lg:w-[30%] flex flex-col justify-center p-8 md:p-12 lg:p-16 bg-white dark:bg-slate-950">
        <div className="w-full max-w-sm mx-auto space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Acessar conta
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              Insira suas credenciais para continuar
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  placeholder="nome@empresa.com"
                  className="h-12 border-slate-200 focus:ring-2 focus:ring-primary/20 transition-all"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs font-medium text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="h-12 border-slate-200 pr-12 focus:ring-2 focus:ring-primary/20 transition-all"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 p-1 rounded-md transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="text-xs font-medium text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-md font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Entrar na Plataforma"
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500">
            Não tem acesso?{" "}
            <a
              href="https://wa.me/5584998636116?text=Oi%20vi%20sua%20propaganda%20e%20quero%20acessar%20o%20seu%20dashboard%20para%20testar%2C%20pode%20me%20fornecer%20um%20usu%C3%A1rio%3F"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-semibold hover:underline"
            >
              Solicite ao admin
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

// Componente auxiliar para os itens da propaganda
function Feature({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 text-slate-300">
      {icon}
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
}
