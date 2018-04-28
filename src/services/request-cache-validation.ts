/**
 * validate requestCache has propeties in validate array
 * @param {RequestCacheI} requestCache
 * @param {string[]}      validate     collection of keys to check RequestCacheI contains
 */
export function validateRequestCache (requestCache: RequestCacheI, validate: string[]): boolean {
  if (typeof requestCache == "undefined") {
    throw "requestCache Object is undefined";
  }

  const validProp: number = validate.length;
  let matchedProps: number = 0;

  Object.keys(requestCache).forEach( (v, i): void => {
    if (validate.indexOf(v) != -1) {
      matchedProps++;
    }
  });

  return validProp == matchedProps;
}
