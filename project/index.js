// const postsContainer = document.getElementById("posts");
// const filterFrom = document.getElementById("from");
// const filterTo = document.getElementById("to");
// const filterDate = document.getElementById("when");
// const loadMoreBtn = document.getElementById("loadMore");

// let allTickets = [];
// let filteredTickets = [];
// let currentPage = 1;
// const itemsPerPage = 5;

// // fetch
// fetch("https://railway.stepprojects.ge/api/tickets")
//   .then((response) => response.json())
//   .then((data) => {
//     allTickets = data;
//     filteredTickets = allTickets;

//     populateDateFilter(allTickets);
//     displayTickets(filteredTickets, true);
//   });

// function populateDateFilter(tickets) {
//   const uniqueDates = [...new Set(tickets.map((ticket) => ticket.date))];

//   uniqueDates.sort();

//   uniqueDates.forEach((date) => {
//     const option = document.createElement("option");
//     option.value = date;
//     option.textContent = date;
//     filterDate.appendChild(option);
//   });
// }

// // display
// function displayTickets(tickets, reset = true) {
//   if (reset) {
//     postsContainer.innerHTML = "";
//     currentPage = 1;
//   }

//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const ticketsToShow = tickets.slice(startIndex, endIndex);

//   ticketsToShow.forEach((ticket) => {
//     const postDiv = document.createElement("div");
//     postDiv.classList.add("post");

//     postDiv.innerHTML = `
//       <h3>${ticket.train.from} - ${ticket.train.to}</h3>
//       <p>დღე: ${ticket.date}</p>
//       <p>გამგზავრება: ${ticket.train.departure}</p>
//       <p>მოსვლა: ${ticket.train.arrive}</p>
//     `;

//     postDiv.addEventListener("click", () => {
//       sessionStorage.setItem("selectedTicket", JSON.stringify(ticket));
//       window.location.href = "reisi.html";
//     });

//     postsContainer.appendChild(postDiv);
//   });

//   if (endIndex >= tickets.length) {
//     loadMoreBtn.style.display = "none";
//   } else {
//     loadMoreBtn.style.display = "block";
//   }
// }

// // Route validation
// function applyFilters() {
//   const fromValue = filterFrom.value;
//   const toValue = filterTo.value;
//   const dateValue = filterDate.value;

//   let filtered = allTickets;

//   if (fromValue !== "all") {
//     filtered = filtered.filter((ticket) => ticket.train.from === fromValue);
//   }

//   if (toValue !== "all") {
//     filtered = filtered.filter((ticket) => ticket.train.to === toValue);
//   }

//   if (dateValue !== "all") {
//     filtered = filtered.filter((ticket) => ticket.date === dateValue);
//   }

//   filteredTickets = filtered;
//   displayTickets(filteredTickets, true);
// }

// // ================= LOAD MORE =================
// loadMoreBtn.addEventListener("click", () => {
//   currentPage++;
//   displayTickets(filteredTickets, false);

//   setTimeout(() => {
//     postsContainer.lastChild?.scrollIntoView({ behavior: "smooth" });
//   }, 100);
// });

// // ================= EVENT LISTENERS =================
// filterFrom.addEventListener("change", applyFilters);
// filterTo.addEventListener("change", applyFilters);
// filterDate.addEventListener("change", applyFilters);

// const postsContainer = document.getElementById("posts");
// const filterFrom = document.getElementById("from");
// const filterTo = document.getElementById("to");
// const filterDate = document.getElementById("when");

// let allDepartures = [];

// fetch("https://railway.stepprojects.ge/api/departures")
//   .then((response) => response.json())
//   .then((data) => {
//     allDepartures = data;
//     displayTrains(allDepartures);
//     populateFilters(allDepartures);
//   })
//   .catch((error) => console.log(error));

// function populateFilters(departures) {
//   const froms = [...new Set(departures.map((d) => d.source))];
//   const tos = [...new Set(departures.map((d) => d.destination))];
//   const dates = [...new Set(departures.map((d) => d.date))];

//   froms.forEach((f) => {
//     const opt = document.createElement("option");
//     opt.value = f;
//     opt.textContent = f;
//     filterFrom.appendChild(opt);
//   });

//   tos.forEach((t) => {
//     const opt = document.createElement("option");
//     opt.value = t;
//     opt.textContent = t;
//     filterTo.appendChild(opt);
//   });

//   dates.forEach((d) => {
//     const opt = document.createElement("option");
//     opt.value = d;
//     opt.textContent = d;
//     filterDate.appendChild(opt);
//   });
// }

// function displayTrains(departures) {
//   postsContainer.innerHTML = "";

//   departures.forEach((dep) => {
//     dep.trains.forEach((train) => {
//       const card = document.createElement("div");

//       card.innerHTML = `
//         <h3>${train.from} → ${train.to}</h3>
//         <p>Date: ${train.date}</p>
//         <p>Departure: ${train.departure}</p>
//         <p>Arrival: ${train.arrive}</p>
//         <button>Select</button>
//       `;

//       card.querySelector("button").addEventListener("click", () => {
//         sessionStorage.setItem("selectedTrain", JSON.stringify(train));
//         window.location.href = "reisi.html";
//       });

//       postsContainer.appendChild(card);
//     });
//   });
// }

const postsContainer = document.getElementById("posts");
const filterFrom = document.getElementById("from");
const filterTo = document.getElementById("to");
const filterDate = document.getElementById("when");
const loadMoreBtn = document.getElementById("loadMore");

let allDepartures = [];
let filteredTrains = [];

let currentPage = 1;
const perPage = 5;

fetch("https://railway.stepprojects.ge/api/departures")
  .then((response) => response.json())
  .then((data) => {
    allDepartures = data;

    populateFilters(allDepartures);

    filteredTrains = getAllTrains(allDepartures);

    displayTrains();
  })
  .catch((error) => console.log(error));

function getAllTrains(departures) {
  let trains = [];

  departures.forEach((dep) => {
    dep.trains.forEach((train) => {
      trains.push(train);
    });
  });

  return trains;
}

function populateFilters(departures) {
  const froms = [...new Set(departures.map((d) => d.source))];
  const tos = [...new Set(departures.map((d) => d.destination))];
  const dates = [...new Set(departures.map((d) => d.date))];

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
  const fromValue = filterFrom.value;
  const toValue = filterTo.value;
  const dateValue = filterDate.value;

  filteredTrains = getAllTrains(allDepartures).filter((train) => {
    return (
      (!fromValue || train.from === fromValue) &&
      (!toValue || train.to === toValue) &&
      (!dateValue || train.date === dateValue)
    );
  });

  currentPage = 1;

  postsContainer.innerHTML = "";

  displayTrains();
}

filterFrom.addEventListener("change", applyFilters);
filterTo.addEventListener("change", applyFilters);
filterDate.addEventListener("change", applyFilters);

function displayTrains() {
  const start = (currentPage - 1) * perPage;
  const end = currentPage * perPage;

  const trainsToShow = filteredTrains.slice(start, end);

  trainsToShow.forEach((train) => {
    const card = document.createElement("div");

    card.innerHTML = `
      <h3>${train.from} → ${train.to}</h3>
      <p>Date: ${train.date}</p>
      <p>Departure: ${train.departure}</p>
      <p>Arrival: ${train.arrive}</p>
      <button>Select</button>
    `;

    card.querySelector("button").addEventListener("click", () => {
      sessionStorage.setItem("selectedTrain", JSON.stringify(train));

      window.location.href = "reisi.html";
    });

    postsContainer.appendChild(card);
  });
}

loadMoreBtn.addEventListener("click", () => {
  currentPage++;

  displayTrains();
});
if (currentPage * perPage >= filteredTrains.length) {
  loadMoreBtn.style.display = "none";
} else {
  loadMoreBtn.style.display = "block";
}
