function toggleFilter(filter, arrow) {


    const dropdownMenu = document.getElementById(filter);
    const arrowIcon = document.getElementById(arrow);

    dropdownMenu.classList.toggle("hidden");

    if (dropdownMenu.classList.contains("hidden")) {
        arrowIcon.style.transform = "rotate(0deg)";
    } else {
        arrowIcon.style.transform = "rotate(180deg)";
    }
}

function hide() {
    const menu = document.getElementById("filters");

    menu.classList.toggle("hidden");
}

function toggleFilters() {
    const menu = document.getElementById("filters");

    menu.classList.toggle("hidden");
    if (menu.classList.contains("hidden")) {
        document.removeEventListener("click", MenuOutsideClick);
    } else {
        document.addEventListener("click", MenuOutsideClick);
    }

}

function MenuOutsideClick(event) {
    const filter = document.getElementById("filters");
    const content = document.getElementById("content");

    if (filter.contains(event.target) && !content.contains(event.target)) {
        filter.classList.add("hidden");
        document.removeEventListener("click", MenuOutsideClick);
    }
}