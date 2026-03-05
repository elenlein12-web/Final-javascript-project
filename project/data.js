// ბილეთის რეგისტრაცია - მონაცემების შენახვა localStorage-ში
function saveBileti() {
  // არჩეთ საკონტაქტო ინფორმაცია
  const email = document.getElementById("მეილი").value.trim();
  const phone = document.getElementById("ტელეფონი").value.trim();

  if (!email || !phone) {
    alert("შეავსეთ საკონტაქტო ინფორმაცია (მეილი და ტელეფონი)");
    return;
  }

  const passengerBlocks = document.querySelectorAll(".passenger-row");

  let passengers = [];
  let selectedCount = 0;

  for (let block of passengerBlocks) {
    const fname = block.querySelector(".fname").value.trim();
    const lname = block.querySelector(".lname").value.trim();
    const idnum = block.querySelector(".idnum").value.trim();
    const seat = block.querySelector(".seat-btn span").innerText;

    if (!fname || !lname || !idnum || seat === "აირჩიე") {
      alert("შეავსეთ ყველა მგზავრის ინფორმაცია და აირჩიეთ ადგილი");
      return;
    }

    selectedCount++;

    passengers.push({
      fname,
      lname,
      idnum,
      seat,
    });
  }

  const ticketId = Math.random().toString(36).substring(2, 10).toUpperCase();
  const totalPrice = selectedCount * TICKET_PRICE;

  let tickets = JSON.parse(localStorage.getItem("tickets")) || {};

  tickets[ticketId] = {
    passengers,
    totalPrice: totalPrice,
    createdAt: new Date().toLocaleString(),
    contact: {
      email: email,
      phone: phone,
    },
  };

  localStorage.setItem("tickets", JSON.stringify(tickets));
  localStorage.setItem("lastTicketId", ticketId);
  localStorage.setItem("lastTicketPrice", totalPrice);

  console.log("ბილეთი შენახული localStorage-ში:", ticketId);
  console.log("ყველა ბილეთი:", tickets);

  alert("ბილეთი წარმატებით შეძენილია! თქვენი Ticket ID: " + ticketId);

  // გადატანა გადახდის გვერდზე
  window.location.href = "data2.html";
}
const ticketContainer = document.querySelector(".რეისის-ბარათი");

const storedTicket = sessionStorage.getItem("selectedTicket");

if (storedTicket) {
  const ticket = JSON.parse(storedTicket);

  ticketContainer.innerHTML = `
    <h2>${ticket.train.from} - ${ticket.train.to}</h2>
    <p>დღე: ${ticket.date}</p>
    <p>წასვლა: ${ticket.train.departure}</p>
    <p>მოსვლა: ${ticket.train.arrive}</p>
  `;
}

function მონაცემებისშენახვა() {
  // მონაცემების ამოღება
  const მომხმარებელი = {
    მეილი: document.getElementById("მეილი").value,
    ტელეფონი: document.getElementById("ტელეფონი").value,
    მგზავრი1: {
      სახელი: document.querySelector("#მგზავრი-1 .სახელი").value,
      გვარი: document.querySelector("#მგზავრი-1 .გვარი").value,
      პირადი: document.querySelector("#მგზავრი-1 .პირადი-ნომერი").value,
    },
  };

  // LocalStorage-ში შენახვა (ტექსტური ფორმატით)
  localStorage.setItem("ბილეთისმონაცემები", JSON.stringify(მომხმარებელი));

  alert("მონაცემები წარმატებით შეინახა LocalStorage-ში!");
  console.log("შენახული მონაცემები:", მომხმარებელი);
}

// თქფონის ნომრის ფორმატირება
function ფორმატიფიკაციაფონი(event) {
  let value = event.target.value.replace(/\D/g, "");
  if (value.length > 0) {
    if (value.length <= 3) {
      value = value;
    } else if (value.length <= 6) {
      value = value.slice(0, 3) + " " + value.slice(3);
    } else if (value.length <= 9) {
      value =
        value.slice(0, 3) + " " + value.slice(3, 6) + " " + value.slice(6);
    } else {
      value =
        value.slice(0, 3) + " " + value.slice(3, 6) + " " + value.slice(6, 9);
    }
  }
  event.target.value = value;
}

// გვერდის ჩატვირთვისას მონაცემების აღდგენა (თუ არსებობს)
window.onload = function () {
  // ჯერ ფონის ინპუტზე event listener დამატება
  const ტელფონი = document.getElementById("ტელეფონი");
  if (ტელფონი) {
    ტელფონი.addEventListener("input", ფორმატიფიკაციაფონი);
  }

  // sample მონაცემების ჩატვირთვა
  const შენახული = localStorage.getItem("ბილეთისმონაცემები");
  if (!შენახული) {
    // ამავე sample დეტა
    const sample = {
      მეილი: "user@gmail.com",
      ტელეფონი: "555 123 4567",
    };
    localStorage.setItem("ბილეთისმონაცემები", JSON.stringify(sample));
    document.getElementById("მეილი").value = sample.მეილი;
    document.getElementById("ტელეფონი").value = sample.ტელეფონი;
  } else {
    const მონაცემები = JSON.parse(შენახული);
    document.getElementById("მეილი").value = მონაცემები.მეილი;
    document.getElementById("ტელეფონი").value = მონაცემები.ტელეფონი;
  }
};
const TICKET_PRICE = 35.0;
let selectedPassengerIdx = null;

// მგზავრების მონაცემების გენერაცია
function initApp() {
  renderPassengers(2); // ვუშვებთ 2 მგზავრისთვის
  loadSamplePassengerData();
  loadFromLocalStorage();
}

function renderPassengers(count) {
  const container = document.getElementById("passenger-list");
  for (let i = 1; i <= count; i++) {
    container.innerHTML += `
            <div class="passenger-row" data-id="${i}">
                <strong>მგზავრი ${i}</strong>
                <input type="text" placeholder="სახელი" class="fname" oninput="saveToLocalStorage()">
                <input type="text" placeholder="გვარი" class="lname" oninput="saveToLocalStorage()">
                <input type="text" placeholder="პირადი #" class="idnum" oninput="saveToLocalStorage()">
                <button onclick="openModal(${i})" class="seat-btn">ადგილი: <span id="seat-${i}">აირჩიე</span></button>
            </div>
        `;
  }
}
//change

// LocalStorage-ში შენახვა
function saveToLocalStorage() {
  const data = [];
  document.querySelectorAll(".passenger-row").forEach((row, idx) => {
    const passenger = {
      fname: row.querySelector(".fname").value,
      lname: row.querySelector(".lname").value,
      idnum: row.querySelector(".idnum").value,
      seat: row.querySelector(".seat-btn span").innerText,
    };
    data.push(passenger);
    console.log(`მგზავრი ${idx + 1} შენახული:`, passenger);
  });
  localStorage.setItem("railway_booking", JSON.stringify(data));
  console.log("✅ ყველა მგზავრი შენახული localStorage-ში");
  updateInvoice();
}

// ჩატვირთვა
function loadFromLocalStorage() {
  const saved = localStorage.getItem("railway_booking");
  if (saved) {
    const data = JSON.parse(saved);
    console.log("✅ localStorage-ის მონაცემი იკითხა, მგზავრი:", data.length);
    data.forEach((item, index) => {
      const row = document.querySelector(
        `.passenger-row[data-id="${index + 1}"]`,
      );
      if (row) {
        row.querySelector(".fname").value = item.fname;
        row.querySelector(".lname").value = item.lname;
        row.querySelector(".idnum").value = item.idnum;
        row.querySelector(".seat-btn span").innerText = item.seat;
        console.log(`მგზავრი ${index + 1} იკითხა:`, item);
      }
    });
    updateInvoice();
  }
}

// Sample მონაცემების ჩატვირთვა
function loadSamplePassengerData() {
  const saved = localStorage.getItem("railway_booking");
  if (!saved) {
    // თუ მონაცემი არ არსებობს, ჩატვირთე sample data
    const sampleData = [
      {
        fname: "გიორგი",
        lname: "ქარ ტველი",
        idnum: "12345678",
        seat: "5A",
      },
      {
        fname: "მარიამ",
        lname: "თოფურიძე",
        idnum: "87654321",
        seat: "5B",
      },
    ];
    localStorage.setItem("railway_booking", JSON.stringify(sampleData));
    console.log("✅ Sample მონაცემი დატვირთული (ორი მგზავრი)");
    loadFromLocalStorage();
  }
}

// ადგილების არჩევა
function openModal(idx) {
  selectedPassengerIdx = idx;
  document.getElementById("seat-modal").classList.remove("hidden");
  renderSeats();
}

function renderSeats() {
  const grid = document.getElementById("seats-grid");
  grid.innerHTML = "";
  const currentSeat = document.getElementById(
    `seat-${selectedPassengerIdx}`,
  ).innerText;

  // ყველა დაკავებული ადგილი
  const bookedSeats = [];
  document.querySelectorAll(".seat-btn span").forEach((span) => {
    const seat = span.innerText;
    if (seat !== "აირჩიე") {
      bookedSeats.push(seat);
    }
  });

  console.log("დაკავებული ადგილები:", bookedSeats);
  console.log("ამჟამი მგზავრის ადგილი:", currentSeat);

  for (let i = 1; i <= 20; i++) {
    const seatName = `${Math.ceil(i / 2)}${i % 2 === 0 ? "B" : "A"}`;
    const div = document.createElement("div");
    div.className = "seat";

    // თუ ეს ადგილი ამჟამი მგზავრის აირჩეულია
    if (seatName === currentSeat) {
      div.classList.add("selected");
    }
    // თუ ეს ადგილი სხვა მგზავრის ან დაკავებულია
    else if (bookedSeats.includes(seatName)) {
      div.classList.add("booked");
    }

    div.innerText = seatName;
    div.onclick = () => {
      // თუ ადგილი უკვე დაკავებულია სხვა მგზავრის მიერ
      if (bookedSeats.includes(seatName) && seatName !== currentSeat) {
        alert("ეს ადგილი უკვე დაკავებულია!");
        return;
      }
      document.getElementById(`seat-${selectedPassengerIdx}`).innerText =
        seatName;
      document.getElementById("seat-modal").classList.add("hidden");
      saveToLocalStorage();
    };
    grid.appendChild(div);
  }
}

function updateInvoice() {
  const seats = document.querySelectorAll(".seat-btn span");
  let selectedCount = 0;
  seats.forEach((s) => {
    if (s.innerText !== "აირჩიე") selectedCount++;
  });

  document.getElementById("total-amount").innerText = (
    selectedCount * TICKET_PRICE
  ).toFixed(2);
}

// მოდალის დახურვა
document.querySelector(".close-modal").onclick = () => {
  document.getElementById("seat-modal").classList.add("hidden");
};

// ბილეთის რეგისტრაცია
document.getElementById("book-btn").addEventListener("click", function () {
  const seats = document.querySelectorAll(".seat-btn span");
  let selectedCount = 0;
  seats.forEach((s) => {
    if (s.innerText !== "აირჩიე") selectedCount++;
  });

  const termsCheckbox = document.getElementById("terms");

  if (selectedCount === 0) {
    alert("გთხოვთ, აირჩიოთ ადგილი ყველა მგზავრისთვის");
    return;
  }

  if (!termsCheckbox.checked) {
    alert("გთხოვთ, დაეთანხმოთ წესებს");
    return;
  }

  // ბილეთის მონაცემების შენახვა localStorage-ში
  saveBileti();
});

initApp();
const ticket = {
  id: "00c91282-c9f6-4943-852a-1b25c3ae1e86",
  from: "თბილისი",
  to: "ბათუმი",
  departure: "17:05",
  arrival: "22:17",
  date: "30-08-2023",
  name: "ნიკა ბერიძე",
  personalNumber: "12345678901",
  seat: "7A",
  price: 150,
};
localStorage.setItem("ticket", JSON.stringify(ticket));
