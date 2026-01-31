import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { GetDashboardFilterDto } from "./dto/get-dashboard-filter.dto";
import { Prisma } from "@prisma/client";

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  // --- Função Mestra (Pública) ---
  async getDashboardData(filters: GetDashboardFilterDto) {
    // 1. Gera o filtro base para reutilizar em todas as queries
    const where = this.buildWhereClause(filters);

    // 2. Executa as queries em paralelo para performance
    const [
      summary,
      salesByCourse,
      salesByCategory,
      recentSales,
      leadsStatus, // Bônus: dados de leads
    ] = await Promise.all([
      this.getSummary(where),
      this.getSalesByCourse(where),
      this.getSalesByCategory(where),
      this.getRecentSales(where),
      this.getLeadsOverview(
        filters.categoryId,
        filters.startDate,
        filters.endDate,
      ),
    ]);

    // 3. Retorna o objeto consolidado
    return {
      summary,
      charts: {
        salesByCourse,
        salesByCategory,
        leadsStatus,
      },
      table: recentSales,
    };
  }

  // --- Funções Auxiliares (Privadas) ---

  // 1. Construtor de Filtros (O Segredo para não repetir código)
  private buildWhereClause(
    filters: GetDashboardFilterDto,
  ): Prisma.SubscriptionWhereInput {
    const where: Prisma.SubscriptionWhereInput = {};
    const courseWhere: Prisma.CourseWhereInput = {};

    // Filtro de Data
    if (filters.startDate && filters.endDate) {
      where.saleDate = {
        gte: new Date(filters.startDate),
        lte: new Date(filters.endDate),
      };
    }

    // Filtro de Curso (LIKE / Case Insensitive)
    if (filters.courseName) {
      courseWhere.name = {
        contains: filters.courseName,
        mode: "insensitive",
      };
    }

    // Filtro de Categoria
    if (filters.categoryId) {
      courseWhere.categoryId = filters.categoryId;
    }

    // Filtro de Status
    if (filters.status) {
      where.status = filters.status;
    }

    if (Object.keys(courseWhere).length > 0) {
      where.course = courseWhere;
    }
    return where;
  }

  // 2. Cards de Resumo (Total Receita, Total Vendas, Ticket Médio)
  private async getSummary(where: Prisma.SubscriptionWhereInput) {
    const aggregate = await this.prisma.subscription.aggregate({
      where,
      _sum: {
        paidPrice: true,
      },
      _count: {
        id: true,
      },
    });

    const totalRevenue = Number(aggregate._sum.paidPrice) || 0;
    const totalSales = aggregate._count.id || 0;
    const averageTicket = totalSales > 0 ? totalRevenue / totalSales : 0;

    return {
      totalRevenue,
      totalSales,
      averageTicket,
    };
  }

  // 3. Gráfico: Vendas por Curso (Top 5)
  private async getSalesByCourse(where: Prisma.SubscriptionWhereInput) {
    const result = await this.prisma.subscription.groupBy({
      by: ["courseId"],
      where,
      _sum: {
        paidPrice: true,
      },
      _count: {
        id: true,
      },
      orderBy: {
        _sum: {
          paidPrice: "desc",
        },
      },
      take: 5, // Top 5
    });

    // Precisamos buscar os nomes dos cursos, pois o groupBy só devolve o ID
    return Promise.all(
      result.map(async (item) => {
        const course = await this.prisma.course.findUnique({
          where: { id: item.courseId },
        });
        return {
          name: course?.name || "Desconhecido",
          totalRevenue: Number(item._sum.paidPrice),
          count: item._count.id,
        };
      }),
    );
  }

  // 4. Gráfico: Vendas por Categoria
  private async getSalesByCategory(where: Prisma.SubscriptionWhereInput) {
    // Como a categoria está "longe" (Subscription -> Course -> Category),
    // o groupBy do Prisma tem limitações com relações profundas.
    // Vamos buscar os cursos filtrados e agrupar manualmente ou fazer query raw se precisar performance extrema.
    // Solução Elegante com Prisma:

    // Primeiro buscamos as subscriptions com a relação incluída
    const sales = await this.prisma.subscription.findMany({
      where,
      select: {
        paidPrice: true,
        course: {
          select: {
            category: {
              select: { description: true },
            },
          },
        },
      },
    });

    // Agrupamento em memória (JS)
    const grouped = sales.reduce((acc, curr) => {
      const catName = curr.course.category.description;
      if (!acc[catName]) acc[catName] = 0;
      acc[catName] += Number(curr.paidPrice);
      return acc;
    }, {});

    return Object.keys(grouped).map((key) => ({
      category: key,
      value: grouped[key],
    }));
  }

  // 5. Tabela: Vendas Recentes
  private async getRecentSales(where: Prisma.SubscriptionWhereInput) {
    return this.prisma.subscription.findMany({
      where,
      take: 10,
      orderBy: { saleDate: "desc" },
      select: {
        id: true,
        status: true,
        saleDate: true,
        paidPrice: true,
        user: { select: { name: true, email: true } },
        course: { select: { name: true } },
      },
    });
  }

  // 6. Marketing: Leads por Status (Filtra leads pela categoria selecionada também)
  private async getLeadsOverview(
    categoryId?: string,
    start?: string,
    end?: string,
  ) {
    const where: Prisma.LeadWhereInput = {};

    if (categoryId) where.interestedCategoryId = categoryId;
    if (start && end)
      where.createdAt = { gte: new Date(start), lte: new Date(end) };

    const result = await this.prisma.lead.groupBy({
      by: ["status"],
      where,
      _count: { id: true },
    });

    return result.map((r) => ({ status: r.status, count: r._count.id }));
  }
}
