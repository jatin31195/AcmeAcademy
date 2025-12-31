import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

const EnhancedDataTable = ({
  columns,
  data,
  loading = false,
  emptyMessage = "No data available",
  pagination,
  onEdit,
  onDelete,
  onView,
  rowKey = "id",
  className,
}) => {
  const totalPages = pagination
    ? Math.ceil(pagination.total / pagination.limit)
    : 1;

  const hasActions = onEdit || onDelete || onView;

  const renderLoadingSkeleton = () => (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          {columns.map((col) => (
            <TableCell key={col.key}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
          {hasActions && (
            <TableCell>
              <Skeleton className="h-8 w-24" />
            </TableCell>
          )}
        </TableRow>
      ))}
    </>
  );

  return (
    <div className={cn("space-y-4", className)}>
      {/* TABLE */}
      <div
        className="rounded-lg border overflow-hidden shadow-card"
        style={{
          backgroundColor: "hsl(var(--card))",
          borderColor: "hsl(var(--border))",
        }}
      >
        <Table>
          <TableHeader>
            <TableRow
              style={{
                backgroundColor: "hsl(var(--secondary))",
                borderColor: "hsl(var(--border))",
              }}
            >
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={cn("font-semibold", column.className)}
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  {column.header}
                </TableHead>
              ))}

              {hasActions && (
                <TableHead
                  className="font-semibold w-32"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              renderLoadingSkeleton()
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (hasActions ? 1 : 0)}
                  className="h-32 text-center"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow
                  key={String(item[rowKey])}
                  style={{
                    borderColor: "hsl(var(--border))",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "hsl(var(--secondary) / 0.4)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      className={column.className}
                      style={{ color: "hsl(var(--foreground))" }}
                    >
                      {column.render
                        ? column.render(item)
                        : item[column.key]}
                    </TableCell>
                  ))}

                  {hasActions && (
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {onView && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            style={{ color: "hsl(var(--muted-foreground))" }}
                            onClick={() => onView(item)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}

                        {onEdit && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            style={{ color: "hsl(var(--primary))" }}
                            onClick={() => onEdit(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}

                        {onDelete && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            style={{ color: "hsl(var(--destructive))" }}
                            onClick={() => onDelete(item)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      {pagination && pagination.total > 0 && (
        <div className="flex items-center justify-between px-2">
          <p
            className="text-sm"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(
              pagination.page * pagination.limit,
              pagination.total
            )}{" "}
            of {pagination.total} results
          </p>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => pagination.onPageChange(1)}
              disabled={pagination.page === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() =>
                pagination.onPageChange(pagination.page - 1)
              }
              disabled={pagination.page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span
              className="px-3 text-sm"
              style={{ color: "hsl(var(--foreground))" }}
            >
              Page {pagination.page} of {totalPages}
            </span>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() =>
                pagination.onPageChange(pagination.page + 1)
              }
              disabled={pagination.page >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => pagination.onPageChange(totalPages)}
              disabled={pagination.page >= totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedDataTable;
