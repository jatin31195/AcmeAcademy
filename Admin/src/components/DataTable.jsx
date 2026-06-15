import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const DataTable = ({ columns, data = [], className }) => {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border/70 bg-card shadow-card",
        className
      )}
    >
      <div className="w-full overflow-x-auto">
        <Table className="min-w-[760px]">
          <TableHeader>
            <TableRow className="border-border/70 bg-secondary/40 hover:bg-secondary/40">
              {columns.map((column) => (
                <TableHead
                  key={String(column.key)}
                  className="h-11 whitespace-nowrap text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={columns.length}
                  className="h-28 text-center text-sm text-muted-foreground"
                >
                  No data available.
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow
                  key={item.id}
                  className="border-border/60 transition-colors hover:bg-muted/40"
                >
                  {columns.map((column) => (
                    <TableCell
                      key={`${item.id}-${String(column.key)}`}
                      className="align-top text-sm text-foreground"
                    >
                      {column.render
                        ? column.render(item)
                        : String(item[column.key] ?? "")}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DataTable;
