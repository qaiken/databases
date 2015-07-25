var app;

$(function() {

  var $messageContainer, timer;
  var cachedMessages = [];
  var chatRooms = [];
  var friends = {};
  var $spinner = $('.spinner');
  var $messageForm = $('#message-form');
  var $chatRoomSelector = $('#chat-room-select');
  var $userName = $('#user-name');
  var $newChatRoom = $('#new-chatroom');
  var $message = $('#message');
  var $sendMessage = $('#send-message');
  var server = 'http://localhost:3000/classes/messages';

  function initFeed(messages) {
    var frag = $(document.createDocumentFragment());

    $messageContainer.html('');

    _.each(messages, function(message) {
      if(_.indexOf(cachedMessages, message.id) == -1) {
        cachedMessages.push(message.id);
      }
      if( message.Chatroom.chatroom_name === $chatRoomSelector.val() ) {
        frag.append(buildMessage(message));
      }
    });

    $messageContainer.append(frag);
  }

  function buildMessage(data) {
    var userName;
    var div = $('<div />');
    var friendClass = '';

    if(!data.message_text || !data.User.user_name) {
      return;
    }

    userName = _.escape(data.User.user_name).replace(/ +/g,'');

    if(friends[userName]) {
      friendClass = 'friend';
    }

    div.append('<p class="user-name '+friendClass+'" data-username="'+userName+'">User:<span>'+userName+'</span></p>');
    div.append('<p>'+ _.escape(data.message_text) +'</p>');
    return div;
  }

  function appendNewMessages(messages) {
    var frag = $(document.createDocumentFragment());

    for(var i = 0; i < messages.length; i++) {
      if(_.indexOf(cachedMessages, messages[i].id) > -1) {
        break;
      }
      cachedMessages.push(messages[i].id);
      if( messages[i].Chatroom.chatroom_name === $chatRoomSelector.val() ) {
        frag.append(buildMessage(messages[i]));
      }
    }

    $messageContainer.prepend(frag);
  }

  function buildChatRooms(messages) {
    _.each(messages, function(message) {
      var roomname = _.escape(message.Chatroom.chatroom_name);
      if( _.indexOf(chatRooms,roomname) === -1 ) {
        chatRooms.push(roomname);
        $chatRoomSelector.append('<option value="'+ roomname +'">'+roomname+'</option');
      }
    });
  }

  function switchRooms() {
    cachedMessages = [];
    $newChatRoom.val(this.value);
    fetch();
  }

  function messageParse() {

    var userName = $userName.val();
    var text = $message.val();
    var roomName = $newChatRoom.val();

    if( !userName || !text || !roomName) {
      return;
    }

    var message = {
      user_name: userName,
      message_text: text,
      chatroom_name: roomName
    };

    $message.val('');

    send(message);
  }

  function addFriend() {
    var userName = $(this).data('username');

    if(friends[userName]) {
      friends[userName] = false;
    } else {
      friends[userName] = true;
    }

    $('.user-name[data-username="'+userName+'"]').each(function(i,el) {
      $(el).toggleClass('friend',friends[userName]);
    });
  }

  function init(params) {
    $messageContainer = params.container;

    $messageContainer.on('click','.user-name',addFriend);

    $messageForm.on('submit',function(e) {
      e.preventDefault();
    });

    $sendMessage.on('click',messageParse);
    $chatRoomSelector.on('change',switchRooms);

    fetch();
  };

  function send(message) {

    $spinner.show();

    $.ajax({
      url: server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        clearInterval(timer);
        fetch();
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message');
      }
    });
  };

  function fetch() {
    $.ajax({
      url: server,
      type: 'GET',
      data: {order: '-createdAt'},
      contentType: 'application/json',
      success: function(data) {
        clearInterval(timer);
        timer = setInterval(fetch,5000);
        displayMessages(data);
        $spinner.fadeOut();
      },
      error: function (data) {
        console.error('chatterbox: Failed to fetch message');
      }
    });
  };

  function displayMessages(data) {

    buildChatRooms(data);

    if(!cachedMessages.length) {
      initFeed(data);
      return;
    }

    if( JSON.stringify(data[0]) !== JSON.stringify(cachedMessages[0]) ) {
      appendNewMessages(data);
    }

  };

  app = {
    server: server,
    init: init,
    send: send,
    fetch: fetch,
    displayMessages: displayMessages
  };

});
