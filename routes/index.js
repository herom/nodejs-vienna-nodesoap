var express = require('express');
var router = express.Router();
var soapClient = require('../util/soap-client');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Welcome to the fabulous SOAP Dictionary!' });
});

//router.get('/definiton', function (req, res) {
//  var word = req.params('word');
//
//  if(word) {
//    soapClient.lookupDefinition(word).then(
//        function onLookupSuccess (definitions) {
//          res.render('definitions', {definitions: definitions});
//        },
//
//        function onLookupFailure (err) {
//          res.render('error', {error: err});
//        }
//    )
//  } else {
//    res.status(404).send();
//  }
//});

module.exports = router;
