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
socket.on('userdb-updated', change => {
    $.get('/getUsers', function (result) {
        users = result;
        filterUser("Date-Ascending", users);
    });
});

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

function buildUserTable(users) {
    var table = $('#userTable');
    table.empty();
    for (var i = 0; i < users.length; i++) {
        var row = `<tr class="user-row">
            <td>${users[i].DateJoined}</td>
            <td>${users[i].Username}</td>
            <td>${users[i].Email}</td>
            <td>${users[i].OrdersMade}</td>
            <td><button type="button" id="remButton" name="${i}">Remove</button></td>
        </tr>`
        table.append(row);
    };
}

/* Order Tab */

function getOrdersFromDB() {
    $.get('/getOrders', function (result) {
        orders = result;
        filterOrders('All', orders);
    })
}

function buildOrderTable(orders) {
    var table = $('#orderTable');
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
            <td>                
                <select id="${i}" class="orderProgressOptions" name="${i}">
                    <option value="Pending">Pending</option>
                    <option value="On Route">On Route</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            </td>
            </tr>`
            console.log(orders[i].Status)
            table.append(row);
             $(`#${i}`).val(`${orders[i].Status}`);
            // $(`#${i}`).filter(function () {
            //     return $(this).text() == orders[i].Status;
            // }).prop('selected', true);
        };
    }

}
function filterOrdetbyDate (filter, orders) {
    
}
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
    $.get('/getMenu', function (result) {
        menu = result;
        buildMenuTable(menu);
    });
}
function buildMenuTable(menu) {
    var table = $('#menuTable');
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
        table.append(row);
    };
}

/* Filters for User sorting */
function AtoZ(a, b) {
    if (a.Username.toLowerCase() < b.Username.toLowerCase()) {
        return -1;
    }
    if (b.Username.toLowerCase() > a.Username.toLowerCase()) {
        return 1;
    }
    return 0;
};

function ZtoA(a, b) {
    if (a.Username.toLowerCase() > b.Username.toLowerCase()) {
        return -1;
    }
    if (b.Username.toLowerCase() < a.Username.toLowerCase()) {
        return 1;
    }
    return 0;
};

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
    $('#orderTable').on('change', '.orderProgressOptions', function () {
        var index = parseInt($(this).prop('name'));
        var id = orders[index]._id;
        var status = $(`#${index} option:selected`).prop('value')
        var body = {
            orderID: id,
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
    $("#menuTable").on('click', '#remButton', function () {
        var index = parseInt($(this).prop('name'));
        var id = menu[index]._id;
        $.post(`/admin/removeItem/${id}`, function (result) {
            if (result) {
                getMenuFromDB();
            } else {
                alert("Error");
            }
        });
    });


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
    $("#edit-submitBtn").click(function () {
        var id = $("#editID").val();
        var foodName = $("#editFoodName").val();
        var price = $("#editPrice").val();
        var description = $("#editDescription").val();
        var category = $("#editCategory").val();
        var isAvailable = $("#editAvailable").is(":checked");

        var body = {
            FoodName: foodName,
            Price: price,
            Description: description,
            Category: category,
            isAvailable: isAvailable
        }

        $.post(`/admin/updateItem/${id}`, body, function(result) {
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