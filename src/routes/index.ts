import * as express from "express";
const router = express.Router();

import * as singles from "../controllers/index";

router.get("/", singles.index);

export {
  router
};
