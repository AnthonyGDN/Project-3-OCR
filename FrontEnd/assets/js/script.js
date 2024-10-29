document.addEventListener("DOMContentLoaded", () => {
    const gallery = document.querySelector(".gallery");
    const CatFilters = document.querySelector(".ButtonsCatFilters");
    const containerModals = document.querySelector(".modalsContainer");
    const closeModals = document.querySelector(".modalsContainer .fa-xmark");
    const projectModal = document.querySelector(".containerGalleryModal");
    const galleryModal = document.querySelector(".galleryModal")
    const modalAddWork = document.querySelector(".addWorksModal");
    const btnAddWorkModal = document.querySelector(".galleryModal button");
    const arrowleft = document.querySelector(".addWorksModal .fa-arrow-left");
    const markAdd = document.querySelector(".addWorksModal .fa-xmark");
    async function getWorks() {
        try {
            const response = await fetch("http://localhost:5678/api/works");
            if (!response.ok) throw new Error('Error while retrieving works');
            return await response.json();
        } catch (error) {
            console.error(error.message);
            return [];
        }
    }
    async function displayWorks() {
        const works = await getWorks();
        gallery.innerHTML = "";
        works.forEach((work) => createWorks(work));
    }
    function createWorks(work) {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const figcaption = document.createElement("figcaption");
        img.src = work.imageUrl;
        figcaption.textContent = work.title;
        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    }
    async function getCategories() {
        try {
            const response = await fetch("http://localhost:5678/api/categories");
            if (!response.ok) throw new Error('Error retrieving categories');
            return await response.json();
        } catch (error) {
            console.error(error.message);
            return [];
        }
    }
    async function displayButtonsCat() {
        const categories = await getCategories();
        categories.forEach((category) => {
            const btn = document.createElement("button");
            btn.textContent = category.name;
            btn.id = category.id;
            CatFilters.appendChild(btn);
        });
        filterCategorie();
    }
    async function filterCategorie() {
        const images = await getWorks();
        const AllButtons = document.querySelectorAll(".ButtonsCatFilters button");
        AllButtons.forEach((button) => {
            button.addEventListener("click", (e) => {
                AllButtons.forEach((btn) => btn.classList.remove("active"));
                button.classList.add("active");
                const btnId = e.target.id;
                gallery.innerHTML = "";
                const filteredImages = images.filter((work) => btnId == work.categoryId || btnId == "0");
                filteredImages.forEach((work) => createWorks(work));
            });
        });
    }
    async function administratorToken() {
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: "sophie.bluel@test.tld",
                password: "S0phie",
            }),
        });
        const data = await response.json();
        return data.token;
    }
    async function init() {
        try {
            const token = await administratorToken();
            window.localStorage.setItem("token", token);
            console.log("Token:", token);
            checkUserLoggedIn(token);
        } catch (error) {
            console.error("Error retrieving token", error);
        }
    }
    function checkUserLoggedIn(token) {
        const tokenLocalStorage = window.localStorage.getItem("token");
        if (tokenLocalStorage === token) {
            setupAdminMode();
        }
    }
    function setupAdminMode() {
        const logout = document.querySelector("header nav .logout");
        const portfolio = document.querySelector("#portfolio");
        const portfolioTitle = document.querySelector("#portfolio h2");
        const adminTitle = "Mode édition";
        const LogoAdminMod = `<i class="fa-regular fa-pen-to-square"></i>`;
        const adminLog = `<div class="admin-mod"><p>${LogoAdminMod}${adminTitle}</p></div>`;
        const divEdit = document.createElement("div");
        const spanEdit = document.createElement("span");
        logout.textContent = "logout";
        document.body.insertAdjacentHTML("afterbegin", adminLog);
        spanEdit.innerHTML = LogoAdminMod + " Modifier";
        divEdit.classList.add("div-edit");
        divEdit.appendChild(portfolioTitle);
        divEdit.appendChild(spanEdit);
        portfolio.prepend(divEdit);
        CatFilters.style.display = "none";
        divEdit.addEventListener("click", () => {
            containerModals.style.display = "flex";
            displayWorkModal(); 
        });
        logout.addEventListener("click", () => {
            window.localStorage.removeItem("token");
            location.reload();
        });
        closeModals.addEventListener("click", () => {
            containerModals.style.display = "none";
        });
        containerModals.addEventListener("click", (e) => {
            if (e.target.className === "modalsContainer") {
                containerModals.style.display = "none";
            }
        });
        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                containerModals.style.display = "none";
            }
        });
    }
    displayAddWorkModal();
    async function displayWorkModal() {
        projectModal.innerHTML = "";
        const imageWork = await getWorks();
        imageWork.forEach(project => {
            const figure = document.createElement("figure");
            const img = document.createElement("img");
            const span = document.createElement("span");
            const trash = document.createElement("i");
            trash.classList.add("fa-solid", "fa-trash-can");
            trash.id = project.id;
            trash.addEventListener("click", () => deleteWork(project.id));
            img.src = project.imageUrl;
            span.appendChild(trash);
            figure.appendChild(span);
            figure.appendChild(img);
            projectModal.appendChild(figure);
        });
    }
    async function deleteWork(id) {
        const token = window.localStorage.getItem("token");
        try {
            const response = await fetch(`http://localhost:5678/api/works/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Error while deleting');
            displayWorks(); 
        } catch (error) {
            console.error(error);
        }
    }
    function displayAddWorkModal() {
        btnAddWorkModal.addEventListener("click", () => {
            modalAddWork.style.display = "flex";  
            containerModals.style.display = "flex"; 
            projectModal.style.display = "none";
            galleryModal.style.display = "none";   
        });
        arrowleft.addEventListener("click", () => {
            modalAddWork.style.display = "none";    
            projectModal.style.display = "flex";    
        });
        markAdd.addEventListener("click", () => {
            containerModals.style.display = "none"; 
            modalAddWork.style.display = "none";    
            projectModal.style.display = "none";    
        });
    }
    const previewImg = document.querySelector(".containerFileModal img");
    const inputFile = document.querySelector(".containerFileModal input");
    inputFile.addEventListener("change", () => {
        const file = inputFile.files[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = function (e) {
                previewImg.src = e.target.result;
                previewImg.style.display = "flex";
            };
            reader.readAsDataURL(file);
        } else {
            console.log("Please select a valid image");
        }
    });
    const form = document.querySelector("form");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const payload = new FormData(form);
        const token = window.localStorage.getItem("token");
        try {
            const response = await fetch("http://localhost:5678/api/works/", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: payload,
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            displayWorks();
            displayWorkModal();
            modalAddWork.style.display = "none";
        } catch (error) {
            console.log("An error occurred while sending the image", error.message);
        }
    });
    init();
    displayWorks();
    displayButtonsCat();
});