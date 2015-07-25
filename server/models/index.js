var db = require('../db');

module.exports = {
  messages: {
    get: function () {}, // a function which produces all the messages
    post: function () {} // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function () {},
    post: function (userName) {
      db.connect();

      db.query('INSERT INTO users (user_name) VALUES ("' + userName + '")', function(err, rows, fields) {
        if (err) throw err;

        console.log('success!');
      });

      db.end();
    }
  }
};

