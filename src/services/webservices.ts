//Load the request module
var request = require('request');

//Lets configure and request
request({
    url: 'https://localhost:9002/rest/v2/hmhb2bSite/users/default/orders', //URL to hit
    qs: {from: 'example', time: +new Date()}, //Query string data
    method: 'GET', // specify the request type
    headers: { // speciyfy the headers
        'Content-Type': 'MyContentType',
        'Custom-Header': 'Custom Value'
    },
    body: 'Hello Hello! String body!' //Set the body as a string
}, function(error, response, body){
    if(error) {
        console.log(error);
    } else {
        console.log(response.statusCode, body);
    }
});



var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
var User = require('./User');
// ADD THIS PART
// CREATES A NEW USER
router.post('/', function (req, res) {
    User.create({
            name : req.body.name,
            email : req.body.email,
            password : req.body.password
        }, 
        function (err, user) {
            if (err) return res.status(500).send("There was a problem adding the information to the database.");
            res.status(200).send(user);
        });
});
// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', function (req, res) {
    User.find({}, function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
    });
});

// GETS A SINGLE USER FROM THE DATABASE
router.get('/:id', function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        res.status(200).send(user);
    });
});


module.exports = router;