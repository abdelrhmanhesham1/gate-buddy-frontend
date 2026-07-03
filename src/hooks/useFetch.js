import { useEffect, useState, useCallback } from "react";

/**
 * Minimal data-fetching helper that standardizes loading / error / empty state.
 * `fn` should return an axios promise. `select` extracts the value from the response.
 *
 *   const { data, loading, error, reload } = useFetch(
 *     () => servicesAPI.getAll("COUNTERS"),
 *     (res) => res.data.data.services,
 *     []
 *   );
 */
export function useFetch(fn, select = (r) => r, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fn();
      setData(select(res));
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    run();
  }, [run]);

  return { data, loading, error, reload: run };
}
