import { Request, Response, NextFunction } from "express";
import { getAccountPage, getLoginPage } from "../services/api-client";

/**
 * GET /
 * Account page.
 */

export let index = (req: Request, res: Response, next: NextFunction) => {
  getAccountPage()  
   .then(data => res.render("pages/account/index", data))
   .catch(next);
};

export let login = (req: Request, res: Response, next: NextFunction) => {
   getLoginPage()  
   .then(data => res.render("pages/account/login", data))
   .catch(next);
};
 
export let profile = (req: Request, res: Response, next: NextFunction) => {
   getAccountPage()  
   .then(data => res.render("pages/account/profile", data))
   .catch(next);
};

export let register = (req: Request, res: Response, next: NextFunction) => {
   getAccountPage()  
   .then(data => res.render("pages/account/register", data))
   .catch(next);
};