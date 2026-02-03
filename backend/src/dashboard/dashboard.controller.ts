import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";
import { GetDashboardFilterDto } from "./dto/get-dashboard-filter.dto";
import { AuthGuard } from "@nestjs/passport";

@UseGuards(AuthGuard("jwt"))
@Controller("dashboard")
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  getDashboardData(@Query() filters: GetDashboardFilterDto) {
    return this.dashboardService.getDashboardData(filters);
  }

  @Get("options")
  async getDashboardOptions() {
    const [categories, courses] = await Promise.all([
      this.dashboardService.getCategories(),
      this.dashboardService.getCourses(),
    ]);
    return { categories, courses };
  }
}
