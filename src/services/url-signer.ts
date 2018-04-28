import * as querystring from "querystring";
import * as jwt from "jsonwebtoken";

const JWT_SECRET = "OC{0V4OG8BjwB|pV'&H*uo0k@7c~Juqwcrhr/ill$s'(p_<zM3&5hh3qP,Txyhl";

export const createSignature = (url: string): string => {
  return jwt.sign({}, JWT_SECRET, {
    subject: url,
    expiresIn: "1h"
  });
};

export const verifySignature = (url: string, signature: string): boolean => {
  try {
    const decoded = jwt.verify(signature, JWT_SECRET, {
      subject: url,
      ignoreNotBefore: true
    });
  } catch (e) {
    return false;
  }

  return true;
};

export const getSignedUrl = (url: string): string => {
  const uri = url.replace(/^https?:\/\/[^\/]+/, "");

  const delimeter: string = (uri.indexOf("?") > -1) ? "&" : "?";

  const signature: string = jwt.sign({}, JWT_SECRET, {
    subject: uri,
    expiresIn: "1h"
  });

  return `${uri}${delimeter}signature=${encodeURIComponent(signature)}`;
};
