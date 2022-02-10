
function menuFilter() {
    document.getElementById("menuDropdown").classList.toggle("show");
}

let menu = {};
let categories = ['Appetizer', 'Meat', 'Vegetable', 'Seafood', 'Drinks', 'Others'];


/* This function retrieves the menu from the database and builds the table 
    in the menu.hbs file */
async function getMenu() {
    var result = await $.get('/getMenu').then()
    if (result !== undefined) {
        menu = result;
        buildMenu(menu)

        var category = $('#Category').attr('name');
        filterMenu(category, menu)
    }
}


/* Sets the dropdown options to the acquired categories */
function setDropdown() {
    var dropdown = $('#menuDropdown');
    var allOption = `<a href=''>All</a>`;
    dropdown.append(allOption);

    categories.forEach(category => {
        var option = `<a href='#${category.toLowerCase()}'>${category}</a>`
        dropdown.append(option);
    });
}

/* This function creates a section per category and appends the food items
    in their own respective categories */
function buildMenu(menu) {
    var menuContainer = $('#menu-container');
    menuContainer.empty();

    if (menu.length > 0) {
        //Go through each unique category
        categories.forEach(category => {
            var section = `<section id="${category.toLowerCase()}" class="menu"></section>`;
            menuContainer.append(section);
            var title = `<div class="menu-title">${category.toUpperCase()}</div>`;
            var itemDiv = `<div id="${category.toLowerCase()}Grid"class="m1"></div>`;
            $(`#${category.toLowerCase()}`).append(title)
            $(`#${category.toLowerCase()}`).append(itemDiv)
            //Go through each item in the menu and compare the category
            for (i = 0; i < menu.length; i++) {
                //If the food item's category matches the current unique category, append it to the section
                if (menu[i].Category == category) {
                    var foodItem = `
                    <div class="menu1-card">
                        <a href="/menu/${menu[i]._id}"><img src="${menu[i].ImagePath}"></a>
                        <a href="/menu/${menu[i]._id}">
                        <p>${menu[i].FoodName} - ${menu[i].Price}</p>
                        </a>
                    </div>`

                    $(`#${category.toLowerCase()}Grid.m1`).append(foodItem);
                }
            }
        })
    }
}

/* This function filters the menu based on the category selected */
function filterMenu(category, menu) {
    buildMenu(menu);
    switch (category) {
        case 'all':
            $('#filter').val(category)
            $("#appetizer").show();
            $("#meat").show();
            $("#seafood").show();
            $("#vegetable").show();
            $("#drinks").show();
            $("#others").show();
            break;
        case 'appetizer':
            $('#filter').val(category)
            $("#appetizer").show();
            $("#meat").hide();
            $("#seafood").hide();
            $("#vegetable").hide();
            $("#drinks").hide();
            $("#others").hide();
            break;
        case 'meat':
            $('#filter').val(category)
            $("#appetizer").hide();
            $("#meat").show();
            $("#seafood").hide();
            $("#vegetable").hide();
            $("#drinks").hide();
            $("#others").hide();
            break;
        case 'seafood':
            $('#filter').val(category)
            $("#appetizer").hide();
            $("#meat").hide();
            $("#seafood").show();
            $("#vegetable").hide();
            $("#drinks").hide();
            $("#others").hide();
            break;
        case 'vegetable':
            $('#filter').val(category)
            $("#appetizer").hide();
            $("#meat").hide();
            $("#seafood").hide();
            $("#vegetable").show();
            $("#drinks").hide();
            $("#others").hide();
            break;
        case 'drinks':
            $('#filter').val(category)
            $("#appetizer").hide();
            $("#meat").hide();
            $("#seafood").hide();
            $("#vegetable").hide();
            $("#drinks").show();
            $("#others").hide();
            break;
        case 'others':
            $('#filter').val(category)
            $("#appetizer").hide();
            $("#meat").hide();
            $("#seafood").hide();
            $("#vegetable").hide();
            $("#drinks").hide();
            $("#others").show();
            break;
    }
}

$(document).ready(async function () {
    getMenu();
    $('body').on('change', '#filter', function () {
        if ($(this).val() == "appetizer") {
            $("#appetizer").show();
            $("#meat").hide();
            $("#seafood").hide();
            $("#vegetable").hide();
            $("#drinks").hide();
            $("#others").hide();
        } else if ($(this).val() == "meat") {
            $("#appetizer").hide();
            $("#meat").show();
            $("#seafood").hide();
            $("#vegetable").hide();
            $("#drinks").hide();
            $("#others").hide();
        } else if ($(this).val() == "seafood") {
            $("#appetizer").hide();
            $("#meat").hide();
            $("#seafood").show();
            $("#vegetable").hide();
            $("#drinks").hide();
            $("#others").hide();
        } else if ($(this).val() == "vegetable") {
            $("#appetizer").hide();
            $("#meat").hide();
            $("#seafood").hide();
            $("#vegetable").show();
            $("#drinks").hide();
            $("#others").hide();
        } else if ($(this).val() == "drinks") {
            $("#appetizer").hide();
            $("#meat").hide();
            $("#seafood").hide();
            $("#vegetable").hide();
            $("#drinks").show();
            $("#others").hide();
        } else if ($(this).val() == "others") {
            $("#appetizer").hide();
            $("#meat").hide();
            $("#seafood").hide();
            $("#vegetable").hide();
            $("#drinks").hide();
            $("#others").show();
        } else {
            $("#appetizer").show();
            $("#meat").show();
            $("#seafood").show();
            $("#vegetable").show();
            $("#drinks").show();
            $("#others").show();
        }
    });
})