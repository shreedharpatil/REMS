var express = require('express');
var wait = require('wait.for');
var router = express.Router();
var _ = require('underscore-node');

var handleCollection = function(req,res){
	try {
		var collection = req.body;
		var plotwinner = IsMemberInPlotDrawList(collection, req);
		if (plotwinner.IsPlotWinner) {
			res.status(404).send(plotwinner.message);
			return;
		}
		var transactionId = '';
		var latestPaidDate = new Date();
		var today = latestPaidDate.getFullYear() + "-" + (latestPaidDate.getMonth() + 1) + "-" + latestPaidDate.getDate();
		collection.paid_amount = parseFloat(collection.paid_amount);
		// prepare range list first
		var rangeListData = PrepareRangeList(req);

		// first insert into transactions table.
		var transactionQuery = "insert into transaction (customer_id,agent_id,receipt_id,paid_date,paid_amount) values(?,?,?,?,?)";
		var transactionQueryResult = req.db.ExecuteQuerySynch(transactionQuery, [collection["customer_id"], collection["agent_id"], collection["receipt_number"], today, collection["paid_amount"]]);

		// get the latest transaction id
		var getTransactionIdQuery = "select max(transaction_id) from transaction";
		var getTransactionIdQueryResult = req.db.ExecuteQuerySynch(getTransactionIdQuery, []);

		transactionId = getTransactionIdQueryResult.rows[0]['max(transaction_id)'];

		// get latest installment number
		var latestInstallmentDetails = GetLatestInstallmentDetails(collection["customer_id"], req);
		var latestInstallmentNumber = req.NumberOfLapsedInstallments == undefined ? 0 : req.NumberOfLapsedInstallments;
		var isFirstInstallment = true;

		if (latestInstallmentDetails) {
			isFirstInstallment = false;
			latestInstallmentNumber = latestInstallmentDetails.installment_number;
			latestPaidDate = latestInstallmentDetails.paid_date;
			today = latestPaidDate.getFullYear() + "-" + (latestPaidDate.getMonth() + 1) + "-" + latestPaidDate.getDate();
		}
		// get current installmetn number
		var currentIstallmentNumber = latestInstallmentNumber + 1;

		// get current installment amount.
		var currentInstallmentamount = GetInstallmentAmount(currentIstallmentNumber, rangeListData);


		// if paid amount is zero , insert into installment payment table and exit.
		if (collection["paid_amount"] == 0) {
			if (!isFirstInstallment) {
				today = latestPaidDate.getFullYear() + "-" + (latestPaidDate.getMonth() + 2) + "-" + latestPaidDate.getDate();
			}
			InsertIntoInstallmentPayment(req, [transactionId, collection["customer_id"], collection["agent_id"], collection["receipt_number"], today, today, "UP", collection["paid_amount"], currentInstallmentamount, currentInstallmentamount, currentIstallmentNumber]);
			res.send('Collection details saved successfully.');
			return;
		}

		// get customer due list.
		var dueList = GetCustomerDues(collection["customer_id"], req);


		var remaining_amount = collection["paid_amount"];
		//Fill dues entry lists
		for (var i = 0; i < dueList.length; i++) {
			var due = dueList[i];

			if (remaining_amount == 0) {
				break;
			}
			due.due_amount = parseFloat(due.due_amount);
			due.paid_amount = parseFloat(due.paid_amount);
			if (remaining_amount >= due.due_amount) {
				//Update existing due entry
				var install_payment = {
					paid_modified_date: today,
					payment_status_flag: "FP",
					paid_amount: due.paid_amount + due.due_amount,
					due_amount: 0,
					customer_id: collection["customer_id"],
					installment_number: due.installment_number
				}

				UpdateDueEntry([install_payment.paid_modified_date,
						install_payment.payment_status_flag,
						install_payment.paid_amount,
						install_payment.due_amount,
						install_payment.customer_id,
						install_payment.installment_number]
					, req);
				remaining_amount -= due.due_amount;
			}
			else if (remaining_amount < due.due_amount) {
				var install_payment = {
					paid_modified_date: today,
					payment_status_flag: "PP",
					paid_amount: due.paid_amount + remaining_amount,
					due_amount: due.due_amount - remaining_amount,
					customer_id: collection["customer_id"],
					installment_number: due.installment_number
				}
				UpdateDueEntry([install_payment.paid_modified_date,
						install_payment.payment_status_flag,
						install_payment.paid_amount,
						install_payment.due_amount,
						install_payment.customer_id,
						install_payment.installment_number]
					, req);
				remaining_amount = 0;
			}
		}
		;
		//Pay Partial

		if (remaining_amount == 0 || remaining_amount < currentInstallmentamount) {
			var payment_status_flag = remaining_amount == 0 ? "UP" : "PP";
			if (!isFirstInstallment) {
				today = latestPaidDate.getFullYear() + "-" + (latestPaidDate.getMonth() + 2) + "-" + latestPaidDate.getDate();
			}
			InsertIntoInstallmentPayment(req, [transactionId, collection["customer_id"], collection["agent_id"], collection["receipt_number"], today, today, payment_status_flag, remaining_amount, currentInstallmentamount - remaining_amount, currentInstallmentamount, currentIstallmentNumber]);
			res.send('Collection details saved successfully.');
			return;
		}
		//Pay Full current Installment
		if (remaining_amount >= currentInstallmentamount) {
			if (!isFirstInstallment) {
				latestPaidDate = new Date(latestPaidDate.getFullYear(), latestPaidDate.getMonth() + 1, latestPaidDate.getDate());
				today = latestPaidDate.getFullYear() + "-" + (latestPaidDate.getMonth() + 1) + "-" + latestPaidDate.getDate();

			}
			InsertIntoInstallmentPayment(req, [transactionId, collection["customer_id"], collection["agent_id"], collection["receipt_number"], today, today, "FP", currentInstallmentamount, 0, currentInstallmentamount, currentIstallmentNumber]);
			remaining_amount -= currentInstallmentamount;
		}
		//Future Installment Amount
		var futureInstallmentNumber;
		var futureInstallmentAmount = 0;
		var futurePaidAmount = 0;
		//var tempDate = new Date();
		var todayDate = new Date(latestPaidDate.getFullYear(), latestPaidDate.getMonth() + 1, latestPaidDate.getDate());
		var futurePaidDate;
		var futurePaidStatus;
		var futureDueAmount;
		while (remaining_amount > 0) {
			futureInstallmentNumber = currentIstallmentNumber + 1;
			futureInstallmentAmount = GetInstallmentAmount(futureInstallmentNumber, rangeListData);
			futurePaidDate = todayDate.getFullYear() + "-" + (todayDate.getMonth() + 1) + "-" + todayDate.getDate();
			;
			if (remaining_amount >= futureInstallmentAmount) {
				remaining_amount -= futureInstallmentAmount;
				futurePaidAmount = futureInstallmentAmount;
				futureDueAmount = 0;
				futurePaidStatus = "FP";
			}
			else {
				futurePaidAmount = remaining_amount;
				futurePaidStatus = "PP";
				futureDueAmount = futureInstallmentAmount - remaining_amount;
				remaining_amount = 0;
			}

			// insert future transctions.
			InsertIntoInstallmentPayment(req, [transactionId, collection["customer_id"],
				collection["agent_id"],
				collection["receipt_number"],
				futurePaidDate,
				futurePaidDate,
				futurePaidStatus,
				futurePaidAmount,
				futureDueAmount,
				futureInstallmentAmount, futureInstallmentNumber]);
			todayDate = new Date(todayDate.getFullYear(), todayDate.getMonth() + 1, todayDate.getDate());
			currentIstallmentNumber += 1;
		}
		res.send('Collection details saved successfully.');
	}
	catch(e){
		req.logger.error({Error: e, Stack: e.stack, Message: e.message});
		res.status(500).send('An unknown error has occurred.');
	}
};

var getInstallmentDetails = function(req, res){
	try {
		var dataList = PrepareRangeList(req);
		var installmentList = [];
		_.each(_.range(1, req.NumberOfLapsedInstallments + 1), function (installment) {
			installmentList.push({
				InstallmentNumber: installment,
				InstallmentAmount: GetInstallmentAmount(installment, dataList)
			});
		});
		res.send(installmentList);
	}
	catch(e){
		req.logger.error({Error: e, Stack: e.stack, Message: e.message});
		res.status(500).send('An unknown error has occurred.');
	}
};
var IsMemberInPlotDrawList = function(member, req){
	var query = "select * from draw where membership_number = ? and draw_type = 'plot'";
	var result = req.db.ExecuteQuerySynch(query,[member["customer_id"]]);
	req.logger.info({  Query : query, Data : result.rows, RouteFile : 'collections.js', Method :'IsMemberInPlotDrawList',QueryData:[member["customer_id"]]});
	if(result.rows.length > 0 ){
		return {IsPlotWinner:true, message:'This member is plot winner, hence he need not to pay any installment effective from the date:'+result.rows[0].winning_date};
	}
	return {IsPlotWinner:false};
};

var GetLatestInstallmentDetails = function(membershipnumber,req){
	var  query = "select installment_number, paid_date from installment_payment where customer_id=? and installment_number in "+
	"(select max(installment_number) from installment_payment where customer_id = ?)";	
	var result = req.db.ExecuteQuerySynch(query,[membershipnumber,membershipnumber]);
	req.logger.info({  Query : query, Data : result.rows, RouteFile : 'collections.js', Method :'GetLatestInstallmentDetails',QueryData:[membershipnumber,membershipnumber]});
	if(result.rows.length > 0){
		return (result.rows[0]);
		}
	return null;
	// return result.rows.length > 0 ? result.rows[0]['max(installment_number)'] : 0;
};

var GetInstallmentAmount = function(installmentnumber,datalist){
installmentnumber = parseInt(installmentnumber);
	var row;
	for (var i=0; i < datalist.length ; i++){
		row = datalist[i];
		if(row.range.indexOf(installmentnumber)!= -1){		
			return parseFloat(row.installment_amount);
		}
	};
	return 0;
};

var GetCustomerDues = function(membershipnumber,req){
	var query = "select * from installment_payment where customer_id=? and payment_status_flag != ?";	
	var result = req.db.ExecuteQuerySynch(query,[membershipnumber,"FP"]);
	req.logger.info({  Query : query, Data : result.rows, RouteFile : 'collections.js',
		Method :'GetCustomerDues',QueryData:[membershipnumber,"FP"]});
	var sorted = _.sortBy(result.rows,function(row){
		return row.installment_number;
	});
	return sorted;
	
};

var GetPlotLayoutDetails = function(req){
	var query = "select * from plot_layout";	
	var result = req.db.ExecuteQuerySynch(query,[]);
	req.logger.info({  Query : query, Data : result.rows, RouteFile : 'collections.js',
		Method :'GetPlotLayoutDetails',QueryData:[]});
	return result.rows[0];
};

var PrepareRangeList = function(req){
	var plot_layout = GetPlotLayoutDetails(req);
	req.NumberOfLapsedInstallments = plot_layout.number_of_installments_lapsed;

	var initial_amount = parseFloat(plot_layout.initial_installment_amount);
	var installment_amount = 0;
	var increment_amount = parseFloat(plot_layout.increment_amount);
	var start = 1;
	var result =[];
	if( plot_layout.increment_interval ==0 || increment_amount == 0){
		var value = {};		
		value.range = _.range(start,plot_layout.number_of_installments+1);
		value.installment_amount = initial_amount;
		result.push(value);		
		return result;
	}
	var iteration = plot_layout.number_of_installments / plot_layout.increment_interval;
	var end = plot_layout.increment_interval;
	for(var i=1; i <= iteration ; i++ ){
		var eachValue = {};		
		eachValue.range = _.range(start,end+1);
		eachValue.installment_amount = installment_amount + initial_amount;
		start += plot_layout.increment_interval;
		end += plot_layout.increment_interval;
		initial_amount += increment_amount;
		result.push(eachValue);
	}
	return result;	
};

var InsertIntoTransaction = function(req, collection){
	var transactionQuery = "insert into transaction (customer_id,agent_id,receipt_id,paid_date,paid_amount) values(?,?,?,?,?)";
	var tranData = [
		collection["customer_id"],
		collection["agent_id"],
		collection["receipt_number"],
		collection["today"],
		collection["paid_amount"]
	];
	var transactionQueryResult = req.db.ExecuteQuerySynch(transactionQuery,tranData);
	req.logger.info({  Query : transactionQuery, Data : transactionQueryResult.rows, RouteFile : 'collections.js',
		Method :'InsertIntoTransaction',QueryData:tranData});
};

var GetTransactionId = function(req){
	// get the latest transaction id
	var getTransactionIdQuery = "select max(transaction_id) from transaction";
	var getTransactionIdQueryResult = req.db.ExecuteQuerySynch(getTransactionIdQuery,[]);
	req.logger.info({  Query : getTransactionIdQuery, Data : getTransactionIdQueryResult, RouteFile : 'collections.js',
		Method :'GetTransactionId',QueryData:[]});
	return getTransactionIdQueryResult.rows[0]['max(transaction_id)'];
};

var InsertIntoInstallmentPayment = function(req,data){
	var query = "insert into installment_payment values(?,?,?,?,?,?,?,?,?,?,?)";
	var result = req.db.ExecuteQuerySynch(query,data);
	req.logger.info({  Query : query, Data : result.rows, RouteFile : 'collections.js',
		Method :'InsertIntoInstallmentPayment',QueryData:data});
	return result.rows;
};

var UpdateDueEntry = function(data,req){
	var query = "update installment_payment set paid_modified_date=?,payment_status_flag=?,paid_amount=?,due_amount=? where customer_id=? and installment_number=?";
	var result = req.db.ExecuteQuerySynch(query,data);
	req.logger.info({  Query : query, Data : result.rows, RouteFile : 'collections.js',
		Method :'UpdateDueEntry',QueryData:data});
	return result.rows;
};

router.post('/DoCollection', function(req,res){
      wait.launchFiber(handleCollection, req, res);
});

var SaveBackDatedCollection = function(req,res){
	try {
		var collection = req.body;
		var isCollectionExists = IsCollectionExists(req, collection);
		if (isCollectionExists.IsExistsAlready) {
			res.status(404).send(isCollectionExists.Message);
			return;
		}
		var collectionDataToInsert = {
			customer_id: collection.CustomerId,
			agent_id: collection.AgentId,
			receipt_number: collection.ReceiptNumber,
			today: collection.PaidDate,
			paid_amount: collection.PaidAmount
		};

		InsertIntoTransaction(req, collectionDataToInsert);
		var transId = GetTransactionId(req);

		var installmentPaymentDataToInsert = [
			transId,
			collection.CustomerId,
			collection.AgentId,
			collection.ReceiptNumber,
			collection.PaidDate,
			collection.PaidDate,
			"FP",
			collection.PaidAmount,
			0,
			collection.PaidAmount,
			collection.InstallmentNumber
		];
		InsertIntoInstallmentPayment(req, installmentPaymentDataToInsert);
		res.send('Collection details saved successfully.');
	}
	catch(e){
		req.logger.error({Error: e, Stack: e.stack, Message: e.message});
		res.status(500).send('An unknown error has occurred.');
	}
};

var IsCollectionExists = function(req, data){
	var query = "select * from installment_payment where customer_id = ? and " +
		"(installment_number = ? or (YEAR(paid_date)=? and MONTH(paid_date)=?))";
	data['PaidDate'] = new Date(data['PaidDate']);
	var givenMonth = data['PaidDate'].getMonth() + 1;
	var givenYear = data['PaidDate'].getFullYear();
	var result = req.db.ExecuteQuerySynch(query,[data["CustomerId"],data["InstallmentNumber"],givenYear, givenMonth]);
	req.logger.info({  Query : query, Data : result.rows, RouteFile : 'collections.js',
		Method :'IsCollectionExists',QueryData:[data["CustomerId"],data["InstallmentNumber"],givenYear, givenMonth]});
	var record = {IsExistsAlready : false, Message :''};
	if(result.rows.length > 0){
		record.IsExistsAlready = true;
		if(data.CustomerId == result.rows[0].customer_id && data.InstallmentNumber == result.rows[0].installment_number){
			record.Message = "This member has already paid installment :" + data.InstallmentNumber + " on " + result.rows[0].paid_date.FormatDate('-');
		}
		else{
			record.Message = "This member has already paid an installment for the month: "+ result.rows[0].paid_date.FormatMonth('-');
		}
	}//Monkey@1214
	return record;
};

router.post('/SaveBackDatedCollection', function(req,res){
	wait.launchFiber(SaveBackDatedCollection, req, res); //handle in a fiber, keep node spinning
});


router.get('/test',function(req,res){
	wait.launchFiber(PrepareRangeList,req,res);
});

router.post('/audit', function(req,res){
	try {
		var audit = req.body;
		var x = new Date(audit['TransactionDate']);

		var year = x.getFullYear();

		var month = x.getMonth() + 1;

		var query;
		if (audit['agent_id'] == 0) {
			query = "select * from installment_payment ip, customer c  where YEAR(paid_date)=? and MONTH(paid_date)=? and ip.customer_id=c.id order by customer_id, agent_id";
		}
		else {
			query = "select * from installment_payment ip, customer c where   YEAR(paid_date)=? and MONTH(paid_date)=? and agent_id=? and ip.customer_id=c.id order by customer_id, agent_id";
		}

		var callback = function (err, rows, fields) {
			req.logger.info({
				Query: query, Data: rows, RouteFile: 'collections.js',
				Method: '/audit', QueryData: [year, month, audit['agent_id']]
			});
			if (err) {
				req.logger.error({Error: err, Message: err});
			}
			if (rows) {
				res.send(rows);
			}
			else {
				res.status(404).send("No transactions found.");
			}
		};
		req.db.ExecuteQueryWithData(query, [year, month, audit['agent_id']], callback);
	}
	catch(e){
		req.logger.error({Error: e, Stack: e.stack, Message: e.message});
		res.status(500).send('An unknown error has occurred.');
	}
});

router.get('/transHistory/:id',function(req,res){
	try {
		var query = "select * from installment_payment ip, customer c where customer_id = ? and c.id = ip.customer_id";
		var callback = function (err, rows, fields) {
			if (err) {
				req.logger.error({Error: err, Message: err});
				res.status(500).send(err);
			}
			req.logger.info({
				Query: query, Data: rows, RouteFile: 'collections.js',
				Method: '/transHistory/:id', QueryData: [req.params.id]
			});
			res.send(rows);
		}
		req.db.ExecuteQueryWithData(query, [req.params.id], callback);
	}
	catch(e){
		req.logger.error({Error: e, Stack: e.stack, Message: e.message});
		res.status(500).send('An unknown error has occurred.');
	}
});

router.get('/loadInstallmentDetails',function(req,res){
	wait.launchFiber(getInstallmentDetails, req, res); //handle in a fiber, keep node spinning
});
module.exports = router;