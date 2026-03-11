const form = document.getElementById("authForm");
const toggleText = document.getElementById("toggleText");
const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");

const firstNameInput = document.getElementById("username");
const lastNameInput = document.getElementById("lastname");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const passwordInput = document.getElementById("password");

let isSignUp = false;

/* ---------- FORM TOGGLE ---------- */
function renderForm() {
  if (isSignUp) {
    formTitle.textContent = "Sign Up";
    submitBtn.textContent = "Sign Up";

    lastNameInput.style.display = "block";
    phoneInput.style.display = "block";
    emailInput.style.display = "block";

    toggleText.innerHTML = `Already have an account? <button type="button" id="toggleBtn">Sign In</button>`;
  } else {
    formTitle.textContent = "Sign In";
    submitBtn.textContent = "Sign In";

    lastNameInput.style.display = "none";
    phoneInput.style.display = "none";
    emailInput.style.display = "block";

    toggleText.innerHTML = `Don't have an account? <button type="button" id="toggleBtn">Sign Up</button>`;
  }

  const toggleBtn = document.getElementById("toggleBtn");
  toggleBtn.addEventListener("click", () => {
    isSignUp = !isSignUp;
    renderForm();
  });
}

renderForm();

/* ---------- FORM SUBMIT ---------- */
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const firstName = firstNameInput.value.trim();
  const lastName = lastNameInput.value.trim();
  const email = emailInput.value.trim();
  const phone = phoneInput.value.trim();
  const password = passwordInput.value.trim();

  let url, body;

  if (isSignUp) {
    if (!firstName || !lastName || !email || !password) {
      Swal.fire("Error", "Please fill all required fields", "error");
      return;
    }

    url = "https://api.everrest.educata.dev/auth/sign_up";
    body = {
      firstName,
      lastName,
      age: 18,
      email,
      password,
      address: "Tbilisi",
      phone: phone || "+995599123456",
      zipcode: "0178",
      avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${firstName}`,
      gender: "MALE",
    };
  } else {
    // Sign In validation
    if (!email || !password) {
      Swal.fire("Error", "Enter email and password", "error");
      return;
    }

    url = "https://api.everrest.educata.dev/auth/sign_in";
    body = { email, password };
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || "Request failed");


    const token = data.accessToken || data.access_token;
    if (token) localStorage.setItem("token", token);

    // Save user info so index.html recognizes login
    localStorage.setItem(
      "loggedInUser",
      JSON.stringify({ firstName: firstName, email }),
    );

    Swal.fire({
      icon: "success",
      title: isSignUp ? "Account created!" : "Login successful!",
    }).then(() => {
      window.location.href = "index.html";
    });
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: err.message,
    });
  }
});
