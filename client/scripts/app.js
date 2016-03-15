var app = {
  
};
app.init = function() {
  app.fetch();
};

//Send posts to other users
app.send = function(message) {
  $.ajax({
    'url': 'https://api.parse.com/1/classes/messages',
    'type': 'POST',
    'data': JSON.stringify(message),
    'contentType': 'application/json',
    'success': function(response) {
      console.log(response);
    },
    'error': function() {
      $('#chats').text('An error has occurred');
    }
  });
};

//Get posts from other users
app.fetch = function() {
  $.ajax({
    'url': 'https://api.parse.com/1/classes/messages',
    'data': {
      format: 'json'
    },
    'error': function() {
      $('#chats').text('An error has occurred');
    },
    dataType: 'json',
    success: function(data) {
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
    },
    type: 'GET'
  });
};


$(function() {
  var $chats = $('#chats');
  app.post = function (userName, date, message) {
    var $msgBox = $('<div class="msg-box"></div>');
    var $userName = $('<h2 class="user-name"></h2>');
    var $date = $('<p class="date"></p>');
    var $message = $('<p class="message"></p>');
    $userName.text(userName);
    $date.text(date);
    $message.text(message);
    $msgBox.append($userName).append($date).append($message);
    $chats.prepend($msgBox);
  };
  app.fetch();
  
});
// $(function() {
//   var $chats = $('#chats');
  


//   var post = function (userName, date, message) {
//     var $msgBox = $('<div class="msg-box"></div>');
//     var $userName = $('<h2 class="user-name"></h2>');
//     var $date = $('<p class="date"></p>');
//     var $message = $('<p class="message"></p>');
//     $userName.text(userName);
//     $date.text(date);
//     $message.text(message);
//     $msgBox.append($userName).append($date).append($message);
//     $chats.prepend($msgBox);
//   };



//   $('[name="submit-btn"]').click(function(e) {
//     e.preventDefault();
//     var userName = window.location.search.split('username=')[1];
//     var date = new Date();
//     var text = $('[name="message-box"]').val();
//     var roomName = $('[name="room"]').val();
//     var message = {
//       username: userName,
//       text: text,
//       roomname: roomName
//     };
//     app.send(message);
//     // post(userName, date, text);
//   });

// });