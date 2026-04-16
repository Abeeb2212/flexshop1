// REGISTER
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const email = document.getElementById("regEmail").value;
        const password = document.getElementById("regPassword").value;

        let users = JSON.parse(localStorage.getItem("users")) || [];

        const userExists = users.find(user => user.email === email);

        if (userExists) {
            alert("User already exists!");
            return;
        }

        users.push({ email, password });
        localStorage.setItem("users", JSON.stringify(users));

        alert("Registration successful!");
        window.location.href = "login.html";
    });
}

// LOGIN
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        let users = JSON.parse(localStorage.getItem("users")) || [];

        const validUser = users.find(
            user => user.email === email && user.password === password
        );

        if (validUser) {
            localStorage.setItem("loggedInUser", email);
            alert("Login successful!");
            window.location.href = "index.html";
        } else {
            alert("Invalid credentials");
        }
    });
}