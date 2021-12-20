$(document).ready(function() {
    $('#email').keyup(function() {
        var email = $('#email').val();
        $.get('/checkEmail', {Email: email}, function(result) {
            if (result.Email == email) {
                $('#error').text('Email is already registered');
                $('#submit').prop('disabled', true)
            }
            else {
                $('#error').text('');
                $('#submit').prop('disabled', false);
            }
        });
    });
});