var express = require('express');
var router = express.Router();

router.get('/RegisterAgentTemplate', function(req, res) { 	
    res.sendFile(req.basepath + '/admin/registerAgent.html');
});

router.get('/AdminHomePageTemplate', function(req, res) {  
    res.sendFile(req.basepath + '/admin/AdminHomePageTemplate.html');
});

router.get('/GetAllCustomerDetailsTemplate', function(req, res) {  
    res.sendFile(req.basepath + '/admin/getAllCustomersTemplate.html');
});

router.get('/GetAllAgentDetailsTemplate', function(req, res) {  
    res.sendFile(req.basepath + '/admin/getAllAgentDetailsTemplate.html');
});

router.get('/showCustomerDetailsModalTemplate', function(req, res) {  
    res.sendFile(req.basepath + '/admin/showCustomerDetailsModalTemplate.html');
});

router.get('/showAgentDetailsModalTemplate', function(req, res) {  
    res.sendFile(req.basepath + '/admin/showAgentDetailsModalTemplate.html');
});

router.get('/editCustomerDetailsModalTemplate', function(req, res) {  
    res.sendFile(req.basepath + '/admin/editCustomerDetailsModalTemplate.html');
});

router.get('/editAgentDetailsModalTemplate', function(req, res) {  
    res.sendFile(req.basepath + '/admin/editAgentDetailsModalTemplate.html');
});

router.get('/registerCustomerDetailsTemplate', function(req, res) {  
    res.sendFile(req.basepath + '/common/registerCustomerDetailsTemplate.html');
});

router.get('/commonModalTemplate', function(req, res) {  
    res.sendFile(req.basepath + '/common/CommonModalTemplate.html');
});

router.get('/plotLayout', function(req, res) {  
    res.sendFile(req.basepath + '/admin/plotLayout.html');
});

router.get('/confirmPlotLayout', function(req, res) {  
    res.sendFile(req.basepath + '/admin/ConfirmPlotLayout.html');
});

router.get('/resetPasswordAgent', function(req, res) {  
    res.sendFile(req.basepath + '/admin/ResetPasswordAgentTemplate.html');
});

router.get('/changeAdminPassword', function(req, res) {  
    res.sendFile(req.basepath + '/admin/changeAdminPasswordTemplate.html');
});

router.get('/agentProfile', function(req, res) {
    res.sendFile(req.basepath + '/admin/agentProfile.html');
});
module.exports = router;