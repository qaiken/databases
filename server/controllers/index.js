var models = require('../models');

module.exports = {
  messages: {
    get: function (req, res) {
      models.messages.get().then(function(data) {
        res.json(data);
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
      models.users.get().then(function(data) {
        res.json(data);
      });
    },
    post: function (req, res) {
      models.users.post(req.body.user_name);
      res.end();
    }
  }
};