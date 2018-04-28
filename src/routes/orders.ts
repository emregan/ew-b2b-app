import * as express from "express";
const router = express.Router();

import * as orders from "../controllers/index";

router.get("/", orders.index);
router.get("/:slug([^/]+)", orders.detail);

router.get('/orders/:key', function (req, res) {  
  var orderNumber = req.params.key;
});

export {
  router
};
