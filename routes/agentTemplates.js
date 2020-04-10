var express = require('express');
var router = express.Router();

router.get('/CustomerAgentDetailsTemplate', function(req, res) {  
    res.sendFile(req.basepath + '/agent/CustomerAgentDetailsTemplate.html');
});

router.get('/AgentHomePageTemplate', function(req, res) {  
    res.sendFile(req.basepath + '/agent/AgentHomePageTemplate.html');
});

router.get('/showAgentCustomerDetailsModalTemplate', function(req, res) {  
    res.sendFile(req.basepath + '/agent/showAgentCustomerDetailsModalTemplate.html');
});

router.get('/editAgentCustomerDetailsModalTemplate', function(req, res) {  
    res.sendFile(req.basepath + '/agent/editAgentCustomerDetailsModalTemplate.html');
});

router.get('/Collections', function(req, res) {  
    res.sendFile(req.basepath + '/agent/Collections.html');
});

router.get('/changePassword', function(req, res) {  
    res.sendFile(req.basepath + '/agent/ChangePasswordTemplate.html');
});

router.get('/backDatedCollections', function(req, res) {
    res.sendFile(req.basepath + '/agent/BackDatedCollections.html');
});

module.exports = router;