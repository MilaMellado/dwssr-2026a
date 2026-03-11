var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.render('author', {
    name: 'Camila Arellano',
    github: 'MilaMellado',

});

});

module.exports = router;
