// Premium skeleton loader for the Classplus-backed courses grid, sized to
// match the real card (image + title + meta rows) so streaming in the real
// data causes no layout shift.
export default function CoursesSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4" aria-hidden="true">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-gray-200/60 bg-white/40 overflow-hidden animate-pulse"
        >
          <div className="w-full aspect-square bg-gray-200" />
          <div className="p-4 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-8 bg-gray-200 rounded w-full" />
            <div className="flex gap-1">
              <div className="h-4 bg-gray-200 rounded-full w-12" />
              <div className="h-4 bg-gray-200 rounded-full w-12" />
            </div>
            <div className="h-8 bg-gray-200 rounded-md w-full mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}
