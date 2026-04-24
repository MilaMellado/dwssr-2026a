//var express = require('express');
import express from 'express';
const router = express.Router();

/* GET home page. */
// eslint-disable-next-line no-unused-vars
router.get('/', function(req, res, next) {
  res.render('index', {title: 'Proyecto Asombroso ✨'});

});

//module.exports = router;
export default router;