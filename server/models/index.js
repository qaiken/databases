var db = require('../db');
var Q = require('q');

// 'SELECT message_text, user_name, chatroom_name
//   FROM messages, users, chatrooms
//   WHERE messages.user_id=users.id AND messages.chatroom_id=chatrooms.id'

module.exports = {
  messages: {
    get: function () {
      var defer = Q.defer();
      db.query('SELECT m.id, m.message_text, u.user_name, c.chatroom_name FROM messages m INNER JOIN users u on m.user_id = u.id INNER JOIN chatrooms c on m.chatroom_id = c.id ORDER BY m.id DESC', function(err, rows, fields) {
        if (err) throw err;
        defer.resolve(rows);
      });
      return defer.promise;
    }, // a function which produces all the messages
    post: function (messageObj) {
      var user_name = messageObj["user_name"];
      var message_text = messageObj["message_text"];
      var chatroom_name = messageObj["chatroom_name"];

      var query = "INSERT IGNORE INTO users (user_name) VALUES (?); ";
      query += "INSERT IGNORE INTO chatrooms (chatroom_name) VALUES (?); ";
      query += "INSERT INTO messages (message_text, user_id, chatroom_id) SELECT ?, users.id, chatrooms.id FROM users, chatrooms WHERE users.user_name=? AND chatrooms.chatroom_name=?;";
      db.query(query,[user_name,chatroom_name,message_text,user_name,chatroom_name],function(err,rows, fields) {

      });
    } // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function () {
      var defer = Q.defer();
      db.query('SELECT user_name FROM users', function(err, rows, fields) {
        if (err) throw err;

        defer.resolve(rows);

        console.log('selected from users!');
      });
      return defer.promise;
    },
    post: function (userName) {
      db.query('INSERT INTO users (user_name) VALUES ("' + userName + '")', function(err, rows, fields) {
        if (err) throw err;

        console.log('inserted into users table!');
      });
    }
  }
};

