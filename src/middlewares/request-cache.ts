import { Request, Response, NextFunction } from "express";

export default function requestCache(req: Request, res: Response, next: NextFunction): void {
  const requestCache = {
    originalUrl: req.originalUrl,
    path: req.path,
    host: req.get("host"),
    protocol: req.get("x-forwarded-proto") || req.protocol,
    query: Object.assign({}, req.query),
    xhr: req.xhr,
    useragent: req.useragent
  };

  res.locals = Object.assign(res.locals, {requestCache});
  res.locals.NODE_ENV = process.env.NODE_ENV;

  next();
}
