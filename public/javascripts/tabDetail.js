document.getElementById("product-info").classList.add("border-b");
document.getElementById("product-info").classList.add("border-MydarkYellow");
document.getElementById("info").style.display = "block";

function showTab(tabName) {
    // Get all tab content elements
    var tabContents = document.getElementsByClassName("tab-content");

    // Hide all tab content
    for (var i = 0; i < tabContents.length; i++) {
        tabContents[i].style.display = "none";
    }

    // Remove the class from all buttons
    var tabButtons = document.querySelectorAll(".border-b.border-MydarkYellow");
    for (var i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove("border-b");
        tabButtons[i].classList.remove("border-MydarkYellow");
    }

    // Show the selected tab content
    document.getElementById(tabName).style.display = "block";

    // Add the class to the clicked button
    document.getElementById("product-" + tabName).classList.add("border-b");
    document.getElementById("product-" + tabName).classList.add("border-MydarkYellow");
}