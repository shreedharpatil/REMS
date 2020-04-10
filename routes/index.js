var express = require('express');
var path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/servetemplate', function(req, res) {  
    res.sendFile(req.basepath + '/agent/CustomerAgentDetailsTemplate.html');
});

router.get('/getValue',function(req,res){
var mysql = require('mysql');
 var loginData = {"UserName":"admin","Password":"admin","Type":"admin"};
		//loginData = JSON.parse(loginData);		
console.log('after parsing');
console.log(loginData);
var queryString = "SELECT * from login where user_name='"+loginData['UserName']+"' and password='"+loginData['Password']+"' and user_type='"+loginData['Type']+"'"; //'SELECT * FROM test1';
console.log(queryString);
var connection = mysql.createConnection(
    {
      host     : 'localhost',
      user     : '',
      password : '',
      database : 'REMS'
    }
);
 
connection.connect();
 
 var data;
connection.query(queryString, function(err, rows, fields) {
console.log('inside query');
    if (err) {
	console.log(err);
	};
 data=rows;
    for (var i in rows) {        
		console.log(JSON.stringify(rows[i]));
		
    }
});
 
connection.end();
console.log('connection eneded');
res.send(JSON.stringify(data));
});

module.exports = router;
