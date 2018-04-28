import { URL } from "url";
import { compact } from "lodash";
import * as querystring from "querystring";
import * as rp from "request-promise-native";
import * as api from "./api-client";
import {
  Bucket,
  Buckets,
  Filters,
  IndexerAggData,
  NormalizedAggData,
  NormalizeGlobalSearchData,
  NormalizePredictiveSearchData } from "./interfaces/es-client";
import { slugify, deslugify } from "./slugifier";

const BASE_URL: string = "/search/shop/";
/**
 * Map the response types to get (key) and how many
 * results (value) per type
 */
const searchTypeMap: any =  {
  "programs": 8,
  "hmh-k12-components,hmh-trade-products,hmh-riverside-products": 8,
  "subjects,programTypes": 48,
  "blog": 3,
  "events,webinars": 3,
  "pressReleases": 3,
};


const httpRequest = (term: string, method: string = "GET", params: any = {}) => {
  const clientUrl: string = process.env.ES_API_CLIENT_HTTP_URL ||
    "http://hmhco-vmg-es-indexer-app-1975919286.us-east-1.elb.amazonaws.com";

  const urlInstance = new URL(`/v1/es/search?`, clientUrl);

  let url: string = urlInstance.href;

  if (term) {
    params.term = term;
  }

  const hasParams = Object.keys(params).length > 0;

  if (hasParams) {
    url += querystring.stringify(params);
  }

  const requestOptions: any = {
    url,
    method,
  };


  if (process.env.NODE_ENV == "local") {
    console.log("\n---- ES client: httpRequest - requestOptions ----\n");
    console.log(requestOptions);
    console.log("\n---- ES client: httpRequest - requestOptions ----\n");
  }


  const doRequest = (): Promise<any> =>
    rp(requestOptions).then((res: any) => {
      return JSON.parse(res);
    });

  return doRequest();
};

/**
 * Create a generic HTTP request with the given term
 * verb and params if any
 */
export const request = (
  term: string,
  method: string,
  params: any = {},
): Promise<any> => {
  return httpRequest(term, method, params);
};

/**
 * Creates a GET request
 * @type {[type]}
 */
export const get = (term: string, params: any = {}): Promise<any> => {
  return request(term, "GET", params);
};

export const filter = (term: string, params: any = {}): Promise<any> => {
  const page: number = Number(params.page) || 1;
  const size: number = 20;
  const from: number = (size * (page - 1));
  const paginationDetails: any = { size, page };

  // Add pagination param
  if (from > 0) {
    params.from = from;
  }

  return get(term, params)
    .then((data: any) => {
      return searchPaginate({
        data: {
          results: [data]
        }
      }, paginationDetails);
    })
    .then(fullData => {
      const { data } = fullData;
      // const aggs = normalizeAggData(data[0].aggregations, params);
      const aggs = normalizeAggData(data.results[0].aggregations, params);
      const cats = aggs.cats;

      return {
        results: data.results[0],
        pagination: data.pagination,
        cats,
        aggs,
      };
    });
};
