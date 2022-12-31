// variables
const container = document.querySelector(".container");
const searchInput = document.querySelector("#search");
const select = document.querySelector("select");
let episodes = null;

// functions
window.addEventListener("DOMContentLoaded", fetchApi());
async function fetchApi() {
  const response = await fetch("https://api.tvmaze.com/shows/82/episodes");
  episodes = await response.json();
  renderCards(episodes);
  renderOptions(episodes);
}

function renderCards(data) {
  const cards = document.createElement("div");
  cards.classList = "cards mt-5 flex flex-wrap";

  data.map(({ name, image, season, number, summary, url, rating }) => {
    summary = summary.slice(3, -4);
    const card = `
      <div class="w-3/12 p-5">
        <div class="bg-black text-white rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-all duration-400 hover:shadow-xl">
          <div class="relative">
            <img
              src="${image.medium}"
              alt="${name}"
              class="w-full h-110 bg-cover"
              title="${name}"
            />
            <p class="absolute top-5 right-5 bg-rose-400 py-1 px-2 rounded-sm">${
              rating.average
            }</p>
          </div>
          <p class="text-center my-2 text-lg px-4" title="${name}">${
      name.length > 25 ? name.substring(0, 25) + "..." : name
    }</p>
          <p class="text-center">
            S${season > 10 ? season : "0" + season}E${
      number > 10 ? number : "0" + number
    }
          </p>
          <p class="mt-2 mb-5 px-4 h-20">
            ${summary.length > 60 ? summary.substring(0, 70) + "..." : summary}
          </p>
          <div class="mb-4 flex justify-center">
            <a href="${url}" target="_blank" class="border-2 border-white py-1 px-8 rounded-md hover:cursor-pointer hover:bg-white hover:text-black hover:px-12 transition-all duration-400">Watch</a>
          </div>
        </div>
      </div>
    `;

    cards.innerHTML += card;
  });

  container.appendChild(cards);
}

function renderOptions(data) {
  data.map(({ name, season, number, id }) => {
    const option = `
      <option value="${id}">${season > 10 ? season : "0" + season}E${
      number > 10 ? number : "0" + number
    }${name}</option>
    `;
    select.innerHTML += option;
  });
}

function searchEpisode(data, value) {
  const cards = document.querySelector(".cards");
  if (value) {
    cards && cards.remove();
    const filterEpisodes = data.filter(
      ({ name, summary }) =>
        name.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
        summary.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
    renderCards(filterEpisodes);
  } else {
    cards && cards.remove();
    renderCards(episodes);
  }
}

function selectEpisode(data, value) {
  const cards = document.querySelector(".cards");
  if (value !== "all") {
    cards && cards.remove();
    const filterEpisode = data.filter(({ id }) => id === parseInt(value));
    renderCards(filterEpisode);
  } else {
    cards && cards.remove();
    renderCards(episodes);
  }
}

// events
searchInput.addEventListener("input", (e) => {
  searchEpisode(episodes, e.target.value);
});

select.addEventListener("change", (e) => {
  selectEpisode(episodes, e.target.value);
});
