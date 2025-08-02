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
  // Create a container to hold the search input and count display
  const searchContainer = document.createElement("div");
  searchContainer.id = "search-container";
  searchContainer.style.position = "fixed";
  searchContainer.style.top = "10px";
  searchContainer.style.left = "10px";
  searchContainer.style.backgroundColor = "white";
  searchContainer.style.padding = "10px";
  
  searchContainer.style.zIndex = "1000";
  
  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Search episodes...";
  searchInput.id = "search-input";
  searchInput.style.marginBottom = "5px";
  searchInput.style.display = "block";

  const countDisplay = document.createElement("p");
  countDisplay.id = "count-display";
  countDisplay.textContent = `Displaying ${episodes.length}/${episodes.length} episodes`;
  countDisplay.style.margin = "0";

  searchContainer.appendChild(searchInput);
  searchContainer.appendChild(countDisplay);

  // Add the container to the body (not root, to stay fixed)
  document.body.appendChild(searchContainer);

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
