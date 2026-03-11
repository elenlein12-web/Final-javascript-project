document
  .getElementById("გადახდის-ფორმა")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const seat = JSON.parse(sessionStorage.getItem("selectedSeat"));

    localStorage.setItem("lastTicketPrice", seat.price);

    alert("Payment successful");

    window.location.href = "lastpage.html";
  });
