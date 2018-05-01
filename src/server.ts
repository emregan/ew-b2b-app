import * as dotenv from "dotenv";
// load from .env file
dotenv.config();

import * as express from "express";
import * as compression from "compression";
import * as bodyParser from "body-parser";
import * as requestLogger from "morgan";
import * as cookieParser from "cookie-parser";
import * as errorHandler from "./controllers/errorHandler";
import * as lusca from "lusca";
import * as path from "path";
import * as minimist from "minimist";
import * as logger from "./services/logger";
import * as device from "express-device";
import * as manageCookies from "./middlewares/manage-cookies";
import requestCache from "./middlewares/request-cache";
import { appRouter } from "./middlewares/routes";
import * as useragent from "express-useragent";
import * as api from "./services/api-client";
import expressValidator = require("express-validator");


// load command line args
const args = minimist(process.argv.slice(2));

/**
 * Create Express server.
 */
const app = express();

/**
 * Import Twig Function/Filter extensions
 */
require("./config/twig");

/**
 * App settings.
 */
app.set("port", args.port || process.env.PORT || 3030);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "twig");
app.set("twig options", {
  autoescape: true
});

/**
 * Middlewares.
 */
app.use(compression());
app.use(requestLogger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(device.capture());
device.enableDeviceHelpers(app);
app.use(cookieParser());
app.use(expressValidator());
app.use(useragent.express());
app.use(express.static(path.join(__dirname, "public"), { maxAge: 31557600000 }));

/**
 * VMG Middlewares
 */
app.use(manageCookies());
app.use(requestCache);
// This has to be the last middleware, as routes does not execute next
app.use(appRouter);

/**
 * Error and 404 Handler
 */
app.use(errorHandler.handleError);
app.use(errorHandler.handle404);

/**
 * Start Express server.
 */
app.listen(app.get("port"), () => {
  logger.info(("  App is running at http://localhost:%d in %s mode"), app.get("port"), app.get("env"));
  logger.info("  Press CTRL-C to stop\n");
});

process.on("unhandledRejection", (err: Error) => {
  logger.error(`unhandledRejection: ${err.message}`, {stack: err.stack});
  process.exit(1);
});

process.on("uncaughtException", (err: Error) => {
  logger.error(`uncaughtException: ${err.message}`, {stack: err.stack});
  process.exit(1);
});

module.exports = app;
