var Sequelize = require("sequelize");

var sequelize = new Sequelize("chatter", "root", "",{
  define: {
    timestamps: false
  }
});

var User = sequelize.define('User', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_name: {
    type: Sequelize.STRING,
    unique: true
  }
});

var Chatroom = sequelize.define('Chatroom', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  chatroom_name: {
    type: Sequelize.STRING,
    unique: true
  }
});

var Message = sequelize.define('Message', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  message_text: Sequelize.STRING,
  user_id: {
    type: Sequelize.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  },
  chatroom_id: {
    type: Sequelize.INTEGER,
    references: {
      model: Chatroom,
      key: 'id'
    }
  }
});

User.hasMany(Message, {foreignKey: 'user_id'});
Message.belongsTo(User, {foreignKey: 'user_id'});

Chatroom.hasMany(Message, {foreignKey: 'chatroom_id'});
Message.belongsTo(Chatroom, {foreignKey: 'chatroom_id'});

User.sync().then(function() {
  console.log('User table created');
});

Chatroom.sync().then(function() {
  console.log('Chatroom table created');
});

Message.sync().then(function() {
  console.log('Message table created');
});

module.exports = {
  sequelize: sequelize,
  User: User,
  Chatroom: Chatroom,
  Message: Message
};