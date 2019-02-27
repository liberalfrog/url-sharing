var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('account', {});
});

router.get('/followee', function(req, res, next) {
  res.render('account', {});
});

router.get('/follower', function(req, res, next) {
  res.render('account', {});
});

module.exports = router;
