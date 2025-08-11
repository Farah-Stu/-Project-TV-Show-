document.addEventListener("DOMContentLoaded", setup);

const root = document.getElementById("root");
const controls = document.getElementById("controls");

let cachedEpisodes = {}; // { showId: [episodes] }
let cachedShows = []; // store shows list so we don't refetch


function formatEpisodeCode(season, number) {
  return `S${String(season).padStart(2, "0")}E${String(number).padStart(2, "0")}`;
}

async function setup() {
  try {
    const showSelect = document.createElement("select");
    showSelect.id = "show-select";
    controls.appendChild(showSelect);

    if (cachedShows.length === 0) {
      const res = await fetch("https://api.tvmaze.com/shows");
      if (!res.ok) throw new Error("Network error");
      cachedShows = await res.json();
      cachedShows.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
    }

    showSelect.innerHTML =
      `<option value="" disabled>Select a show...</option>` +
      cachedShows.map(show => `<option value="${show.id}">${show.name}</option>`).join("");

    // Load the first alphabetical show immediately
    const firstShow = cachedShows[0];
    showSelect.value = firstShow.id;
    await loadEpisodes(firstShow.id);

    // Handle dropdown changes
    showSelect.addEventListener("change", async e => {
      const showId = e.target.value;
      await loadEpisodes(showId);
    });

  } catch (err) {
    root.innerHTML = `<p class="error-message">Oops! Something went wrong loading shows.</p>`;
    console.error(err);
  }
}

async function loadEpisodes(showId) {
  try {
    root.innerHTML = "";
    const extraControls = Array.from(controls.children).filter(el => el.id !== "show-select");
    extraControls.forEach(el => el.remove());

    let episodes;
    if (cachedEpisodes[showId]) {
      episodes = cachedEpisodes[showId];
    } else {
      const res = await fetch(`https://api.tvmaze.com/shows/${showId}/episodes`);
      if (!res.ok) throw new Error("Network error");
      episodes = await res.json();
      cachedEpisodes[showId] = episodes;
    }

    makePageForEpisodes(episodes);
    setupEpisodeControls(episodes);

  } catch (err) {
    root.innerHTML = `<p class="error-message">Oops! Something went wrong loading episodes.</p>`;
    console.error(err);
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
      <div>${ep.summary || ""}</div>
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