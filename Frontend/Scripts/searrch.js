import { products } from "../Data/beats.js";
import { merchProducts } from "../Data/merch-pro.js";

export function initSearch() {
  const searchInput = document.getElementById("search");
  const resultsBox = document.getElementById("search-results");
  if (!searchInput || !resultsBox) return;

  let currentAudio = null;
  let currentButton = null;

  function fuzzyMatch(query, text) {
    return text.toLowerCase().includes(query.toLowerCase());
  }

  function matchesQuery(item, fields, queryWords) {
    return queryWords.every(word =>
      fields.some(field => fuzzyMatch(word, String(field || "")))
    );
  }

  searchInput.addEventListener("keyup", function () {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) {
      resultsBox.style.display = "none";
      resultsBox.innerHTML = "";
      return;
    }

    resultsBox.style.display = "block";
    const queryWords = query.split(/\s+/);

    const beatResults = (products || []).filter(b =>
      matchesQuery(b, [b.name, b.Genre, b.producer, String(b.BPM), ...(b.keywords || [])], queryWords)
    );

    const merchResults = (merchProducts || []).filter(m =>
      matchesQuery(m, [m.name, m.category, String(m.price), ...(m.keywords || [])], queryWords)
    );

    const totalResults = beatResults.length + merchResults.length;
    resultsBox.innerHTML = "";

    if (totalResults === 0) {
      resultsBox.innerHTML = `<p class="no-results">No results found</p>`;
      return;
    }

    resultsBox.innerHTML = `<p class="results-count"><strong>${totalResults} result(s) found</strong></p>`;

    if (beatResults.length > 0) {
      resultsBox.innerHTML += `<h3>Beats</h3>`;
      beatResults.forEach((b, index) => {
        resultsBox.innerHTML += `
          <div class="search-item beat-item" data-id="${b.id}">
            <p>${b.name} (${b.Genre}, ${b.BPM} bpm) - ${b.producer}</p>
            <button class="play-btn" data-audio="${b.audio}" id="play-${index}">▶</button>
          </div>
        `;
      });
    }

    if (merchResults.length > 0) {
      resultsBox.innerHTML += `<h3>Merch</h3>`;
      merchResults.forEach((m) => {
        resultsBox.innerHTML += `
          <div class="search-item merch-item" data-id="${m.id}">
            <img src="${m.image || "placeholder.png"}" class="thumb">
            <p>${m.name} - R${m.price} (${m.category})</p>
          </div>
        `;
      });
    }

    document.querySelectorAll(".search-item.beat-item").forEach((item) => {
  item.addEventListener("click", () => {
    const id = item.dataset.id;
    // Open the item detail page with URL param
    window.location.href = `item.html?item=${encodeURIComponent(id)}`;
  });
});

document.querySelectorAll(".search-item.merch-item").forEach((item) => {
  item.addEventListener("click", () => {
    const id = item.dataset.id;
    window.location.href = `item.html?item=${encodeURIComponent(id)}`;
  });
});


    document.querySelectorAll(".play-btn").forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        const audioSrc = this.getAttribute("data-audio");

        if (currentAudio && currentAudio.src === audioSrc) {
          if (currentAudio.paused) {
            currentAudio.play();
            this.textContent = "⏸";
          } else {
            currentAudio.pause();
            this.textContent = "▶";
          }
          return;
        }

        if (currentAudio) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
          if (currentButton) currentButton.textContent = "▶";
        }

        currentAudio = new Audio(audioSrc);
        currentAudio.play();
        this.textContent = "⏸";
        currentButton = this;

        currentAudio.addEventListener("ended", () => {
          this.textContent = "▶";
          currentButton = null;
          currentAudio = null;
        });
      });
    });
  });

  searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
      // Use URL param instead of localStorage
      window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    }
  }
});

  document.addEventListener("click", (e) => {
    if (!resultsBox.contains(e.target) && e.target !== searchInput) {
      resultsBox.style.display = "none";
    }
  });
}
