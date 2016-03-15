var app = {};

app.init = () => {
  setInterval(function() {
    $.ajax({
      url: app.server,
      type: 'GET',
      dataType: 'json',
      success: app.fetch
    });
  }, 5000);

  //Username
  app.server = 'https://api.parse.com/1/classes/messages';
  app.username = window.location.search.split('username=')[1];
  app.friends = [];
  // app.handleSubmit();
  // app.autoRefresh();
};

//Send posts to other users
app.send = function(message) {
  console.log(message);
  $.ajax({
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function(response) {
      console.log('Successful Post');
    },
    error: function(data) {
      console.log('An error has occurred Post');
    }
  });
  $('[name="message-box"]').val('');
  app.fetch();
};

//Get posts from other users
app.fetch = function() {
  $.ajax({
    url: app.server,
    type: 'GET',
    data: {
      format: 'json'
    },
    error: function(data) {
      console.log('An error has occurred Get');
    },
    success: function(data) {
      console.dir(data);
      console.log('Successful Get');
      var res = data.results;
      app.clearMessages();
      for (var i = 0; i < res.length; i++) {
        var message = {
          username: res[i].username || 'anonymous',
          text: res[i].text,
          roomname: res[i].roomname
        };
        if ($('#chat-room').text() === message.roomname || $('#chat-room').text() === 'all-rooms') {
          app.addMessage(message);
        }
      }
    }
  });
};

app.addRoom = function(roomname) {
  var $newRoom = $('<option value="' + roomname + '" class="room" id="' + roomname + '" ></option>').text(roomname);
  $('#roomSelect').append($newRoom);
};

app.clearMessages = function() {
  $('#chats').html('');
};

app.addMessage = function (message) {
  var $msgBox = $('<div class="msg-box"></div>');
  var $userName = $('<h2 class="username"></h2>');
  var $date = $('<p class="date"></p>');
  var $message = $('<p class="message"></p>');
  $userName.text(message.username);
  // if username is in friends list
    // add friend class to username h2
  $date.text(message.date);
  $message.text(message.text);
  $msgBox.append($userName).append($date).append($message);
  app.$chats.append($msgBox);
  app.showFriends(message.username, function() {
    $userName.addClass('friend');
  });
};

app.addFriend = function(userName) {
  var user = userName.text();
  if (app.friends.indexOf(user) === -1) {
    app.friends.push(user);
  } else {
    var index = app.friends.indexOf(user);
    app.friends.splice(index, 1);
  }
  // app.showFriends(user);
  app.fetch();
};

app.showFriends = function(username, callback) {
  if (app.friends.indexOf(username) > -1) {
    callback();
  }
};

app.handleSubmit = function() {
  var date = new Date();
  var text = $('[name="message-box"]').val();
  var roomname = $('#roomSelect').val();
  if (roomname === 'all-rooms') {
    roomname = 'lobby';
  }
  var message = {
    username: app.username,
    text: text,
    roomname: roomname
  };
  app.send(message);
};


$(function() {
  app.$chats = $('#chats');
  
  app.fetch();

  $('#send').on('click', '.submit', function(e) {
    e.preventDefault();
    app.handleSubmit();
  });

  $('.clear-messages').click(function(e) {
    e.preventDefault();
    app.clearMessages();
    app.fetch();
  });

  $('#main').on('click', '[name="add-room-btn"]', function(e) {
    e.preventDefault();
    var roomname = $('[name="add-room"]').val();
    $('[name="add-room"]').val('');
    app.addRoom(roomname);
  });

  $('#chats').on('click', '.username', function(e) {
    e.preventDefault();
    app.addFriend($(this));
  });

  $('#roomSelect').on('change', function() {
    $('#chat-room').text($(this).val());
    var currentRoom = $('#chat-room').text();
    // empty our chat room
    app.clearMessages();
    // place only messages that are from the room
    app.fetch();

  });
});

app.init();
