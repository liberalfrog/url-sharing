var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/test', function(req, res, next) {
  res.render('test', { title: 'Express' });
});

router.get('/feed', function(req, res, next) { 
  res.render('feed', {});
});

router.get('/folder', function(req, res, next) { 
  res.render('feed', {});
});

module.exports = router;
