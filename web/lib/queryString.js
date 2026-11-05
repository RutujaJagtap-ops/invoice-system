export const toQuery = (params) => {
  const query = new URLSearchParams(Object.entries(params).filter(([, value]) => value)).toString();
  return query ? `?${query}` : "";
};