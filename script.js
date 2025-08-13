function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = ""; // Clear old content, no count text

  episodeList.forEach((episode) => {
    const section = document.createElement("section");
    section.classList.add("episode-card");

    // Title + episode code together
    const episodeCode = `S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")}`;
    const title = document.createElement("h2");
    title.textContent = `${episode.name} – ${episodeCode}`;

    // Episode image
    const image = document.createElement("img");
    image.src = episode.image.medium;
    image.alt = episode.name;

    // Summary with HTML formatting preserved
    const summary = document.createElement("p");
    summary.innerHTML = episode.summary;

    // Append in correct order
    section.appendChild(title);
    section.appendChild(image);
    section.appendChild(summary);

    rootElem.appendChild(section);
  });
}

window.onload = setup;
