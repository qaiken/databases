var db = require('../db');

// 'SELECT message_text, user_name, chatroom_name
//   FROM messages, users, chatrooms
//   WHERE messages.user_id=users.id AND messages.chatroom_id=chatrooms.id'

module.exports = {
  messages: {
    get: function (cb) {
      db.query('SELECT c.chatroom_name,m.message_text, u.user_name FROM messages m INNER JOIN users u on m.user_id = u.id INNER JOIN chatrooms c on m.chatroom_id = c.id', function(err, rows, fields) {
        if (err) throw err;

        cb(rows);
      });
    }, // a function which produces all the messages
    post: function (messageObj) {
      var user_name = messageObj["user_name"];
      var message_text = messageObj["message_text"];
      var chatroom_name = messageObj["chatroom_name"];

     //  'BLAH BLAH BLAH;' +
     //  'BLAH BLAH BLAH;'

     //  db.query('INSERT IGNORE INTO users (user_name) VALUES ("' + user_name + '")', function(err, rows, fields) {
     //    db.query('INSERT INTO chatrooms (chatroom_name) VALUES ("' + chatroom_name + '")', function(err, rows, fields) {
     //      db.query('INSERT INTO chatrooms (chatroom_name) VALUES ("' + chatroom_name + '")', function(err, rows, fields) {

     //      // SELECT id FROM users WHERE user_name=messageObj.user_name
     //      // SELECT id FROM chatrooms HWERE chatroom_name=messageObj.chatroom_name

     //        db.query('INSERT INTO users (user_name) VALUES ("' + messageObj.user_name + '")', function(err, rows, fields) {
     //      });
     //    });
     //  });
     // });
    } // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function (cb) {
      db.query('SELECT user_name FROM users', function(err, rows, fields) {
        if (err) throw err;

        cb(rows);

        console.log('selected from users!');
      });
    },
    post: function (userName) {
      db.query('INSERT INTO users (user_name) VALUES ("' + userName + '")', function(err, rows, fields) {
        if (err) throw err;

        console.log('inserted into users table!');
      });
    }
  }
};

