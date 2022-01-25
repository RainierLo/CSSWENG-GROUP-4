
function menuFilter(){
    document.getElementById("menuDropdown").classList.toggle("show");
}

// window.onclick = function(event) {
//     if (!event.target.matches('.drop-filter')) {
//         var dd = document.getElementsByClassName("drop-filter-content");
//         var i;
//         for (i = 0; i < dd.length; i++) {
//             var openDropdown = dd[i];
//             if (openDropdown.classList.contains('show')) {
//                 openDropdown.classList.remove('show');
//             }
//         }
//     }
// }




let menu = {};
let categories = {};

/* This function is used to obtain the unique categories for each food item */
function getCategories(menu) {

    categories = menu.map(foodItem => foodItem.Category);

    let uniqueCategories = [...new Set (categories)]
    
    categories = uniqueCategories;
}

/* This function retrieves the menu from the database and builds the table 
    in the menu.hbs file */
function getMenu() {
    $.get('/getMenu', function(result) {
        if (result !== undefined) {
            menu = result;
            console.log(menu);
            buildMenu(menu)
        }         
    })
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
    getCategories(menu);
    console.log(getCategories(menu));
    setDropdown();
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


$(document).ready(function() {
    getMenu();
    $('body').on('change', '#filter', function(){
        if($(this).val() == "appetizer") {
            $("#appetizer").show();
            $("#meat").hide();
            $("#seafood").hide();
            $("#vegetable").hide();
            $("#drinks").hide();
            $("#others").hide();
        } else if($(this).val() == "meat"){
            $("#appetizer").hide();
            $("#meat").show();
            $("#seafood").hide();
            $("#vegetable").hide();
            $("#drinks").hide();
            $("#others").hide();
        } else if($(this).val() == "seafood") {
            $("#appetizer").hide();
            $("#meat").hide();
            $("#seafood").show();
            $("#vegetable").hide();
            $("#drinks").hide();
            $("#others").hide();
        } else if($(this).val() == "vegetable") {
            $("#appetizer").hide();
            $("#meat").hide();
            $("#seafood").hide();
            $("#vegetable").show();
            $("#drinks").hide();
            $("#others").hide();
        } else if($(this).val() == "drinks") {
            $("#appetizer").hide();
            $("#meat").hide();
            $("#seafood").hide();
            $("#vegetable").hide();
            $("#drinks").show();
            $("#others").hide();
        } else if($(this).val() == "others") {
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