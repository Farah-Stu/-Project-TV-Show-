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
  // Create a container to hold the search input, count, and dropdown
  const searchContainer = document.createElement("div");
  searchContainer.style.position = "fixed";
  searchContainer.style.top = "10px";
  searchContainer.style.left = "10px";
  searchContainer.style.backgroundColor = "white";
  searchContainer.style.padding = "10px";
  searchContainer.style.zIndex = "1000";
  searchContainer.style.maxWidth = "250px";

  // Search input
  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Search episodes...";
  searchInput.id = "search-input";
  searchInput.style.marginBottom = "5px";
  searchInput.style.display = "block";
  searchInput.style.width = "100%";

  // Count display
  const countDisplay = document.createElement("p");
  countDisplay.id = "count-display";
  countDisplay.textContent = `Displaying ${episodes.length}/${episodes.length} episodes`;
  countDisplay.style.margin = "5px 0";

  // Select dropdown
  const episodeSelect = document.createElement("select");
  episodeSelect.id = "episode-select";
  episodeSelect.style.width = "100%";
  episodeSelect.style.marginBottom = "5px";

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

  // Event listener for dropdown
  episodeSelect.addEventListener("change", function () {
    const targetId = this.value;
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  // Add elements to the container
  searchContainer.appendChild(episodeSelect);
  searchContainer.appendChild(searchInput);
  searchContainer.appendChild(countDisplay);
  //searchContainer.appendChild(episodeSelect);

  document.body.appendChild(searchContainer);

  // Search logic
  searchInput.addEventListener("input", function () {
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
}

window.onload = setup;
