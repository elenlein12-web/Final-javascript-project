const storedTrain = JSON.parse(sessionStorage.getItem("selectedTrain"));
const API_VAGONS = `https://railway.stepprojects.ge/api/vagons?trainId=${storedTrain.id}`;
const TICKET_PRICE = 35;

let selectedPassengerIdx = null;
let trainSeats = [];
let seatsLoaded = false;

/* TRAIN INFO */
const ticketContainer = document.querySelector(".რეისის-ბარათი");

if (storedTrain && ticketContainer) {
  ticketContainer.innerHTML = `
    <h2>${storedTrain.from} - ${storedTrain.to}</h2>
    <p>დღე: ${storedTrain.date}</p>
    <p>წასვლა: ${storedTrain.departure}</p>
    <p>მოსვლა: ${storedTrain.arrive}</p>
  `;
}

/* INIT */
async function initApp() {
  renderPassengers(2);
  await loadSeatsFromAPI();
  loadFromLocalStorage();
}

initApp();

/* PASSENGERS */
function renderPassengers(count) {
  const container = document.getElementById("passenger-list");
  container.innerHTML = "";

  for (let i = 1; i <= count; i++) {
    container.innerHTML += `
      <div class="passenger-row" data-id="${i}">
        <strong>მგზავრი ${i}</strong>
        <input type="text" placeholder="სახელი" class="fname" oninput="saveToLocalStorage()">
        <input type="text" placeholder="გვარი" class="lname" oninput="saveToLocalStorage()">
        <input type="text" placeholder="პირადი #" class="idnum" oninput="saveToLocalStorage()">

        <button onclick="openModal(${i})" class="seat-btn">
          ადგილი: <span id="seat-${i}">აირჩიე</span>
        </button>
      </div>
    `;
  }
}

/* LOAD SEATS FROM API */
async function loadSeatsFromAPI() {
  if (seatsLoaded) return;

  try {
    const response = await fetch(API_VAGONS);
    const vagons = await response.json();

    trainSeats = [];

    vagons.forEach((vagon) => {
      vagon.seats.forEach((seat) => trainSeats.push(seat));
    });

    seatsLoaded = true;
  } catch (err) {
    console.error("Seat loading error:", err);
  }
}

/* SEAT MODAL */
function openModal(idx) {
  selectedPassengerIdx = idx;
  document.getElementById("seat-modal").classList.add("show");
  renderSeats();
}

function renderSeats() {
  const grid = document.getElementById("seats-grid");
  grid.innerHTML = "";

  const bookedSeats = [];

  document.querySelectorAll(".seat-btn span").forEach((span) => {
    if (span.innerText !== "აირჩიე") {
      bookedSeats.push(span.innerText);
    }
  });

  trainSeats.forEach((seat) => {
    const div = document.createElement("div");
    div.className = "seat";
    div.innerText = seat.number;

    if (seat.isOccupied || bookedSeats.includes(seat.number)) {
      div.classList.add("booked");
      div.style.pointerEvents = "none";
    }

    div.onclick = () => {
      document.getElementById(`seat-${selectedPassengerIdx}`).innerText =
        seat.number;

      saveToLocalStorage();
      document.getElementById("seat-modal").classList.remove("show");
    };

    grid.appendChild(div);
  });
}

/* CLOSE MODAL */
document.querySelector(".close-modal").onclick = () => {
  document.getElementById("seat-modal").classList.remove("show");
};

/* STORAGE */
function saveToLocalStorage() {
  const data = [];

  document.querySelectorAll(".passenger-row").forEach((row) => {
    data.push({
      fname: row.querySelector(".fname").value,
      lname: row.querySelector(".lname").value,
      idnum: row.querySelector(".idnum").value,
      seat: row.querySelector(".seat-btn span").innerText,
    });
  });

  localStorage.setItem("railway_booking", JSON.stringify(data));
  updateInvoice();
}

function loadFromLocalStorage() {
  const saved = JSON.parse(localStorage.getItem("railway_booking") || "[]");

  saved.forEach((p, i) => {
    const row = document.querySelector(`.passenger-row[data-id="${i + 1}"]`);
    if (!row) return;

    row.querySelector(".fname").value = p.fname;
    row.querySelector(".lname").value = p.lname;
    row.querySelector(".idnum").value = p.idnum;
    row.querySelector(".seat-btn span").innerText = p.seat;
  });

  updateInvoice();
}

/* PRICE */
function updateInvoice() {
  const seats = document.querySelectorAll(".seat-btn span");
  let count = 0;

  seats.forEach((s) => {
    if (s.innerText !== "აირჩიე") count++;
  });

  document.getElementById("total-amount").innerText = (
    count * TICKET_PRICE
  ).toFixed(2);
}

/* BOOK BUTTON */
const bookBtn = document.getElementById("book-btn");

bookBtn.addEventListener("click", () => {
  const email = document.getElementById("მეილი").value.trim();
  const phone = document.getElementById("ტელეფონი").value.trim();
  const terms = document.getElementById("terms");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+995\d{8}$/;

  if (!emailRegex.test(email)) {
    Swal.fire("შეცდომა", "გთხოვთ სწორად შეიყვანოთ ელფოსტა", "error");
    return;
  }

  if (!phoneRegex.test(phone)) {
    Swal.fire(
      "შეცდომა",
      "გთხოვთ სწორად შეიყვანოთ ტელეფონი (+995xxxxxxxx)",
      "error",
    );
    return;
  }

  if (!terms.checked) {
    Swal.fire("შეცდომა", "გთხოვთ დაეთანხმოთ წესებს", "error");
    return;
  }

  const passengers = [];
  let allFilled = true;

  document.querySelectorAll(".passenger-row").forEach((row) => {
    const fname = row.querySelector(".fname").value.trim();
    const lname = row.querySelector(".lname").value.trim();
    const idnum = row.querySelector(".idnum").value.trim();
    const seat = row.querySelector(".seat-btn span").innerText;

    if (!fname || !lname || !idnum || seat === "აირჩიე") {
      allFilled = false;
    }

    passengers.push({ fname, lname, idnum, seat });
  });

  if (!allFilled) {
    Swal.fire(
      "შეცდომა",
      "გთხოვთ შეავსოთ ყველა ველი და აირჩიოთ ადგილები",
      "error",
    );
    return;
  }

  const totalPrice = (passengers.length * TICKET_PRICE).toFixed(2);

  const ticketId =
    "T" +
    Date.now().toString(36).toUpperCase() +
    Math.floor(Math.random() * 1000);

  const ticket = {
    id: ticketId,
    train: storedTrain,
    contact: { email, phone },
    passengers,
    totalPrice,
  };

  const tickets = JSON.parse(localStorage.getItem("tickets") || "{}");
  tickets[ticketId] = ticket;

  localStorage.setItem("tickets", JSON.stringify(tickets));

  Swal.fire({
    title: "ბილეთი წარმატებით შეინახა!",
    html: `<p>ბილეთის ნომერი: <strong>${ticketId}</strong></p><p>შეგიძლიათ დაკოპიროთ ან დაიმახსოვროთ.</p>`,
    icon: "success",
    showCancelButton: true,
    confirmButtonText: "კოპირება",
    cancelButtonText: "გასვლა",
  }).then((result) => {
    if (result.isConfirmed) {
      navigator.clipboard.writeText(ticketId);

      Swal.fire(
        "კოპირებულია!",
        "ბილეთის ნომერი კლიპბორდზე გაიგზავნა.",
        "success",
      ).then(() => {
        window.location.href = "lastpage.html";
      });
    } else {
      window.location.href = "lastpage.html";
    }
  });
});
