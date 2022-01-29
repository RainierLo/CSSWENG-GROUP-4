var tabButtons = document.querySelectorAll(".tab-container .button-container button");
var tabPanels = document.querySelectorAll(".tab-container .tab-panel");

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
const socket = io("http://localhost:3000");
var users = {};
var orders = {};
var menu = {};

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
function getUsersFromDB() {
    $.get('/getUsers', function (result) {
        users = result;
        filterUser("Date-Ascending", users);
    });
};

/* This function appends each item of the user array as rows to 
   the user table*/
function buildUserTable(users) {
    var table = $('#userTable');
    //Clear the body of the table
    table.empty();
    for (var i = 0; i < users.length; i++) {
        var row = `<tr class="user-row">
            <td>${users[i].DateJoined}</td>
            <td>${users[i].Username}</td>
            <td>${users[i].Email}</td>
            <td>${users[i].OrdersMade}</td>
            <td><button type="button" id="remButton" name="${i}">Remove</button></td>
        </tr>`
        //Append the row created to the table
        table.append(row);
    };
}

/* Order Tab */

function getOrdersFromDB() {
    $.get('/getOrders', function (result) {
        orders = result;
        filterOrders('Pending', orders);
    })
}
/* This function appends each item of the order array as rows to 
   the order table*/
function buildOrderTable(orders) {
    var table = $('#orderTable');
    //Clear the body of the table
    table.empty();
    //console.log(orders);
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
            <td id="StatusCol${i}">                
                <select id="${i}" class="orderProgressOptions" name="${i}">
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
            $(`#${i}`).val(`${orders[i].Status}`);

            if (orders[i].Status == 'Completed' || orders[i].Status == 'Cancelled') {
                $(`#StatusCol${i}`).empty();
                $(`#StatusCol${i}`).text(orders[i].Status);
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

function getMenuFromDB() {
    $.get('/getAdminMenu', function (result) {
        menu = result;
        buildMenuTable(menu);
    });
}
/* This function appends each item of the menu array as rows to 
   the menu table*/
function buildMenuTable(menu) {
    var table = $('#menuTable');
    //Clear the body of the table
    table.empty();
    for (var i = 0; i < menu.length; i++) {
        var row = `<tr class="menu-row">
        <td><img height="150" width="150" src="${menu[i].ImagePath}"></td>
        <td>${menu[i].FoodName}</td>
        <td>${menu[i].Price}</td>
        <td>${menu[i].Description}</td>
        <td>${menu[i].Category}</td>
        <td><button type="button" id="editButton" name="${i}">Edit</button></td>    
        <td><button type="button" id="remButton" name="${i}">Remove</button></td>
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

$(document).ready(function () {
    getUsersFromDB();
    getOrdersFromDB();
    getMenuFromDB();

    //Removes the chosen user from the db
    $("#userTable").on('click', '#remButton', function () {
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
    $('#orderTable').on('change', '.orderProgressOptions', function () {
        var index = parseInt($(this).prop('name'));
        var id = orders[index]._id;
        var userID = orders[index].User._id;
        var status = $(`#${index} option:selected`).prop('value')
        var body = {
            orderID: id,
            userID: userID,
            Status: status
        }

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
    $("#menuTable").on('click', '#remButton', function () {
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

    //Allows for updating / editing of the current food item's values
    $("#menuTable").on('click', '#editButton', function () {
        var index = parseInt($(this).prop('name'));
        var item = menu[index];
        $("#editID").val(`${item._id}`);
        $("#editFoodName").val(`${item.FoodName}`);
        $("#editPrice").val(`${item.Price}`);
        $("#editDescription").val(`${item.Description}`);
        $("#editCategory").val(`${item.Category}`);
        $("#editAvailable").prop("checked", item.isAvailable);
        $("#editItemModal").css("display", "block");
    });

    //Makes the post request to accomplish the update of values
    $("#edit-submitBtn").click(function () {
        var id = $("#editID").val();
        var foodName = $("#editFoodName").val();
        var price = $("#editPrice").val();
        var description = $("#editDescription").val();
        var category = $("#editCategory option:selected").val();
        var isAvailable = $("#editAvailable").is(":checked");

        var body = {
            FoodName: foodName,
            Price: price,
            Description: description,
            Category: category,
            isAvailable: isAvailable
        }
        $.post(`/admin/updateItem/${id}`, body, function (result) {
            if (result === 'Success') {
                getMenuFromDB();
                $("#editItemModal").css("display", "none");
            } else {
                alert('Error updating item')
            }
        })
    })
    $("#edit-closeBtn").click(function () {
        $("#editItemModal").css("display", "none");
    })

    $("#add-item").click(function () {
        $("#addItemModal").css("display", "block");
    });

    $("#menu-closeBtn").click(function () {
        $("#addItemModal").css("display", "none");
    })
    $("menu-submitBtn").click(function () {
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
})