document.addEventListener("DOMContentLoaded", () => {
    const emailInput = document.querySelector("form #email");
    const passwordInput = document.querySelector("form #password");
    const loginForm = document.querySelector("form");
    const messageError = document.querySelector(".login p");
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const userEmail = emailInput.value;
        const userPassword = passwordInput.value;
        if (!userEmail || !userPassword) {
            messageError.textContent = "Erreur dans l’identifiant ou le mot de passe";
            return;
        }
        const login = {
            email: userEmail,
            password: userPassword,
        };
        const user = JSON.stringify(login);
        fetch("http://localhost:5678/api/users/login", {
            method: "POST", 
            mode: "cors", 
            credentials: "same-origin", 
            headers: { "Content-Type": "application/json" }, 
            body: user, 
        })
        .then((response) => {
            if (!response.ok) {
                return response.json().then((error) => {
                    throw new Error(`Error during query : ${error.message}`);
                });
            }
            return response.json(); 
        })
        .then((data) => {
            const { userId, token: userToken } = data;
            window.sessionStorage.setItem("token", userToken, "userId", userId);
            window.sessionStorage.setItem("loged", "true"); 
            window.location.href = "../index.html";
    })
    .catch((error) => {
        console.error("An error occurred while retrieving data.", error);
    });
})});
