var models = require('../models');
var bluebird = require('bluebird');


// {
//   results: [
//   {
//     roomname:
//     createdAt:
//     username:
//   }

//   ]
// }



module.exports = {
  messages: {
    get: function (req, res) {}, // a function which handles a get request for all messages
    post: function (req, res) {} // a function which handles posting a message to the database
  },

  users: {
    // Ditto as above
    get: function (req, res) {
      res.redirect(301,'/');
    },
    post: function (req, res) {
      models.users.post(req.body.user_name);
      res.end();
    }
  }
};