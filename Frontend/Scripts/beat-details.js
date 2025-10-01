import { products } from "../Data/beats.js";
import { addToCart } from "./cart.js";

export function initBeatDetails() {
  const beatId = localStorage.getItem("selectedBeat");
  if (!beatId) return;

  const beat = products.find(b => b.id == beatId);
  if (!beat) return;

  document.getElementById("beatName").textContent = beat.name;
  document.getElementById("beatGenre").textContent = beat.Genre;
  document.getElementById("beatBPM").textContent = beat.BPM;
  document.getElementById("beatProducer").textContent = beat.producer;
  document.getElementById("beatPrice").textContent = beat.price.toFixed(2);

  const addBtn = document.getElementById("addToCartBtn");
  addBtn.addEventListener("click", () => {
    addToCart(beat);
    alert(`${beat.name} added to cart!`);
  });

  // Optional: simulate purchase for dashboard tracking
  const purchaseBtn = document.getElementById("purchaseBtn");
  if (purchaseBtn) {
    purchaseBtn.addEventListener("click", () => {
      let purchased = JSON.parse(localStorage.getItem("purchasedBeats")) || [];
      if (!purchased.includes(beat.id)) {
        purchased.push(beat.id);
        localStorage.setItem("purchasedBeats", JSON.stringify(purchased));
        alert(`${beat.name} purchased successfully!`);
      } else {
        alert("You already purchased this beat.");
      }
    });
  }
}
