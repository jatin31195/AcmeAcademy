const PageHeader = ({ title, description, children }) => {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1
          className="text-2xl font-bold"
          style={{ color: "hsl(var(--foreground))" }}
        >
          {title}
        </h1>

        {description && (
          <p
            className="mt-1"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            {description}
          </p>
        )}
      </div>

      {children && (
        <div className="flex items-center gap-3">
          {children}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
