import { Request, Response, NextFunction } from "express";
import { getHomePage, getOrderIndex, getOrderDetail } from "../services/api-client";

/**
 * GET /
 * Order History page.
 */
 
'use strict';
export let index = (req: Request, res: Response, next: NextFunction) => {
   getOrderIndex()
   .then(data => res.render("pages/orders/index", data))
   .catch(next);
};

 export let xxindex = (req: Request, res: Response, next: NextFunction) => {
   getOrderIndex(req.params)  
   .then(data => res.render("pages/orders/index", data))
   .catch(next);
};

export let detail = (req: Request, res: Response, next: NextFunction) => {
  getOrderDetail(req.params)
    .then(data => res.render("pages/orders/detail", data))
    .catch(next);
};