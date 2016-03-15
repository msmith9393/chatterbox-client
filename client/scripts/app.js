var app = {};
app.server = 'https://api.parse.com/1/classes/messages';
app.init = function() {
  app.handleSubmit();
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
      var userName, date, message, roomname;
      var res = data.results;
      app.clearMessages();
      for (var i = 0; i < res.length; i++) {
        var message = {
          username: res[i].username || 'anonymous',
          text: res[i].text,
          // date: res[i].createdAt,
          roomname: res[i].roomname
        };
        app.addMessage(message);
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
  $date.text(message.date);
  $message.text(message.text);
  $msgBox.append($userName).append($date).append($message);
  app.$chats.append($msgBox);
};

app.friends = [];

app.addFriend = function(userName) {
  var index = app.friends.indexOf(userName);
  if (index === -1) {
    app.friends.push(userName.text());  
  } else {
    app.friends.splice(index, 0);
  }
  userName.addClass('friend');
};

app.handleSubmit = function() {
  var userName = window.location.search.split('username=')[1];
  var date = new Date();
  var text = $('[name="message-box"]').val();
  var roomname = $('#roomSelect').val();
  console.log(roomname);
  var message = {
    username: userName,
    text: text,
    roomname: roomname
  };
  app.send(message);
};

setInterval(function() {
  $.ajax({
    url: app.server,
    type: 'GET',
    dataType: 'json',
    success: app.fetch
  });
}, 5000);

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
    app.addRoom(roomname);
  });

  $('#chats').on('click', '.username', function(e) {
    e.preventDefault();
    app.addFriend($(this));
  });
});

