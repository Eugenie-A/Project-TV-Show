// Get references to page elements
const root = document.getElementById("root");
const showsRoot = document.getElementById("shows-root");
const searchInput = document.getElementById("searchInput");
const showSelect = document.getElementById("showSelect");
const showSearch = document.getElementById("showSearch");
const resultsCount = document.getElementById("resultsCount");
const episodeSelect = document.getElementById("episodeSelect");
const showsView = document.getElementById("shows-view");
const episodesView = document.getElementById("episodes-view");
const backLink = document.getElementById("back-link");

// Store all shows, episodes and cache fetched episode lists
let allShows = [];
let allEpisodes = [];
const episodeCache = {};

// Strip HTML tags from a string
function stripHtml(str) {
  return (str || "").replace(/<[^>]+>/g, "");
}

// Format season and episode numbers as S01E01
function formatEpisodeCode(season, number) {
  const s = String(season).padStart(2, "0");
  const e = String(number).padStart(2, "0");
  return `S${s}E${e}`;
}

// Build a show card element
function createShowCard(show) {
  const div = document.createElement("div");
  div.className = "show-card";

  const summary = stripHtml(show.summary);
  const genres = show.genres.join(", ") || "N/A";
  const rating = show.rating?.average ?? "N/A";
  const runtime = show.runtime ? `${show.runtime} mins` : "N/A";
  const image = show.image?.medium ?? "";

  div.innerHTML = `
    <img src="${image}" alt="${show.name}">
    <div class="show-info">
      <h2 class="show-name">${show.name}</h2>
      <p>${summary}</p>
      <div class="show-details">
      <p><strong>Genres:</strong> ${genres}</p>
      <p><strong>Status:</strong> ${show.status}</p>
      <p><strong>Rating:</strong> ${rating}</p>
      <p><strong>Runtime:</strong> ${runtime}</p>
    </div>
    </div>
  `;

  div.querySelector(".show-name").addEventListener("click", () => {
    loadEpisodes(show);
  });

  return div;
}

// Build an episode card element
function createEpisodeCard(ep) {
  const div = document.createElement("div");
  div.className = "episode-card";
  div.id = `episode-${ep.id}`;

  div.innerHTML = `
    <div class="episode-header">
      <h3>${formatEpisodeCode(ep.season, ep.number)} - ${ep.name}</h3>
    </div>
    <img src="${ep.image?.medium ?? ""}" alt="${ep.name}">
    <p>${stripHtml(ep.summary)}</p>
  `;

  return div;
}

// Switch to episodes view and hide the shows listing
function showEpisodesView(show) {
  showsView.style.display = "none";
  episodesView.style.display = "block";
  searchInput.value = "";
  episodeSelect.value = "";
  showSelect.value = show.id;
}

// Switch back to the shows listing and hide the episodes view
function showShowsView() {
  episodesView.style.display = "none";
  showsView.style.display = "block";
  root.innerHTML = "";
  resultsCount.textContent = "";
  episodeSelect.innerHTML = `<option value="">Jump to episode...</option>`;
  showSearch.value = "";
  displayShows(allShows);
}

// Go back to shows listing when back link is clicked
backLink.addEventListener("click", (e) => {
  e.preventDefault();
  showShowsView();
});

// Render show cards in the shows listing
function displayShows(shows) {
  showsRoot.innerHTML = "";
  shows.forEach((show) => showsRoot.appendChild(createShowCard(show)));
}

// Render episode cards and update the results count
function displayEpisodes(episodes) {
  root.innerHTML = "";
  resultsCount.textContent = `Displaying ${episodes.length} / ${allEpisodes.length} episodes`;
  episodes.forEach((ep) => root.appendChild(createEpisodeCard(ep)));
}

// Add every episode as an option in the episode dropdown
function populateDropdown(episodes) {
  episodeSelect.innerHTML = `<option value="">All Episodes</option>`;

  episodes.forEach((ep) => {
    const option = document.createElement("option");
    option.value = ep.id;
    option.textContent = `${formatEpisodeCode(ep.season, ep.number)} - ${ep.name}`;
    episodeSelect.appendChild(option);
  });
}

// Populate show selector dropdown
function populateShowDropdown() {
  showSelect.innerHTML = `<option value="">Select a show...</option>`;
  allShows.forEach((show) => {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    showSelect.appendChild(option);
  });
}

// Switch show when selector changes
showSelect.addEventListener("change", () => {
  const selectedId = Number(showSelect.value);
  if (!selectedId) return;
  const show = allShows.find((s) => s.id === selectedId);
  if (show) loadEpisodes(show);
});

// Filter shows by name, genre or summary as the user types
showSearch.addEventListener("input", () => {
  const term = showSearch.value.toLowerCase();

  const filtered = allShows.filter(
    (show) =>
      show.name.toLowerCase().includes(term) ||
      stripHtml(show.summary).toLowerCase().includes(term) ||
      show.genres.join(", ").toLowerCase().includes(term),
  );

  displayShows(filtered);
});

// Filter episodes as the user types in the search box
searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.toLowerCase();

  const filtered = allEpisodes.filter(
    (ep) =>
      ep.name.toLowerCase().includes(searchTerm) ||
      stripHtml(ep.summary).toLowerCase().includes(searchTerm),
  );

  displayEpisodes(filtered);
});

// Show only the selected episode, or all if "All Episodes" is chosen
episodeSelect.addEventListener("change", () => {
  const selectedId = episodeSelect.value;

  if (!selectedId) {
    displayEpisodes(allEpisodes);
    return;
  }
  const selected = allEpisodes.filter((ep) => ep.id === Number(selectedId));
  displayEpisodes(selected);
});

// Fetch episodes for the selected show, using cache if available
async function loadEpisodes(show) {
  showEpisodesView(show);
  root.innerHTML = "<p>Loading episodes... please wait</p>";

  const showId = show.id;

  if (episodeCache[showId]) {
    allEpisodes = episodeCache[showId];
    populateDropdown(allEpisodes);
    displayEpisodes(allEpisodes);
    return;
  }

  try {
    const response = await fetch(
      `https://api.tvmaze.com/shows/${showId}/episodes`,
    );
    if (!response.ok) throw new Error("Failed to fetch episodes");

    const episodes = await response.json();
    episodeCache[showId] = episodes;
    allEpisodes = episodes;

    populateDropdown(allEpisodes);
    displayEpisodes(allEpisodes);
  } catch {
    root.innerHTML =
      "<p>Something went wrong loading episodes. Please try again later.</p>";
  }
}

// Fetch all shows from TVMaze on page load
async function loadShows() {
  showsRoot.innerHTML = "<p>Loading shows... please wait</p>";

  try {
    const response = await fetch("https://api.tvmaze.com/shows");

    if (!response.ok) {
      throw new Error("Failed to fetch shows");
    }

    const shows = await response.json();
    // Sort alphabetically (case-insensitive)
    allShows = shows.sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
    );

    displayShows(allShows);
    populateShowDropdown();
  } catch (error) {
    root.innerHTML =
      "<p>Something went wrong loading shows. Please try again later.</p>";
    console.error(error);
  }
}

// Start the app by loading all available shows
loadShows();
