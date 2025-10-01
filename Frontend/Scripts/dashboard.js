import { products } from "../Data/beats.js";

export function initDashboard() {
  const userNameEl = document.getElementById("userName");
  const userEmailEl = document.getElementById("userEmail");
  const purchasedBeatsEl = document.getElementById("purchasedBeats");

  // Display user info
  const name = localStorage.getItem("userName") || "User";
  const email = localStorage.getItem("userEmail") || "email@example.com";
  userNameEl.textContent = name;
  userEmailEl.textContent = email;

  // Display purchased beats
  const purchasedIds = JSON.parse(localStorage.getItem("purchasedBeats")) || [];
  const purchasedBeats = products.filter(b => purchasedIds.includes(b.id));

  if (purchasedBeats.length === 0) {
    purchasedBeatsEl.innerHTML = "<p>You haven't purchased any beats yet.</p>";
  } else {
    purchasedBeatsEl.innerHTML = "";
    purchasedBeats.forEach(beat => {
      const div = document.createElement("div");
      div.classList.add("beat-item");
      div.innerHTML = `
        <h4>${beat.name}</h4>
        <p>Genre: ${beat.Genre}</p>
        <p>Producer: ${beat.producer}</p>
        <p>Price: R${beat.price.toFixed(2)}</p>
        <a href="beat-details.html" class="view-btn" data-id="${beat.id}">View Details</a>
        <a href="${beat.preview}" download class="download-btn">Download Preview</a>
      `;
      purchasedBeatsEl.appendChild(div);

      // Link to beat details
      div.querySelector(".view-btn").addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.setItem("selectedBeat", beat.id);
        window.location.href = "beat-details.html";
      });
    });
  }
}
