import { validateRequestCache } from "../../services/request-cache-validation";

export default function twigGetQuery(requestCache: RequestCacheI, queryName: string): any  {
  const validRequestCache = validateRequestCache(requestCache, ["query"]);

  if (!validRequestCache) {
    throw "First Argument on validRequestCache should be twigQuerystring";
  }
  // Only split of queryName is in query
  return requestCache.query[queryName] ? requestCache.query[queryName].split(",") : undefined;
}
