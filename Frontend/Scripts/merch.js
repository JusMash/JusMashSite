import { merchProducts } from "../Data/merch-pro.js";

document.addEventListener("DOMContentLoaded", () => {
  const merchList = document.querySelector(".merch-list");
  const cartSidebar = document.getElementById("cart-sidebar");
  const cartItemsContainer = document.getElementById("cartItems");
  const cartCount = document.getElementById("cart-count");
  const totalPriceEl = document.getElementById("total-price");
  const checkoutBtn = document.getElementById("checkout");
  const closeCartBtn = document.getElementById("closeCartBtn");
  const cartBtn = document.getElementById("cart-icon");

  let cart = [];

  // Load saved cart
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCart();
  }

  // Render merch
  function renderMerch() {
    merchList.innerHTML = "";
    merchProducts.forEach(product => {
      const item = document.createElement("div");
      item.classList.add("beat-item");

      let sizeSelect = "";
      let colorSelect = "";

      // Add size options if product has sizes
      if (product.sizes) {
        sizeSelect = `<label>Size:
                        <select class="size-select">
                          ${product.sizes.map(s => `<option value="${s}">${s}</option>`).join("")}
                        </select>
                      </label>`;
      }

      // Add color options if product has colors
      if (product.colors) {
        colorSelect = `<label>Color:
                        <select class="color-select">
                          ${product.colors.map(c => `<option value="${c.image}">${c.name}</option>`).join("")}
                        </select>
                      </label>`;
      }

      item.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <h3>${product.name}</h3>
        <p>R${product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        ${sizeSelect}
        ${colorSelect}
        <button class="add-to-cart">Add To Cart</button>
      `;

      // Change image on color select
      const colorDropdown = item.querySelector(".color-select");
      if (colorDropdown) {
        colorDropdown.addEventListener("change", (e) => {
          item.querySelector(".product-image").src = e.target.value;
        });
      }

      item.querySelector(".add-to-cart").addEventListener("click", () => {
        const selectedSize = item.querySelector(".size-select")?.value || null;
        const selectedColor = item.querySelector(".color-select")?.value || product.image;
        addToCart({ ...product, selectedSize, selectedColor, image: selectedColor });
      });

      merchList.appendChild(item);
    });
  }

  // Add to cart
  function addToCart(product) {
    // Optional: merge identical products with same size & color
    const existingItem = cart.find(item => 
      item.id === product.id &&
      item.selectedSize === product.selectedSize &&
      item.selectedColor === product.selectedColor
    );
    if (existingItem) existingItem.quantity += 1;
    else cart.push({ ...product, quantity: 1 });
    updateCart();
  }

  // Update cart
  function updateCart() {
    cartItemsContainer.innerHTML = "";
    let total = 0;
    cart.forEach(item => {
      total += item.price * item.quantity;
      const li = document.createElement("li");
      li.classList.add("cart-item");
      li.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-info">
          <span class="cart-item-name">${item.name}${item.selectedSize ? " (" + item.selectedSize + ")" : ""}</span>
          <span class="cart-item-price">R${(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
        <button class="remove-item">&times;</button>
      `;
      li.querySelector(".remove-item").addEventListener("click", () => removeFromCart(item.id, item.selectedSize, item.selectedColor));
      cartItemsContainer.appendChild(li);
    });
    cartCount.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
    totalPriceEl.textContent = total.toLocaleString(undefined, { minimumFractionDigits: 2 });
    checkoutBtn.classList.toggle("hidden", cart.length === 0);
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function removeFromCart(id, size, color) {
    cart = cart.filter(item => !(item.id === id && item.selectedSize === size && item.selectedColor === color));
    updateCart();
  }

  cartBtn.addEventListener("click", () => cartSidebar.classList.add("open"));
  closeCartBtn.addEventListener("click", () => cartSidebar.classList.remove("open"));
  document.addEventListener("click", e => {
    if (cartSidebar.classList.contains("open") &&
        !cartSidebar.contains(e.target) &&
        !cartBtn.contains(e.target)) {
      cartSidebar.classList.remove("open");
    }
  });

  renderMerch();

  // Animate on scroll
  const animatedElements = document.querySelectorAll(".fade-in, .slide-up");
  function revealOnScroll() {
    const triggerBottom = window.innerHeight * 0.85;
    animatedElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < triggerBottom) {
        el.classList.add("visible");
      }
    });
  }
  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll();
});

