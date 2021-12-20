function validateForm() {
  let x = document.forms["myForm"]["username"].value;
  let y = document.forms["myForm"]["password"].value;
  if (x == "" || y == "") {
    alert("All text fields must be filled out");
    return false;
  }
}

$(document).ready(function() {
  $('#login').click(function() {
      var Email = document.forms["myForm"]["username"].value;
      var Password = document.forms["myForm"]["password"].value;
      if (Email.length > 0 && Password.length > 0) {
          var param = {
              Email: Email,
              Password: Password
          }
          $.post('/login', param, function(result) {
              if(result) {
                  $('#error').text('');
              } else {
                  $('#error').text('Inavlid Username or Password');
              }
          });
      }
  });
});