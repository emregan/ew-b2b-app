import { Request, Response, Router } from "express";
const router = Router();

// router.all(["/"], (req: Request, res: Response) => res.redirect("/orders"));
router.all(["/"], (req: Request, res: Response) => res.redirect("/account/login")); // Redirect home page to login page, for demo
router.all(["/program(s?)", "/case-studies"], (req: Request, res: Response) => res.redirect("/classroom-solutions"));
router.all(["/event(s?)", "webinar(s?)"], (req: Request, res: Response) => res.redirect("/events-webinars"));
router.all(["/people"], (req: Request, res: Response) => res.redirect("/about-us"));

export {
  router
};
