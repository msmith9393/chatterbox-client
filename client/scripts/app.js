var app = {};
app.server = 'https://api.parse.com/1/classes/messages';
app.init = function() {
  app.handleSubmit();
};

//Send posts to other users
app.send = function(message) {
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
      console.log(data);
    },
    success: function(data) {
      console.log('Successful Get');
      console.log(data);
      var userName, date, message;
      var res = data.results;
      for (var i = 0; i < res.length; i++) {
        var message = {
          username: res[i].username || 'anonymous',
          text: res[i].text,
          date: res[i].createdAt
        };
        app.addMessage(message);
      }
    }
  });
};

app.addRoom = function(roomName) {
  var $newRoom = $('<option value="' + roomName + '" name="room"></option>').text(roomName);
  $('#roomSelect').append($newRoom);
};

app.clearMessages = function() {
  $('#chats').html('');
  app.fetch();
};

app.addMessage = function (message) {
  var $msgBox = $('<div class="msg-box"></div>');
  var $userName = $('<h2 class="username"></h2>');
  var $date = $('<p class="date"></p>');
  var $message = $('<p class="message"></p>');
  $userName.text(message.username);
  $date.text(message.date);
  $message.text(message.text);
  $msgBox.append($userName).append($date).append($message);
  app.$chats.append($msgBox);
};

app.friends = [];

app.addFriend = function(userName) {
  app.friends.push(userName.text());
  userName.addClass('friend');
};

app.handleSubmit = function() {
  var userName = window.location.search.split('username=')[1];
  var date = new Date();
  var text = $('[name="message-box"]').val();
  var roomName = $('[name="room"]').val();
  var message = {
    text: text,
    roomname: roomName
  };
  console.log(message);
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
  });

  $('[name="add-room-btn"]').click(function(e) {
    e.preventDefault();
    var roomName = $('[name="add-room"]').val();
    app.addRoom(roomName);
  });

  $('#chats').on('click', '.username', function(e) {
    e.preventDefault();
    app.addFriend($(this));
  });
});

// setInterval(app.fetch, 2000);
