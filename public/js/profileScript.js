

let orders = {};

function getUserOrder() {
    $.get('/getUserOrder', function (result) {
        if (result) {
            orders = result;
            buildUserOrderTable(orders);
        }
    })
}

function buildUserOrderTable(orders) {
    let table = $('#userOrderTable');
    table.empty();
    if (orders.length > 0) {
        for (var i = 0; i < orders.length; i++) {
            var row = `<tr class="order-row">
            <td>${orders[i].DateOrdered}</td>
            <td>${getOrderString(orders[i].Cart)}</td>
            <td>₱ ${orders[i].TotalPrice}</td>
            <td>${orders[i].Status}</td>
            </tr>`
            //Append the row created to the table
            table.append(row);
        };
    } else {
        $('#userOrder-Table').empty();
        $('#emptyOrders').text('You have no orders. Order now!');
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

$(document).ready(function () {
    getUserOrder();
})