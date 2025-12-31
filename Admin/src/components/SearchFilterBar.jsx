import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SearchFilterBar = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters = [],
  activeFilters = {},
  onFilterChange,
  onClearFilters,
}) => {
  const hasActiveFilters = Object.values(activeFilters).some(
    (v) => v && v !== "all"
  );

  return (
    <div className="space-y-4">
      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
            style={{ color: "hsl(var(--muted-foreground))" }}
          />

          <Input
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-10 border"
            style={{
              backgroundColor: "hsl(var(--secondary))",
              borderColor: "hsl(var(--border))",
            }}
          />

          {searchValue && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => onSearchChange("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Filters */}
        {filters.map((filter) => (
          <Select
            key={filter.key}
            value={activeFilters[filter.key] || "all"}
            onValueChange={(value) =>
              onFilterChange && onFilterChange(filter.key, value)
            }
          >
            <SelectTrigger
              className="w-full sm:w-40 border"
              style={{
                backgroundColor: "hsl(var(--secondary))",
                borderColor: "hsl(var(--border))",
              }}
            >
              <SelectValue placeholder={filter.label} />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">
                All {filter.label}
              </SelectItem>

              {filter.options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
      </div>

      {/* Active filters */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-sm"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Active filters:
          </span>

          {Object.entries(activeFilters).map(([key, value]) => {
            if (!value || value === "all") return null;

            const filter = filters.find((f) => f.key === key);
            const option = filter?.options.find(
              (o) => o.value === value
            );

            return (
              <Badge key={key} variant="secondary" className="gap-1">
                {filter?.label}: {option?.label || value}

                <button
                  type="button"
                  onClick={() =>
                    onFilterChange && onFilterChange(key, "all")
                  }
                  className="ml-1"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}

          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchFilterBar;
