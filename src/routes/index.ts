import * as express from "express";
const router = express.Router();
let request = require('request');
let url = process.env['WS_CLIENT_HTTP_URL'];
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import * as home from "../controllers/index";




/* GET home page. */
//router.get('/', function (req, res, next) {
    // res.render('pages/home/index', {title: 'LOGIN', msg: ''});

//});

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
		// console.log(json); // Logging the output within the request function
		// res.send({ data: json }) //then returning the response.. The request.json is empty over here
		res.render('pages/home/index', {title: 'poops', msg: 'yolo', data: json);
	}); //closing the request function
});

router.get("/api/orders", function(req, res)  { 
    request(options, function(err, output, body) {  
    	var json = JSON.parse(body);
		console.log(json); // Logging the output within the request function
		res.json(json) //then returning the response.. The request.json is empty over here
	}); //closing the request function
});

export {
  router
};
