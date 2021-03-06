var tabButtons = document.querySelectorAll(".tab-container .button-container button");
var tabPanels = document.querySelectorAll(".tab-container .tab-panel");

/* Function to show the current panel selected */
function showPanel(panelIndex, colorCode) {
    tabButtons.forEach(function (node) {
        node.style.backgroundColor = "";
        node.style.color = "";
    });
    tabButtons[panelIndex].style.backgroundColor = colorCode;
    tabButtons[panelIndex].style.color = "white";
    tabPanels.forEach(function (node) {
        node.style.display = "none";
    });
    tabPanels[panelIndex].style.display = "block";
    tabPanels[panelIndex].style.backgroundColor = colorCode;
}
showPanel(0, 'var(--red)');

import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
const socket = io();
let users = {};
let orders = {};
let menu = {};
let reviews = {};

/* If there are updates to the user db, perform a getUsers query again
   to update the user table */
socket.on('userdb-updated', change => {
    $.get('/getUsers', function (result) {
        getUsersFromDB();
    });
});

/* If there are updates to the order db, perform a getOrders query again
   to update the order table */
socket.on('orderdb-updated', change => {
    getOrdersFromDB();
});


/* User Tab */
/* Retrieves the user data from the database */
function getUsersFromDB() {
    $.get('/getUsers', function (result) {
        users = result;
        filterUser("Date-Ascending", users);
    });
};

/* This function appends each item of the user array as rows to 
   the user table*/
function buildUserTable(users) {
    var table = $('#user-body');
    //Clear the body of the table
    table.empty();
    for (var i = 0; i < users.length; i++) {
        var row = `<tr class="user-row">
            <td>${users[i].DateJoined}</td>
            <td>${users[i].Username}</td>
            <td>${users[i].Email}</td>
            <td>${users[i].OrdersMade}</td>
            <td><button type="button" id="remButton" class="admin-btn" name="${i}">Remove</button></td>
        </tr>`
        //Append the row created to the table
        table.append(row);
    };
}

/* Order Tab */
/* Retrieves the order details from the database */
function getOrdersFromDB() {
    $.get('/getOrders', function (result) {
        orders = result;
        filterOrders('Pending', orders);
    })
}
/* This function appends each item of the order array as rows to 
   the order table*/
function buildOrderTable(orders) {
    var table = $('#order-body');
    //Clear the body of the table
    table.empty();
    if (orders.length > 0) {
        for (var i = 0; i < orders.length; i++) {
            var row = `<tr class="order-row">
            <td>${orders[i].DateOrdered}</td>
            <td>${orders[i].User.Username}</td>
            <td>${orders[i].User.Email}</td>
            <td>${orders[i].User.MobileNumber}</td>    
            <td>${orders[i].Address}</td>
            <td>${getOrderString(orders[i].Cart)}</td>
            <td>${orders[i].TotalPrice}</td>
            <td id="StatusCol-${orders[i]._id}">                
                <select id="${orders[i]._id}" class="orderProgressOptions" name="${orders[i].User._id}">
                    <option value="Pending">Pending</option>
                    <option value="On Route">On Route</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            </td>
            </tr>`
            //Append the row created to the table
            table.append(row);
            //Set the status of the created select tag
            $(`#${orders[i]._id}`).val(`${orders[i].Status}`);

            if (orders[i].Status == 'Completed' || orders[i].Status == 'Cancelled') {
                $(`#StatusCol-${orders[i]._id}`).empty();
                $(`#StatusCol-${orders[i]._id}`).text(orders[i].Status);
            }
        };
    }

}
/* This function a concatenated string of the user's orders */
function getOrderString(Cart) {
    var orderStr = ''
    Cart.map(item => {
        var str = `${item.Quantity}x ${item.FoodName} <br/>`;
        orderStr = orderStr.concat('', str);
    })
    return orderStr;
}
/* Menu Tab */
/* Retrieve the menu data from the database */
function getMenuFromDB() {
    $.get('/getAdminMenu', function (result) {
        menu = result;
        buildMenuTable(menu);
    });
}
/* This function appends each item of the menu array as rows to 
   the menu table*/
function buildMenuTable(menu) {
    var table = $('#menu-body');
    //Clear the body of the table
    table.empty();
    for (var i = 0; i < menu.length; i++) {
        var row = `<tr class="menu-row">
        <td><img height="150" width="150" src="${menu[i].ImagePath}"></td>
        <td>${menu[i].FoodName}</td>
        <td>${menu[i].Price}</td>
        <td>${menu[i].Description}</td>
        <td>${menu[i].Category}</td>
        <td><button type="button" id="editButton" class="admin-btn" name="${i}">Edit</button></td>    
        <td><button type="button" id="remButton" class="admin-btn" name="${i}">Remove</button></td>
        </tr>`
        //Append the row created to the table
        table.append(row);
    };
}

/* Review Tab */
/* Retrieves the review data from the database */
function getReviewsFromDB() {
    $.get('/getReviews', function (result) {
        reviews = result;
        buildReviewTable(reviews)
    })
}
/* This function appends each item of the reviews array as rows to 
   the reviews table*/
function buildReviewTable(reviews) {
    var table = $('#review-body');
    //Clear the body of the table
    table.empty();
    for (var i = 0; i < reviews.length; i++) {
        var row = `<tr class="menu-row">
        <td>${reviews[i].User.Username}</td>
        <td>${reviews[i].User.Email}</td>
        <td>${reviews[i].Review}</td>
        <td><button type="button" class="admin-btn remReview-btn" name="${i}">Remove</button></td>
        </tr>`
        //Append the row created to the table
        table.append(row);
    };
}
/* Filters for User sorting */
/* Filter for Ascending alphabetic order*/
function AtoZ(a, b) {
    if (a.Username.toLowerCase() < b.Username.toLowerCase()) {
        return -1;
    }
    if (b.Username.toLowerCase() > a.Username.toLowerCase()) {
        return 1;
    }
    return 0;
};
/* Filter for Descending alphabetic order*/
function ZtoA(a, b) {
    if (a.Username.toLowerCase() > b.Username.toLowerCase()) {
        return -1;
    }
    if (b.Username.toLowerCase() < a.Username.toLowerCase()) {
        return 1;
    }
    return 0;
};

/* This function handles the filtering of the user based on the 
   chosen filter (Alphabetical, Date joined, number of orders made) */
function filterUser(filter, users) {
    switch (filter) {
        case 'Date-Ascending':
            buildUserTable(users.sort(function (a, b) {
                return new Date(a.DateJoined) - new Date(b.DateJoined);
            }));
            break;
        case 'Date-Descending':
            buildUserTable(users.sort(function (a, b) {
                return new Date(b.DateJoined) - new Date(a.DateJoined);
            }));
            break;
        case 'Name-Ascending':
            buildUserTable(users.sort(AtoZ));
            break;
        case 'Name-Descending':
            buildUserTable(users.sort(ZtoA));
            break;
        case 'Orders-Ascending':
            buildUserTable(users.sort(function (a, b) {
                return a.OrdersMade - b.OrdersMade;
            }));
            break;
        case 'Orders-Descending':
            buildUserTable(users.sort(function (a, b) {
                return b.OrdersMade - a.OrdersMade;
            }));
            break;
    };
};

/* Filters for Order sorting */
function filterOrders(filter, orders) {
    switch (filter) {
        case 'All':
            $('#numOrders').text(`Total Orders: ${orders.length}`);
            buildOrderTable(orders);
            break;
        case 'Pending':
            var pendingOrders = orders.filter(order => order.Status === 'Pending');
            pendingOrders = pendingOrders.sort(function (a, b) {
                return new Date(b.DateOrdered) - new Date(a.DateOrdered);
            });
            $('#numOrders').text(`Total Pending Orders: ${pendingOrders.length}`);
            buildOrderTable(pendingOrders);
            break;
        case 'On Route':
            var onRouteOrders = orders.filter(order => order.Status === 'On Route');
            $('#numOrders').text(`Total On Route Orders: ${onRouteOrders.length}`);
            buildOrderTable(onRouteOrders);
            break;
        case 'Completed':
            var completedOrders = orders.filter(order => order.Status === 'Completed');
            $('#numOrders').text(`Total Completed Orders: ${completedOrders.length}`);
            buildOrderTable(completedOrders);
            break;
        case 'Cancelled':
            var cancelledOrders = orders.filter(order => order.Status === 'Cancelled');
            $('#numOrders').text(`Total Cancelled Orders: ${cancelledOrders.length}`);
            buildOrderTable(cancelledOrders);
            break;
    };
}
$(document).on({
    ajaxStart: function () { $('.loader-container').css('display', 'block') },
    ajaxStop: function () { $('.loader-container').css('display', 'none') }
})

$(document).ready(function () {
    getUsersFromDB();
    getOrdersFromDB();
    getMenuFromDB();
    getReviewsFromDB();


    //Removes the chosen user from the db
    $("#user-body").on('click', '#remButton', function () {
        var index = parseInt($(this).prop('name'));
        var id = users[index]._id;

        $.post(`/admin/removeUser/${id}`, function (result) {
            if (result) {
                users = users.filter(user => users.indexOf(user) !== index);
                buildUserTable(users);
            } else {
                alert("Error");
            }
        });
    });

    /* User Operations*/
    $('#userFilter').change(function () {
        var filter = $('#userFilter option:selected').prop('value')
        filterUser(filter, users);
    });

    /* Order Operations */
    //Updates the status of the order
    $('#order-body').on('change', '.orderProgressOptions', function () {
        var id = $(this).prop('id');
        //var id = orders[index]._id;
        var userID = $(this).prop('name');;
        var status = $(`#${id} option:selected`).prop('value')
        var body = {
            orderID: id,
            userID: userID,
            Status: status
        }
        //console.log(body);
        $.post('/admin/updateOrderStatus', body, function (result) {
            if (result === "Success")
                getOrdersFromDB();
        })
    })
    $('#orderFilter').change(function () {
        var filter = $('#orderFilter option:selected').prop('value')
        filterOrders(filter, orders);
    });
    /* Menu Operations */
    //Removes the chosen food item from the menu
    $("#menu-body").on('click', '#remButton', function () {
        var index = parseInt($(this).prop('name'));
        var id = menu[index]._id;

        //Get the image id to delete in google drive
        var url = new URL(menu[index].ImagePath);
        var imageID = url.searchParams.get('id');


        $.post(`/admin/removeItem/${id}`, { imageID: imageID }, function (result) {
            if (result) {
                getMenuFromDB();
            } else {
                alert("Error");
            }
        });
    });

    $('#menu-submitBtn').click(function () {
        var addForm = document.getElementById("addItemForm")
        var body = new FormData(addForm)

        $.ajax({
            url: `/admin/addFood`,
            type: 'POST',
            data: body,
            processData: false,
            contentType: false
        }).then(
            function () {
                getMenuFromDB();
                $("#addItemModal").css("display", "none");
            },
            function () {
                alert('Error')
                $("#addItemModal").css("display", "none");
            }
        )

    })

    //Allows for updating / editing of the current food item's values
    $("#menu-body").on('click', '#editButton', function () {
        var index = parseInt($(this).prop('name'));
        var item = menu[index];
        $("#editID").val(`${item._id}`);
        $("#editFoodName").val(`${item.FoodName}`);
        $("#editPrice").val(`${item.Price}`);
        $("#editDescription").val(`${item.Description}`);
        $("#editCategory").val(`${item.Category}`);
        $("#editAvailable").prop("checked", item.isAvailable);
        $("#editItemModal").css("display", "flex");
    });

    //Makes the post request to accomplish the update of values
    $("#edit-submitBtn").click(function () {
        // var editForm = $('#editForm');
        var editForm = document.getElementById("editForm")
        var body = new FormData(editForm)
        var id = $("#editID").val();
        var isAvailable = $("#editAvailable").is(':checked');
        if (isAvailable == true)
            body.append($('#editAvailable').attr('id'), true);
        else
            body.append($('#editAvailable').attr('id'), false);

        $.ajax({
            url: `/admin/updateItem/${id}`,
            type: 'POST',
            data: body,
            processData: false,
            contentType: false
        }).then(
            function () {
                getMenuFromDB();
                $("#editItemModal").css("display", "none");
            },
            function () {
                alert('Error')
                $("#editItemModal").css("display", "none");
            }
        )

    })

    //Removes the chosen user from the db
    $("#review-body").on('click', '.remReview-btn', function () {
        var index = parseInt($(this).prop('name'));
        var id = reviews[index]._id;

        $.post(`/admin/removeReview/${id}`, function (result) {
            if (result) {
                reviews = reviews.filter(review => reviews.indexOf(review) !== index);
                buildReviewTable(reviews);
            } else {
                alert("Error");
            }
        });
    });
    $("#edit-closeBtn").click(function () {
        $("#editItemModal").css("display", "none");
    })
    $('#editMenu-xBtn').click(function () {
        $("#editItemModal").css("display", "none");
    });
    $("#add-item").click(function () {
        $("#addItemModal").css("display", "flex");
    });
    $('#addMenu-xBtn').click(function () {
        $("#addItemModal").css("display", "none");
    });
    $("#menu-closeBtn").click(function () {
        $("#addItemModal").css("display", "none");
    })
    $("#menu-submitBtn").click(function () {
        $("#addItemModal").css("display", "none");
    });
    $(window).click(function (event) {
        if (event.target.id == $("#addItemModal").attr('id'))
            $("#addItemModal").css("display", "none");
    });



    $(".button-container").on('click', '#userBtn', function () {
        showPanel(0, 'var(--red)');
    });
    $(".button-container").on('click', '#orderBtn', function () {
        showPanel(1, 'var(--red)');
    });
    $(".button-container").on('click', '#menuBtn', function () {
        showPanel(2, 'var(--red)');
    });
    $(".button-container").on('click', '#reviewBtn', function () {
        showPanel(3, 'var(--red)');
    });
})