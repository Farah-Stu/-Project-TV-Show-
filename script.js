let currentEpisodes = [];
let allShows = [];
let episodeCache = {};

function showEpisodesView(showName) {
  document.getElementById("showsView").style.display = "none";
  document.getElementById("episodesView").style.display = "block";
  document.getElementById("currentShowTitle").textContent = showName;
  document.getElementById("backToShows").style.display = "block";
}

function showShowsView() {
  document.getElementById("showsView").style.display = "block";
  document.getElementById("episodesView").style.display = "none";
  document.getElementById("backToShows").style.display = "none";
}

function setup() {
  const episodeInput = document.getElementById("q");
  const episodeSelect = document.getElementById("episodeSelect");
  const showSearchInput = document.getElementById("showSearch");
  const backButton = document.getElementById("backToShows");
  const showSelect = document.getElementById("showSelect");

  episodeInput.addEventListener("input", function () {
    const searchTerm = episodeInput.value.toLowerCase();
    const filteredEpisodes = currentEpisodes.filter((episode) => {
      return (
        episode.name.toLowerCase().includes(searchTerm) ||
        (episode.summary && episode.summary.toLowerCase().includes(searchTerm))
      );
    });
    makePageForEpisodes(
      filteredEpisodes,
      document.getElementById("episodeCount"),
      episodeSelect
    );
  });

  showSearchInput.addEventListener("input", function () {
    const searchTerm = showSearchInput.value.toLowerCase();
    const filteredShows = allShows.filter((show) => {
      return (
        show.name.toLowerCase().includes(searchTerm) ||
        (show.summary && show.summary.toLowerCase().includes(searchTerm)) ||
        (show.genres &&
          show.genres.join(" ").toLowerCase().includes(searchTerm))
      );
    });
    displayAllShows(filteredShows);
  });

  backButton.addEventListener("click", showShowsView);

  showSelect.addEventListener("change", function () {
    const selectedId = showSelect.value;
    const selectedShow = allShows.find((s) => s.id == selectedId);
    if (selectedShow) {
      loadShowEpisodes(selectedShow);
    }
  });

  loadAllShows();
}

function formatEpisodeCode(episode) {
  return (
    "S" +
    String(episode.season).padStart(2, "0") +
    "E" +
    String(episode.number).padStart(2, "0")
  );
}

function makePageForEpisodes(episodesList, countElem, episodeSelect) {
  const rootElem = document.getElementById("root");
  if (!rootElem) return;

  rootElem.innerHTML = "";
  if (episodeSelect) episodeSelect.innerHTML = "";
  if (countElem)
    countElem.textContent = "Displaying " + episodesList.length + " episodes";

  episodesList.forEach((episode) => {
    const episodeCode = formatEpisodeCode(episode);

    if (episodeSelect) {
      const option = document.createElement("option");
      option.textContent = episode.name + " - " + episodeCode;
      episodeSelect.appendChild(option);
    }

    const section = document.createElement("section");
    section.classList.add("episode-card");
    section.id = "episode-" + episode.id;

    const title = document.createElement("h2");
    title.classList.add("episode-title");
    title.textContent = episode.name + " – " + episodeCode;
    section.appendChild(title);

    const image = document.createElement("img");
    let imgUrl =
      episode.image && episode.image.medium
        ? episode.image.medium
        : "https://via.placeholder.com/210x295?text=No+Image";
    imgUrl = imgUrl.replace(/^http:/, "https:");
    image.src = imgUrl;
    image.alt = episode.name;
    section.appendChild(image);

    const summary = document.createElement("p");
    summary.innerHTML = episode.summary || "No summary available.";
    section.appendChild(summary);

    const link = document.createElement("a");
    link.href = episode.url;
    link.target = "_blank";
    link.textContent = "View on TVMaze";
    section.appendChild(link);

    rootElem.appendChild(section);
  });
}

async function loadAllShows() {
  if (allShows.length > 0) {
    displayAllShows(allShows);
    return;
  }

  try {
    const response = await fetch("https://api.tvmaze.com/shows");
    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }

    const shows = await response.json();
    shows.sort((a, b) => a.name.localeCompare(b.name));
    allShows = shows;
    displayAllShows(shows);
  } catch (error) {
    console.error("Error loading shows:", error);
    document.getElementById("showsRoot").innerHTML =
      "<p>Error loading shows. Please try again.</p>";
  }
}

function displayAllShows(showsList) {
  const showsRoot = document.getElementById("showsRoot");
  const showCount = document.getElementById("showCount");
  const showSelect = document.getElementById("showSelect");

  showSelect.innerHTML = `<option value="">-- Choose a show --</option>`;
  showsList.forEach((show) => {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    showSelect.appendChild(option);
  });

  showCount.textContent = `Displaying ${showsList.length} shows`;
  showsRoot.innerHTML = "";

  showsList.forEach((show) => {
    const showCard = document.createElement("div");
    showCard.classList.add("show-card");
    showCard.addEventListener("click", () => loadShowEpisodes(show));

    const title = document.createElement("h3");
    title.textContent = show.name;
    title.style.marginBottom = "8px";

    const image = document.createElement("img");
    let imgUrl =
      show.image && show.image.medium
        ? show.image.medium
        : "https://via.placeholder.com/210x295?text=No+Image";
    imgUrl = imgUrl.replace(/^http:/, "https:");
    image.src = imgUrl;
    image.alt = show.name;

    const content = document.createElement("div");
    content.innerHTML = `
      <p><strong>Status:</strong> ${show.status || "Unknown"}</p>
      <p><strong>Genres:</strong> ${
        show.genres ? show.genres.join(", ") : "N/A"
      }</p>
      <p><strong>Rating:</strong> ${show.rating?.average || "N/A"}</p>
      <p><strong>Runtime:</strong> ${
        show.runtime ? show.runtime + " mins" : "N/A"
      }</p>
      <p>${show.summary || "No summary available."}</p>
    `;

    showCard.appendChild(title);
    showCard.appendChild(image);
    showCard.appendChild(content);
    showsRoot.appendChild(showCard);
  });
}

function loadShowEpisodes(show) {
  showEpisodesView(show.name);

  const episodeUrl = `https://api.tvmaze.com/shows/${show.id}/episodes`;

  if (episodeCache[episodeUrl]) {
    currentEpisodes = episodeCache[episodeUrl];
    makePageForEpisodes(
      currentEpisodes,
      document.getElementById("episodeCount"),
      document.getElementById("episodeSelect")
    );
    return;
  }

  fetch(episodeUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      return response.json();
    })
    .then((episodes) => {
      episodeCache[episodeUrl] = episodes;
      currentEpisodes = episodes;
      makePageForEpisodes(
        episodes,
        document.getElementById("episodeCount"),
        document.getElementById("episodeSelect")
      );
    })
    .catch((error) => {
      console.error("Error loading episodes:", error);
      document.getElementById("root").innerHTML =
        "<p>Error loading episodes. Please try again.</p>";
    });
}

window.onload = setup;
