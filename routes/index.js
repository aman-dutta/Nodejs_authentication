var express = require('express'),
    router = require.Router();

router.get('/',function(req,res){
    res.render('index', {title:'Express'});
});

module.exports = router;