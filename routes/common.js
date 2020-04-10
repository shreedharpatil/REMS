var express = require('express');
var mysql = require('mysql');
// var xlsx = require('node-xlsx');
var path    = require('path');
var fs      = require('fs');
var wait = require('wait.for');
var formidable = require('formidable');

var router = express.Router();

router.get('/isAppExpired',function(req,res){
	try {
		var query = "select * from renewal";
		var callback = function (err, rows, fields) {
			if (err) {
				console.log(err);
				res.send(err);
			}
			var result = {};
			if (rows.length > 0) {
				var today = new Date();
				var currentYear = today.getFullYear();
				var currentMonth = today.getMonth();
				var renewal = rows[0].application_renewal_date;
				var renewalYear = renewal.getFullYear();
				var renewalMonth = renewal.getMonth();
				var renewalWarningDate = new Date(renewalYear, renewalMonth - 1, renewal.getDate());
				console.log('renewalWarningDate ');
				console.log(renewalWarningDate);
				result.renewal_date = rows[0].application_renewal_date;
				if (today > renewal) {
					result.IsIsExpireMonth = true;
					result.IsExpired = true;
				}
				else if (today >= renewalWarningDate && today < renewal) {
					result.IsIsExpireMonth = true;
					result.IsExpired = false;
				}
				else {
					result.IsIsExpireMonth = false;
					result.IsExpired = false;
				}
			}
			else {
				result.IsIsExpireMonth = false;
				result.IsExpired = false;
			}
			res.send(result);
		};
		req.db.ExecuteQuery(query, callback);
	}
	catch(e){
		req.logger.error({Error: e, Stack: e.stack, Message: e.message});
		res.status(500).send('An unknown error has occurred.');
	}
});

module.exports = router;