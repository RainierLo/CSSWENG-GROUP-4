let reviews = {};

function getReviewsFromDB() {
    $.get('/getReviews', function (result) {
        reviews = result;
        buildReviewTable(reviews)
    })
}

function buildReviewTable(reviews) {
    var table = $('#review-table');
    //Clear the body of the table
    table.empty();
    for (var i = 0; i < reviews.length; i++) {
        var row = `
        <div class="review-box">
            <div class="review-info">
                <div class="review-user">${reviews[i].User.Username}</div>
                    <p>${reviews[i].Review}</p>
            </div>
        </div>
        `
        //Append the row created to the table
        table.append(row);
    };
} 

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



$(document).ready(function() {
    getReviewsFromDB();

    $('#review').keyup(function () {
        validateField($('#review'), 'Review');
    });
})