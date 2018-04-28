import { Request, Response, NextFunction } from "express";
import { getOrderIndex, getOrderDetail } from "../services/api-client";

/**
 * GET /
 * Order History page.
 */

export let detail = (req: Request, res: Response, next: NextFunction) => {
  getOrderDetail(req.params.slug)
    .then(data => res.render("pages/orders/detail", data))
    .catch(next);
};