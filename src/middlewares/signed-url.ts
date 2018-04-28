import { Request, Response, NextFunction, RequestHandler } from "express";
import { verifySignature } from "../services/url-signer";

const middleware = (): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // remove signature from current url
    const url = req.originalUrl.replace(/[\?\&]signature=([^\?\&]+)/, "");

    if (typeof req.query.signature !== "undefined" && verifySignature(url, req.query.signature)) {
      next();
    } else {
      res.status(403);
      res.send("Forbidden");
    }
  };
};

export = middleware;
