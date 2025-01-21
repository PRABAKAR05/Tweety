document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("login-form");
    const errorMessage = document.getElementById("error-message");

    loginForm.addEventListener("submit", async function(event) {
        event.preventDefault(); // Prevent form submission

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        // Reset error message
        errorMessage.style.display = 'none';

        try {
            const response = await fetch('http://localhost:3000/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }), // Proper payload
            });

            const data = await response.json();

            if (response.ok) {
                // Store the token in localStorage for authenticated requests
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', username); // Optionally store the username

                // Redirect to profile page or desired route
                window.location.href = 'profile.html';
            } else {
                // Display error message if login fails
                errorMessage.style.display = 'block';
                errorMessage.textContent = data.message || 'Invalid username or password';
            }
        } catch (error) {
            console.error('Error during login:', error);
            errorMessage.style.display = 'block';
            errorMessage.textContent = 'Something went wrong. Please try again later.';
        }
    });
    

});
