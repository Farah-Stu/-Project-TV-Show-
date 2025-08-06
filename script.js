function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
  setupSearch(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = ""; // Clear existing content

  episodeList.forEach((episode) => {
    const section = document.createElement("section");
    section.classList.add("episode-card");

    const episodeCode = `S${String(episode.season).padStart(2, "0")}E${String(
      episode.number
    ).padStart(2, "0")}`;

    // Give each section a unique ID so we can scroll to it later
    section.id = episodeCode;

    const title = document.createElement("h2");
    title.textContent = `${episode.name} - ${episodeCode}`;

    const image = document.createElement("img");
    image.src = episode.image.medium;

    const summary = document.createElement("div");
    summary.innerHTML = episode.summary;

    section.appendChild(title);
    section.appendChild(image);
    section.appendChild(summary);

    rootElem.appendChild(section);
  });
}

function setupSearch(episodes) {
  let controlsContainer = document.getElementById("controls");
  if (!controlsContainer) {
    controlsContainer = document.createElement("div");
    controlsContainer.id = "controls";
    document.body.insertBefore(controlsContainer, document.getElementById("root"));
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
  searchInput.type = "text";
  searchInput.placeholder = "Search episodes...";
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
