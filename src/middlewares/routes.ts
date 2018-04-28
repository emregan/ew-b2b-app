import * as express from "express";

/** Import routes */
import * as indexRouter from "../routes/index";
import * as redirects from "../routes/redirects";
import * as orders from "../routes/orders";

export const appRouter = express.Router();

/** Use main routes */
appRouter.use("/", redirects.router);
appRouter.use("/", indexRouter.router);
appRouter.use("/orders", orders.router);
// appRouter.use("/:page([^/]+)", pages.router);

