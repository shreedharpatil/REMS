var express = require('express');
var _ = require('underscore-node');
var path    = require('path');
var wait = require('wait.for');
var fs      = require('fs');
var router = express.Router();

router.post('/generateTransHistoryPdf',function(req,res){
	generateTransHistoryPdf(req,res);
});

router.post('/generateAuditPdf',function(req,res){
	generateAuditPdf(req,res);
});

var getFonts = function(){
	var fonts = {
		Roboto: {
			normal: 'node_modules/pdfmake/fonts/Roboto-Regular.ttf',
			bold: 'node_modules/pdfmake/fonts/Roboto-Medium.ttf',
			italics: 'node_modules/pdfmake/fonts/Roboto-Italic.ttf',
			bolditalics: 'node_modules/pdfmake/fonts/Roboto-Italic.ttf'
		}
	};
	return fonts;
};

var getPrinter = function(){
	var PdfPrinter = require('pdfmake/src/printer');
	return new PdfPrinter(getFonts());
};

var createPdf = function(printer, filename, contents){
	var pdfDoc = printer.createPdfKitDocument(contents);
	pdfDoc.pipe(fs.createWriteStream(filename));
	pdfDoc.end();
};

var generateTransHistoryPdf = function(req,res){
	var data = req.body;

	var tabbody = 	[
						[
							{ text: 'Installment No.',bold: true, style: 'tableHeader' }, 
							{ text: 'Paid Amt.', bold: true,style: 'tableHeader'}, 
							{ text: 'Due Amt.',bold: true, style: 'tableHeader' },
							{ text: 'Installment Amt.',bold: true, style: 'tableHeader' },
							{ text: 'Paid Date',bold: true, style: 'tableHeader'}, 
							{ text: 'Agent Id',bold: true, style: 'tableHeader' },
							{ text: 'Status',bold: true, style: 'tableHeader' }
						]										
					];

	for(var index =0;index < data.details.length; index++){
		var transaction = data.details[index];
		if(typeof transaction == "object"){
		tabbody.push([
						transaction.installment_number.toString(),
						transaction.paid_amount.ToRupee('Rs '),
						transaction.due_amount.ToRupee('Rs '),
						transaction.total_installment_amount.ToRupee('Rs '),
						transaction.paid_date.FormatDate('/'),
						transaction.agent_id.toString(),
						transaction.payment_status_flag
					  ]
					);
		}
		
	}
	
	var information = { text:'\nNote: FP: Full Paid, PP: Partial Paid, UP: unpaid ', bold: true};
	
	var contents = {
		 content :  [
						{ 
							text: 'Transaction History Summary', bold: true , margin: [0, 20, 0, 8] 
						},
						{
							style: 'tableExample',
							table: {
									headerRows: 1,
									body: [
											[
												{ text: 'Number of Installments', bold: true, style: 'tableHeader' }, 
												{ text: 'Total Paid Amount',bold: true, style: 'tableHeader'},
												{ text: 'Total Due Amount',bold: true, style: 'tableHeader' },
												{ text: 'Total Installment Amount.',bold: true, style: 'tableHeader' }
											],
											[ 
												data.details.length.toString(), 
												data.history.TotalPaidAmount.ToRupee('Rs '), 
												data.history.TotalDueAmount.ToRupee('Rs '),
												data.history.TotalInstallmentAmount.ToRupee('Rs ') 
											]										
									]
							}
						},
						{ 
							text: 'Transaction History Details',bold: true, style:'header' ,margin: [0, 20, 0, 8] 
						},
						{ 
							text: 'Membership No.: '+ data.details[0].customer_id+' Member Name: '+data.details[0].name, margin: [0, 20, 0, 8] 
						},
						{
							style: 'tableExample',
							table: {
										headerRows: 1,
										body: tabbody
									}
						},
						information
					]
};

	try {
		var printer = getPrinter();
		var outputFileDirectory = path.join(__dirname, '../reports');
		var outputFilePath = data.details[0].name + '.pdf';
		req.filename = outputFileDirectory + '\\' + outputFilePath;
		createPdf(printer, req.filename, contents);
		res.send(outputFilePath);
	}
	catch(e){
		req.logger.error({Error: e, Stack: e.stack, Message: e.message});
		res.status(500).send('An unknown error has occurred.');
		return;
	}
};

var generateAuditPdf = function(req, res){
	try {
		var data = req.body;
		var tabbody = [
			[
				{text: 'Membership No.', bold: true, style: 'tableHeader'},
				{text: 'Member Name', bold: true, style: 'tableHeader'},
				{text: 'Installment No.', bold: true, style: 'tableHeader'},
				{text: 'Paid Amt.', bold: true, style: 'tableHeader'},
				{text: 'Due Amt.', bold: true, style: 'tableHeader'},
				{text: 'Installment Amt.', bold: true, style: 'tableHeader'},
				{text: 'Agent Id', bold: true, style: 'tableHeader'},
				{text: 'Status', bold: true, style: 'tableHeader'}
			]
		];

		for (var index = 0; index < data.details.length; index++) {
			var transaction = data.details[index];
			if (typeof transaction == "object") {
				tabbody.push([
						transaction.id.toString(),
						transaction.name,
						transaction.installment_number.toString(),
						transaction.paid_amount.ToRupee('Rs '),
						transaction.due_amount.ToRupee('Rs '),
						transaction.total_installment_amount.ToRupee('Rs '),
						transaction.agent_id.toString(),
						transaction.payment_status_flag
					]
				);
			}

		}

		var information = {text: '\nNote: FP: Full Paid, PP: Partial Paid, UP: unpaid ', bold: true};

		var contents = {
			content: [
				{
					text: 'Audit Summary', bold: true, margin: [0, 20, 0, 8]
				},
				{
					style: 'tableExample',
					table: {
						headerRows: 1,
						body: [
							[
								{text: 'Audit Month', bold: true, style: 'tableHeader'},
								{text: 'Total Number of Cust.', bold: true, style: 'tableHeader'},
								{text: 'Total Paid Amount', bold: true, style: 'tableHeader'},
								{text: 'Total Due Amount', bold: true, style: 'tableHeader'},
								{text: 'Total Installment Amount.', bold: true, style: 'tableHeader'}
							],
							[
								data.history.PaidDate.FormatDate('/'),
								data.details.length.toString(),
								data.history.TotalPaidAmount.ToRupee('Rs '),
								data.history.TotalDueAmount.ToRupee('Rs '),
								data.history.TotalInstallmentAmount.ToRupee('Rs ')
							]
						]
					}
				},
				{
					text: 'Audit Details', bold: true, style: 'header', margin: [0, 20, 0, 8]
				},
				{
					style: 'tableExample',
					table: {
						headerRows: 1,
						body: tabbody
					}
				},
				information
			]
		};


		var printer1 = getPrinter();
		var outputFileDirectory = path.join(__dirname, '../reports');
		var outputFilePath = 'Audit_' + data.history.PaidDate.FormatDate('_') + '.pdf';
		req.filename = outputFileDirectory + '\\' + outputFilePath;
		createPdf(printer1, req.filename, contents);
		res.send(outputFilePath);
	}
	catch(e){
		req.logger.error({Error: e, Stack: e.stack, Message: e.message});
		res.status(500).send('An unknown error has occurred.');
	}
};

router.get('/downloadPdf/:filename',function(req,res){
	try {
		var outputFileDirectory = path.join(__dirname, '../reports');
		//res.sendFile(outputFileDirectory+ '/' +req.params.filename);
		res.setHeader('Content-disposition', 'attachment;filename=' + (req.params.filename));
		res.setHeader('Content-type', 'application/pdf');
		var filestream = fs.createReadStream(outputFileDirectory + '/' + req.params.filename);
		filestream.pipe(res);
	}
	catch(e){
		req.logger.error({Error: e, Stack: e.stack, Message: e.message});
		res.status(500).send('An unknown error has occurred.');
	}
});

router.get('/downloadAuditPdf/:filename',function(req,res){
	try {
		var outputFileDirectory = path.join(__dirname, '../reports');
		//res.sendFile(outputFileDirectory+ '/' +req.params.filename);
		res.setHeader('Content-disposition', 'attachment;filename=' + (req.params.filename));
		res.setHeader('Content-type', 'application/pdf');
		var filestream = fs.createReadStream(outputFileDirectory + '/' + req.params.filename);
		filestream.pipe(res);
	}
	catch(e){
		req.logger.error({Error: e, Stack: e.stack, Message: e.message});
		res.status(500).send('An unknown error has occurred.');
	}
});

module.exports = router;