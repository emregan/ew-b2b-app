import * as express from "express";
const router = express.Router();

import * as home from "../controllers/home";

// router.get("/home", home.index);

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var url = process.env.WS_CLIENT_HTTP_URL;

var request = require('request-promise');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'LOGIN', msg: ''});

});

router.post('/', function (req, res, next) {

    req.session.username = req.body.username;
    request({
        "method": "POST",
        "uri": url + req.body.username + "&password=" + req.body.password,
        "json": true,
        "headers": {
            "Content-Type": "application/json",
        }

    }).then(function (response) {
        console.log("//////////////////////");
        console.log("response");
        console.log("//////////////////////");
        console.log(response);
        req.session.access_token = response.access_token;
        req.session.refresh_token = response.refresh_token;
        res.redirect('/cart');
    }).catch(function (err) {
        console.log("//////////////////////");
        console.log("err oauth/token");
        console.log("//////////////////////");
        console.log(err.error);
        res.render('index', {title: 'LOGIN', msg: err.error.error_description});
        return 0;
    });


});


export {
  router
};