var express = require('express');
var _ = require('underscore-node');
var path    = require('path');
var wait = require('wait.for');
var fs      = require('fs');
var router = express.Router();
router.get('/generate3/:id',function(req,res){
	transHistory(req, res);
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

var generatePdf = function(req,res,rows){

	var data = {
					details : rows,
					history:{
								TotalPaidAmount:0,
								TotalDueAmount:0,
								TotalInstallmentAmount:0
							}
			};

	data.history.TotalInstallments = data.details.length;
	_.each(data.details,function(trans){
		data.history.TotalPaidAmount += parseFloat(trans.paid_amount);
		data.history.TotalDueAmount += parseFloat(trans.due_amount);
		data.history.TotalInstallmentAmount += parseFloat(trans.total_installment_amount);
	});

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
		console.log(index);
		var transaction = data.details[index];
		if(typeof transaction == "object"){
			console.log(transaction);
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
		//var PdfPrinter = require('pdfmake/src/printer');
		//var printer = new PdfPrinter(getFonts());
		var printer = getPrinter();
		var outputFileDirectory = path.join(__dirname, '../reports');
		var outputFilePath = data.details[0].name + '.pdf';
		req.filename = outputFileDirectory + '\\' + outputFilePath;
		//var pdfDoc = printer.createPdfKitDocument(contents);
		//pdfDoc.pipe(fs.createWriteStream(outputFileDirectory + '/' + outputFilePath));
		//pdfDoc.end();
		createPdf(printer, req.filename, contents);
		//res.setHeader('Content-disposition', 'attachment;filename='+ path.basename(res.filename) );
		//res.setHeader('Content-type', 'application/pdf');
		//var filestream = fs.createReadStream(res.filename);
		//filestream.pipe(res);
		//res.sendFile(res.filename);
		res.send(outputFilePath);
	}
	catch(e){
		res.status(404).send(e);
		return;
	}
};

router.get('/abc/:filename',function(req,res){
	var outputFileDirectory = path.join(__dirname, '../reports');
	//res.sendFile(outputFileDirectory+ '/' +req.params.filename);
	res.setHeader('Content-disposition', 'attachment;filename='+ (req.params.filename) );
	res.setHeader('Content-type', 'application/pdf');
	var filestream = fs.createReadStream(outputFileDirectory+ '/' +req.params.filename);
	filestream.pipe(res);
});

var transHistory = function(req,res){
	var query = "select * from installment_payment ip, customer c where customer_id = ? and c.id = ip.customer_id";
	var callback = function(err,rows, fields){
		if(err){
			console.log(err);
			res.status(500).send(err);
		}
		// res.send(rows);
		generatePdf(req,res,rows);
	}
	req.db.ExecuteQueryWithData(query, [req.params.id],callback);
};

router.get('/generate2',function(req,res){
	var fonts = {
	Roboto: {
		normal: 'node_modules/pdfmake/fonts/Roboto-Regular.ttf',
		bold: 'node_modules/pdfmake/fonts/Roboto-Medium.ttf',
		italics: 'node_modules/pdfmake/fonts/Roboto-Italic.ttf',
		bolditalics: 'node_modules/pdfmake/fonts/Roboto-Italic.ttf'
	}
};

var PdfPrinter = require('pdfmake/src/printer');
var printer = new PdfPrinter(fonts);
var fs = require('fs');

var xx = {
		 content : [{ text: 'but you can provide a custom styler as well', margin: [0, 20, 0, 8] },
                {
						style: 'tableExample',
						table: {
								headerRows: 1,
								body: [
										[{ text: 'Header 1', style: 'tableHeader' }, { text: 'Header 2', style: 'tableHeader'}, { text: 'Header 3', style: 'tableHeader' }],
										[ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
										[ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
										[ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
										[ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
										[ 'Sample value 1', 'Sample value 2', 'Sample value 3' ]
								]
						}
				}
				]
};

var docDefinition = {
	content: [
				{ text: 'Tables', style: 'header' },
				'Official documentation is in progress, this document is just a glimpse of what is possible with pdfmake and its layout engine.',
				{ text: 'A simple table (no headers, no width specified, no spans, no styling)', style: 'subheader' },
				'The following table has nothing more than a body array',
				{
						style: 'tableExample',
						table: {
								body: [
										['Column 1', 'Column 2', 'Column 3'],
										['One value goes here', 'Another one here', 'OK?']
								]
						}
				},
				{ text: 'A simple table with nested elements', style: 'subheader' },
				'It is of course possible to nest any other type of nodes available in pdfmake inside table cells',
				{
						style: 'tableExample',
						table: {
								body: [
										['Column 1', 'Column 2', 'Column 3'],
										[
												{
														stack: [
																'Let\'s try an unordered list',
																{
																		ul: [
																				'item 1',
																				'item 2'
																		]
																}
														]
												},
												/* a nested table will appear here as soon as I fix a bug */
												[
													'or a nested table',
													{
														table: {
															body: [
																[ 'Col1', 'Col2', 'Col3'],
																[ '1', '2', '3'],
																[ '1', '2', '3']
															]
														}
													}
												],
												{ text: [
														'Inlines can be ',
														{ text: 'styled\n', italics: true },
														{ text: 'easily as everywhere else', fontSize: 10 } ]
												}
										]
								]
						}
				},
				{ text: 'Defining column widths', style: 'subheader' },
				'Tables support the same width definitions as standard columns:',
				{
						bold: true,
						ul: [
								'auto',
								'star',
								'fixed value'
						]
				},
				{
						style: 'tableExample',
						table: {
								widths: [100, '*', 200, '*'],
								body: [
										[ 'width=100', 'star-sized', 'width=200', 'star-sized'],
										[ 'fixed-width cells have exactly the specified width', { text: 'nothing interesting here', italics: true, color: 'gray' }, { text: 'nothing interesting here', italics: true, color: 'gray' }, { text: 'nothing interesting here', italics: true, color: 'gray' }]
								]
						}
				},
				{ text: 'Headers', style: 'subheader' },
				'You can declare how many rows should be treated as a header. Headers are automatically repeated on the following pages',
				{ text: [ 'It is also possible to set keepWithHeaderRows to make sure there will be no page-break between the header and these rows. Take a look at the document-definition and play with it. If you set it to one, the following table will automatically start on the next page, since there\'s not enough space for the first row to be rendered here' ], color: 'gray', italics: true },
				{
						style: 'tableExample',
						table: {
								headerRows: 1,
								// dontBreakRows: true,
								// keepWithHeaderRows: 1,
								body: [
										[{ text: 'Header 1', style: 'tableHeader' }, { text: 'Header 2', style: 'tableHeader' }, { text: 'Header 3', style: 'tableHeader' }],
										[
												'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
										]
								]
						}
				},
				{ text: 'Column/row spans', style: 'subheader' },
				'Each cell-element can set a rowSpan or colSpan',
				{
						style: 'tableExample',
						color: '#444',
						table: {
								widths: [ 200, 'auto', 'auto' ],
								headerRows: 2,
								// keepWithHeaderRows: 1,
								body: [
										[{ text: 'Header with Colspan = 2', style: 'tableHeader', colSpan: 2, alignment: 'center' }, {}, { text: 'Header 3', style: 'tableHeader', alignment: 'center' }],
										[{ text: 'Header 1', style: 'tableHeader', alignment: 'center' }, { text: 'Header 2', style: 'tableHeader', alignment: 'center' }, { text: 'Header 3', style: 'tableHeader', alignment: 'center' }],
										[ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
										[ { rowSpan: 3, text: 'rowSpan set to 3\nLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor' }, 'Sample value 2', 'Sample value 3' ],
										[ '', 'Sample value 2', 'Sample value 3' ],
										[ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
										[ 'Sample value 1', { colSpan: 2, rowSpan: 2, text: 'Both:\nrowSpan and colSpan\ncan be defined at the same time' }, '' ],
										[ 'Sample value 1', '', '' ],
								]
						}
				},
				{ text: 'Styling tables', style: 'subheader' },
				'You can provide a custom styler for the table. Currently it supports:',
				{
						ul: [
								'line widths',
								'line colors',
								'cell paddings',
						]
				},
				'with more options coming soon...\n\npdfmake currently has a few predefined styles (see them on the next page)',
				{ text: 'noBorders:', fontSize: 14, bold: true, pageBreak: 'before', margin: [0, 0, 0, 8] },
				{
						style: 'tableExample',
						table: {
								headerRows: 1,
								body: [
										[{ text: 'Header 1', style: 'tableHeader' }, { text: 'Header 2', style: 'tableHeader'}, { text: 'Header 3', style: 'tableHeader' }],
										[ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
										[ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
										[ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
										[ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
										[ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
								]
						},
						layout: 'noBorders'
				},
				{ text: 'headerLineOnly:', fontSize: 14, bold: true, margin: [0, 20, 0, 8] },
				{
						style: 'tableExample',
						table: {
								headerRows: 1,
								body: [
										[{ text: 'Header 1', style: 'tableHeader' }, { text: 'Header 2', style: 'tableHeader'}, { text: 'Header 3', style: 'tableHeader' }],
										[ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
										[ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
										[ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
										[ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
										[ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
								]
						},
						layout: 'headerLineOnly'
				},
				{ text: 'lightHorizontalLines:', fontSize: 14, bold: true, margin: [0, 20, 0, 8] },
				{
						style: 'tableExample',
						table: {
								headerRows: 1,
								body: [
										[{ text: 'Header 1', style: 'tableHeader' }, { text: 'Header 2', style: 'tableHeader'}, { text: 'Header 3', style: 'tableHeader' }],
										[ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
										[ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
										[ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
										[ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
										[ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
								]
						},
						layout: 'lightHorizontalLines'
				},
                { text: 'but you can provide a custom styler as well', margin: [0, 20, 0, 8] },
                {
						style: 'tableExample',
						table: {
								headerRows: 1,
								body: [
										[{ text: 'Header 1', style: 'tableHeader' }, { text: 'Header 2', style: 'tableHeader'}, { text: 'Header 3', style: 'tableHeader' }],
										[ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
										[ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
										[ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
										[ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
										[ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
								]
						},
						layout: {
                            hLineWidth: function(i, node) {
                                return (i === 0 || i === node.table.body.length) ? 2 : 1;
                            },
                            vLineWidth: function(i, node) {
                                return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                            },
                            hLineColor: function(i, node) {
                                return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
                            },
                            vLineColor: function(i, node) {
                                return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
                            }
                            // paddingLeft: function(i, node) { return 4; },
                            // paddingRight: function(i, node) { return 4; },
                            // paddingTop: function(i, node) { return 2; },
                            // paddingBottom: function(i, node) { return 2; }
						}
				}
	],
	styles: {
		header: {
			fontSize: 18,
			bold: true,
			margin: [0, 0, 0, 10]
		},
		subheader: {
			fontSize: 16,
			bold: true,
			margin: [0, 10, 0, 5]
		},
		tableExample: {
			margin: [0, 5, 0, 15]
		},
		tableHeader: {
			bold: true,
			fontSize: 13,
			color: 'black'
		}
	},
	defaultStyle: {
		// alignment: 'justify'
	}
};

var pdfDoc = printer.createPdfKitDocument(xx);
pdfDoc.pipe(fs.createWriteStream('tables1.pdf'));
pdfDoc.end();
//res.send('done')
});

Date.prototype.FormatDate = function(delimiter){
	var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	var date = this;
	return date.getDate() + delimiter + months[date.getMonth()] + delimiter + date.getFullYear();
};

String.prototype.FormatDate = function(delimiter){
	var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	var date = new Date(this);
	return date.getDate() + delimiter + months[date.getMonth()] + delimiter + date.getFullYear();
};

String.prototype.ToRupee = function(symbol){
	return (symbol + this.toString() );
};

Number.prototype.ToRupee = function(symbol){
	return (symbol + this.toString() );
};

module.exports = router;