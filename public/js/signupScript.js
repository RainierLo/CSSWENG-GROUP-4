$(document).ready(function () {
    //Check if all of the fields are filled with inputs
    function isFilled() {
        var username = validator.trim($('#username').val());
        var email = validator.trim($('#email').val());
        var password = validator.trim($('#password').val());
        var confirmPass = validator.trim($('#passwordConfirm').val());

        var usernameEmpty = validator.isEmpty(username);
        var emailEmpty = validator.isEmpty(email);
        var passwordEmpty = validator.isEmpty(password);
        var confirmPassEmpty = validator.isEmpty(confirmPass);

        return !usernameEmpty && !emailEmpty && !passwordEmpty && !confirmPassEmpty
    }

    /* Check if the entered email is a valid one and check in the db if there 
       are duplicates 
    */
    function isValidEmail(field, callback) {
        var email = validator.trim($('#email').val());
        var isEmail = validator.isEmail(email);
        var isDuplicate;

        //Check first if the email is valid
        if (isEmail) {
            //Then check if there are duplicates in the db
            $.get('/checkEmail', { Email: email }, function (result) {
                if (result.Email == email) {
                    if (field.is($('#email')))
                        $('#emailError').text('Email is already registered');
                    isDuplicate = true;
                }
                else {
                    if (field.is($('#email')))
                        $('#emailError').text('');
                    isDuplicate = false;
                }
                return callback(!isDuplicate);
            });
        }
        else {
            if (field.is($('#email')))
                $('#emailError').text('Email is not valid.');
            return callback(false);
        }
    }
    //Checks if the username entered corresponds to the set required length
    function isValidUsername(field) {
        var isValid = false;

        var username = validator.trim($('#username').val());
        var isValidLength = validator.isLength(username, { min: 6 });

        if (isValidLength) {
            if (field.is($('#username')))
                $('#usernameError').text('');

            isValid = true;
        } else {
            if (field.is($('#username')))
                $('#usernameError').text('Username should contain at least 6 characters.');
        }
        return isValid;
    }
    //Checks if the password entered corresponds to the set required length
    function isValidPassword(field) {
        var isValid = false;

        var password = validator.trim($('#password').val());
        var isValidLength = validator.isLength(password, { min: 6 });

        if (isValidLength) {
            if (field.is($('#password')))
                $('#passwordError').text('');

            isValid = true;
        } else {
            if (field.is($('#password')))
                $('#passwordError').text('Passwords should contain at least 6 characters.');
        }
        return isValid;
    }
    //Checks if the confirm password field matches the original password
    function checkPasswords(field) {
        var isMatch = false
        var password = validator.trim($('#password').val());
        var confirmPass = validator.trim($('#passwordConfirm').val());


        if (password !== confirmPass) {
            if (field.is($('#passwordConfirm'))) {
                $('#passwordConfirmError').text('Passwords do not match.');
            }
            isMatch = false;
        } else {
            if (field.is($('#passwordConfirm'))) {
                $('#passwordConfirmError').text();
            }
            isMatch = true;
        }

        return isMatch;
    }

    /*
        This function will be called for each keyup function
    */
    function validateField(field, fieldName, error) {
        var value = validator.trim(field.val());
        var empty = validator.isEmpty(value);

        if (empty) {
            field.prop('value', '');
            error.text(`${fieldName} should not be empty.`)
        } else {
            error.text('');
        }

        var filled = isFilled();
        var validUsername = isValidUsername(field);
        var validPass = isValidPassword(field);
        var isMatch = checkPasswords(field);

        isValidEmail(field, function (validEmail) {

            if (filled && validEmail && validPass && isMatch && validUsername) {
                $('#submit').prop('disabled', false);
            } else {
                $('#submit').prop('disabled', true);
            }
        });
    }

    $('#username').keyup(function () {
        validateField($('#username'), 'Username', $('#usernameError'));
    });
    $('#email').keyup(function () {
        validateField($('#email'), 'Email', $('#emailError'));
    });
    $('#password').keyup(function () {
        validateField($('#password'), 'Password', $('#passwordError'));
    });
    $('#passwordConfirm').keyup(function () {
        validateField($('#passwordConfirm'), 'Confirm Password', $('#passwordConfirmError'));
    });

});