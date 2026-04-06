// Get references to page elements
const root = document.getElementById("root");
const searchInput = document.getElementById("searchInput");
const resultsCount = document.getElementById("resultsCount");
const episodeSelect = document.getElementById("episodeSelect");

// Store all episodes so we can filter without re-fetching
let allEpisodes = [];

// Load episodes from the provided getAllEpisodes() function
function setup() {
  allEpisodes = getAllEpisodes();

  populateDropdown(allEpisodes);
  displayEpisodes(allEpisodes);
}

// Filter episodes on every keystroke and update the display
searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.toLowerCase();

  const filtered = allEpisodes.filter((ep) => {
    const name = ep.name.toLowerCase();
    const summary = (ep.summary || "").toLowerCase();

    return name.includes(searchTerm) || summary.includes(searchTerm);
  });

  displayEpisodes(filtered);
});

// Render episode cards and update the results count
function displayEpisodes(episodes) {
  root.innerHTML = "";

  resultsCount.textContent = `Displaying ${episodes.length} / ${allEpisodes.length} episodes`;

  episodes.forEach((ep) => {
    const episodeCode = formatEpisodeCode(ep.season, ep.number);

    const div = document.createElement("div");
    div.className = "episode-card";
    div.id = `episode-${ep.id}`;

    div.innerHTML = `
      <div class="episode-header">
        <h3>${episodeCode} - ${ep.name}</h3>
      </div>
      <img src="${ep.image?.medium || ""}" alt="${ep.name}">
      <p>${(ep.summary || "").replace(/<[^>]+>/g, "")}</p>
    `;

    root.appendChild(div);
  });
}

// Build the episode selector dropdown with all episodes
function populateDropdown(episodes) {
  episodeSelect.innerHTML = `<option value="">All Episodes</option>`;

  episodes.forEach((ep) => {
    const option = document.createElement("option");

    const code = formatEpisodeCode(ep.season, ep.number);

    option.value = ep.id;
    option.textContent = `${code} - ${ep.name}`;

    episodeSelect.appendChild(option);
  });
}

// Show only the selected episode,
// or all episodes if "All Episodes" is chosen
episodeSelect.addEventListener("change", () => {
  const selectedId = episodeSelect.value;

  if (!selectedId) {
    // Displays all episodes when "All Episodes" is selected
    displayEpisodes(allEpisodes);
    return;
  }

  // Find the selected episode and display only that one
  const selectedEpisode = allEpisodes.filter(
    (ep) => ep.id === Number(selectedId),
  );
  displayEpisodes(selectedEpisode);
});

// Format season and episode numbers as S01E01
function formatEpisodeCode(season, number) {
  const s = String(season).padStart(2, "0");
  const e = String(number).padStart(2, "0");
  return `S${s}E${e}`;
}

// Start the app on page load
window.onload = setup;
