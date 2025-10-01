// item.js
import { products } from "../Data/beats.js";
import { merchProducts } from "../Data/merch-pro.js";
import { addToCart } from "./cart.js";

document.addEventListener("DOMContentLoaded", () => {
  const itemContainer = document.getElementById("item-details");
  const noResultsMessage = document.getElementById("no-results-message");

  // 1. Get item ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const itemId = urlParams.get("item");

  if (!itemId) {
    noResultsMessage.classList.remove("hidden");
    return;
  }

  // Convert to number in case IDs are numeric
  const idNum = Number(itemId);

  // 2. Find item in beats or merch
  const item =
    products.find(p => p.id === idNum || p.id === itemId) ||
    merchProducts.find(m => m.id === idNum || m.id === itemId);

  if (!item) {
    noResultsMessage.classList.remove("hidden");
    return;
  }

  // 3. Render item details
  itemContainer.innerHTML = `
    <div class="item-card">
      <img src="${item.image}" alt="${item.name}">
      <h2>${item.name}</h2>
      ${item.Genre ? `
        <p>Genre: ${item.Genre}</p>
        <p>BPM: ${item.BPM}</p>
        <p>Producer: ${item.producer}</p>
        ${item.preview ? `
          <div class="audio-preview">
            <audio controls src="${item.preview}"></audio>
          </div>
        ` : ""}
      ` : `<p>Category: ${item.category}</p>`}
      <p>Price: R${item.price.toFixed(2)}</p>
      <button id="addToCartBtn" class="add-to-cart">Add To Cart</button>
    </div>
  `;

  // 4. Add to cart button
  document.getElementById("addToCartBtn").addEventListener("click", () => addToCart(item));
});
