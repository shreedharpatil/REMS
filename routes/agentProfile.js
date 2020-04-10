/**
 * Created by shreedhar on 3/15/2015.
 */
var express = require('express');
var wait = require('wait.for');
var router = express.Router();


router.get('/profile/:id',function(req,res){
    wait.launchFiber(GetAgentProfile, req,res);
});

var GetAgentProfile = function(req,res){
    var agentId = req.params.id;
    var agentSummary = GetAgentSummary(req,agentId);
    var customers = GetCustomers(req,agentId);
    var result = {
        agentSummary : agentSummary,
        customers : customers
    };

    res.send(result);
};

var GetAgentSummary = function(req,agentId){
    var query = "select sum(total_installment_amount) total_installment_amount, sum(paid_amount) total_paid_amount, sum(due_amount) total_due_amount "
    + " from installment_payment where agent_id = ?";
    var result = req.db.ExecuteQuerySynch(query,[agentId]);
    req.logger.info({  Query : query, Data : result.rows, RouteFile : 'agentProfile.js', Method :'GetAgentSummary',QueryData:[agentId]});
    return result.rows[0];
};

var GetCustomers = function(req,agentId){
    var query = "select c.id, c.name ,c.contact_number,c.address, c.image_url "+
        "from customer c ,customer_agent_mapping ca where ca.customer_id=c.id and ca.agent_id= ? order by c.id";
    var result = req.db.ExecuteQuerySynch(query,[agentId]);
    req.logger.info({  Query : query, Data : result.rows, RouteFile : 'agentProfile.js', Method :'GetCustomers',QueryData:[agentId]});
    return result.rows;
};

module.exports = router;