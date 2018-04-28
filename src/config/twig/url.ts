import * as path from "path";
import { URL } from "url";
import * as is from "is_js";
import * as urlSigner from "../../services/url-signer";
import { validateRequestCache } from "../../services/request-cache-validation";

interface SearchProduct {
  metaTitle: string;
  productCode: number;
  isbn13Code: number;
  response_type: string;
}

export function buildUrl (requestCache: RequestCacheI, urlSegments: string[] = []): string {
  const validRequestCache =  validateRequestCache(requestCache, ["originalUrl", "protocol", "host"]);
  if (!validRequestCache) {
    throw "First Argument on validRequestCache should be requestCache";
  }

  // Clone urlSegments
  let urlSegmentsCopy: string[] = urlSegments.slice();

  if (urlSegmentsCopy.length === 0) {
    urlSegmentsCopy = requestCache.originalUrl.split("/");
  }

  let rootUrl = urlSegmentsCopy.shift();

  // Check the first arg to see if we need to prepend a base url
  if (is.not.url(rootUrl)) {
    const protocol = requestCache.protocol;
    const host = requestCache.host;
    urlSegmentsCopy.unshift(rootUrl.replace(/^\//, ""));
    rootUrl = `${protocol}://${host}`;
  }

  // Join URL string
  const urlStr = path.join.apply(path, urlSegmentsCopy);
  const url = new URL(urlStr, rootUrl);

  return url.href;
}

export function buildSignedUrl (requestCache: RequestCacheI, urlSegments: string[]): string {
  const validRequestCache =  validateRequestCache(requestCache, ["originalUrl", "protocol", "host"]);
  if (!validRequestCache) {
    throw "First Argument on buildSignedUrl should be requestCache";
  }

  const args: any[] = [requestCache, urlSegments];
  return urlSigner.getSignedUrl(buildUrl.apply(this, args));
}

export function buildSearchProductUrl (requestCache: RequestCacheI, product: SearchProduct): string {
  const validRequestCache =  validateRequestCache(requestCache, ["originalUrl", "protocol", "host"]);
  if (!validRequestCache) {
    throw "First Argument on buildSearchProductUrl should be requestCache";
  }

  if (product.response_type === "hmh-k12-components") {
    return `/shop/k12/${product.metaTitle}/${String(product.isbn13Code)}`;
  }

  if (product.response_type === "hmh-trade-products") {
    return `/shop/books/${product.metaTitle}/${String(product.isbn13Code)}`;
  }

  if (product.response_type === "hmh-riverside-products") {
    return `/shop/k12/${product.metaTitle}/id/${String(product.productCode)}`;
  }

  return "";
}

export function getSegment (requestCache: RequestCacheI, segment: number) {
  const validRequestCache =  validateRequestCache(requestCache, ["originalUrl"]);
  if (!validRequestCache) {
    throw "First Argument on getSegment should be requestCache";
  }

  return requestCache.originalUrl.split("/")[segment];
}
