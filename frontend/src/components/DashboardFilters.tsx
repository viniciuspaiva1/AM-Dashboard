import { Search, Filter, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Interface baseada no seu DTO do NestJS
export interface FilterState {
  startDate?: string;
  endDate?: string;
  courseName?: string;
  courseIds?: string[];
  categoryId?: string;
}

interface Props {
  onApply: (filters: FilterState) => void;
  options: {
    courses: { id: string; name: string }[];
    categories: { id: string; description: string }[];
  };
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  filters: FilterState;
}

export function DashboardFilters({
  filters,
  setFilters,
  onApply,
  options,
}: Props) {
  const handleApply = () => onApply(filters);

  const handleClear = () => {
    const cleared = { courseIds: [] };
    setFilters(cleared);
    // onApply(cleared);
  };

  const toggleCourse = (id: string) => {
    setFilters((prev) => ({
      ...prev,
      courseIds: prev.courseIds?.includes(id)
        ? prev.courseIds.filter((i) => i !== id)
        : [...(prev.courseIds || []), id],
    }));
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border shadow-sm space-y-6">
      <div className="flex items-center gap-2 text-primary font-semibold mb-2">
        <Filter className="w-4 h-4" />
        <span>Painel de Filtros</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Data Inicial e Final */}
        <div className="space-y-2">
          <Label>Período</Label>
          <div className="flex gap-2 items-center">
            <Input
              type="date"
              value={filters.startDate || ""}
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
            />
            <p>até</p>
            <Input
              type="date"
              value={filters.endDate || ""}
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value })
              }
            />
          </div>
        </div>

        {/* Busca por Nome */}
        <div className="space-y-2">
          <Label>Nome do Curso</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Ex: Intensivo..."
              className="pl-9"
              value={filters.courseName || ""}
              onChange={(e) =>
                setFilters({ ...filters, courseName: e.target.value })
              }
            />
          </div>
        </div>

        {/* Multi-select de Cursos (Checkbox Suspenso) */}
        <div className="space-y-2">
          <Label>Cursos Específicos</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between font-normal h-10"
              >
                {filters.courseIds!.length > 0
                  ? `${filters.courseIds!.length} selecionados`
                  : "Selecionar cursos"}
                <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-2" align="start">
              <div className="space-y-2 max-h-[250px] overflow-y-auto p-1">
                {options.courses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center space-x-2 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                  >
                    <Checkbox
                      id={course.id}
                      checked={filters.courseIds?.includes(course.id)}
                      onCheckedChange={() => toggleCourse(course.id)}
                    />
                    <label
                      htmlFor={course.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {course.name}
                    </label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Select de Categoria */}
        <div className="space-y-2">
          <Label>Categoria</Label>
          <Select
            value={filters.categoryId}
            onValueChange={(v) => setFilters({ ...filters, categoryId: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas as categorias" />
            </SelectTrigger>
            <SelectContent>
              {options.categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          variant="ghost"
          onClick={handleClear}
          className="text-muted-foreground"
        >
          <X className="w-4 h-4 mr-2" />
          Limpar Filtros
        </Button>
        <Button
          onClick={handleApply}
          className="px-8 shadow-lg shadow-primary/20"
        >
          Aplicar Filtros
        </Button>
      </div>
    </div>
  );
}
