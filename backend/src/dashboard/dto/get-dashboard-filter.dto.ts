import { IsOptional, IsString, IsDateString, IsEnum } from "class-validator";

export class GetDashboardFilterDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  courseName?: string; // Para o LIKE

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  status?: string; // active, pending, etc.
}
