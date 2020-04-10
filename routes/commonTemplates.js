var express = require('express');
var router = express.Router();

router.get('/header', function(req, res) {  
    res.sendFile(req.basepath + '/common/header.html');
});

router.get('/footer', function(req, res) {  
    res.sendFile(req.basepath + '/common/footer.html');
});

router.get('/audit', function(req, res) {  
    res.sendFile(req.basepath + '/common/AuditTemplate.html');
});

router.get('/showTransHistoryModalTemplate', function(req, res) {  
    res.sendFile(req.basepath + '/common/showTransHistoryModalTemplate.html');
});

router.get('/drawTemplate', function(req, res) {  
    res.sendFile(req.basepath + '/common/DrawTemplate.html');
});

router.get('/showDrawWinnerDetailsModalTemplate', function(req, res) {  
    res.sendFile(req.basepath + '/common/showDrawDetailsModalTemplate.html');
});

router.get('/customerBiodataModalTemplate', function(req, res) {
    res.sendFile(req.basepath + '/common/CustomerBiodata.html');
});

router.get('/logoutModalTemplate', function(req, res) {
    res.sendFile(req.basepath + '/common/logoutModel.html');
});

module.exports = router;