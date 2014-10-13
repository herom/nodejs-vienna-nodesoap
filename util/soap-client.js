var Promise = require('bluebird');

var SoapClient = {
  isClientSet: false,

  client: null,

  setClient: function (client) {
    this.client = client;
    this.isClientSet = true;
  },

  lookupServerInfo: function () {
    if (!this.isClientSet) {
      return Promise.reject('No SoapClient available!');
    }
    var client = this.client;

    return new Promise(function promisedServerInfo(resolve, reject) {
      client.ServerInfo({}, function (err, info) {
        if (err) {
          reject(err);
        } else {
          var serverInfo = info.ServerInfoResult.replace('\r', '').split('\n');
          resolve(serverInfo);
        }
      });
    });
  },

  lookupDictionaries: function () {
    if (!this.isClientSet) {
      return Promise.reject('No SoapClient available!');
    }
    var client = this.client;

    return new Promise(function promisedDictionaryLookup(resolve, reject) {
      client.DictionaryList({}, function (err, list) {
        if (err) {
          reject(err);
        } else {
          resolve(list.DictionaryListResult.Dictionary);
        }
      });
    });
  },

  lookupDefinition: function (word) {
    if (!this.isClientSet) {
      return Promise.reject('No SoapClient available!');
    }

    var self = this;

    return new Promise(function promisedWordLookup(resolve, reject) {
      self.client.Define({word: word.trim()}, function (err, defined) {
        if (err) {
          reject(err);
        } else {
          var definitions = defined.DefineResult.Definitions.Definition;
          var preparedDefinitions = [];

          if (definitions) {
            definitions.forEach(function (definition) {
              var dictionary = definition.Dictionary.Name;
              var textSplits = definition.WordDefinition.split('[syn:');
              var text = definition.WordDefinition;
              var word = definition.Word;
              var def = '';
              var synonyms;
              var prepared = {};

              if (Array.isArray(textSplits) && textSplits.length > 1) {
                text = textSplits[0];
                synonyms = self._extractSynonyms(textSplits[1].replace('\n', '').replace(/\s{2,}/g, ' '));
              }

              text = text.replace('\n', '').replace(/\s{2,}/g, ' ').trim();

              if (/^:/.exec(text)) {
                def = text.substr(1, text.length);
              } else {
                def = text;
              }

              prepared = {
                word: word,
                def: def,
                dict: dictionary
              };

              if (Array.isArray(synonyms) && synonyms.length > 0) {
                prepared.syn = synonyms;
              }

              preparedDefinitions.push(prepared);
            });
          }
          resolve(preparedDefinitions);
        }
      });
    });
  },

  _extractSynonyms: function (str) {
    var synonyms = [];
    var regExp = /{([^}]+)}/g;
    var text;

    while (text = regExp.exec(str)) {
      synonyms.push(text[1]);
    }

    return synonyms;
  }
};

module.exports = SoapClient;