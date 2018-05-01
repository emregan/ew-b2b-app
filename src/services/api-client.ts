"use strict";

import { RequestResponse, Headers } from "request";
import * as _ from "lodash";
import * as rp from "request-promise-native";
import * as jwt from "jsonwebtoken";
import * as querystring from "querystring";
import * as cache from "./cache";
import * as logger from "./logger";
import { URL } from "url";
import parseCacheControl = require("parse-cache-control");
import promiseRetry = require("promise-retry");

const generateJwt = (): string => {
  const jwtSecret: string = process.env.API_CLIENT_AUTH_TOKEN_SECRET || "";

  return jwt.sign(
    {},
    jwtSecret,
    {
      expiresIn: "2h",
      notBefore: "2h"
    }
   );
};

const httpRequest = (uri: string, method: string = "GET", data: any = {}, token?: string): Promise<any> => {
  const TIMEOUT = process.env.API_CLIENT_TIMEOUT || 3000;
  const httpUrl: string = process.env.API_CLIENT_HTTP_URL || "http://localhost:8181/";
  const proxyUrl: string = process.env.API_CLIENT_PROXY_URL || "";
  const cacheEnabled: boolean = process.env.API_CLIENT_CACHE_ENABLED || false;
  const timeout: number = (typeof process.env.API_CLIENT_TIMEOUT !== "undefined") ? Number(process.env.API_CLIENT_TIMEOUT) : 30000;
  const isGet = method === "GET";
  const hasData = Object.keys(data).length > 0;
  const path = hasData ? `${uri}?${querystring.stringify(data)}` : uri;
  const url = isGet ? `${httpUrl}${path}` : `${httpUrl}${uri}`;
  const cacheKey = decodeURIComponent(`api-cache:${path}`);
  const requestOptions: any = {
    url: url,
    method: method,
    headers: {
      "Accept": "application/json",
      "User-Agent": "hmhco-b2b-app"
    },
    timeout: timeout,
    resolveWithFullResponse: true
  };

  if (proxyUrl) {
    requestOptions.proxy = proxyUrl;
  }

  if (token) {
    requestOptions.auth = {
      bearer: token
    };
  }

  if (!isGet && hasData) {
    requestOptions.form = data;
  }

  const responseHandler = (res: RequestResponse): any => {
    // parse the response
    const responseData = JSON.parse(res.body);

    // cache the response value
    if (isGet && cacheEnabled) {
      cacheResponse(res.headers, cacheKey, responseData);
    }

    // resolve the promise
    return responseData;
  };

  const doRequest = (): Promise<any> => promiseRetry(
    (retry: (error: any) => never, number: number): Promise<any> => {
      return rp(requestOptions)
        .then(responseHandler)
        .catch((err: any) => {
          if (
            err.code === "ETIMEDOUT" ||
            (typeof err.connect !== "undefined" && err.connect === true) ||
            err.statusCode === 503 ||
            err.statusCode === 504
          ) {
            logger.error(`API Retry: ${uri}`, err);
            retry(err);
          } else {
            throw err;
          }
        });
    },
    {
      retries: process.env.API_CLIENT_RETRIES || 3,
      minTimeout: timeout,
    }
  );

  if (cacheEnabled) {
    return cache.get(cacheKey)
      .then((cachedValue: any) => Promise.resolve(cachedValue || doRequest()));
  }

  return doRequest();
};



const jsonRequest = (uri: string, method: string = "GET", data: any = {}, token?: string): Promise<any> => {
  const TIMEOUT = process.env.API_CLIENT_TIMEOUT || 3000;
  const httpUrl: string = process.env.WS_CLIENT_HTTP_URL || "http://localhost:8181/";
  const proxyUrl: string = process.env.API_CLIENT_PROXY_URL || "";
  const cacheEnabled: boolean = process.env.API_CLIENT_CACHE_ENABLED || false;
  const timeout: number = (typeof process.env.API_CLIENT_TIMEOUT !== "undefined") ? Number(process.env.API_CLIENT_TIMEOUT) : 30000;
  const isGet = method === "GET";
  const hasData = Object.keys(data).length > 0;
  const path = hasData ? `${uri}?${querystring.stringify(data)}` : uri;
  const url = isGet ? `${httpUrl}${path}` : `${httpUrl}${uri}`;
  const cacheKey = decodeURIComponent(`api-cache:${path}`);
  const requestOptions: any = {
    url: url,
    method: method,
    headers: {
      "Accept": "application/json",
      "User-Agent": "hmhco-b2b-app"
    },
    timeout: timeout,
    resolveWithFullResponse: true
  };

  if (proxyUrl) {
    requestOptions.proxy = proxyUrl;
  }

  if (token) {
    requestOptions.auth = {
      bearer: token
    };
  }

  if (!isGet && hasData) {
    requestOptions.form = data;
  }

  const responseHandler = (res: RequestResponse): any => {
    // parse the response
    const responseData = JSON.parse(res.body);

    // cache the response value
    if (isGet && cacheEnabled) {
      cacheResponse(res.headers, cacheKey, responseData);
    }

    // resolve the promise
    return responseData;
  };

  const doRequest = (): Promise<any> => promiseRetry(
    (retry: (error: any) => never, number: number): Promise<any> => {
      return rp(requestOptions)
        .then(responseHandler)
        .catch((err: any) => {
          if (
            err.code === "ETIMEDOUT" ||
            (typeof err.connect !== "undefined" && err.connect === true) ||
            err.statusCode === 503 ||
            err.statusCode === 504
          ) {
            logger.error(`API Retry: ${uri}`, err);
            retry(err);
          } else {
            throw err;
          }
        });
    },
    {
      retries: process.env.API_CLIENT_RETRIES || 3,
      minTimeout: timeout,
    }
  );

  if (cacheEnabled) {
    return cache.get(cacheKey)
      .then((cachedValue: any) => Promise.resolve(cachedValue || doRequest()));
  }

  return doRequest();
};


const cacheResponse = (headers: Headers, key: string, value: any): void => {
  // check cache-control header
  if ("cache-control" in headers && headers["cache-control"]) {
    const cacheControl = parseCacheControl(headers["cache-control"]);

    // cache if does not have no-cache and if max-age is greater than 0
    if (
      (!("no-cache" in cacheControl) || !cacheControl["no-cache"]) &&
      ("max-age" in cacheControl && cacheControl["max-age"] > 0)
    ) {
      cache.set(key, value, cacheControl["max-age"]);
    }
  }
};


/**
 * Create pagination object
 * @param {any} data       [response data]
 * @param {any} pagination [response paginaiton data, this is needed so this functiona can be used with alternate data]
 */
export const assignPagination = (data: any, pagination: any): any => {
  const currentPage = pagination.current_page;
  const totalItems = pagination.total;
  const totalPages = pagination.total_pages;
  const nextPage = (currentPage == totalPages || currentPage == 0) ? false : currentPage + 1;
  const prevPage = (currentPage == 1 || currentPage == 0) ? false : currentPage - 1;
  const range = [];

  const rangeLimit = (totalPages > 4) ? 4 : totalPages;
  const startVal = ( (totalPages - currentPage) < rangeLimit) ? (totalPages - rangeLimit + 1) : currentPage;

  for (let i = startVal; i < (startVal + rangeLimit); i++) {
    range.push(i);
  }

  data.pagination = {currentPage, totalPages, nextPage, prevPage, range, totalItems};
  return data;
};

const assignPaginationPromise = (data: any): Promise<any> => {
  const pagination: any = {
    "current_page": data.meta.pagination.current_page,
    "total": data.meta.pagination.total,
    "total_pages": data.meta.pagination.total_pages,
  };

  data = assignPagination(data, pagination);
  return Promise.resolve(data);
};

/**
 * Normalizes data for modular pages, it removes recursively
 * the section type from the data keys (about/program/page)
 */
const normalizeModularPage = (context: any): Promise<any> => {
  const cleanData: any = {};
  const sanitizeName: any = (data: any, key: any, collection: any) => {
    let newKey = _.chain(key).replace(/^(program|about|page)/, "").lowerFirst().value();
    newKey = Boolean(newKey) ? newKey : key;

    if ( _.isObject(data) || _.isArray(data) ) {
      if ( _.isObject(data) ) {
        collection[newKey] = {};
      }

      if ( _.isArray(data) ) {
        collection[newKey] = [];
      }

      _.forEach(data, (data2, key2) => sanitizeName(data2, key2, collection[newKey]) );
    } else {
      if (_.isArray(collection)) {
        collection = collection || [];
        collection.push(data);
      } else {
        collection[newKey] = data;
      }
    }
  };

  _.forEach(context.data, (data, key) => sanitizeName(data, key, cleanData));
  context.data = cleanData;

  // Center modules if it's a program, about section or subpageLayout
  if (context.data.section === "programs" || context.data.section === "about" || context.data.type === "subpageLayout") {
    context.data.centerModules = true;
  }

  return Promise.resolve(context);
};

/**
 * Make a request to the Craft API and get a JSON response
 */
export const request = (uri: string, method: string = "GET", data: any = {}): Promise<any> => {
  return httpRequest(uri, method, data, generateJwt());
};

export const get = (uri: string, data: any = {}): Promise<any> => {
  return request(uri, "GET", data);
};

export const post = (uri: string, data: any = {}): Promise<any> => {
  return request(uri, "POST", data);
};

export const put = (uri: string, data: any = {}): Promise<any> => {
  return request(uri, "PUT", data);
};

export const del = (uri: string, data: any = {}): Promise<any> => {
  return request(uri, "DELETE", data);
};

export const patch = (uri: string, data: any = {}): Promise<any> => {
  return request(uri, "PATCH", data);
};

export const getWithGlobals = (uri: string, data: any = {}): Promise<any> => {
  return withGlobals(get(uri, data));
};

// Attaches globals to a request's response
export const withGlobals = (request: Promise<any>): Promise<any> => {
  return Promise.all([
    getGlobals(),
    request
  ]).then((all: any[]) => Promise.resolve(
    Object.assign(
      {globals: all[0].data},
      all[1]
    )
   ));
};

interface IndexQuery {
  page?: string;
}

interface BlogIndexQuery extends IndexQuery {
  tags?: string;
  author?: string;
}

interface EventsIndexQuery extends IndexQuery {
  tags?: string;
  series?: string;
  [index: string]: string;
}

interface PressReleasesQuery extends IndexQuery {
  year?: string;
}

export const getBlogIndex = (query: BlogIndexQuery = {}): Promise<any> => {
  const params: any = {
    limit: 10,
    include: ["pagination", "tags", "landingPage"].join(",")
  };

  if ("page" in query) {
    params.page = query.page;
  }

  if ("tags" in query) {
    params.tags = query.tags;
  }

  if ("author" in query) {
    params.author = query.author;
  }

  return getWithGlobals("api/blog", params)
    .then(assignPaginationPromise);
};

/**
 *
 * Get Entries
 * @desc grab only the title and slug of a certain entry type and use the regular
 * API as a fallback if necessary
 *
 */
export const getEntries = (sections: string, hitApi?: boolean): Promise<any> => {
  const params: any = {
    limit: 0,
    sections,
    include: "pagination",
  };

  if (hitApi) {
    params.include = ["categories"].join(",");
  }

  const endpoint: string = hitApi ? sections : "search-index";

  return get(`api/${endpoint}`, params);
};


export const getGlobals = (): Promise<any> => {
  return get(`api/globals`);
};

export const getRedirect = (url: string): Promise<any> => {
  return get(`api/redirects`, {url});
};

export const getAccountInfo = (): Promise<any> => {
  return Promise.resolve({
    // "loggedIn": true,
    // "username": "Jennifer",
    // "cartCount": 1,
  });
};

export const getNewsIndex = (query: any): Promise<any> => {
  const params: any = {
    limit: 10,
    include: ["pagination", "landingPage"].join(",")
  };

  if ("page" in query) {
    params.page = query.page;
  }

  return getWithGlobals("api/news", params)
    .then(assignPaginationPromise);
};
export const getNewsDetail = (slug: string): Promise<any> => {
  return getWithGlobals(`api/news/${slug}`);
};

export const getSitemap = (): Promise<any> => {
  return getWithGlobals("/api/html-sitemap");
};




/**
 * During dev you can add methods to this client
 * and simply return Promise.resolve({foo:"bar"})
 * with dummy data and we can replace that will real
 * calls to craft api later
 */
/*
export const getNewsPage = (): Promise<any> => {
  return Promise.resolve([
    {
      id: 1,
      title: "Foo"
    },
    {
      id: 2,
      title: "Bar"
    }
  ])
};
*/
/*
export const getNews = (): Promise<any> => {
  return request('/api/news');
};
*/

export const getOrders = (): Promise<any> => {
  return request('api/orders');
}

export const getLoginPage = (): Promise<any> => {
  const params: any = {};
  return getWithGlobals( "api/news" , params);
};

export const getHomePage = (): Promise<any> => {
  const params: any = {};
  return getWithGlobals( "api/news" , params);
};

export const getAccountPage = (): Promise<any> => {
  const params: any = {};
  return getWithGlobals( "api/news" , params);
};


export const temp = (request: Promise<any>): Promise<any> => {
  return Promise.all([
    getGlobals(),
    request
  ]).then((all: any[]) => Promise.resolve(
    Object.assign(
      {globals: all[0].data},
      all[1]
    )
   ));
};

export const getOrderIndex = (): Promise<any> => {
  const params: any = {};
  return getWithGlobals( "api/news" , params);
};

export const getOrderDetail = (slug: string): Promise<any> => {
  const params: any = {
    copper: 'woof'
  };
  return getWithGlobals(`api/news`, params);
  
};
