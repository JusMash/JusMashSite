import { addToCart } from "./cart.js";
import { createWavePlayer } from "./audioPlayer.js";

/**
 * Render beats or merch items into a container.
 * @param {HTMLElement} beatList - Container element.
 * @param {Array} products - Array of product objects (beats or merch).
 * @param {string} genre - Optional genre filter for beats (default: "all").
 */
export function renderBeats(beatList, products, genre = "all") {
    if (!beatList || !products || products.length === 0) return;

    // Filter beats by genre if it's a beat
    const filteredProducts = genre === "all"
        ? products
        : products.filter(p => p.Genre?.trim().toLowerCase() === genre.toLowerCase());

    beatList.innerHTML = "";

    if (!filteredProducts || filteredProducts.length === 0) {
        beatList.innerHTML = `<p>No ${genre.charAt(0).toUpperCase() + genre.slice(1)} items available.</p>`;
        return;
    }

    filteredProducts.forEach(product => {
        const item = document.createElement("div");
        item.classList.add("beat-item");

        if (product.Genre) {
            // Beat card
            item.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="clickable-item">
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

            // Initialize audio preview
            if (product.preview) {
                const canvas = item.querySelector(".wave-canvas");
                const playBtn = item.querySelector(".play-btn");
                const volumeBtn = item.querySelector(".volume-btn");
                if (canvas && playBtn && volumeBtn) createWavePlayer(product.preview, canvas, playBtn, volumeBtn);
            }

        } else {
            // Merch card
            item.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="clickable-item">
                <h3>${product.name}</h3>
                <p>Category: ${product.category || "Merch"}</p>
                <p>R${product.price.toFixed(2)}</p>
                <button class="add-to-cart">Add To Cart</button>
            `;
        }

        // Open item.html with product data in localStorage
       const img = item.querySelector(".clickable-item");
        if (img) {
            img.addEventListener("click", () => {
                window.location.href = `item.html?item=${encodeURIComponent(product.id)}`;
            });
        }


        // Add to cart
        item.querySelector(".add-to-cart")?.addEventListener("click", () => addToCart(product));

        // Append to container
        beatList.appendChild(item);
    });
}
