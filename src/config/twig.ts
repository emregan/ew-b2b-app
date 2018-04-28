import * as twig from "twig";

import { states } from "./states";
import { countries } from "./countries";
// import { tooltips } from "./tooltips";

import { TwigGroup } from "./twig/group";
import { column } from "./twig/column";
import { TwigSortAlpha } from "./twig/sort-alpha";
import { log } from "./twig/log";
import BrightcoveHandler from "./twig/brightcove";
import * as image from "./twig/image";
import * as search from "./twig/search";

import AssetsManifest from "./twig/asset";
import ReplaceRegex from "./twig/replace-regex";
import ProgramColor from "./twig/program-color";
import backLink from "./twig/back-link";

import normalizeFilters from "./twig/normalize-filters";
import { buildUrl, getSegment, buildSignedUrl, buildSearchProductUrl } from "./twig/url";
import twigQuerystring from "./twig/querystring";
import twigGetQuery from "./twig/get-query";
import Seo from "./twig/seo";
import env from "./twig/env";
import stripsymbols from "./twig/stripsymbols";


const manifest: AssetsManifest = new AssetsManifest();
const programColor: ProgramColor = new ProgramColor(twig);
const seo: Seo = new Seo(twig);

/**
 * Twig extensions. Twig is defined at a process level.
 * Defining extensions inside the middleware will cause twig to overwrite the extension
 * This is an issue because we are doing async request to and API and request B could finish before request A
 * then request A will have data from request BrightcoveHandler
 *
 * ATTENTION!
 * When making a twig extension that requires use of Request/Response content
 * assign them to res.locals
 * Do not overwrite function this with .bind.
 * Inside the function use this.context._locals to access data
 */
twig.cache(process.env.NODE_ENV === "production"); // @TODO remove on prod

/**
 * Twig Filters
 */
twig.extendFilter("group", TwigGroup);
twig.extendFilter("column", column);
twig.extendFilter("replace_regex", ReplaceRegex);
twig.extendFilter("sort_alpha", TwigSortAlpha.bind(twig)); // https://lodash.com/docs/4.17.4#orderBy
twig.extendFilter("stripsymbols", stripsymbols); // https://lodash.com/docs/4.17.4#orderBy

/**
 * Twig Extension that do not require Request/Response Information
 */
// Store brightcove players to render later
// We need this to avoid each video from loading the same player redundantly
twig.extendFunction("brightcoveStore", BrightcoveHandler.store.bind(BrightcoveHandler));
twig.extendFunction("brightcoveGet", BrightcoveHandler.get.bind(BrightcoveHandler));

twig.extendFunction("jsManifest", manifest.getJsFile.bind(manifest));
twig.extendFunction("cssManifest", manifest.getCssFile.bind(manifest));

twig.extendFunction("log", log.bind(twig));

twig.extendFunction("getProgramColor", programColor.get.bind(programColor));
twig.extendFunction("setProgramColorStyles", programColor.setStyles.bind(programColor));

twig.extendFunction("states", states);
twig.extendFunction("countries", countries);

twig.extendFunction("imageUrl", image.url);
twig.extendFunction("imageWidth", image.width);
twig.extendFunction("imageHeight", image.height);
twig.extendFunction("imageTransform", image.transforms);

twig.extendFunction("searchProductStatus", search.productStatus);
twig.extendFunction("searchProductAddToCartText", search.productAddToCartText);
twig.extendFunction("isSearchProduct", search.isProduct);

twig.extendFunction("backLink", backLink);
twig.extendFunction("env", env);

// using function to keep access to template _context
twig.extendFunction("seo", function(): string {
  return seo.render(this);
});

/**
 * Twig extension that require info from Request/Response
 */

twig.extendFunction("url", buildUrl);
twig.extendFunction("segment", getSegment);
twig.extendFunction("signedUrl", buildSignedUrl);
twig.extendFunction("searchProductUrl", buildSearchProductUrl);

twig.extendFunction("querystring", twigQuerystring);
twig.extendFunction("getQuery", twigGetQuery);
twig.extendFunction("normalizeFilters", normalizeFilters);
