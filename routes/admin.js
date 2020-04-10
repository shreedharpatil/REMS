var express = require('express');
var mysql = require('mysql');
var path    = require('path');
var fs      = require('fs');
var wait = require('wait.for');
var formidable = require('formidable');

var router = express.Router();

router.get('/home/:id',function(req,res){
	res.render('admin/index', { title: 'Express' });
});

router.get('/admin/:id',function(req,res){
	try {
		var adminId = req.params.id;
		var query = "SELECT * from admin where id='" + adminId + "'";
		var callback = function (err, rows, fields) {
			if (err) {
				req.logger.error({Error: err, Stack: err.stack, Message: err.message});
			}
			if (rows) {
				req.logger.info({
					AdminId: adminId,
					Query: query,
					Data: rows,
					RouteFile: 'admin.js',
					Method: '/admin/:id'
				});
				res.send(JSON.stringify(rows[0]));
			}
			else {
				req.logger.warning({
					AdminId: adminId,
					Query: query,
					Data: rows,
					RouteFile: 'admin.js',
					Message: "agent detials not found",
					Method: '/admin/:id'
				});
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

router.post('/saveAgent',function(req,res){
	try {
		var agent = req.body;
		var query1 = "insert into agent (name,contact_number,address,image_url) values ('" + agent["name"] + "','" + agent["contact_number"] + "','" + agent["address"] + "','" + agent["image_url"] + "')";
		var query2 = "select max(id) from agent";
		var query3 = "insert into login values(?,?,?)";
		var callback1 = function (err, rows, fields) {
			if (err) {
				req.logger.error({Error: err, Stack: err.stack, Message: err.message});
			}
			if (rows) {
				req.logger.info({
					Query: query1,
					Data: rows,
					RouteFile: 'admin.js',
					Method: '/saveAgent',
					Message: 'Saving into agent table is successful.'
				});
				req.db.ExecuteQuery(query2, callback2);
			}
			else {
				res.status(404).send("agent detials not found");
			}
		};
		var callback2 = function (err, rows, fields) {
			if (err) {
				req.logger.error({Error: err, Stack: err.stack, Message: err.message});
			}
			if (rows) {
				req.logger.info({
					Query: query2,
					Data: rows,
					RouteFile: 'admin.js',
					Method: '/saveAgent',
					Message: 'Getting agent id.'
				});
				req.db.ExecuteUpdate(query3, [rows[0]["max(id)"], 'agent', 'agent'], callback3);
			}
		};
		var callback3 = function (err, rows, fields) {
			if (err) {
				req.logger.error({Error: err, Stack: err.stack, Message: err.message});
			}
			if (rows) {
				req.logger.info({
					Query: query3,
					Data: rows,
					RouteFile: 'admin.js',
					Method: '/saveAgent',
					Message: 'Inserting into login table.'
				});
				res.send("agent details saved successfully....!");
			}
		};

		req.db.ExecuteQuery(query1, callback1);
	}
	catch(e){
		req.logger.error({Error: e, Stack: e.stack, Message: e.message});
		res.status(500).send('An unknown error has occurred.');
	};
});

router.get('/getAllCustomers',function(req,res) {
try{
	var query = "select * from customer order by id";
	var callback = function (err, rows, fields) {
		if (err) {
			req.logger.error({Error: err, Stack: err.stack, Message: err.message});
		}
		if (rows) {
			req.logger.info({Query: query, Data: rows, RouteFile: 'admin.js', Method: '/getAllCustomers'});
			res.send(JSON.stringify(rows));
		}
		else {
			res.status(404).send("Customer detials not found");
		}
	};
	req.db.ExecuteQuery(query, callback);
}
catch(e){
	req.logger.error({Error: e, Stack: e.stack, Message: e.message});
	res.status(500).send('An unknown error has occurred.');
};
});

router.get('/getAllAgents',function(req,res){
	try {
		var query = "select * from agent order by id";
		var callback = function (err, rows, fields) {
			if (err) {
				req.logger.error({Error: err, Stack: err.stack, Message: err.message});
			}
			if (rows) {
				req.logger.info({Query: query, Data: rows, RouteFile: 'admin.js', Method: '/getAllAgents'});
				res.send(JSON.stringify(rows));
			}
			else {
				res.status(404).send("Customer detials not found");
			}
		};
		req.db.ExecuteQuery(query, callback);
	}
	catch(e){
		req.logger.error({Error: e, Stack: e.stack, Message: e.message});
		res.status(500).send('An unknown error has occurred.');
	};
});

router.delete('/deleteCustomer/:id',function(req,res){
	try {
		var query1 = "delete from customer where id=" + req.params.id;
		var query2 = " delete from customer_agent_mapping where customer_id =" + req.params.id;
		var callback1 = function (err, result) {
			if (err) {
				req.logger.error({Error: err, Stack: err.stack, Message: err.message});
			}
			if (result) {
				req.logger.info({Query: query1, Data: result, RouteFile: 'admin.js', Method: '/deleteCustomer/:id'});
				req.db.ExecuteQuery(query2, callback2);

			}
			else {
				res.status(404).send("Customer detials not found try again");
			}
		};

		var callback2 = function (err, result) {
			if (err) {
				req.logger.error({Error: err, Stack: err.stack, Message: err.message});
			}
			if (result) {
				req.logger.info({Query: query2, Data: result, RouteFile: 'admin.js', Method: '/deleteCustomer/:id'});
				res.send("customer with id " + req.params.id + " deleted successfully");
			}
			else {
				res.status(404).send("Customer detials not found try again");
			}
		};
		req.db.ExecuteQuery(query1, callback1);
	}
	catch(e){
		req.logger.error({Error: e, Stack: e.stack, Message: e.message});
		res.status(500).send('An unknown error has occurred.');
	};
});

router.put('/updateCustomer',function(req,res){
	try {
		var customer = req.body;
		var query = "update customer set name= '" + customer["name"] + "',contact_number='" + customer["contact_number"] + "',address='" + customer["address"] + "' ";
		if (customer['image_url']) {
			query += ", image_url = '" + customer['image_url'] + "' ";
		}
		query += " where id='" + customer["id"] + "'";
		var callback = function (err, rows, fields) {
			if (err) {
				req.logger.error({Error: err, Stack: err.stack, Message: err.message});
			}
			if (rows) {
				req.logger.info({Query: query, Data: rows, RouteFile: 'admin.js', Method: '/updateCustomer'});
				res.send("Customer details updated successfully");
			}
			else {
				res.status(404).send("Sorry Unable to update due to technical problems, try after some time");
			}
		};
		req.db.ExecuteQuery(query, callback);
	}
	catch(e){
		req.logger.error({Error: e, Stack: e.stack, Message: e.message});
		res.status(500).send('An unknown error has occurred.');
	};
});

router.delete('/deleteAgent/:id',function(req,res){
	try {
		var query = "delete from agent where id=" + req.params.id;

		var callback = function (err, result) {
			if (err) {
				req.logger.error({Error: err, Stack: err.stack, Message: err.message});
			}
			if (result) {
				req.logger.info({Query: query, Data: result, RouteFile: 'admin.js', Method: '/deleteAgent/:id'});
				res.send("agent with id " + req.params.id + " deleted successfully");
			}
			else {
				res.status(404).send("Agent details not found try again");
			}
		};
		req.db.ExecuteQuery(query, callback);
	}
	catch(e){
		req.logger.error({Error: e, Stack: e.stack, Message: e.message});
		res.status(500).send('An unknown error has occurred.');
	}
});

router.put('/updateAgent',function(req,res){
	try {
		var agent = req.body;
		var query = "update agent set name= '" + agent["name"] + "',contact_number='" + agent["contact_number"] + "',address='" + agent["address"] + "' ";
		if (agent['image_url']) {
			query += ", image_url = '" + agent['image_url'] + "' ";
		}
		query += " where id='" + agent["id"] + "'";
		var callback = function (err, rows, fields) {
			if (err) {
				req.logger.error({Error: err, Stack: err.stack, Message: err.message});
			}
			if (rows) {
				req.logger.info({Query: query, Data: rows, RouteFile: 'admin.js', Method: '/updateAgent'});
				res.send("Agent details updated successfully");
			}
			else {
				res.status(404).send("Sorry Unable to update due to technical problems, try after some time");
			}
		};
		req.db.ExecuteQuery(query, callback);
	}
	catch(e){
		req.logger.error({Error: e, Stack: e.stack, Message: e.message});
		res.status(500).send('An unknown error has occurred.');
	}
});

var GetDefaultPhoto = function(){
	var photos = [
		"photo1.jpg", "photo2.png", "photo3.jpg", "photo4.png", "photo5.jpg",
		"photo6.png", "photo7.jpg", "photo8.png", "photo9.png", "photo10.jpg",
	];
	try{
		var index = Math.floor((Math.random() * 10));
		if(index >=0 && index <10){
			return photos[index];
		}
		return photos[0];
	}
	catch(e){
			return photos[9];
	}
};

router.post('/registerCustomer',function(req,res){
	try {
		var customer = req.body;
		if (!customer["image_url"]) {
			customer["image_url"] = '/default/' + GetDefaultPhoto();
		}
		var query1 = "insert into customer (id,name,contact_number,address,image_url) values ('" + customer["id"] + "','" + customer["name"] + "','" + customer["contact_number"] + "','" + customer["address"] + "', '" + customer["image_url"] + "')";
		var query2 = "insert into customer_agent_mapping values('" + customer["agent_id"] + "','" + customer["id"] + "')";

		var callback1 = function (err, rows, fields) {
			if (err) {
				req.logger.error({Error: err, Stack: err.stack, Message: err.message});
			}
			if (rows) {
				req.logger.info({Query: query1, Data: rows, RouteFile: 'admin.js', Method: '/registerCustomer'});
				req.db.ExecuteQuery(query2, callback2);
			}
			else {
				res.status(404).send("there is error in adding customer detials please contact support team");
			}
		};

		var callback2 = function (err, rows, fields) {
			if (err) {
				req.logger.error({Error: err, Stack: err.stack, Message: err.message});
			}
			if (rows) {
				req.logger.info({Query: query2, Data: rows, RouteFile: 'admin.js', Method: '/registerCustomer'});
				res.send("customer details saved successfully....!");
			}
			else {
				res.status(404).send("customer detials not found");
			}
		};

		req.db.ExecuteQuery(query1, callback1);
	}
	catch(e){
		req.logger.error({Error: e, Stack: e.stack, Message: e.message});
		res.status(500).send('An unknown error has occurred.');
	}
});

router.post('/uploadAgentPhoto', function(req, res) {
	try {
		var form = new formidable.IncomingForm();
		form.parse(req, function (err, fields, files) {
			if (err) {
				req.logger.error({Error: err, Stack: err.stack, Message: err.message});
				return;
			}
			var image = files.agentPhoto;

			var newImageLocation = path.join(__dirname, '../photos/agent', image.name);
			fs.readFile(image.path, function (err, data) {
				fs.writeFile(newImageLocation, data, function (err) {
					res.json(200, {
						src: 'photos/agent/' + image.name,
						size: image.size
					});
				});
			});
		});
	}
	catch(e){
		req.logger.error({Error: e, Stack: e.stack, Message: e.message});
		res.status(500).send('An unknown error has occurred.');
	}
});

router.post('/uploadCustomerPhoto', function(req, res) {
	try {
		var form = new formidable.IncomingForm();
		form.parse(req, function (err, fields, files) {
			if (err) {
				req.logger.error({Error: err, Stack: err.stack, Message: err.message});
				return;
			}
			var image = files.customerPhoto;

			var newImageLocation = path.join(__dirname, '../photos/customer', image.name);
			fs.readFile(image.path, function (err, data) {
				fs.writeFile(newImageLocation, data, function (err) {
					res.json(200, {
						src: 'customer/agent/' + image.name,
						size: image.size
					});
				});
			});
		});
	}
	catch(e){
		req.logger.error({Error: e, Stack: e.stack, Message: e.message});
		res.status(500).send('An unknown error has occurred.');
	}
});

router.get('/validateMembershipNumber/:id',function(req,res){
	try {
		var userId = req.params.id;
		var query = "SELECT * from customer where id='" + userId + "'";
		var callback = function (err, rows, fields) {
			var response = {};
			if (err) {
				req.logger.error({Error: err, Stack: err.stack, Message: err.message});
				res.status(404).send("There seems some technical issue. Please try again after some time.");
			}
			if (rows) {
				req.logger.info({
					Query: query,
					Data: rows,
					RouteFile: 'admin.js',
					Method: '/validateMembershipNumber/:id'
				});
				if (rows.length > 0) {
					response = rows[0];
					response.IsMembershipNumberExists = true;
				}
				else {
					response.IsMembershipNumberExists = false;
				}
				// response.IsMembershipNumberExists = rows.length>0 ? true:false;
				res.send(JSON.stringify(response));
			}
			else {
				response.IsMembershipNumberExists = false;
				res.send(JSON.stringify(response));
			}
		};
		req.db.ExecuteQuery(query, callback);
	}
	catch(e){
		req.logger.error({Error: e, Stack: e.stack, Message: e.message});
		res.status(500).send('An unknown error has occurred.');
	}
});

router.post("/uploadBulkAgentList",function(req,res){
	try{
var form = new formidable.IncomingForm();
      form.parse(req, function(err, fields, files) {
		  if (err) {
			  req.logger.error({Error: err, Stack: err.stack, Message: err.message});
			  return;
		  }
		  var file = files.agentList;
		  console.log(file);
		  var newImageLocation = path.join(__dirname, '../bulkdatauploads', file.name);
		  fs.readFile(file.path, function (err, data) {
			  fs.writeFile(newImageLocation, data, function (err) {
				  var query = "insert into agent (name,contact_number,address,image_url) values(?,?,?,?)";
				  var agentList = xlsx.parse(newImageLocation);
				  var agentDataList = agentList[0].data;
				  var callback = function (err, rows, fields) {
					  if (err) {
						  console.log("ExecuteUpdate Error :" + err);
					  }
				  };
				  for (var i = 1; i < agentDataList.length; i++) {

					  req.db.ExecuteUpdate(query, agentDataList[i], callback);

				  }
				  res.send('inserted successfully');
			  });
		  });
	  });
	  }
	catch(e){
			req.logger.error({Error: e, Stack: e.stack, Message: e.message});
			res.status(500).send('An unknown error has occurred.');
		}
});

router.post('/createPlotLayout',function(req,res){
	try {
		var plot = req.body;
		var insertQuery = "insert into renewal values(?,?)";
		var insertCallback = function (err, rows, fields) {
			if (err) {
				req.logger.error({Error: err, Stack: err.stack, Message: err.message});
				res.send(err);
			}
			if (rows) {
				req.logger.info({
					Query: insertQuery,
					Data: rows,
					RouteFile: 'admin.js',
					Method: '/createPlotLayout',
					Message: 'Inserted into renewal table',
					QueryData: [new Date(), renewalDate]
				});
				res.send("Plot layout has been created successfully. Click ok to close the popup.");
			}
		};

		var query = "insert into plot_layout values (?,?,?,?,?,?)";
		var callback = function (err, rows, fields) {
			if (err) {
				req.logger.error({Error: err, Stack: err.stack, Message: err.message});
				res.send(err);
			}
			if (rows) {
				req.logger.info({
					Query: query,
					Data: rows,
					RouteFile: 'admin.js',
					Method: '/createPlotLayout',
					Message: 'Inserted into plot layout table',
					QueryData: [plot["number_of_plots"], plot["number_of_installments"], plot["initial_installment_amount"], plot["increment_interval"], plot["increment_amount"], plot["number_of_installments_lapsed"]]
				});
				var today = new Date();
				var renewalDate = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
				req.db.ExecuteQueryWithData(insertQuery, [today, renewalDate], insertCallback);
			}
			else {
				res.status(404).send("failed to create plot layout. Please try again after some time. If problem still persists contact administrator.");
			}
		};
		req.db.ExecuteUpdate(query, [plot["number_of_plots"], plot["number_of_installments"], plot["initial_installment_amount"], plot["increment_interval"], plot["increment_amount"], plot["number_of_installments_lapsed"]], callback);
	}
	catch(e){
		req.logger.error({Error: e, Stack: e.stack, Message: e.message});
		res.status(500).send('An unknown error has occurred.');
	}
});

router.get('/plotLayoutDetails',function(req,res){
	try {
		var query = "select * from plot_layout";
		var callback = function (err, rows, fields) {
			if (err) {
				req.logger.error({Error: err, Stack: err.stack, Message: err.message});
			}
			req.logger.info({Query: query, Data: rows, RouteFile: 'admin.js', Method: '/plotLayoutDetails'});
			if (rows.length > 0) {
				var result = rows[0];
				result.status = true;
				res.send(result);
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

router.post('/resetPasswordforAgent',function(req,res){
	try {
		var agent = req.body;
		var newpwd = "agent@" + agent['id'];

		var query = "update login set password='" + newpwd + "' where user_name='" + agent['id'] + "' and user_type='agent'";
		var callback = function (err, rows, fields) {
			if (err) {
				req.logger.error({Error: err, Stack: err.stack, Message: err.message});
			}
			req.logger.info({Query: query, Data: rows, RouteFile: 'admin.js', Method: '/resetPasswordforAgent'});
			if (rows) {
				res.send("Password has been reset successfully.");
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

router.post('/changeAdminPassword',function(req,res){
	try {
		var admin = req.body;
		var query = "update login set password=? where user_name = ? and user_type='admin'";
		var callback = function (err, rows, fields) {
			if (err) {
				req.logger.error({Error: err, Stack: err.stack, Message: err.message});
				res.send(err);
			}
			req.logger.info({
				Query: query,
				Data: rows,
				RouteFile: 'admin.js',
				Method: '/changeAdminPassword',
				QueryData: [admin['newPwd11'], admin['id']]
			});
			if (rows) {

				res.send("Password has been changed Successfully.");
			}
			else {
				res.send({status: false});
			}
		}
		req.db.ExecuteUpdate(query, [admin['newPwd11'], admin['id']], callback);
	}
	catch(e){
		req.logger.error({Error: e, Stack: e.stack, Message: e.message});
		res.status(500).send('An unknown error has occurred.');
	}
});

var saveDraw = function(req,res){
	try {
		var draw = req.body;
		var query2 = "insert into draw values(?,?,?,?,?)";
		var query1 = "select * from draw where installment_number = ?  and draw_type = ?";
		var result = req.db.ExecuteQuerySynch(query1, [draw.InstallmentNumber, draw.Type]);
		req.logger.info({
			Query: query1,
			Data: result,
			RouteFile: 'admin.js',
			Method: 'saveDraw',
			QueryData: [draw.InstallmentNumber, draw.Type]
		});
		if (result.rows.length > 0) {
			var message = "The member with membership number:" + (result.rows[0] ? result.rows[0].membership_number : 0) + " has already won the " + draw.Type + " draw for the instalment number:" +
				draw.InstallmentNumber + " on the date:" + result.rows[0].winning_date.FormatDate('-');
			req.saveDrawResponse = {status: 404, message: message};
			res.status(req.saveDrawResponse.status).send(req.saveDrawResponse.message);
			req.logger.warning({Message: message, RouteFile: 'admin.js', Method: 'saveDraw'});
			return;
		}

		result = req.db.ExecuteQuerySynch(query2, [draw.InstallmentNumber, draw.MembershipNumber, new Date(), draw.Type, draw.DrawNumber]);
		if (result.error) {
			req.saveDrawResponse = {status: 500, message: result.error};
			req.logger.error({Message: result.error, RouteFile: 'admin.js', Method: 'saveDraw'});
			res.status(req.saveDrawResponse.status).send(req.saveDrawResponse.message);
			return;
		}
		req.logger.info({
			Query: query2,
			Data: result,
			RouteFile: 'admin.js',
			Method: 'saveDraw',
			QueryData: [draw.InstallmentNumber, draw.MembershipNumber, new Date(), draw.Type, draw.DrawNumber]
		});
		req.saveDrawResponse = {status: 200, message: 'Draw details saved successfully.'};
		res.status(req.saveDrawResponse.status).send(req.saveDrawResponse.message);
	}
	catch(e){
		req.logger.error({Error: e, Stack: e.stack, Message: e.message});
		res.status(500).send('An unknown error has occurred.');
	}
};

router.post('/saveDraw',function(req,res){
	wait.launchFiber(saveDraw, req, res);
});

router.get('/getDraws/:type',function(req,res){
	try {
		var drawType = req.params.type;
		var query = "select * from draw, customer where draw_type=? and draw.membership_number = customer.id order by installment_number";
		var callback = function (err, rows, fields) {
			if (err) {
				req.logger.error({
					Message: err.message,
					Stack: err.stack,
					RouteFile: 'admin.js',
					Method: '/getDraws/:type',
					QueryData: [drawType]
				});
				res.status(500).send(err);
			}
			req.logger.info({Query: query, Data: rows, RouteFile: 'admin.js', Method: '/getDraws/:type'});
			if (rows) {
				res.send(rows);
			}
		};
		req.db.ExecuteQueryWithData(query, [drawType], callback);
	}
	catch(e){
		req.logger.error({Error: e, Stack: e.stack, Message: e.message});
		res.status(500).send('An unknown error has occurred.');
	}
});

module.exports = router;
