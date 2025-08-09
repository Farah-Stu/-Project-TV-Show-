document.addEventListener("DOMContentLoaded", setup);

const root = document.getElementById("root");

function formatEpisodeCode(season, number) {
  return `S${String(season).padStart(2, "0")}E${String(number).padStart(2, "0")}`;
}

async function setup() {
  try {
    const res = await fetch("https://api.tvmaze.com/shows/82/episodes");
    if (!res.ok) throw new Error("Network error");

    const episodes = await res.json();
    makePageForEpisodes(episodes);
    setupSearch(episodes);
  } catch {
    root.innerHTML = `<p class="error-message">Oops! Something went wrong.</p>`;
  }
}

function makePageForEpisodes(episodes) {
  const fragment = document.createDocumentFragment();
  episodes.forEach(ep => {
    const section = document.createElement("section");
    section.classList.add("episode-card");
    section.dataset.name = ep.name.toLowerCase();
    section.dataset.summary = ep.summary.toLowerCase();
    section.id = formatEpisodeCode(ep.season, ep.number);

    section.innerHTML = `
      <h2>${ep.name} - ${section.id}</h2>
      <img src="${ep.image.medium}" alt="${ep.name}">
      <div>${ep.summary}</div>
    `;

    fragment.appendChild(section);
  });
  root.appendChild(fragment);
}

function setupSearch(episodes) {
  const controls = document.getElementById("controls");

  const select = document.createElement("select");
  select.id = "episode-select";
  select.innerHTML = `<option value="" disabled selected>Jump to episode...</option>` +
    episodes.map(ep => {
      const code = formatEpisodeCode(ep.season, ep.number);
      return `<option value="${code}">${code} - ${ep.name}</option>`;
    }).join("");

  const searchInput = document.createElement("input");
  searchInput.id = "search-input";
  searchInput.placeholder = "Search episodes...";

  

  const countDisplay = document.createElement("p");
  countDisplay.id = "count-display";
  countDisplay.textContent = `Displaying ${episodes.length}/${episodes.length} episodes`;

  controls.append(select, searchInput, countDisplay);

  select.addEventListener("change", e => {
    document.getElementById(e.target.value)?.scrollIntoView({ behavior: "smooth" });
  });

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    let matches = 0;
    document.querySelectorAll(".episode-card").forEach(card => {
      const match = card.dataset.name.includes(query) || card.dataset.summary.includes(query);
      card.style.display = match ? "block" : "none";
      if (match) matches++;
    });
    countDisplay.textContent = `Displaying ${matches}/${episodes.length} episodes`;
  });
}