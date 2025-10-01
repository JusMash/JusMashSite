import { products } from "../Data/beats.js";
import { initAuth } from "./auth.js"; // Import auth module


// ------------------ DOM ELEMENTS ------------------
// Automatically pick cart items container (handles cart-items vs cartItems)
const beatList = document.querySelector(".beat-list");
const cartSidebar = document.getElementById("cart-sidebar");
const cartItemsContainer = document.getElementById("cart-items") || document.getElementById("cartItems");
const cartCount = document.getElementById("cart-count");
const totalPriceEl = document.getElementById("total-price");
const checkoutBtn = document.getElementById("checkout");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartBtn = document.getElementById("cart-icon");

//---INIT AUTH---
document.addEventListener("DOMContentLoaded", () => {
    initAuth();

    const userName = localStorage.getItem("userName");
    const nac = document.querySelector ("nav");

    if (userName && nav) {
        const loginBtns = document.querySelectorAll("#loginBtn, #heroLoginBtn");
        const signupBtns = document.querySelectorAll("#signupBtn, #heroSignupBtn");
        loginBtns.forEach(btn => btn.style.display = "none");
        signupBtns.forEach(btn => btn.style.display = "none");

        if(!document.querySelector(".welcome-user")) {
            const welcomeEl = document.createElement("span");
            welcomeEl.classList.add("welcome-user");
            welcomeEl.style.marginLeft = "15px";
            welcomeEl.innerHTML = `Welcome, ${userName} <button id="logoutBtn" class="logout-btn>Logout</button>`;
            nav.appendChild(welcomeEl);
        }

        const logoutBtn = document.getElementById("logoutBtn");
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("userName");
            localStorage.removeItem("userEmail");
            localStorage.removeItem("userPassword");
            location.reload();
        });
    }
});

// Get genre from body
const genre = document.body.dataset.genre?.trim().toLowerCase() || "all";

// ------------------ CART ------------------
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ------------------ FILTER BEATS ------------------
const filteredBeats = genre === "all"
    ? products
    : products.filter(p => p.Genre?.trim().toLowerCase() === genre);

// ------------------ RENDER BEATS ------------------
function renderBeats() {
    if (!beatList) return;

    beatList.innerHTML = "";

    if (!filteredBeats || filteredBeats.length === 0) {
        beatList.innerHTML = `<p>No ${genre.charAt(0).toUpperCase() + genre.slice(1)} beats available.</p>`;
        return;
    }

    filteredBeats.forEach(product => {
        const beatItem = document.createElement("div");
        beatItem.classList.add("beat-item");

        beatItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <h4>Genre: ${product.Genre}</h4>
            <h4>BPM: ${product.BPM}</h4>
            <h4>Producer: ${product.producer}</h4>
            <p>R${product.price.toFixed(2)}</p>
            <div class="custom-audio-player">
                <button class="play-btn">▶</button>
                <button class="volume-btn">🔊</button>
                <canvas class="wave-canvas"></canvas>
            </div>
            <button class="add-to-cart">Add To Cart</button>
        `;

        // Add to cart
        const addBtn = beatItem.querySelector(".add-to-cart");
        if (addBtn) addBtn.addEventListener("click", () => addToCart(product));

        beatList.appendChild(beatItem);

        // Audio player
        if (product.preview) {
            const canvas = beatItem.querySelector(".wave-canvas");
            const playBtn = beatItem.querySelector(".play-btn");
            const volumeBtn = beatItem.querySelector(".volume-btn");
            if (canvas && playBtn && volumeBtn) createWavePlayer(product.preview, canvas, playBtn, volumeBtn);
        }
    });
}

// ------------------ CART LOGIC ------------------
function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) existing.quantity++;
    else cart.push({ ...product, quantity: 1 });
    updateCart();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

function updateCart() {
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

// ------------------ SIDEBAR ------------------
if (cartBtn && cartSidebar && closeCartBtn) {
    cartBtn.addEventListener("click", () => cartSidebar.classList.add("open"));
    closeCartBtn.addEventListener("click", () => cartSidebar.classList.remove("open"));
    document.addEventListener("click", e => {
        if (cartSidebar.classList.contains("open") && !cartSidebar.contains(e.target) && !cartBtn.contains(e.target)) {
            cartSidebar.classList.remove("open");
        }
    });
}

// ------------------ AUDIO PLAYER ------------------
function createWavePlayer(audioSrc, canvas, playBtn, volumeBtn) {
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = 60;

    const audio = new Audio(audioSrc);
    audio.crossOrigin = "anonymous";
    audio.volume = 0.8;

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioCtx.createAnalyser();
    const source = audioCtx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyser.fftSize = 256;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    let isPlaying = false;
    let isMuted = false;

    playBtn.addEventListener("click", () => {
        if (!isPlaying) { audioCtx.resume(); audio.play(); playBtn.textContent = "⏸"; }
        else { audio.pause(); playBtn.textContent = "▶"; }
        isPlaying = !isPlaying;
    });

    volumeBtn.addEventListener("click", () => {
        isMuted ? (audio.volume = 0.8, volumeBtn.textContent = "🔊") : (audio.volume = 0, volumeBtn.textContent = "🔇");
        isMuted = !isMuted;
    });

    canvas.addEventListener("click", e => {
        const rect = canvas.getBoundingClientRect();
        audio.currentTime = ((e.clientX - rect.left) / canvas.width) * audio.duration;
    });

    function drawWave() {
        requestAnimationFrame(drawWave);
        analyser.getByteFrequencyData(dataArray);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const width = canvas.width, height = canvas.height, sliceWidth = width / dataArray.length;
        let x = 0;
        ctx.beginPath();
        for (let i = 0; i < dataArray.length; i++) {
            const v = dataArray[i] / 255;
            const y = height / 2 - v * 30;
            const offsetY = Math.sin(i * 0.3 + Date.now() * 0.002) * v * 15;
            const finalY = y + offsetY;
            ctx.strokeStyle = x / width <= (audio.currentTime / audio.duration || 0) ? "#ff6a00" : "#ccc";
            i === 0 ? ctx.moveTo(x, finalY) : ctx.lineTo(x, finalY);
            x += sliceWidth;
        }
        ctx.lineWidth = 2.5;
        ctx.stroke();
    }
    drawWave();
}

// ------------------ ANIMATE ON SCROLL ------------------
document.addEventListener("DOMContentLoaded", () => {
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
});

// ------------------ INITIALIZE ------------------
renderBeats();
updateCart();


