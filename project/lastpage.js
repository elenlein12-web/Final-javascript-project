// const checkBtn = document.getElementById("checkBtn");
// const cancelBtn = document.getElementById("cancelBtn");
// const ticketInput = document.getElementById("ticketNumber");
// const resultArea = document.getElementById("resultArea");
// const errorMsg = document.getElementById("errorMsg");
// const cancelSuccess = document.getElementById("cancelSuccess");
// const passengersContainer = document.getElementById("passengersContainer");

// checkBtn.addEventListener("click", () => {
//   // დამალე წინა შეტყობინებები
//   errorMsg.classList.add("hidden");
//   cancelSuccess.classList.add("hidden");

//   const tickets = JSON.parse(localStorage.getItem("tickets")) || {};
//   const id = ticketInput.value.trim().toUpperCase();

//   console.log("ძიების ID:", id);
//   console.log("localStorage-ის ყველა ბილეთი:", tickets);
//   console.log("ობიექტის ყველა key:", Object.keys(tickets));

//   if (!tickets[id]) {
//     console.log("ბილეთი ვერ მოიძებნა!");
//     errorMsg.classList.remove("hidden");
//     resultArea.classList.add("hidden");
//     return;
//   }

//   const ticket = tickets[id];

//   console.log("ნაპოვნი ბილეთი:", ticket);
//   console.log("მგზავრების რაოდენობა:", ticket.passengers.length);

//   // საკონტაქტო ინფორმაციის ჩვენება
//   let contactHTML = "";
//   if (ticket.contact) {
//     contactHTML = `
//       <div class="contact-info-result">
//         <h4>📋 საკონტაქტო ინფორმაცია</h4>
//         <p><strong>📧 ელფოსტა:</strong> ${ticket.contact.email}</p>
//         <p><strong>📱 ტელეფონი:</strong> ${ticket.contact.phone}</p>
//         <hr>
//       </div>
//     `;
//   }

//   // დინამიკურად ემატება ყველა მგზავრი
//   passengersContainer.innerHTML = contactHTML;
//   ticket.passengers.forEach((passenger, index) => {
//     console.log(`მგზავრი ${index + 1}:`, passenger);
//     passengersContainer.innerHTML += `
//       <div class="passenger-card">
//         <h4>მგზავრი ${index + 1}</h4>
//         <p><strong>სახელი:</strong> ${passenger.fname}</p>
//         <p><strong>გვარი:</strong> ${passenger.lname}</p>
//         <p><strong>პირადი ნომერი:</strong> ${passenger.idnum}</p>
//         <p><strong>ადგილი:</strong> ${passenger.seat}</p>
//         <hr>
//       </div>
//     `;
//   });

//   document.getElementById("dispPrice").innerText = ticket.totalPrice;

//   console.log("ბილეთი წარმატებით აჩვენეს!");
//   resultArea.classList.remove("hidden");
//   resultArea.classList.add("ticket-checked");
// });

// cancelBtn.addEventListener("click", () => {
//   cancelSuccess.classList.add("hidden");

//   const tickets = JSON.parse(localStorage.getItem("tickets")) || {};
//   const id = ticketInput.value.trim().toUpperCase();

//   if (tickets[id]) {
//     delete tickets[id];
//     localStorage.setItem("tickets", JSON.stringify(tickets));
//     console.log("ბილეთი გაუქმდა:", id);
//     cancelSuccess.classList.remove("hidden");
//     resultArea.classList.add("hidden");
//     ticketInput.value = "";
//   }
// });

// // localStorage-ის შემოწმების ფუნქცია დებაგისთვის
// window.showTickets = function () {
//   const tickets = JSON.parse(localStorage.getItem("tickets")) || {};
//   console.log("=== localStorage-ის ყველა ბილეთი ===");
//   console.table(tickets);
//   return tickets;
// };

const confirmBtn = document.getElementById("confirmBtn");

const train = JSON.parse(sessionStorage.getItem("selectedTrain"));
const seat = JSON.parse(sessionStorage.getItem("selectedSeat"));

confirmBtn.addEventListener("click", () => {
  const ticketData = {
    trainId: train.id,
    date: new Date().toISOString(),
    email: document.getElementById("email").value,
    phoneNumber: document.getElementById("phone").value,
    people: [
      {
        seatId: seat.seatId,
        name: document.getElementById("name").value,
        surname: document.getElementById("surname").value,
        idNumber: document.getElementById("idnumber").value,
        status: "Adult",
        payoutCompleted: true,
      },
    ],
  };

  fetch("https://railway.stepprojects.ge/api/tickets/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ticketData),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Ticket created:", data);

      alert("Ticket booked successfully!");
    })
    .catch((err) => console.log(err));
});
