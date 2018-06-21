var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('landing', {title: 'CYON Regina-Mundi'});
});

module.exports = router;