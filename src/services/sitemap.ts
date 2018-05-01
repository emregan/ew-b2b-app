import * as api from "../services/api-client";
import * as es from "../services/es-client";
import * as rp from "request-promise-native";

import { APIEntry } from "./interfaces/sitemap";

const searchSize: number = 1000;

export function generate(protocol: string, host: string) {
  const sitemap = [];
  const links: any = [];
  const lastmod = getLastmod();

  for (const route of routes()) {
    links.push({
      sitemap: {
        loc: `${protocol}://${host}/sitemap-${route}.xml`,
        lastmod
      }
    });
  }

  return links;
}

/**
 * Get main sitemap
 */
export function main() {
  return api.getSitemap();
}

/**
 *
 * Request
 * @desc grab the given sitemap path request that data from the CMS/ES API
 * to provide the data for the detail
 *
 */
export function request(rawPath: string, protocol: string, host: string, params: any): Promise<any> {
  const path = stripPath(rawPath);
  if (path === "blog") {
      return api.getEntries(path).then((data) => {
        return reduceResponse(data.data, path, "title", protocol, host, true);
    });
  } else if (path === "about-us") {
    return api.getEntries("aboutSubpages").then((data) => {
        return reduceResponse(data.data, path, "aboutSubpageTitle", protocol, host, false);
    });
  } else if (path === "case-studies") {
    return api.getEntries("caseStudies").then((data) => {
        return reduceResponse(data.data, path, "title", protocol, host, true);
    });
  } else if (path === "pages") {
    return api.getEntries("pages").then((data) => {
        return reduceResponse(data.data, "", "title", protocol, host, false);
    });
  } else if (path === "event") {
    return api.getEntries("events").then((data) => {
        return reduceResponse(data.data, path, "title", protocol, host, "events-webinars");
    });
  } else if (path === "webinars") {
    return api.getEntries("webinars").then((data) => {
        return reduceResponse(data.data, path, "title", protocol, host, "events-webinars");
    });
  } else if (path === "forms") {
    return api.getEntries("forms").then((data) => {
        return reduceResponse(data.data, path, "title", protocol, host, false);
    });
  } else if (path === "people") {
    return api.getEntries("people").then((data) => {
      return reduceResponse(data.data, "people", "title", protocol, host, false);
    });
  } else if (path === "programs") {
    return api.getEntries("programs").then((data) => {
      return reduceResponse(data.data, path, "title", protocol, host, false);
    });
} else if (path === "support") {
    return api.getEntries("support").then((data) => {
      return reduceResponse(data.data, path, "title", protocol, host, true);
    });
  } else if (path === "home") {
    return Promise.resolve().then(() => {
      return reduceResponse(undefined, path, "title", protocol, host, " ");
    });
  } else {
    return api.getEntries(path).then((data) => {
      return reduceResponse(data.data, path, "title", protocol, host, false);
    });
  }
}

function reduceResponse(data: APIEntry|APIEntry[], path: string, titleProp: string, protocol: string, host: string, index: boolean|string, params?: any): any {
  const urlset: any = [];

  if (index && (typeof params === "undefined" || Number(params.from) === searchSize)) {
    const indexSlug = typeof index === "string" ? index : path;
    const url = formatUrl(`${protocol}://${host}/${indexSlug}`);
    const indexEntry = {
      url
    };

    urlset.push(indexEntry);
  }

  if (typeof data === "undefined") {
    return { urlset };
  }
  const results: any = Array.isArray(data) ? data : [data];

  for (const entry of results) {
    const title = entry[titleProp] || entry.title;
    const slug = entry.pageUri || entry.slug || entry.url;
    const loc = `${protocol}://` + `${host}/${path}/${slug}`.replace(/\/\//g, "/");
    const url = formatUrl(loc);

    // push in as long as the path and title aren't the same
    if (title.toLowerCase() !== path.toLowerCase()) {
      urlset.push({
        url
      });
    }
  }
  return  [
    {
      name: "urlset",
      attrs: {
        xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9"
      },
      children: urlset
    }
  ];
}

function formatUrl(loc: string, index?: boolean): any {
  const lastmod = getLastmod();
  const changefreq = "daily";
  const priority = "1.0";

  if (typeof index === "undefined" || index === false) {
    return {
      loc,
      lastmod,
      changefreq,
      priority
    };
  } else {
    return {
      loc,
      lastmod
    };
  }
}
function getLastmod(): string {
  const rawDate = new Date();
  const year = rawDate.getFullYear();
  const month = ("0" + (rawDate.getMonth() + 1)).slice(-2);
  const day = rawDate.getDate();

  return `${year}-${month}-${day}`;
}

function stripPath(rawPath: string): string {
  return rawPath
    .replace("sitemap-", "")
    .replace(".xml", "");
}

function routes(): string[] {
  return [
    "home",
    "about-us",
    "blog",
    "case-studies",
    "pages",
    "event",
    "webinars",
    "forms",
    "people",
    "programs",
    "shop",
    "support",
  ];
}
