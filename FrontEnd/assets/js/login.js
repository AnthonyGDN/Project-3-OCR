document.addEventListener("DOMContentLoaded", () => {
    const emailInput = document.querySelector("form #email");
    const passwordInput = document.querySelector("form #password");
    const loginForm = document.querySelector("form");
    const messageError = document.querySelector(".login p");
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const userEmail = emailInput.value;
        const userPassword = passwordInput.value;
        messageError.textContent = "";
        if (!userEmail || !userPassword) {
            messageError.textContent = "Erreur dans l’identifiant ou le mot de passe";
            return;
        }
        const login = {
            email: userEmail,
            password: userPassword,
        };
        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(login),
        })
        .then((response) => {
            if (!response.ok) {
                return response.json().then((error) => {
                    throw new Error(error.message);
                });
            }
            return response.json();
        })
        .then((data) => {
            const { userId, token: userToken } = data;
            window.localStorage.setItem("token", userToken);
            window.localStorage.setItem("userId", userId); 
            window.location.href = "./index.html";
        })
        .catch((error) => {
            console.error("An error occurred while retrieving data.", error);
            messageError.textContent = "Erreur dans l’identifiant ou le mot de passe";
        });
    });
});