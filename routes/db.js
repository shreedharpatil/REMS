var express = require('express');
var mysql = require('mysql');
var router = express.Router();

var db = function(){
	
	this.ExecuteQuery(query,callback)
	{
		console.log('inside ExecuteQuery method');
		console.log('query:'+query);
		var connection = this.CreateConnectionObject();
		connection.connect();
		connection.query(query, function(err, rows, fields){
			callback(err, rows, fields);
			connection.end();
		});
	}

	this.CreateConnectionObject = function()
	{
		var connection = {
	  host     : 'localhost',
      user     : '',
      password : '',
      database : 'REMS',
    };
    return mysql.createConnection(req.connectionObj);
	}
};

router.db = new db();

module.exports = router;