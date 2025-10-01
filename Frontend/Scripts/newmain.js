// Import modules
import { initAuth } from "./auth.js";
import { initUI } from "./ui.js";
import { initSearch } from "./search.js";
import { renderBeats } from "./renderBeats.js";
import { updateCart, initCartEvents } from "./cart.js";

// Initialize DOM-dependent functions
document.addEventListener("DOMContentLoaded", () => {
  
  // 1️⃣ Initialize UI animations (scroll effects, etc.)
  initUI();

  // 2️⃣ Initialize auth (login/signup modal)
  initAuth();

  // 3️⃣ Initialize search bar
  initSearch();

  // 4️⃣ Initialize cart sidebar
  const cartBtn = document.getElementById("cart-icon");
  const cartSidebar = document.getElementById("cart-sidebar");
  const closeCartBtn = document.getElementById("closeCartBtn");
  initCartEvents(cartBtn, cartSidebar, closeCartBtn);
  updateCart();

  // 5️⃣ If there is a beat-list container (like on beats pages)
  const beatList = document.querySelector(".beat-list");
  if (beatList && window.products) {
    renderBeats(beatList, window.products, "all"); // assumes products are globally available
  }

  // 6️⃣ Show logged-in user info in navbar
  const userName = localStorage.getItem("userName");
  if (userName) {
    // Hide login/signup buttons
    const loginBtns = document.querySelectorAll("#loginBtn, #heroLoginBtn");
    const signupBtns = document.querySelectorAll("#signupBtn, #heroSignupBtn");
    loginBtns.forEach(btn => btn.style.display = "none");
    signupBtns.forEach(btn => btn.style.display = "none");

    // Show welcome message
    const navbar = document.querySelector("nav");
    if (navbar && !document.querySelector(".welcome-user")) {
      const welcomeEl = document.createElement("span");
      welcomeEl.textContent = `Welcome, ${userName}`;
      welcomeEl.classList.add("welcome-user");
      welcomeEl.style.marginLeft = "15px";
      navbar.appendChild(welcomeEl);
    }
  }
});
