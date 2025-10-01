// Elements
const purchasedItemsContainer = document.getElementById("purchased-items");
const totalAmountEl = document.getElementById("total-amount");
const billingForm = document.getElementById("billing-form");
const checkmarkContainer = document.getElementById("checkmark-container");

// Load cart
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let total = 0;

// Render purchased items (always visible)
if(cart.length === 0){
    purchasedItemsContainer.innerHTML = "<p>No items in cart.</p>";
    totalAmountEl.textContent = "";
} else {
    purchasedItemsContainer.style.opacity = 1; // ensure visible

    cart.forEach(item => {
        total += item.price * item.quantity;

        const div = document.createElement("div");
        div.classList.add("purchased-item");

        div.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="purchased-item-info">
                <span class="purchased-item-name">${item.name}</span>
                <span class="purchased-item-quantity">Quantity: ${item.quantity}</span>
                <span class="purchased-item-price">R${(item.price * item.quantity).toLocaleString()}</span>
            </div>
        `;

        purchasedItemsContainer.appendChild(div);
    });

    totalAmountEl.textContent = `Total: R${total.toLocaleString()}`;
}

// Handle billing form submission
billingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Show checkmark animation
    checkmarkContainer.style.display = "block";
    const svg = checkmarkContainer.querySelector(".checkmark");
    svg.style.transform = "scale(1)";

    // Optional: Add fade effect for purchased items (already visible)
    purchasedItemsContainer.style.transition = "opacity 0.8s ease";
    purchasedItemsContainer.style.opacity = 1;

    // Clear cart
    localStorage.removeItem("cart");
    cart = [];

    // Optional redirect after 3 seconds
    setTimeout(() => {
        window.location.href = "index.html";
    }, 3000);
});
