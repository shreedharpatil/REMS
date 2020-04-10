var express = require('express');
 // var xlsx = require('node-xlsx');
var path = require('path');
var router = express.Router();

router.get('/home/:id',function(req,res){		
	res.render('agent/index', { title: 'Express' });
});

router.get('/agent/:id',function(req,res){
	try {
		var agentId = req.params.id;
		var query = "SELECT * from agent where id='" + agentId + "'";
		var callback = function (err, rows, fields) {
			if (err) {
				req.logger.error({Error: err, Stack: err.stack, Message: err.message});
			}
			if (rows) {
				req.logger.info({
					AgentId: agentId,
					Query: query,
					Data: rows,
					RouteFile: 'agent.js',
					Method: '/agent/:id'
				});
				res.send(JSON.stringify(rows[0]));
			}
			else {
				res.status(404).send("agent detials not found");
			}
		};
		req.db.ExecuteQuery(query, callback);
	}
	catch(e){
		req.logger.error({Error: e, Stack: e.stack, Message: e.message});
		res.status(500).send('An unknown error has occurred.');
	}
});


router.get('/agentCustomerMapping/:id',function(req,res){
	try {
		var agentId = req.params.id;
		var query = "select c.id, c.name ,c.contact_number,c.address, c.image_url from customer c ,customer_agent_mapping ca where ca.customer_id=c.id and ca.agent_id='" + agentId + "' order by c.id";
		var callback = function (err, rows, fields) {
			if (err) {
				req.logger.error({Error: err, Stack: err.stack, Message: err.message});
			}
			if (rows) {
				req.logger.info({
					AgentId: agentId,
					Query: query,
					Data: rows,
					RouteFile: 'agent.js',
					Method: '/agentCustomerMapping/:id'
				});
				res.send(JSON.stringify(rows));
			}
			else {
				res.status(404).send("agent detials not found");
			}
		};
		req.db.ExecuteQuery(query, callback);
	}
	catch(e){
		req.logger.error({Error: e, Stack: e.stack, Message: e.message});
		res.status(500).send('An unknown error has occurred.');
	}
});

router.post('/transaction',function(req,res){
	try {
		var transaction = req.body;

		var query = "insert into transaction (customer_id,agent_id,date,paid_unpaid_flg,amount_paid,amount_remaining,monthly_amount) values ('" + transaction["customerId"] + "','" + transaction["agentId"] + "','" + transaction["date"] + "','" + transaction["paidUnpaidFlg"] + "','" + transaction["amountPaid"] + "','" + transaction["amountRemaining"] + "','" + transaction["monthlyAmount"] + "')";
		var callback = function (err, rows, fields) {
			if (err) {
				req.logger.error({Error: err, Stack: err.stack, Message: err.message});
			}
			if (rows) {
				req.logger.info({
					AgentId: transaction["agentId"],
					Query: query,
					Data: rows,
					RouteFile: 'agent.js',
					Method: '/transaction',
					Message: "Transaction saved succesfully....!"
				});
				res.send("Transaction saved succesfully....!");
			}
			else {
				res.status(404).send("agent detials not found");
			}
		};
		req.db.ExecuteQuery(query, callback);
	}
	catch(e){
		req.logger.error({Error: e, Stack: e.stack, Message: e.message});
		res.status(500).send('An unknown error has occurred.');
	}
});

router.post('/changePassword',function(req,res){
	try {
		var agent = req.body;

		var query = "update login set password='" + agent['newPwd11'] + "' where user_name='" + agent['id'] + "' and user_type='agent'";
		var callback = function (err, rows, fields) {
			if (err) {
				req.logger.error({Error: err, Stack: err.stack, Message: err.message});
				res.send("Technical error has occured while updating your password. Try again later.");
			}
			if (rows) {
				req.logger.info({
					AgentId: agent['id'],
					Query: query,
					Data: rows,
					RouteFile: 'agent.js',
					Method: '/changePassword',
					Message: "Password has been changed successfully."
				});
				res.send("Password has been changed successfully.");
			}
			else {
				res.send({status: false});
			}
		}
		req.db.ExecuteQuery(query, callback);
	}
	catch(e){
		req.logger.error({Error: e, Stack: e.stack, Message: e.message});
		res.status(500).send('An unknown error has occurred.');
	}
});

module.exports = router;