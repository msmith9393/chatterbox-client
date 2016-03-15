var app = {};
app.server = 'https://api.parse.com/1/classes/messages';
app.init = function() {
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
        if (res[i].username === undefined) {
          userName = 'anonymous';
        } else {
          userName = res[i].username;
        }
        date = res[i].createdAt;
        message = res[i].text;
        app.post(userName, date, message);
      }
    }
  });
};


app.post = function (userName, date, message) {
  var $msgBox = $('<div class="msg-box"></div>');
  var $userName = $('<h2 class="user-name"></h2>');
  var $date = $('<p class="date"></p>');
  var $message = $('<p class="message"></p>');
  $userName.text(userName);
  $date.text(date);
  $message.text(message);
  $msgBox.append($userName).append($date).append($message);
  app.$chats.prepend($msgBox);
};


$(function() {
  app.$chats = $('#chats');
  app.fetch();
  $('[name="submit-btn"]').on('click', function(e) {
    e.preventDefault();
    var userName = window.location.search.split('username=')[1];
    var date = new Date();
    var text = $('[name="message-box"]').val();
    var roomName = $('[name="room"]').val();
    var message = {
      text: text,
      roomname: roomName
    };
    app.send(message);
  });


});


