let cart = JSON.parse(localStorage.getItem("cart")) || [];
let cartItemsContainer, cartCount, totalPriceEl, checkoutBtn;

export function initCartElements({ container, count, totalEl, checkout }) {
    cartItemsContainer = container;
    cartCount = count;
    totalPriceEl = totalEl;
    checkoutBtn = checkout;
    updateCart();
}

export function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) existing.quantity++;
    else cart.push({ ...product, quantity: 1 });
    updateCart();
}

export function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

export function updateCart() {
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;

        const li = document.createElement("div");
        li.classList.add("cart-item");
        li.innerHTML = `
            <img src="${item.image}" class="cart-item-img">
            <div class="cart-item-info">
                <span class="cart-item-name">${item.name}</span>
                <span class="cart-item-price">R${(item.price * item.quantity).toFixed(2)}</span>
            </div>
            <button class="remove-item">&times;</button>
        `;
        li.querySelector(".remove-item")?.addEventListener("click", () => removeFromCart(item.id));
        cartItemsContainer.appendChild(li);
    });

    if (cartCount) cartCount.textContent = cart.reduce((sum, i) => sum + i.quantity, 0);
    if (totalPriceEl) totalPriceEl.textContent = total.toFixed(2);
    if (checkoutBtn) checkoutBtn.classList.toggle("hidden", cart.length === 0);

    localStorage.setItem("cart", JSON.stringify(cart));
}

// Initialize sidebar toggle
export function initCartEvents(cartBtn, cartSidebar, closeCartBtn) {
    if (!cartBtn || !cartSidebar || !closeCartBtn) return;

    cartBtn.addEventListener("click", () => cartSidebar.classList.add("open"));
    closeCartBtn.addEventListener("click", () => cartSidebar.classList.remove("open"));

    document.addEventListener("click", e => {
        if (cartSidebar.classList.contains("open") && !cartSidebar.contains(e.target) && !cartBtn.contains(e.target)) {
            cartSidebar.classList.remove("open");
        }
    });
}
