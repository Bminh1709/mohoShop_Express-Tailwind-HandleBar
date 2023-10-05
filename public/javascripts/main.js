var count = 1;
var quantity = document.getElementById('quantity');

function plus() {
    count++;
    quantity.value = count;
}

function minus() {
    if (count > 1) {
        count--;
        quantity.value = count;
    }
}

function adjustQuantity(button, action) {
    const input = button.parentElement.querySelector('input[type="number"]');
    const productId = input.getAttribute('data-product-id');
    
    // You can use the productId to identify which product is being adjusted
    // Update the quantity based on the action (increase or decrease)
    if (action === 'increase') {
        // Increase the quantity
        input.value = parseInt(input.value) + 1;
    } else if (action === 'decrease' && input.value > 1) {
        // Decrease the quantity, ensuring it's not less than 1
        input.value = parseInt(input.value) - 1;
    }
}


function showTabProfile(tabName) {
    // Get all tab content elements
    var tabContentProfiles = document.getElementsByClassName("tab-content-profile");

    // Hide all tab content
    for (var i = 0; i < tabContentProfiles.length; i++) {
        tabContentProfiles[i].style.display = "none";
    }
    // Show the selected tab content
    document.getElementById(tabName).style.display = "block";
}

