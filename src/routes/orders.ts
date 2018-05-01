import * as express from "express";
const router = express.Router();
let request = require('request');

let url = process.env['WS_CLIENT_HTTP_URL'];
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import * as orders from "../controllers/orders";

// router.get("/", orders.index);

const options = {  
    url: url,
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Accept-Charset': 'utf-8',
        'User-Agent': 'my-reddit-client'
    }
};

router.get("/", function(req, res)  { 
    request(options, function(err, output, body) {  
    	var json = JSON.parse(body);
		// console.log(json);
		res.render('pages/orders/index', { data: json });
	});
});

router.get("/:slug([^/]+)", orders.detail);

router.get("/orders/:key", function (req, res) {
  const orderNumber = req.params.key;
  res.send(orderNumber); 
  res.locals.orderNumber = orderNumber;
  next();
});


export {
  router
};