var express = require('express');
var http    = require('http');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var fs      = require('fs');
var wait=require('wait.for');
var winston = require('winston');

var routes = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var agent = require('./routes/agent');
var admin = require('./routes/admin');
var common = require('./routes/common');
var agentTemplates = require('./routes/agentTemplates');
var commonTemplates = require('./routes/commonTemplates');
var adminTemplates = require('./routes/adminTemplates');
var collection      = require('./routes/collections');
var reports      = require('./routes/reports');
var expiryCheck = require('./routes/projectExpiryCheck');
var customerbiodata = require('./routes/customerBiodata');
var agentProfile = require('./routes/agentProfile');

var app = express();

app.engine('.html', require('ejs').__express);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// we are specifying the html directory as another public directory
app.use(express.static(path.join(__dirname, 'templates')));
app.use(express.static(path.join(__dirname, 'photos')));
app.use(express.static(path.join(__dirname, 'reports')));

var db = function(){
    this.ExecuteQuerySynch = function(query, data){
		var connection = this.CreateConnectionObject();
		var result = wait.forMethod(connection, "mysqlStandardCallback", query,data);
		connection.end();
		return result;
	};

    this.ExecuteQuery = function(query,callback)
    {
        var connection = this.CreateConnectionObject();
        connection.connect();
        connection.query(query, function(err, rows, fields){
            callback(err, rows, fields);
            connection.end();
            console.log('connection ended');
        });
    }

	this.ExecuteQueryWithData = function(query,data,callback)
    {
        var connection = this.CreateConnectionObject();
        connection.connect();
        connection.query(query,data, function(err, rows, fields){
            callback(err, rows, fields);
            connection.end();
            console.log('connection ended');
        });
    }

    this.CreateConnectionObject = function(multipleStatements)
    {
        var props = {
      host     : 'localhost',
      user     : '',
      password : '',
      database : 'REMS',
	  multipleStatements: multipleStatements ? true: false
    };
	var connection = mysql.createConnection(props);
	// connection.prototype = Object.prototype;
connection.mysqlStandardCallback = function(sql,data ,callback){
this.query(sql,data,function(err, rows, fields){
if(err){
	console.log(err);
}
   var data = {rows:rows, fields:fields, error:err};
   callback( err, data);
});
};
    return connection;
    }
 this.ExecuteUpdate = function(query,data,callback)
    {
        var connection = this.CreateConnectionObject();
        connection.connect();
        connection.query(query, data, function(err, rows, fields){
            callback(err, rows, fields);
            connection.end();
            console.log('connection ended');
        });
    }
	};


var formatmonth = function(delimiter, value){
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var date = value;
    return months[date.getMonth()] + delimiter + date.getFullYear();
};
var formatdate = function(delimiter , value){
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var date = typeof value == 'Date' ? value : new Date(value);
    return date.getDate() + delimiter + months[date.getMonth()] + delimiter + date.getFullYear();
};

var formatdatewithtime = function(delimiter , value){
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var date = typeof value == 'Date' ? value : new Date(value);
    return date.getDate() + delimiter + months[date.getMonth()] + delimiter + date.getFullYear()
        + delimiter + date.getHours()+ delimiter + date.getMinutes() + delimiter + date.getSeconds();
};

Date.prototype.FormatDateWithTime = function(delimiter){
    return formatdatewithtime(delimiter, this);
};

String.prototype.FormatDateWithTime = function(delimiter){
    return formatdatewithtime(delimiter, this);
};

Date.prototype.FormatDate = function(delimiter){
    return formatdate(delimiter, this);
};

String.prototype.FormatDate = function(delimiter){
    return formatdate(delimiter, this);
};

Date.prototype.FormatMonth = function(delimiter){
    return formatmonth(delimiter,this);
};

String.prototype.FormatMonth = function(delimiter){
    return formatmonth(delimiter,this);
};
String.prototype.ToRupee = function(symbol){
    return (symbol + this.toString() );
};

Number.prototype.ToRupee = function(symbol){
    return (symbol + this.toString() );
};

var logs = path.join(__dirname, 'logs');
var winstonLogger = new (winston.Logger)({
    transports: [
        new (winston.transports.File)({
            name: 'sql-file',
            filename: logs  +'\\sqllogs\\'+new Date().FormatDate('-') +'.log',
            level: 'info'
        }),
        new (winston.transports.File)({
            name: 'error-file',
            filename: logs +'\\errorlogs\\'+new Date().FormatDate('-') +'.log',
            level: 'error'
        }),
        new (winston.transports.File)({
            name: 'warn-file',
            filename: logs +'\\infologs\\'+new Date().FormatDate('-') +'.log',
            level: 'warn'
        })
    ]
});

winston.handleExceptions(new winston.transports.File({ filename: logs + '\\unhandledexceptions\\' + new Date().FormatDate('-') + '.log' }))

var logger = function(){
    this.info = function(log){
        //winston.log('info',log);
        winstonLogger.log('info',log);
    };

    this.error = function(error){
        //winston.log('error',error);
        winstonLogger.log('error',error);
    };

    this.warning = function(warning){
        // console.log('sql',sql);
        winstonLogger.log('warn',warning);
    };
};

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = new db();
	req.logger = new logger();
    req.basepath = path.join(__dirname, 'templates');
	req.filebasepath = 	path.join(__dirname, 'photos');
    req.reportsBasePath = path.join(__dirname,'reports');
    next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/', login);
app.use('/agent', agent);
app.use('/admin', admin);
app.use('/common', common);
app.use('/',agentTemplates);
app.use('/',commonTemplates);
app.use('/',adminTemplates);
app.use('/collection',collection);
app.use('/reports',reports);
app.use('/expiryCheck',expiryCheck);
app.use('/customer',customerbiodata);
app.use('/agent',agentProfile);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        console.log(err.stack);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;

app.listen(2000);
console.log('server started listening at 2000');
