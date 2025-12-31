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
      className={cn("rounded-xl shadow-card border", className)}
      style={{
        backgroundColor: "hsl(var(--card))",
        borderColor: "hsl(var(--border))",
      }}
    >
      <Table>
        <TableHeader>
          <TableRow
            className="hover:bg-transparent"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            {columns.map((column) => (
              <TableHead
                key={String(column.key)}
                className="font-medium"
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
  );
};

export default DataTable;
