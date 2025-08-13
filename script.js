function setup() {
  const allEpisodes = getAllEpisodes();
  makeEpisodeDropdown(allEpisodes);
  makePageForEpisodes(allEpisodes);
}

function makeEpisodeDropdown(episodeList) {
  const header = document.createElement("header");
  header.style.margin = "20px";

  const select = document.createElement("select");
  select.id = "episodeSelect";

  // Default option
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select an episode...";
  select.appendChild(defaultOption);

  // Add all episodes to dropdown
  episodeList.forEach((episode) => {
    const episodeCode = `S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")}`;
    const option = document.createElement("option");
    option.value = episodeCode;
    option.textContent = `${episodeCode} - ${episode.name}`;
    select.appendChild(option);
  });

  // Button to reset view
  const resetButton = document.createElement("button");
  resetButton.textContent = "Show All Episodes";
  resetButton.style.marginLeft = "10px";
  resetButton.onclick = () => {
    makePageForEpisodes(episodeList);
    select.value = "";
  };

  // Dropdown change event
  select.addEventListener("change", () => {
    const selectedCode = select.value;
    if (selectedCode) {
      const filtered = episodeList.filter((ep) => {
        const code = `S${String(ep.season).padStart(2, "0")}E${String(ep.number).padStart(2, "0")}`;
        return code === selectedCode;
      });
      makePageForEpisodes(filtered);
    }
  });

  header.appendChild(select);
  header.appendChild(resetButton);
  document.body.insertBefore(header, document.getElementById("root"));
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = ""; // Clear old content

  episodeList.forEach((episode) => {
    const section = document.createElement("section");
    section.classList.add("episode-card");

    const episodeCode = `S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")}`;
    const title = document.createElement("h2");
    title.textContent = `${episode.name} – ${episodeCode}`;

    const image = document.createElement("img");
    image.src = episode.image.medium;
    image.alt = episode.name;

    const summary = document.createElement("p");
    summary.innerHTML = episode.summary;

    section.appendChild(title);
    section.appendChild(image);
    section.appendChild(summary);

    rootElem.appendChild(section);
  });
}

window.onload = setup;
