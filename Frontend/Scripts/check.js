// Checkout JS – check.js

// Get DOM elements
const cartContainer = document.getElementById("cart-item-container");
const itemCount = document.getElementById("item-count");
const itemCountTotal = document.getElementById("item-count-total");
const totalAmount = document.getElementById("total-amount");

// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Render cart items
function renderCart() {
  cartContainer.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    totalAmount.textContent = "0.00";
    itemCount.textContent = 0;
    itemCountTotal.textContent = 0;
    return;
  }

  cart.forEach(item => {
    total += item.price * item.quantity;

    const div = document.createElement("div");
    div.classList.add("cart-item");

    div.innerHTML = `
    <div class="cart-item-left">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
    </div>
    <div class="cart-item-info">
      <span class="cart-item-name">${item.name}</span>
      <span class="cart-item-price">R${(item.price * item.quantity).toFixed(2)}</span>
      <span class="cart-item-quantity">Quantity: ${item.quantity}</span>
    </div>
    <button class="remove-item">&times;</button>
    `;


    // Remove item button
    div.querySelector(".remove-item").addEventListener("click", () => {
      removeItem(item.id);
    });

    cartContainer.appendChild(div);
  });

  itemCount.textContent = cart.reduce((acc, i) => acc + i.quantity, 0);
  itemCountTotal.textContent = cart.reduce((acc, i) => acc + i.quantity, 0);
  totalAmount.textContent = total.toFixed(2);
}

// Remove item
function removeItem(id) {
  cart = cart.filter(item => item.id !== id);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

// Initial render
renderCart();

// Checkout form submission
document.getElementById("checkout-form").addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Purchase completed!");
  cart = [];
  localStorage.removeItem("cart");
  renderCart();
});

// Redirect to final purchase page
document.getElementById("complete-purchase-btn").addEventListener("click", () => {
    if(cart.length === 0){
        alert("Your cart is empty!");
        return;
    }
    // Optionally, you can also clear the cart here or after successful completion
    window.location.href = "purchase-complete.html"; // change to your actual page
});
 async function submitOrder(cart) {
  try {
    const response = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(cart)
    });

    const result = await response.json();
    alert(result.message); // Order saved offline
  } catch (err) {
    alert("Error saving order")
  }
 }