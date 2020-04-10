var express = require('express');
var mysql = require('mysql');
var wait = require('wait.for');
var router = express.Router();

router.post('/login',function(req,res){
	try {
		var loginData = req.body;
		var query = "SELECT * from login where user_name='" + loginData['UserName'] + "' and password='" + loginData['Password'] + "' and user_type='" + loginData['Type'] + "'";
		var queryCallback = function (err, rows, fields) {
			if (err) {
				req.logger.error({Error: err, Stack: err.stack, Message: err.message});
				res.status(500).send('Error while logging in. Try again later.');
			}
			;
			req.logger.info({Query: query, Data: rows, RouteFile: 'login.js', Method: '/login'});
			var result = {};
			result.Status = rows ? rows.length != 0 : false;
			result.path = (loginData['Type'] == 'Admin') ? '/admin/home' : '/agent/home';
			res.send(JSON.stringify(result));
		};
		req.db.ExecuteQuery(query, queryCallback);
	}
	catch(e){
		req.logger.error({Error: e, Stack: e.stack, Message: e.message});
		res.status(500).send('An unknown error has occurred.');
	}
});


var dbBackup = function(req,res){
	try {
		var backup = require('./backup').backup;
		var result = backup.takeBackup(req, res);
		res.status(result.code).send(result.message);
	}
	catch(e){
		req.logger.error({Error: e, Stack: e.stack, Message: e.message});
		res.status(500).send('An unknown error has occurred.');
	}
};

router.post('/logout',function(req,res){
	wait.launchFiber(dbBackup ,req,res);
});
module.exports = router;