const toggleBtn = document.getElementById("toggleBtn");
const toggleText = document.getElementById("toggleText");
const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const authForm = document.getElementById("authForm");

const firstNameInput = document.getElementById("username");
const lastNameInput = document.getElementById("lastname");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const passwordInput = document.getElementById("password");

let isSignUp = false;
const defaultRole = "user";

function updateFormUI() {
  if (isSignUp) {
    formTitle.textContent = "Sign Up";
    submitBtn.textContent = "Sign Up";
    lastNameInput.classList.remove("hidden");
    emailInput.classList.remove("hidden");
    phoneInput.classList.remove("hidden");
    toggleText.innerHTML = `Already have an account? <button class="toggle-btn" id="toggleBtn">Sign In</button>`;
    document.getElementById("toggleBtn").addEventListener("click", toggleForm);
  } else {
    formTitle.textContent = "Sign In";
    submitBtn.textContent = "Sign In";
    lastNameInput.classList.add("hidden");
    emailInput.classList.add("hidden");
    phoneInput.classList.add("hidden");
    toggleText.innerHTML = `Don't have an account? <button class="toggle-btn" id="toggleBtn">Sign Up</button>`;
    document.getElementById("toggleBtn").addEventListener("click", toggleForm);
  }
}

function toggleForm() {
  isSignUp = !isSignUp;
  updateFormUI();
}

updateFormUI();

authForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const firstName = firstNameInput.value.trim();
  const lastName = lastNameInput.value.trim();
  const email = emailInput.value.trim();
  const phone = phoneInput.value.trim();
  const password = passwordInput.value.trim();

  if (
    !firstName ||
    !password ||
    (isSignUp && (!lastName || !email || !phone))
  ) {
    return Swal.fire("შეცდომა", "გთხოვთ შეავსოთ ყველა ველი", "error");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?\d{9,15}$/;

  if (isSignUp && !emailRegex.test(email)) {
    return Swal.fire("შეცდომა", "გთხოვთ შეიყვანოთ ვალიდური ელფოსტა", "error");
  }

  if (isSignUp && !phoneRegex.test(phone)) {
    return Swal.fire("შეცდომა", "გთხოვთ შეიყვანოთ სწორი ტელეფონი", "error");
  }

  try {
    if (isSignUp) {
      const res = await fetch(
        "https://rentcar.stepprojects.ge/api/Users/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            password,
            role: defaultRole,
            phoneNumber: phone,
          }),
        },
      );

      const data = await res.json();

      if (res.ok) {
        Swal.fire(
          "წარმატება!",
          "რეგისტრაცია წარმატებით შესრულდა!",
          "success",
        ).then(() => {
          // Redirect to index.html
          window.location.href = "index.html";
        });
      } else {
        Swal.fire(
          "შეცდომა",
          data.message || "რეგისტრაცია ვერ განხორციელდა",
          "error",
        );
      }
    } else {
      const res = await fetch(
        "https://rentcar.stepprojects.ge/api/Users/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName,
            lastName: lastName || "User",
            email: email || "",
            password,
            role: defaultRole,
            phoneNumber: phone || "+995555555555",
          }),
        },
      );

      const data = await res.json();

      if (res.ok) {
        Swal.fire("წარმატება!", "წარმატებით შესვლა!", "success").then(() => {
          localStorage.setItem("loggedInUser", JSON.stringify(data));
          window.location.href = "index.html";
        });
      } else {
        Swal.fire("შეცდომა", data.message || "შესვლა ვერ მოხერხდა", "error");
      }
    }
  } catch (err) {
    console.error(err);
    Swal.fire("შეცდომა", "სერვერთან დაკავშირება ვერ მოხერხდა", "error");
  }
});
