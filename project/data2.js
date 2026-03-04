document
  .getElementById("გადახდის-ფორმა")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const lastTicketPrice = localStorage.getItem("lastTicketPrice") || "150.00";

    const ბარათისმონაცემები = {
      ნომერი: document.getElementById("ბარათის-ნომერი").value,
      ვადა: document.getElementById("ვადა").value,
      მფლობელი: document.getElementById("მფლობელი").value,
      თანხა: lastTicketPrice,
    };

    localStorage.setItem("ბოლო_გადახდა", JSON.stringify(ბარათისმონაცემები));

    alert("გადახდა წარმატებით დასრულდა! მონაცემები შენახულია.");
    
    // გადატანა ბილეთის შემოწმების გვერდზე
    window.location.href = "lastpage.html";
    
    this.reset();
  });

window.onload = function () {
  // აჩვენე უკანასკნელი ბილეთის თანხა
  const lastTicketPrice = localStorage.getItem("lastTicketPrice") || "150.00";
  document.getElementById("თანხა").innerText = lastTicketPrice;

  const შენახულიმონაცემები = localStorage.getItem("ბოლო_გადახდა");
  if (შენახულიმონაცემები) {
    console.log(
      "ნაპოვნია წინა გადახდის ისტორია:",
      JSON.parse(შენახულიმონაცემები),
    );
  }
};