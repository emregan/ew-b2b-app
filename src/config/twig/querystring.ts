import * as querystring from "querystring";
import unique = require("array-unique");
import { validateRequestCache } from "../../services/request-cache-validation";

// Focusing on handling toggling one propety
// May need some refactoring if multiple properties need toggling
const toggleProp = function(queryPromp: string, paramPromp: Array<any>) {
  let queryPrompArr: string = queryPromp
    .split(",")
    .concat(paramPromp)
  .join(",");
  // console.log({queryPromp, paramPromp, queryPrompArr})

  paramPromp.forEach((val) => {
    const regex = new RegExp(`\,?(${val})`, "g");
    const match = queryPrompArr.match(regex);

    if (match.length > 1) {
      queryPrompArr = queryPrompArr.replace(regex, "");
    }
  });

  return queryPrompArr;
};

export default function twigQuerystring(requestCache: RequestCacheI, params: any): string {
  const validRequestCache =  validateRequestCache(requestCache, ["query"]);
  if (!validRequestCache) {
    throw "First Argument on validRequestCache should be twigQuerystring";
  }

  const query = Object.assign({}, requestCache.query);
  let returnQueryStrign: string;

  for (const prop in params) {
    // skip if prop starts with underscore
    if (/^_/.test(prop)) {
      continue;
    } else if (params[prop] === null) {
      delete query[prop];
    } else if (Array.isArray(params[prop]) && query.hasOwnProperty(prop)) {
      query[prop] = toggleProp(query[prop], params[prop]);
    } else {
      query[prop] = params[prop];
    }
  }

  returnQueryStrign = querystring.stringify(query).replace(/%2C/g, ",");
  return returnQueryStrign ? "?" + returnQueryStrign : "";
}
