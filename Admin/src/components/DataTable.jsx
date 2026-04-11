import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const DataTable = ({ columns, data, className }) => {
  return (
    <div
      className={cn("rounded-xl border shadow-card", className)}
      style={{
        backgroundColor: "hsl(var(--card))",
        borderColor: "hsl(var(--border))",
      }}
    >
      <div className="w-full overflow-x-auto">
      <Table className="min-w-[760px]">
        <TableHeader>
          <TableRow
            className="hover:bg-transparent"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            {columns.map((column) => (
              <TableHead
                key={String(column.key)}
                className="whitespace-nowrap font-medium"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item) => (
            <TableRow
              key={item.id}
              style={{
                borderColor: "hsl(var(--border))",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "hsl(var(--muted) / 0.5)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              {columns.map((column) => (
                <TableCell
                  key={`${item.id}-${String(column.key)}`}
                  className="align-top"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  {column.render
                    ? column.render(item)
                    : String(item[column.key] ?? "")}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
    </div>
  );
};

export default DataTable;
