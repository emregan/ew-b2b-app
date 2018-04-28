import { Request, Response, NextFunction } from "express";
import * as rpErrors from "request-promise-native/errors";
import * as api from "../services/api-client";
import * as logger from "../services/logger";

interface Redirect {
  id: number;
  type: string;
  src: string;
  dest: string|null;
  statusCode: number;
}

/**
 * GET /
 * Home page.
 */
export const handleError = (err: Error, req: Request, res: Response, next: NextFunction) => {
  // API responded with 404
  if (err instanceof rpErrors.StatusCodeError) {
    handle404(req, res);
  } else {
    logger.error("API error", err);
    handle503(req, res);
  }
};

export const handle404 = (req: Request, res: Response) => {
  // strip query string and url hash
  const url = req.url.replace(/[#\?].*?$/, "");

  // check for redirects
  api.getRedirect(url).then((data: any) => {
    const redirect: Redirect = data.data;

    const dest = redirect.type === "regex" ? req.url.replace(new RegExp(redirect.src, "i"), redirect.dest) : redirect.dest;

    logger.info(`Redirect [${redirect.statusCode}] ${url} -> ${dest}`, redirect);

    if (redirect.statusCode === 410) {
      res.status(410).render("pages/singles/404.twig");
    } else {
      res.redirect(redirect.statusCode, dest);
    }
  }).catch(err => {
    logger.info(`No Redirect ${url}`, err);

    res.status(404).render("pages/singles/404.twig");
  });
};

export const handle503 = (req: Request, res: Response) => {
  res.status(503).render("pages/singles/503.twig", {message: "We're having trouble serving your request. Please try again soon."});
};
