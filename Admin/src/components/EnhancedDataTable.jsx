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
  Inbox,
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
  const colSpan = columns.length + (hasActions ? 1 : 0);

  const renderLoadingSkeleton = () => (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <TableRow key={i} className="border-border/60">
          {columns.map((col, ci) => (
            <TableCell key={col.key}>
              <Skeleton
                className={cn("h-4", ci === 0 ? "w-3/4" : "w-1/2")}
              />
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
      <div className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-card">
        <div className="w-full overflow-x-auto">
          <Table className="min-w-[820px]">
            <TableHeader>
              <TableRow className="border-border/70 bg-secondary/50 hover:bg-secondary/50">
                {columns.map((column) => (
                  <TableHead
                    key={column.key}
                    className={cn(
                      "h-11 whitespace-nowrap text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                      column.className
                    )}
                  >
                    {column.header}
                  </TableHead>
                ))}

                {hasActions && (
                  <TableHead className="h-11 w-32 whitespace-nowrap text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Actions
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                renderLoadingSkeleton()
              ) : data.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={colSpan} className="h-40">
                    <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                      <div className="grid h-12 w-12 place-items-center rounded-full bg-muted">
                        <Inbox className="h-6 w-6 opacity-60" />
                      </div>
                      <p className="text-sm font-medium">{emptyMessage}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item) => (
                  <TableRow
                    key={String(item[rowKey])}
                    className="border-border/60 transition-colors hover:bg-muted/40"
                  >
                    {columns.map((column) => (
                      <TableCell
                        key={column.key}
                        className={cn(
                          "align-middle text-sm text-foreground",
                          column.className
                        )}
                      >
                        {column.render ? column.render(item) : item[column.key]}
                      </TableCell>
                    ))}

                    {hasActions && (
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          {onView && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                              onClick={() => onView(item)}
                              aria-label="View"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}

                          {onEdit && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-primary hover:bg-primary/10"
                              onClick={() => onEdit(item)}
                              aria-label="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}

                          {onDelete && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:bg-destructive/10"
                              onClick={() => onDelete(item)}
                              aria-label="Delete"
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
      </div>

      {/* PAGINATION */}
      {pagination && pagination.total > 0 && (
        <div className="flex flex-col gap-3 px-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground sm:text-sm">
            Showing{" "}
            <span className="font-medium text-foreground">
              {(pagination.page - 1) * pagination.limit + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium text-foreground">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-foreground">
              {pagination.total}
            </span>{" "}
            results
          </p>

          <div className="flex items-center gap-1 self-start sm:self-auto">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => pagination.onPageChange(1)}
              disabled={pagination.page === 1}
              aria-label="First page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span className="px-3 text-sm font-medium text-foreground">
              Page {pagination.page} of {totalPages}
            </span>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page >= totalPages}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => pagination.onPageChange(totalPages)}
              disabled={pagination.page >= totalPages}
              aria-label="Last page"
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
