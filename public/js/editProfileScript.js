$(document).ready(function () {
    function isFilled() {
        var username = validator.trim($('#username').val());
        var password = validator.trim($('#password').val());
        var confirmPass = validator.trim($('#passwordConfirm').val());
        var contactNum = validator.trim($('#contactnumber').val());

        var usernameEmpty = validator.isEmpty(username);
        var passwordEmpty = validator.isEmpty(password);
        var confirmPassEmpty = validator.isEmpty(confirmPass);
        var contactNumEmpty = validator.isEmpty(contactNum)

        return !usernameEmpty && !contactNumEmpty && !passwordEmpty && !confirmPassEmpty
    }

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
        if (filled && validPass && isMatch && validUsername && validContact) {
            $('#submit').prop('disabled', false);
        } else {
            $('#submit').prop('disabled', true);
        }
    }
    $('#username').keyup(function () {
        validateField($('#username'), 'Username', $('#usernameError'));
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
})