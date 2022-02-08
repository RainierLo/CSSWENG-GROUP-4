

$(document).ready(function() {
    function isValidReview() {
        var isValid = false;
        var review = $('#review').val()
        var isValidLength = validator.isLength(review, { min: 1 });

        if (isValidLength) {
            $('#error').text('');
            isValid = true;
        } else {
            $('#error').text('Review should not be empty');
            isValid = false;
        }
        return isValid;
    }

    async function validateField(field, fieldname) {
        var validReview = isValidReview()
        if (validReview) {
            $('#submit').prop('disabled', false);
        } else {
            $('#submit').prop('disabled', true);
        }
    }

    $('#review').keyup(function () {
        validateField($('#review'), 'Review');
    });
})