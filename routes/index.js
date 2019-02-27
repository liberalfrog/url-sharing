var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/signup', function(req, res, next) {
  res.render('signup', {});
});

router.get('/home', function(req, res, next) { 
  res.render('home', {});
});

router.get('/folder', function(req, res, next) { 
  res.render('home', {});
});

router.get('/walkthrough', function(req, res, next) { 
  res.render('walkthrough', {});
});

module.exports = router;
