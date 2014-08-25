'use strict';

var express = require('express');
var fs = require('fs');
var router = express.Router();
var config = require('../app-config');



router.get('/:filename', function(req, res, next) {
	console.log(config.user.dataDir + '/' + req.params.filename);
	res.sendFile(config.user.dataDir + '/' + req.params.filename);
});	
	

	

module.exports = router;
