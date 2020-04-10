/**
 * Created by shreedhar on 3/14/2015.
 */
var express = require('express');
var mysql = require('mysql');
var path    = require('path');
var fs      = require('fs');
var wait = require('wait.for');
var router = express.Router();

router.get('/biodata/:id', function(req,res){
    wait.launchFiber(GetCustomerBioDetails, req, res);
});

var GetCustomerBioDetails = function(req,res){
    try {
        var customerId = req.params.id;

        var agentDetails = GetAgentDetails(req, customerId);

        var historyDetails = GetTransactionHistoryDetails(req, customerId, agentDetails.id);

        var result = {
            agentDetails: agentDetails,
            transDetails: historyDetails
        };
        res.send(result);
    }catch (e){
        req.logger.error({Error : e, stack: e.stack, Message:"This customer has no matching agent."});
        res.status(500).send("This customer has no matching agent.")
    }
};

var GetAgentDetails = function(req, customerId){
    var agentId = GetAgentId(req,customerId);
    var query = "select * from agent where id = ?";
    var result = req.db.ExecuteQuerySynch(query,[agentId]);
    req.logger.info({  Query : query, Data : result.rows, RouteFile : 'customerBiodata.js', Method :'GetAgentDetails',QueryData:[agentId]});

    return result.rows[0];
};

var GetAgentId = function(req,customerId){
    var query = "select * from customer_agent_mapping where customer_id = ?";
    var result = req.db.ExecuteQuerySynch(query,[customerId]);
    req.logger.info({  Query : query, Data : result.rows, RouteFile : 'customerBiodata.js', Method :'GetAgentId',QueryData:[customerId]});
    try {
        return result.rows[0].agent_id;
    }
    catch (e){
        return null;
    }
};

var GetTransactionHistoryDetails = function(req,customerId, agentId){
    var query = "select * from installment_payment where customer_id = ? and agent_id = ? order by installment_number";
    var result = req.db.ExecuteQuerySynch(query,[customerId,agentId]);
    req.logger.info({  Query : query, Data : result.rows, RouteFile : 'customerBiodata.js', Method :'GetTransactionHistoryDetails',QueryData:[customerId,agentId]});
    return result.rows;
};

module.exports = router;