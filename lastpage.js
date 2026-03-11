const checkBtn = document.getElementById("checkBtn");
const cancelBtn = document.getElementById("cancelBtn");
const ticketInput = document.getElementById("ticketNumber");
const resultArea = document.getElementById("resultArea");
const errorMsg = document.getElementById("errorMsg");
const cancelSuccess = document.getElementById("cancelSuccess");
const passengersContainer = document.getElementById("passengersContainer");

// Check ticket in localStorage
checkBtn.addEventListener("click", () => {
  errorMsg.classList.add("hidden");
  cancelSuccess.classList.add("hidden");
  passengersContainer.innerHTML = "";

  const ticketId = ticketInput.value.trim().toUpperCase();
  if (!ticketId) {
    errorMsg.innerText = "გთხოვთ შეიყვანოთ ბილეთის ნომერი!";
    errorMsg.classList.remove("hidden");
    return;
  }

  const tickets = JSON.parse(localStorage.getItem("tickets")) || {};
  const ticket = tickets[ticketId];

  if (!ticket) {
    errorMsg.innerText = "ბილეთი ვერ მოიძებნა!";
    errorMsg.classList.remove("hidden");
    resultArea.classList.add("hidden");
    return;
  }

  // Display contact info
  passengersContainer.innerHTML += `
    <div class="contact-info-result">
      <h4>📋 საკონტაქტო ინფორმაცია</h4>
      <p><strong>📧 ელფოსტა:</strong> ${ticket.contact?.email || "N/A"}</p>
      <p><strong>📱 ტელეფონი:</strong> ${ticket.contact?.phone || "N/A"}</p>
      <hr>
    </div>
  `;

  // Display all passengers
  ticket.passengers.forEach((p, i) => {
    passengersContainer.innerHTML += `
      <div class="passenger-card">
        <h4>მგზავრი ${i + 1}</h4>
        <p><strong>სახელი:</strong> ${p.fname}</p>
        <p><strong>გვარი:</strong> ${p.lname}</p>
        <p><strong>პირადი ნომერი:</strong> ${p.idnum}</p>
        <p><strong>ადგილი:</strong> ${p.seat}</p>
        <hr>
      </div>
    `;
  });

  // Display total price
  document.getElementById("dispPrice").innerText = ticket.totalPrice;

  resultArea.classList.remove("hidden");
});

// Cancel ticket
cancelBtn.addEventListener("click", () => {
  cancelSuccess.classList.add("hidden");

  const ticketId = ticketInput.value.trim().toUpperCase();
  if (!ticketId) return;

  const tickets = JSON.parse(localStorage.getItem("tickets")) || {};
  if (tickets[ticketId]) {
    delete tickets[ticketId];
    localStorage.setItem("tickets", JSON.stringify(tickets));

    cancelSuccess.innerText = "ბილეთი წარმატებით გაუქმდა";
    cancelSuccess.classList.remove("hidden");
    resultArea.classList.add("hidden");
    ticketInput.value = "";
  } else {
    cancelSuccess.innerText = "ბილეთი ვერ მოიძებნა გაუქმებისთვის";
    cancelSuccess.classList.remove("hidden");
  }
});
