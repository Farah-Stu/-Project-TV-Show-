const root = document.getElementById("root");

async function setup() {
  try {
    root.textContent = "Loading episodes...";

    const response = await fetch("https://api.tvmaze.com/shows/82/episodes");
    if (!response.ok) {
      throw new Error("Network response was not Ok");
    }

    const allEpisodes = await response.json();
    makePageForEpisodes(allEpisodes);
    setupSearch(allEpisodes);
  } catch (error) {
    root.innerHTML = "";

    const errorMessage = document.createElement("p");
    errorMessage.textContent = "Oops! Something went wrong.";
    errorMessage.style.color = "red";

    root.appendChild(errorMessage);
  }
}
function makePageForEpisodes(episodeList) {
  episodeList.forEach((episode) => {
    const section = document.createElement("section");
    section.classList.add("episode-card");

    const episodeCode = `S${String(episode.season).padStart(2, "0")}E${String(
      episode.number
    ).padStart(2, "0")}`;

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

    root.appendChild(section);
  });
}

function setupSearch(episodes) {
  // Create or get the controls container
  let controlsContainer = document.getElementById("controls");
  if (!controlsContainer) {
    controlsContainer = document.createElement("div");
    controlsContainer.id = "controls";
    document.body.insertBefore(
      controlsContainer,
      document.getElementById("root")
    );
  }

  // Style the controls container
  controlsContainer.style.display = "flex";
  controlsContainer.style.alignItems = "center";
  controlsContainer.style.gap = "10px";
  controlsContainer.style.padding = "10px";
  controlsContainer.style.backgroundColor = "#f9f9f9";
  //controlsContainer.style.borderBottom = "1px solid #ccc";

  // Sticky positioning
  controlsContainer.style.position = "sticky";
  controlsContainer.style.top = "0";
  controlsContainer.style.zIndex = "999"; // Keep it above other content

  // Search input
  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Search episodes...";
  searchInput.id = "search-input";
  searchInput.style.padding = "5px";
  searchInput.style.flex = "1";

  // Episode selector
  const episodeSelect = document.createElement("select");
  episodeSelect.id = "episode-select";
  episodeSelect.style.padding = "5px";
  episodeSelect.style.flex = "1";

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

  // Count display
  const countDisplay = document.createElement("p");
  countDisplay.id = "count-display";
  countDisplay.textContent = `Displaying ${episodes.length}/${episodes.length} episodes`;
  countDisplay.style.margin = "0";
  countDisplay.style.whiteSpace = "nowrap";

  // Add all elements to the container
  controlsContainer.appendChild(searchInput);
  controlsContainer.appendChild(episodeSelect);
  controlsContainer.appendChild(countDisplay);

  // Episode select scroll logic
  episodeSelect.addEventListener("change", function () {
    const targetId = this.value;
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  // Search filtering logic
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
