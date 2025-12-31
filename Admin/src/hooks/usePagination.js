import { useState, useCallback, useMemo } from "react";

export function usePagination(options = {}) {
  const {
    initialPage = 1,
    initialLimit = 10,
    total: initialTotal = 0,
  } = options;

  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(initialTotal);

  const totalPages = useMemo(
    () => Math.ceil(total / limit) || 1,
    [total, limit]
  );

  const offset = useMemo(
    () => (page - 1) * limit,
    [page, limit]
  );

  const canGoNext = page < totalPages;
  const canGoPrev = page > 1;

  const handleSetPage = useCallback(
    (newPage) => {
      setPage(Math.max(1, Math.min(newPage, totalPages)));
    },
    [totalPages]
  );

  const handleSetLimit = useCallback((newLimit) => {
    setLimit(newLimit);
    setPage(1); // reset to first page when limit changes
  }, []);

  const nextPage = useCallback(() => {
    if (canGoNext) setPage((p) => p + 1);
  }, [canGoNext]);

  const prevPage = useCallback(() => {
    if (canGoPrev) setPage((p) => p - 1);
  }, [canGoPrev]);

  const firstPage = useCallback(() => {
    setPage(1);
  }, []);

  const lastPage = useCallback(() => {
    setPage(totalPages);
  }, [totalPages]);

  const paginationProps = useMemo(
    () => ({
      page,
      limit,
      total,
      onPageChange: handleSetPage,
      onLimitChange: handleSetLimit,
    }),
    [page, limit, total, handleSetPage, handleSetLimit]
  );

  return {
    page,
    limit,
    total,
    totalPages,
    offset,
    setPage: handleSetPage,
    setLimit: handleSetLimit,
    setTotal,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    canGoNext,
    canGoPrev,
    paginationProps,
  };
}

export default usePagination;
