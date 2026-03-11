const postsContainer = document.getElementById("posts");
const filterFrom = document.getElementById("from");
const filterTo = document.getElementById("to");
const filterDate = document.getElementById("when");
const loadMoreBtn = document.getElementById("loadMore");

let departures = [];
let trains = [];
let filteredTrains = [];

let page = 1;
const perPage = 5;

fetch("https://railway.stepprojects.ge/api/departures")
  .then((res) => res.json())
  .then((data) => {
    departures = data;
    data.forEach((dep) => dep.trains.forEach((train) => trains.push(train)));
    filteredTrains = trains;
    populateFilters();
    renderTrains();
  })
  .catch((err) => console.error(err));

function populateFilters() {
  const froms = [...new Set(trains.map((t) => t.from))];
  const tos = [...new Set(trains.map((t) => t.to))];
  const dates = [...new Set(trains.map((t) => t.date))];

  froms.forEach((f) => {
    const opt = document.createElement("option");
    opt.value = f;
    opt.textContent = f;
    filterFrom.appendChild(opt);
  });
  tos.forEach((t) => {
    const opt = document.createElement("option");
    opt.value = t;
    opt.textContent = t;
    filterTo.appendChild(opt);
  });
  dates.forEach((d) => {
    const opt = document.createElement("option");
    opt.value = d;
    opt.textContent = d;
    filterDate.appendChild(opt);
  });
}

function applyFilters() {
  const from = filterFrom.value;
  const to = filterTo.value;
  const date = filterDate.value;
  filteredTrains = trains.filter(
    (train) =>
      (!from || train.from === from) &&
      (!to || train.to === to) &&
      (!date || train.date === date),
  );
  page = 1;
  postsContainer.innerHTML = "";
  renderTrains();
}

filterFrom.addEventListener("change", applyFilters);
filterTo.addEventListener("change", applyFilters);
filterDate.addEventListener("change", applyFilters);

function renderTrains() {
  const start = (page - 1) * perPage;
  const end = page * perPage;
  const trainsToShow = filteredTrains.slice(start, end);

  trainsToShow.forEach((train) => {
    const card = document.createElement("div");
    card.classList.add("post");
    card.innerHTML = `
      <div class="train-header"><h3>${train.from} → ${train.to}</h3><span class="train-date">დღე: ${train.date}</span></div>
      <div class="train-times">
        <div><span class="time"> წასვლა --- ${train.departure}</span></div>
        <div class="line"></div>
        <div><span class="time"> მისვლა --- ${train.arrive}</span></div>
      </div>
      <button class="select-btn">Select Ticket</button>
    `;
    card.querySelector("button").addEventListener("click", () => {
      sessionStorage.setItem("selectedTrain", JSON.stringify(train));
      window.location.href = "reisi.html";
    });
    postsContainer.appendChild(card);
  });
}

loadMoreBtn.addEventListener("click", () => {
  page++;
  renderTrains();
});
