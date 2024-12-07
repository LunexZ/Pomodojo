document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.getElementById("login-button");

    loginButton.addEventListener("click", () => {
        // Navigate to the /login page
        window.location.href = '/login';
    });
});
