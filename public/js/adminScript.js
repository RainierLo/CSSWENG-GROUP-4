var tabButtons=document.querySelectorAll(".tab-container .button-container button");
var tabPanels=document.querySelectorAll(".tab-container .tab-panel");

function showPanel(panelIndex, colorCode){
    tabButtons.forEach(function(node){
        node.style.backgroundColor="";
        node.style.color="";
    });
    tabButtons[panelIndex].style.backgroundColor=colorCode;
    tabButtons[panelIndex].style.color="white";
    tabPanels.forEach(function(node) {
        node.style.display="none";
    });
    tabPanels[panelIndex].style.display="block";
    tabPanels[panelIndex].style.backgroundColor=colorCode;
}
showPanel(0,'var(--red)');

import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
const socket = io("http://localhost:3000");


var users = {};
var orders = {};
var menu = {};
/* User Tab */
function getUsersFromDB() {
    $.get('/getUsers', function (result) {
        users = result;
        buildUserTable(users);
    });
};

function buildUserTable(users) {
    var table = $('#userTable');
    table.empty();
    for (var i = 0; i < users.length; i++) {
        var row = `<tr>
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
        buildOrderTable(orders);
    })
}

function buildOrderTable(orders) {
    var table = $('#orderTable');
    table.empty();
    for (var i = 0; i < orders.length; i++) { 
        var row = `<tr>
        <td>${orders[i].User.Username}</td>
        <td>${orders[i].User.Email}</td>
        <td>${orders[i].User.MobileNumber}</td>    
        <td>${orders[i].Address}</td>
        <td>${getOrderString(orders[i].Cart)}</td>
        <td>${orders[i].TotalPrice}</td>
        <td>${orders[i].Status}</td>
        </tr>`
        table.append(row);
    };
}

function getOrderString (Cart) {
    var orderStr = ''
    Cart.map(item => {
        var str = `${item.Quantity}x ${item.FoodName} <br/>`;
        orderStr = orderStr.concat('', str);
    })
   return orderStr;
}
/* Menu Tab */
$(document).ready(function () {

    $(".button-container").on('click', '#userBtn', function () {
        showPanel(0, 'var(--red)');
    });
    $(".button-container").on('click', '#orderBtn', function () {
        showPanel(1, 'var(--red)');
    });
    $(".button-container").on('click', '#menuBtn', function () {
        showPanel(2, 'var(--red)');
    });

    getUsersFromDB();
    getOrdersFromDB();
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
})