const PageHeader = ({ title, description, children }) => {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1
          className="text-xl font-bold sm:text-2xl"
          style={{ color: "hsl(var(--foreground))" }}
        >
          {title}
        </h1>

        {description && (
          <p
            className="mt-1 text-sm sm:text-base"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            {description}
          </p>
        )}
      </div>

      {children && (
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end sm:gap-3">
          {children}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
