let formTitle = document.querySelector("h2");
let loginForm = document.getElementById("login-form");
let usernameInput = document.getElementById("username");
let emailInput = document.getElementById("email");
let actionBtn = document.getElementById("actionBtn");
let switchBtn = document.getElementById("switchBtn");
let login = true;

function checkUserStatus() {
  let loggedIn = localStorage.getItem("loggedIn");
  if (loggedIn === "true") {
    window.location.href = "homepage.html";
  }
}

switchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    toggleForm();
  });

function toggleForm() {
  login = !login; 
  formTitle.textContent = login ? "Login" : "Register";
  actionBtn.textContent = login ? "Login" : "Register";
  switchBtn.textContent = login ? "Create an account" : "Already have an account?";
}

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let username = usernameInput.value.trim();
  let email = emailInput.value.trim();

  if (!username || !email) {
    alert("Please fill in all fields.");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];
  let userExists = false;

  for (let i = 0; i < users.length; i++) {
    if (users[i].username === username && users[i].email === email) {
      userExists = true;
      break;
    }
  }

  if (login) { 
    if (userExists) {
      localStorage.setItem("loggedIn", "true");
      alert("Login successful!");
      window.location.href = "index.html";
    } else {
      alert("Invalid credentials or user not registered.");
    }
  } else {
    for (let i = 0; i < users.length; i++) {
      if (users[i].username === username || users[i].email === email) {
        alert("User already exists! Please log in.");
        return;
      }
    }
    users.push({ username, email });
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("loggedIn", "true");
    alert("Registration successful!");
    window.location.href = "index.html";
  }
});

checkUserStatus();