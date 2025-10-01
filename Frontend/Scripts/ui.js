import { initCartEvents } from "./cart.js";

export function initUI({ cartBtn, cartSidebar, closeCartBtn } = {}) {
    initScrollAnimations();
    if (cartBtn && cartSidebar && closeCartBtn) initCartEvents(cartBtn, cartSidebar, closeCartBtn);
}

export function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(".fade-in, .slide-up");

    function revealOnScroll() {
        const triggerBottom = window.innerHeight * 0.85;
        animatedElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < triggerBottom) el.classList.add("visible");
        });
    }

    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll();
}
