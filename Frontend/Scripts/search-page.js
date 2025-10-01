// search-page.js
import { products } from "../Data/beats.js";
import { merchProducts } from "../Data/merch-pro.js";

export function initSearchPage() {
  const resultsEl = document.getElementById("searchResults");
  const query = localStorage.getItem("searchQuery")?.toLowerCase() || "";

  if (!query) {
    resultsEl.innerHTML = "<p>No search query found.</p>";
    return;
  }

  const queryWords = query.split(/\s+/);

  function matchesQuery(item, fields) {
    return queryWords.every(word =>
      fields.some(f => String(f || "").toLowerCase().includes(word))
    );
  }

  const beatResults = products.filter(b =>
    matchesQuery(b, [b.name, b.Genre, b.producer, String(b.BPM), ...(b.keywords || [])])
  );

  const merchResults = merchProducts.filter(m =>
    matchesQuery(m, [m.name, m.category, String(m.price), ...(m.keywords || [])])
  );

  if (beatResults.length === 0 && merchResults.length === 0) {
    resultsEl.innerHTML = "<p>No results found.</p>";
    return;
  }

  // Render beats
  if (beatResults.length > 0) {
    resultsEl.innerHTML += "<h3>Beats</h3>";
    beatResults.forEach(b => {
      const div = document.createElement("div");
      div.classList.add("beat-item");
      div.innerHTML = `
        <p>${b.name} (${b.Genre}, ${b.BPM} bpm) - ${b.producer}</p>
      `;
      resultsEl.appendChild(div);
    });
  }

  // Render merch
  if (merchResults.length > 0) {
    resultsEl.innerHTML += "<h3>Merch</h3>";
    merchResults.forEach(m => {
      const div = document.createElement("div");
      div.classList.add("merch-item");
      div.innerHTML = `<p>${m.name} - R${m.price} (${m.category})</p>`;
      resultsEl.appendChild(div);
    });
  }
}
