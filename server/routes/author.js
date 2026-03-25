//var express = require('express');
import express from 'express';
//var router = express.Router();
const router = express.Router();




router.get('/', function(req, res, next) {
  res.render('author', {
    name: 'Camila Arellano',
    github: 'MilaMellado',

});

});

//module.exports = router;
export default router;
