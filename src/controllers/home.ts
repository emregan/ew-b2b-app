import { Request, Response, NextFunction } from "express";
import { getHomePage } from "../services/api-client";

/**
 * GET /
 * Homee page.
 */
 
 export let index = (req: Request, res: Response, next: NextFunction) => {
   getHomePage(req.params)  
   .then(data => res.render("pages/home/index", data))
   .catch(next);
};