/**
 * Created by shreedhar on 4/21/2015.
 */
var express = require('express');
var wait = require('wait.for');
var router = express.Router();


var backup = function(){
    var self = this;
    this.takeBackup = function(req,res) {
        try {
            var database_tables = req.db.ExecuteQuerySynch("Show tables", []);
            var result = [];
            for (var index in database_tables.rows) {
                var table = database_tables.rows[index];
                var row = {};
                var tableInfo = self.getTableDefinition(req, table.Tables_in_rems);
                row.tableStructure = tableInfo.structure;
                row.data = tableInfo.data;
                row.tableName = table.Tables_in_rems;
                result.push(row);
            }
            var fs = require('fs');

            var text = "DROP DATABASE IF EXISTS REMS; \n\n CREATE DATABASE REMS; \n\n USE REMS; \n\n";
            for (var i in result) {
                var table = result[i];
                text += table.tableStructure;
            }

            for (var i in result) {
                text += self.getTableData(result[i].data, result[i].tableName);
            }

            var today = new Date().FormatDate('-');
            // Create a directory with today date.
            var mkdirp = require('mkdirp');
            mkdirp.sync('backups/' + today);

            var path = "backups/" + today + '/' + new Date().FormatDateWithTime('-') + ".sql";

            fs.writeFile(path, text, function (err) {
                if (err) {
                    console.log(err);
                    req.logger.error({Error:err, Message : err.message,stack: err.stack});
                } else {
                    console.log("The file was saved!");
                }
            });

            return {code:200, message:'backup has taken successfully.'};
        }
        catch(e){
            req.logger.error({Message : e.message,stack: e.stack, Error:e});
            return {code:500,
                message:'An error has occurred while taking database backup. try again. If you experience the problem again then contact administrator.'};
        }
    };

    this.getTableDefinition = function(req,tableName){
        var query = "show create table "+tableName;

        var result = req.db.ExecuteQuerySynch(query,[]);

        var up = '';
        for (var t in result.rows) {
            up += "DROP TABLE IF EXISTS " + result.rows[t].Table + "; \n\n";
            up += result.rows[t]["Create Table"] + "; \n\n";
        }

        var data = req.db.ExecuteQuerySynch("select * from "+tableName,[]);
        return {
            structure:up,
            data:data.rows
        };
    };

    this.getTableData = function(data,tableName){
        var result = 'LOCK TABLES '+ tableName +' WRITE; \n' +
            'INSERT INTO ' + tableName ;

        var properties = [];
        // Load table columns in properties array.
        for(var prop in data[0]){
            properties.push(prop);
        }

        result += '(';

        // Prepare TABLENAME(col1,col2,col3)
        for(var prop in properties){
            result += properties[prop];
            if(prop != properties.length-1)
                result += ',';
        }
        result += ') VALUES';

        // Prepare VALUES(val1,val2,val3)
        for(var outerIndex in data) {
            var row = data[outerIndex];
            result += '(';
            for (var index in properties) {
                result += self.getText(row[properties[index]]);

                if(index != properties.length-1)
                    result += ',';
            }
            result += ')';
            if(outerIndex != data.length-1) {
                result += ',';
            }
        }
        result += '; \n UNLOCK TABLES;\n\n';
        return result;
    };

    this.getText = function(data){
        switch(typeof data){
            case 'string':
                return "'"+data+"'";
                break;
            case 'object' :
                if(data instanceof Date){
                    return "'" + data.FormatDate('-')+ "'";
                }
                return data;
                break;
            case 'number':
                return data;
                break;
            default : return data ? data:null;
        }
    }
};

exports.backup = new backup();
