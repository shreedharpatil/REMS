/**
 * Created by shreedhar on 2/1/2015.
 */

var express = require('express');
var wait = require('wait.for');
var router = express.Router();
var _ = require('underscore-node');

router.get('/test',function(req,res){
    wait.launchFiber(getPlotLayoutDetails,req,res);
});

var expiryCheck = function(req,res){
    wait.launchFiber(getPlotLayoutDetails,req,res);
};

var getPlotLayoutDetails = function(req,res){
  var query = "select * from plot_layout";
    var result = req.db.ExecuteQuerySynch(query,[]);
    var applicationStartDate = new Date();
    var totalNumberOfMonth = result.rows[0].number_of_installments;
    var finalValue = [];
    var index = 1;
    for(var i=0 ; i< (totalNumberOfMonth/12);i++){
        var eachRecord = {};
        eachRecord.StartDate = applicationStartDate;
        eachRecord.EndDate = new Date(eachRecord.StartDate.getFullYear()+1,eachRecord.StartDate.getMonth(),eachRecord.StartDate.getDate()-1);
        eachRecord.RenewalDate = new Date(eachRecord.EndDate.getFullYear(),eachRecord.EndDate.getMonth(),eachRecord.EndDate.getDate()+1);
        eachRecord.IsExpired = false;
        eachRecord.IsWarned = false;
        eachRecord.IsRenewed = false;
        eachRecord.Index = index;
        finalValue.push(eachRecord);
        applicationStartDate = eachRecord.RenewalDate;
        index += 1;
    }
    var eachRecord = {};
    eachRecord.StartDate = applicationStartDate;
    eachRecord.EndDate = new Date(eachRecord.StartDate.getFullYear(),eachRecord.StartDate.getMonth()+totalNumberOfMonth%12,eachRecord.StartDate.getDate());
    eachRecord.RenewalDate = '';
    eachRecord.IsExpired = false;
    eachRecord.IsWarned = false;
    eachRecord.IsRenewed = false;
    finalValue.push(eachRecord);

    // give today date and find out its details
    var currentRecord = GetTodayDateRange(finalValue,new Date());
    var today = new Date();
    if(currentRecord.IsRenewed){
        if(today == currentRecord.RenewalDate){
            res.send({IsExpired : false, IsWarned : false});
        }
        else{
            res.send({IsExpired : true, IsWarned: true , Message :'You have changed your system date. Please set it to current date.'});
        }
    }

    if(currentRecord.IsExpired){
        res.send({IsExpired : true, IsWarned: true , Message :'Your application has expired. Try renewing it.'});
    }

    if(currentRecord.IsWarned){
        if(today >= currentRecord.RenewalDate){
            // update is expired = true for current record.
        }
    }

    var warningPeriodStartDate = new Date(currentRecord.EndDate.getFullYear(),currentRecord.EndDate.getMonth()-1,currentRecord.EndDate.getDate());
    if(today >= warningPeriodStartDate && today<= currentRecord.EndDate){
        // update is warned to true for current record.
    }

    var agents = GetAllAgents(req);
    var minInstallmentNumbers = [];
    _.each(agents,function(agent){
        var installmentNumber = GetMinInstallmentNumber(req,agent.id);
        minInstallmentNumbers.push(installmentNumber[0].installmentNumber ? installmentNumber[0].installmentNumber : 0);
    });
    var currentInstallmentNumber = _.min(minInstallmentNumbers);
    var currentRecordMaxInstallmentNumber = currentRecord.Index * 12;
    if(currentInstallmentNumber == currentRecordMaxInstallmentNumber){
        res.send({IsExpired : false, IsWarned : true});
        return;
    }

    if(currentInstallmentNumber > currentRecordMaxInstallmentNumber){
        // update is expired to true for current record.
    }
    res.send(minInstallmentNumbers);
};

var GetTodayDateRange = function(list, date){
    var result = _.find(list,function(range){
        return date >= range.StartDate && date <= range.EndDate;
    });
    return result;
};

var GetAllAgents = function(req){
    var query = "select id from agent";
    var result = req.db.ExecuteQuerySynch(query,[]);
    return result.rows;
};

var GetMinInstallmentNumber = function(req,id){
    var query = 'select min(installment_number) as installmentNumber from installment_payment where agent_id = ?';
    var result = req.db.ExecuteQuerySynch(query,[id]);
    return result.rows;
};

module.exports = router;