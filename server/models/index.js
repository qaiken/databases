var db = require('../db');
var Sequelize = require("sequelize");
var Q = require('q');

module.exports = {
  messages: {
    get: function () {
      var defer = Q.defer();
      db.Message.findAll({
        include: [{
          model: db.User,
          where: {id: Sequelize.col('message.user_id')}
        },{
          model: db.Chatroom,
          where: {id: Sequelize.col('message.chatroom_id')}
        }],
        order: [
          ['id', 'DESC']
        ]
      }).then(function(rows) {
        defer.resolve(rows);
      });
      return defer.promise;
    },
    post: function (messageObj) {

      var user_name = messageObj["user_name"];
      var message_text = messageObj["message_text"];
      var chatroom_name = messageObj["chatroom_name"];

      var query1 = 'INSERT IGNORE INTO users (user_name) VALUES (?);';
      var query2 = 'INSERT IGNORE INTO chatrooms (chatroom_name) VALUES (?); ';
      var query3 = 'INSERT INTO messages (message_text, user_id, chatroom_id) SELECT ?, users.id, chatrooms.id FROM users, chatrooms WHERE users.user_name=? AND chatrooms.chatroom_name=?;';

      db.sequelize.query(query1,{ replacements: [user_name]})
      .then(function() {
        return db.sequelize.query(query2,{ replacements: [chatroom_name]});
      })
      .then(function() {
        return db.sequelize.query(query3,{ replacements: [message_text,user_name,chatroom_name]});
      });
    } // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function () {
      var defer = Q.defer();
      db.User.findAll().then(function(usrs) {
        defer.resolve(usrs);
      });
      return defer.promise;
    },
    post: function (userName) {
      var newUser = db.User.build({user_name: userName});
      newUser.save().then(function() {
        console.log('User saved!');
      });
    }
  }
};

