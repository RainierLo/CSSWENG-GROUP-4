let menu = {};
let categories = {};

/* This function is used to obtain the unique categories for each food item */
function getCategories(menu) {

    categories = menu.map(foodItem => foodItem.Category);

    let uniqueCategories = [...new Set(categories)]

    categories = uniqueCategories;
}

/* This function retrieves the bundle meal from the database and builds the table 
    in the bundlemeals.hbs file */
async function getBundle() {
    var result = await $.get('/getBundle').then() 
    if (result !== undefined) {
        menu = result;
        buildMenu(menu)
    }
}

/* This function creates a section per category and appends the food items
    in their own respective categories */
function buildMenu(menu) {
    getCategories(menu);
    var menuContainer = $('#menu-container');
    menuContainer.empty();

    if (menu.length > 0) {
        for (i = 0; i < menu.length; i++) {
            // Append to the section
            var foodItem = `
            <div class="menu1-card">
                <a href="/menu/${menu[i]._id}"><img src="${menu[i].ImagePath}"></a>
                <a href="/menu/${menu[i]._id}">
                <p>${menu[i].FoodName} - ${menu[i].Price}</p>
                </a>
            </div>`

            $(`#menu-container`).append(foodItem);
        }
    }
}

$(document).ready(async function () {
    await getBundle();
})