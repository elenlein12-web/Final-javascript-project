const postsContainer = document.getElementById("posts");
const filterFrom = document.getElementById("from");
const filterTo = document.getElementById("to");
const filterDate = document.getElementById("when");
const loadMoreBtn = document.getElementById("loadMore");

let allTickets = [];
let filteredTickets = [];
let currentPage = 1;
const itemsPerPage = 5;

// ================= FETCH DATA =================
fetch("https://railway.stepprojects.ge/api/tickets")
  .then((response) => response.json())
  .then((data) => {
    allTickets = data;
    filteredTickets = allTickets;

    populateDateFilter(allTickets); // dynamic dates
    displayTickets(filteredTickets, true);
  });

// ================= POPULATE DATE FILTER =================
function populateDateFilter(tickets) {
  const uniqueDates = [...new Set(tickets.map((ticket) => ticket.date))];

  uniqueDates.sort(); // simple sorting

  uniqueDates.forEach((date) => {
    const option = document.createElement("option");
    option.value = date;
    option.textContent = date;
    filterDate.appendChild(option);
  });
}

// ================= DISPLAY TICKETS =================
function displayTickets(tickets, reset = true) {
  if (reset) {
    postsContainer.innerHTML = "";
    currentPage = 1;
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const ticketsToShow = tickets.slice(startIndex, endIndex);

  ticketsToShow.forEach((ticket) => {
    const postDiv = document.createElement("div");
    postDiv.classList.add("post");

    postDiv.innerHTML = `
      <h3>${ticket.train.from} - ${ticket.train.to}</h3>
      <p>დღე: ${ticket.date}</p>
      <p>გამგზავრება: ${ticket.train.departure}</p>
      <p>მოსვლა: ${ticket.train.arrive}</p>
    `;

    postDiv.addEventListener("click", () => {
      sessionStorage.setItem("selectedTicket", JSON.stringify(ticket));
      window.location.href = "reisi.html";
    });

    postsContainer.appendChild(postDiv);
  });

  if (endIndex >= tickets.length) {
    loadMoreBtn.style.display = "none";
  } else {
    loadMoreBtn.style.display = "block";
  }
}

// ================= FILTER LOGIC =================
function applyFilters() {
  const fromValue = filterFrom.value;
  const toValue = filterTo.value;
  const dateValue = filterDate.value;

  let filtered = allTickets;

  if (fromValue !== "all") {
    filtered = filtered.filter((ticket) => ticket.train.from === fromValue);
  }

  if (toValue !== "all") {
    filtered = filtered.filter((ticket) => ticket.train.to === toValue);
  }

  if (dateValue !== "all") {
    filtered = filtered.filter((ticket) => ticket.date === dateValue);
  }

  filteredTickets = filtered;
  displayTickets(filteredTickets, true);
}

// ================= LOAD MORE =================
loadMoreBtn.addEventListener("click", () => {
  currentPage++;
  displayTickets(filteredTickets, false);

  setTimeout(() => {
    postsContainer.lastChild?.scrollIntoView({ behavior: "smooth" });
  }, 100);
});

// ================= EVENT LISTENERS =================
filterFrom.addEventListener("change", applyFilters);
filterTo.addEventListener("change", applyFilters);
filterDate.addEventListener("change", applyFilters);
