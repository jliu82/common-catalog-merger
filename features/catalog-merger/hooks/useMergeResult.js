function useMergeResult(id) {
  const { data, error } = useSWR(`/api/common-catalog-merger`, fetcher);

  return {
    resultCsv: data,
    isError: error,
  };
}
