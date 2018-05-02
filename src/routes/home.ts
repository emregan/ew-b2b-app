import * as express from "express";
const router = express.Router();

import * as home from "../controllers/home";

router.get("/home", home.index);

export {
  router
};