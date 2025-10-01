// main.js
import { products } from "../Data/beats.js"; // Adjust if Data folder is elsewhere
import { renderBeats } from "./renderBeats.js";
import { initCartEvents, initCartElements } from "./cart.js";
import { initSearch } from "./searrch.js";
import { initUI } from "./ui.js";
import { initAuth } from "./auth.js"; // Import auth module

document.addEventListener("DOMContentLoaded", () => {
  // ---- Cart Elements ----
  const cartSidebar = document.getElementById("cart-sidebar");
  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cart-count");
  const totalPrice = document.getElementById("total-price");
  const checkoutBtn = document.getElementById("checkout");

  initCartElements({
    container: cartItems,
    count: cartCount,
    totalEl: totalPrice,
    checkout: checkoutBtn
  });

  // ---- Render Beats ----
  const beatList = document.querySelector(".beat-list");
  if (beatList && products && products.length > 0) {
    renderBeats(beatList, products, "all");
  } else {
    console.warn("Beat list container or products array is missing/empty");
  }

  // ---- Cart Sidebar Toggle ----
  const cartIcon = document.getElementById("cart-icon");
  const closeCartBtn = document.getElementById("closeCartBtn");
  initCartEvents(cartIcon, cartSidebar, closeCartBtn);

  // ---- Search Initialization ----
  initSearch();

  // ---- UI Animations ----
  initUI();

  // ---- Auth Modal Initialization ----
  initAuth();

  // ---- Show logged-in user or logout button ----
  const userName = localStorage.getItem("userName");
  const nav = document.querySelector("nav");

  if (userName && nav) {
    // Hide login/signup buttons
    const loginBtns = document.querySelectorAll("#loginBtn, #heroLoginBtn");
    const signupBtns = document.querySelectorAll("#signupBtn, #heroSignupBtn");
    loginBtns.forEach(btn => btn.style.display = "none");
    signupBtns.forEach(btn => btn.style.display = "none");

    // Show welcome message with logout
    if (!document.querySelector(".welcome-user")) {
      const welcomeEl = document.createElement("span");
      welcomeEl.classList.add("welcome-user");
      welcomeEl.style.marginLeft = "15px";
      welcomeEl.innerHTML = `Welcome, ${userName} <button id="logoutBtn" class="logout-btn">Logout</button>`;
      nav.appendChild(welcomeEl);

      const logoutBtn = document.getElementById("logoutBtn");
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userPassword");
        location.reload(); // Refresh page to show login/signup buttons again
      });
    }
  }
});

img.addEventListener("click", () => {
    window.location.href = `item.html?item=${encodeURIComponent(product.id)}`;
});
