import { products } from "../Data/beats.js";
import { merchProducts } from "../Data/merch-pro.js";
import { renderBeats } from "./renderBeats.js";

document.addEventListener("DOMContentLoaded", () => {
  const resultsContainer = document.getElementById("search-results-container");
  const noResultsMessage = document.getElementById("no-results-message");

  // Get query from URL
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get("q")?.toLowerCase() || "";

  // Filter beats
  const matchedBeats = products.filter(beat =>
    beat.name.toLowerCase().includes(query) ||
    beat.producer.toLowerCase().includes(query) ||
    (beat.Genre && beat.Genre.toLowerCase().includes(query))
  );

  // Filter merch
  const matchedMerch = merchProducts.filter(item =>
    item.name.toLowerCase().includes(query) ||
    (item.category && item.category.toLowerCase().includes(query))
  );

  const totalMatches = [...matchedBeats, ...matchedMerch];

  if (totalMatches.length > 0) {
    renderBeats(resultsContainer, totalMatches, "all");

    // Animate each item staggered
    const searchItems = resultsContainer.querySelectorAll(".beat-item, .merch-item");
    searchItems.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add("visible");
      }, index * 100);
    });
  } else {
    noResultsMessage.classList.remove("hidden");
  }
});
