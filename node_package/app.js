// MODULOS NECESSARIOS

var express = require('express');
var path = require('path');
var app = express();
var req = require('request');
var bodyparser = require('body-parser');
var busboy = require('connect-busboy');

// Modules for Mongo Db
var crypto = require('crypto');
var random = require('csprng');
var gravatar = require('gravatar');
var mongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/levantador';


//CONFIGURATION DA APP
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Use modules and middlewares

app.use(bodyparser());
//app.use(crypto());
//app.use(random());
//app.use(gravatar());



// importando routes
app.use(require('./route'));


// InsertDocument Function






var port = 1337;	
app.listen(port, function(){
	console.log('server start at http://localhost:' +port + '/');
});









