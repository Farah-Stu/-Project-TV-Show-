//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
 // rootElem.textContent = `Got ${episodeList.length} episode(s)`;

  episodeList.forEach((episode) => {
    const section = document.createElement("section");
    section.classList.add("episode-card");

    const episodeCode= `S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")}`;

     const codeElement = document.createElement("h3");
    codeElement.textContent = episodeCode;
    //section.appendChild(codeElement);

    const title = document.createElement("h2");
    title.textContent = `${episode.name} – ${episodeCode}`;

    //const currentSeason = document.createElement("h2");
    //currentSeason.textContent = `Season ${episode.season}`;

    const image = document.createElement("img");
    image.src = episode.image.medium;
    image.alt = `Image for ${episode.name}`;

    const summary = document.createElement("p");
    //summary.textContent = episode.summary;
    //textContent will render raw HTML tags (e.g., <p>, <i>) as plain text.
    //better to use .innerHTML to render HTML tags correctly.
    summary.innerHTML = episode.summary || "No summary available.";
    

    section.appendChild(title);
    section.appendChild(image);
    section.appendChild(summary);
    //section.appendChild(currentSeason);
    
    

    rootElem.appendChild(section);
  });
}
window.onload = setup;
