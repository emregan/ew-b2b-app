import * as express from "express";
const router = express.Router();

import * as orders from "../controllers/orders";
import { withGlobals, get } from "../services/api-client";

// router.get("/", orders.index);


// MOVE THS TO FUNCTION
import { getGlobals } from "../services/api-client";
let request = require('request');
const url: string = process.env['WS_CLIENT_HTTP_URL'] || '';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

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
		res.render('pages/orders/index', { data: json } );
	});
});

router.get("/:slug([^/]+)", orders.detail);

router.get("/orders/:key", function (req, res) {
  const orderNumber = req.params.key;
   console.log("now, that's sexy - " + orderNumber);
  res.send( { data: orderNumber } );
  res.orderNumber = { orderNumber: '9999999' };
  next();
});


export {
  router
};