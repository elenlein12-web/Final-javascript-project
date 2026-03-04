const ticketContainer = document.getElementById("ticketDetails");
const BookTicket = document.getElementById("bookButton");

const storedTicket = sessionStorage.getItem("selectedTicket");

let ticket = null; // make it global in this file

if (storedTicket) {
  ticket = JSON.parse(storedTicket);

  ticketContainer.innerHTML = `
    <h2>${ticket.train.from} - ${ticket.train.to}</h2>
    <p>დღე: ${ticket.date}</p>
    <p>წასვლა: ${ticket.train.departure}</p>
    <p>მოსვლა: ${ticket.train.arrive}</p>
  `;
} else {
  ticketContainer.innerHTML =
    "<p>არანაირი ბილეთი არ გაქვთ არჩეული, უკან დაბრუნდით და აირჩიეთ.</p>";
}

BookTicket.addEventListener("click", () => {
  if (ticket) {
    sessionStorage.setItem("selectedTicket", JSON.stringify(ticket));
    window.location.href = "data.html";
  }
});
