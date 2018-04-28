import { validateRequestCache } from "../../services/request-cache-validation";
import * as twig from "twig";

import twigQuerystring from "./querystring";
import twigGetQuery from "./get-query";

interface FiltersData {
  tabbed: boolean;
  filters: any[];
  type: string;
  showClearAll: boolean;
}

/**
 * Normalize filter data so that all items have an id, title and slug
 * @param {any}    data
 * @param {string} type
 */
export default function normalizeFilters(requestCache: RequestCacheI, data: any, type: string): any {
  const validRequestCache =  validateRequestCache(requestCache, ["query"]);

  if (!validRequestCache) {
    throw "First Argument on validRequestCache should be requestCache";
  }

  let cleanData: FiltersData;

  switch (type) {
    case "blog":
      cleanData = cleanBlog(requestCache, data);
      break;

    case "events":
      cleanData = cleanEvents(requestCache, data);
      break;

    case "press-releases-news":
      cleanData = cleanPressReleasesNews(requestCache, data);
      break;

    case "search":
    default:
      cleanData = {
        showClearAll: false,
        filters: data,
        tabbed: false,
        type: ""
      };
      break;
  }

  // Add back type
  cleanData.type = type;

  return cleanData;
}

/**
 * Normalize filters for events
 * @param  {any} data
 * @return {FiltersData}
 */
function cleanBlog(requestCache: RequestCacheI, data: any) {
  const query: string[] = twigGetQuery(requestCache, "tags");
  const showClearAll: boolean = (typeof query !== "undefined" && query.length > 0);
  const filters = data.map((item: any) => {

    // Items are disabled/inactive
    if (item.hasOwnProperty("count") && item.count === 0) {
      item.disabled = true;
    }

    // Item is active
    if (typeof query !== "undefined" && query.indexOf(item.slug) >= 0) {
      item.active = true;
    }

    // url query
    item.urlQuery = `?${twigQuerystring(requestCache, {tags: item.slug})}`;

    return item;
  });

  return {
    tabbed: false,
    showClearAll,
    filters,
    type: ""
  };
}

/**
 * Normalize filters for events
 * @param  {any} data
 * @return {FiltersData}
 */
function cleanEvents(requestCache: RequestCacheI, data: any) {
  const { filters, locations } = data;
  const queries: any = {};
  const emptyFiltersIndexes: number[] = [];
  let showClearAll: boolean = false;

  if (data.hasOwnProperty("_keys")) {
    delete data._keys;
  }

  // Add location to filters
  for (const prop in data) {
    if (prop === "location") {
      const key = Object.keys(filters).length;

      filters[key] = {
        id: key,
        title: "Location",
        slug: "location",
        children: data[prop]
      };
    }
  }

  // Normalize filter children
  let tabActive = false;
  filters.forEach((filter: any, i: number) => {
    const { slug } = filter;
    queries[slug] = twigGetQuery(requestCache, slug);

    // Set the first available tab as active and set showClearall
    if (typeof queries[slug] !== "undefined" && !tabActive) {
      filter.tabActive = true;
      tabActive = true;
      showClearAll = true;
    }

    // Only normalize filters that have children
    if (filter.hasOwnProperty("children")) {
      filter.children = normalizeEventFilter.call(this, filter.children, slug);
    } else {
      // Filter has no children add to array to be removed later
      emptyFiltersIndexes.push(i);
    }
  });

  // If no active tab set the first one as active
  if (!tabActive) {
    filters[0].tabActive = true;
  }

  // Remove filters with no children
  if (emptyFiltersIndexes.length > 0) {
    // Loop in reverse order to not mess up the indexes
    for (let i = emptyFiltersIndexes.length - 1; i >= 0; i--) {
      const index = emptyFiltersIndexes[i];

      filters.splice(index, 1);
    }
  }

  /**
   * Normalize individual filters
   * @param filters
   * @param slug
   */
  function normalizeEventFilter(filters: any, slug: string) {
    return filters.map((filter: any) => {
      const paramTitle = filter.slug;
      const query = queries[slug];

      // Items are disabled/inactive
      if (filter.hasOwnProperty("count") && filter.count === 0) {
        filter.disabled = true;
      }

      // Item is active
      if (typeof query !== "undefined" && query.indexOf(paramTitle) >= 0) {
        filter.active = true;
      }

      filter.urlQuery = `?${twigQuerystring(requestCache, {[slug]: paramTitle})}`;

      return filter;
    });
  }

  return {
    tabbed: true,
    showClearAll,
    filters,
    type: "",
  };
}

/**
 * Normalize filters for press-releases and news
 * @param {any} data
 */
function cleanPressReleasesNews(requestCache: RequestCacheI, data: any) {
  const query: string[] = twigGetQuery(requestCache, "year");
  const showClearAll: boolean = (typeof query !== "undefined" && query.length > 0);
  const filters = data.map((item: any, i: number) => {
    const filter: any  = {
      id: i,
      title: item.toString(),
      slug: item.toString(),
    };

    // Is filter active?
    if (typeof query !== "undefined") {
      if (query.indexOf(filter.slug) >= 0) {
        filter.active = true;
      } else {
        filter.disabled = true;
      }
    }

    // url params
    const urlParam = (typeof query !== "undefined" && query.indexOf(filter.slug) >= 0) ? undefined : [filter.slug];
    filter.urlQuery = `?${twigQuerystring(requestCache, {year: filter.slug})}`;

    return filter;
  });

  return {
    tabbed: false,
    showClearAll,
    filters,
    type: "",
  };
}
