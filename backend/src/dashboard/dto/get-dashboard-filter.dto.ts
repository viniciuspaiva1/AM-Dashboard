import { IsOptional, IsString, IsDateString, IsArray } from "class-validator";
import { Transform } from "class-transformer";

export class GetDashboardFilterDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  courseName?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    // Se vier apenas um valor (string), transforma em array.
    // Se já for array, mantém.
    return Array.isArray(value) ? value : [value];
  })
  courseIds?: string[];

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
