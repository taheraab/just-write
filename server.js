'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var config = require('./app-config');
var fs = require('fs');

var fileService = require('./services/files');
var userService = require('./services/users');
var loginService = require('./services/login');
var storyService = require('./services/stories');
var chapterService = require('./services/chapters');

//Connect to database 
mongoose.connect(config.databaseConnectionURI, null, function(err) {
	if (err) console.error(err);
});

fs.mkdir(__dirname + '/files', function(err) {
	console.error(err);
});

var app = express();

app.use(favicon(__dirname + '/www/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({secret: 'Some secret'}));

app.use(express.static(path.join(__dirname, '/www')));

app.use('/services/login', loginService);

//Middleware to check if valid session is present
var checkSession = function(req, res, next) {
	if (req.session.user) {
		next();
	}else {
		res.status(401).end();
	}
};

app.use(checkSession);
//Get logged in use info from session
app.get('/getLoggedInUser', function(req, res, next) {
	res.json(req.session.user);
});

app.get('/signout', function(req, res, next) {
	req.session.destroy();
	res.send(200);
});

// secure services with session check
app.use('/services/files', fileService);
app.use('/services/users', userService);
app.use('/services/stories', storyService);
app.use('/services/chapters', chapterService);

app.set('port', process.env.PORT || 8080);
//start the server
app.listen(app.get('port'));
