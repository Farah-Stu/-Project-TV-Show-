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
  let controlsContainer = document.getElementById("controls");
  if (!controlsContainer) {
    controlsContainer = document.createElement("div");
    controlsContainer.id = "controls";
    document.body.insertBefore(
      controlsContainer,
      document.getElementById("root")
    );
  }

  const searchSection = createSearchSection(episodes);
  const selectSection = createSelectSection(episodes);

  controlsContainer.appendChild(selectSection);
  controlsContainer.appendChild(searchSection);
  
}

function createSearchSection(episodes) {
  const searchContainer = document.createElement("div");
  searchContainer.classList.add("search-container");


  const searchInput = document.createElement("input");
  searchInput.id = "search-input";


  const countDisplay = document.createElement("p");
  countDisplay.id = "count-display";
  countDisplay.textContent = `Displaying ${episodes.length}/${episodes.length} episodes`;

  searchInput.addEventListener("input", function() {
    const query = searchInput.value.trim().toLowerCase();
    let matchCount = 0;

    const episodeCards = document.querySelectorAll(".episode-card");
    episodeCards.forEach((card, index) => {
      const title = episodes[index].name.toLowerCase();
      const summary = episodes[index].summary.toLowerCase();
      const isMatch = title.includes(query) || summary.includes(query);
      
      card.style.display = isMatch ? "block" : "none";
      if (isMatch) matchCount++;
    });

    countDisplay.textContent = `Displaying ${matchCount}/${episodes.length} episodes`;
  });

  searchContainer.appendChild(searchInput);
  searchContainer.appendChild(countDisplay);
  return searchContainer;
}

function createSelectSection(episodes) {
  const selectContainer = document.createElement("div");
  selectContainer.classList.add("select-container");

  const episodeSelect = document.createElement("select");
  episodeSelect.id = "episode-select";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Jump to episode...";
  defaultOption.disabled = true;
  defaultOption.selected = true;
  episodeSelect.appendChild(defaultOption);

  episodes.forEach((episode) => {
    const episodeCode = `S${String(episode.season).padStart(2, "0")}E${String(
      episode.number
    ).padStart(2, "0")}`;
    const option = document.createElement("option");
    option.value = episodeCode;
    option.textContent = `${episodeCode} - ${episode.name}`;
    episodeSelect.appendChild(option);
  });

  episodeSelect.addEventListener("change", function() {
    const targetId = this.value;
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  selectContainer.appendChild(episodeSelect);
  return selectContainer;
}

window.onload = setup;

