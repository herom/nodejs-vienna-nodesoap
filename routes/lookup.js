var express = require('express');
var router = express.Router();
var soapClient = require('../util/soap-client');

router.get('/word', function (req, res) {
  var word = req.param('word');

  if(word) {
    soapClient.lookupDefinition(word).then(
        function onLookupSuccess (definitions) {
          res.render('definitions', {
            word: word,
            defCount: definitions.length,
            definitions: definitions
          });
        },

        function onLookupFailure (err) {
          res.render('error', {error: err});
        }
    )
  } else {
    res.status(404).send();
  }
});

router.get('/dictionaries', function (req, res) {
  soapClient.lookupDictionaries().then(
      function onLookupSuccesss (dictionaries) {
        res.render('dictionaries', {
          dictionaries: dictionaries
        });
      },

      function onLookupFailure (err) {
        res.render('error', {error: err});
      }
  )
});

router.get('/serverinfo', function (req, res) {
  soapClient.lookupServerInfo().then(
      function onLookupSuccess (serverInfo) {
        res.render('serverinfo', {info: serverInfo});
      },

      function onLookupFailure (err) {
        res.render('error', {error: err});
      }
  )
});

module.exports = router;
