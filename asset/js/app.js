// variables
const container = document.querySelector(".container");
const searchInput = document.querySelector("#search");
const results = document.querySelector("#results");
const select = document.querySelector("select");
let episodes = null;

// functions
fetchApi();
async function fetchApi() {
  loading();
  const response = await fetch("https://api.tvmaze.com/shows/82/episodes");
  episodes = await response.json();
  renderCards(episodes);
  renderOptions(episodes);
  removeLoading();
}

function loading() {
  const img = document.createElement("img");
  img.classList =
    "loading absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";
  img.src = "./asset/img/loading.svg";
  document.body.appendChild(img);
}

function removeLoading() {
  const loading = document.querySelector(".loading");
  loading && loading.remove();
}

function renderCards(data) {
  document.querySelector(".not-found") &&
    document.querySelector(".not-found").remove();

  const cards = document.createElement("div");
  cards.classList = "cards mt-5 flex flex-wrap";

  updateResults(data.length);

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
            S${season > 9 ? season : "0" + season}E${
      number > 9 ? number : "0" + number
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
      <option value="${id}">${season > 9 ? season : "0" + season}E${
      number > 9 ? number : "0" + number
    } - ${name}</option>
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
    filterEpisodes.length ? renderCards(filterEpisodes) : notFound();
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

function notFound() {
  document.querySelector(".not-found") &&
    document.querySelector(".not-found").remove();

  updateResults(0);
  const div = document.createElement("div");
  div.innerHTML = `
    <p>Ooops!</p>
    <p>Not found episode!</p>
  `;
  div.classList =
    "not-found absolute flex flex-col space-y-2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/6 py-4 bg-gray-200 text-gray-600 text-center rounded-md";

  container.appendChild(div);
}

function updateResults(number) {
  results.innerText = `${number} results`;
}

// events
searchInput.addEventListener("input", (e) => {
  searchEpisode(episodes, e.target.value);
});

select.addEventListener("change", (e) => {
  selectEpisode(episodes, e.target.value);
});
