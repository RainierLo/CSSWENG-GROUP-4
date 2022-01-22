function menuFilter(){
    document.getElementById("menuDropdown").classList.toggle("show");
}

window.onclick = function(event) {
    if (!event.target.matches('.drop-filter')) {
        var dd = document.getElementsByClassName("drop-filter-content");
        var i;
        for (i = 0; i < dd.length; i++) {
            var openDropdown = dd[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}