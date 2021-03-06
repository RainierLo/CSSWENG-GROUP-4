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
    async function isValidEmail(field) {
        var email = validator.trim($('#email').val());
        var isEmail = validator.isEmail(email);
        var isDuplicate;

        //Check first if the email is valid
        if (isEmail) {
            //Then check if there are duplicates in the db
            let result = await $.get('/checkEmail', { Email: email })
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
            return !isDuplicate;
        }
        else {
            if (field.is($('#email')))
                $('#emailError').text('Email is not valid.');
            return false;
        }
    }
    //Checks if the username entered corresponds to the set required length
    async function isValidUsername(field) {
        var isValid = false;

        var username = validator.trim($('#username').val());
        var isValidLength = validator.isLength(username, { min: 6 });

        if (isValidLength) {

            let result = await $.get('/checkUsername', { Username: username }).then();
            if (result.Username == username) {
                if (field.is($('#username')))
                    $('#usernameError').text('Username is already taken.');
                isValid = false;
            } else {
                if (field.is($('#username')))
                    $('#usernameError').text('');
                isValid = true
            };
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

    //Checks if the password entered corresponds to the set required length
    function isValidContactNum(field) {
        var isValid = false;

        var ContactNum = validator.trim($('#contactnumber').val());
        var isValidLength = validator.isLength(ContactNum, { min: 11 }, { max: 11 });

        if (isValidLength) {
            if (field.is($('#contactnumber')))
                $('#contactnumberError').text('');

            isValid = true;
        } else {
            if (field.is($('#contactnumber')))
                $('#contactnumberError').text('Contact Number must contain 11 numbers');
        }
        return isValid;
    }

    /*
        This function will be called for each keyup function
    */
    async function validateField(field, fieldName, error) {
        var value = validator.trim(field.val());
        var empty = validator.isEmpty(value);

        if (empty) {
            field.prop('value', '');
            error.text(`${fieldName} should not be empty.`)
        } else {
            error.text('');
        }

        var filled = isFilled();
        var validUsername = await isValidUsername(field);
        var validPass = isValidPassword(field);
        var isMatch = checkPasswords(field);
        var validContact = isValidContactNum(field);
        var validEmail = await isValidEmail(field);
        console.log(`${filled} ${validUsername} ${validPass} ${isMatch} ${validContact} ${validEmail}`)
        if (filled && validEmail && validPass && isMatch && validUsername && validContact && validEmail) {
            $('#submit').prop('disabled', false);
        } else {
            $('#submit').prop('disabled', true);
        }
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
    $('#contactnumber').keyup(function () {
        validateField($('#contactnumber'), 'Contact Number', $('#contactnumberError'));
    });

});