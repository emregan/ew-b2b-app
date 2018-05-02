import * as express from "express";
const router = express.Router();
let request = require('request');
let url = process.env['WS_CLIENT_HTTP_URL'];
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import * as home from "../controllers/index";

/* GET home page. */
router.get("/home", home.index);

export {
  router
};
