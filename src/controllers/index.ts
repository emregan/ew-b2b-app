import { Request, Response, NextFunction } from "express";
import { getHomePage, getOrderDetail, getOrders } from "../services/api-client";

/**
 * GET /
 * Home page.
 */


export let index = (req: Request, res: Response, next: NextFunction) => {
  getHomePage()
    .then(data => res.render("pages/index", data))
    .catch(next);
};

export let detail = (req: Request, res: Response, next: NextFunction) => {
getOrderDetail(req.params.slug)
    .then(data => res.render("pages/orders/detail", data))
    .catch(next);
};
