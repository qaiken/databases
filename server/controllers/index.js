var models = require('../models');
var bluebird = require('bluebird');


module.exports = {
  messages: {
    get: function (req, res) {
      models.messages.get(function(data) {
        // need to return results property within object
        res.end(JSON.stringify(data));
        console.log('got messages!');
      });
    }, // a function which handles a get request for all messages
    post: function (req, res) {
      models.messages.post(req.body);
      res.end();
    } // a function which handles posting a message to the database


  },
  users: {
    // Ditto as above
    get: function (req, res) {
      models.users.get(function(data) {
        res.end(JSON.stringify(data));
      });
    },
    post: function (req, res) {
      models.users.post(req.body.user_name);
      res.end();
    }
  }
};