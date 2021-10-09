function useMergeResult(id) {
  const { data, error } = useSWR(`/api/category-merger`, fetcher);

  return {
    resultCsv: data,
    isError: error,
  };
}
