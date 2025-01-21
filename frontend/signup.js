document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById("signup-form");
    const usernameInput = document.getElementById("username");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm-password");

    // Create elements for error messages
    const usernameError = document.createElement("span");
    usernameError.style.color = "red";
    usernameError.style.display = "none";
    usernameInput.parentElement.appendChild(usernameError);

    const emailError = document.createElement("span");
    emailError.style.color = "red";
    emailError.style.display = "none";
    emailInput.parentElement.appendChild(emailError);

    const passwordError = document.createElement("span");
    passwordError.style.color = "red";
    passwordError.style.display = "none";
    confirmPasswordInput.parentElement.appendChild(passwordError);

    signupForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent form submission

        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        // Reset error messages
        usernameError.style.display = "none";
        emailError.style.display = "none";
        passwordError.style.display = "none";

        // Validate password confirmation
        if (password !== confirmPassword) {
            passwordError.textContent = "Passwords do not match.";
            passwordError.style.display = "block";
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Successful registration
                alert("Signup successful! Redirecting to login...");
                window.location.href = "login.html"; // Redirect to login page
            } else {
                // Handle conflicts (username/email exists)
                if (data.message.includes('username') && data.message.includes('email')) {
                    usernameError.textContent = "Both username and email already exist.";
                    usernameError.style.display = "block";
                    emailError.style.display = "block";
                } else if (data.message.includes('username')) {
                    usernameError.textContent = "Username already exists. Please try another.";
                    usernameError.style.display = "block";
                } else if (data.message.includes('email')) {
                    emailError.textContent = "Email already exists. Please try another.";
                    emailError.style.display = "block";
                }
            }
        } catch (error) {
            console.error("Error during signup:", error);
            alert("Something went wrong. Please try again later.");
        }
    });
});