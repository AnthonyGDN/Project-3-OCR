document.addEventListener("DOMContentLoaded", () => {
    const gallery = document.querySelector(".gallery");
    const CatFilters = document.querySelector(".ButtonsCatFilters");
    const containerModals = document.querySelector(".modalsContainer");
    const closeModals = document.querySelector(".fa-x");
    const projectModal = document.querySelector(".containerGalleryModal");
    const galleryModal = document.querySelector(".galleryModal")
    const modalAddWork = document.querySelector(".addWorksModal");
    const btnAddWorkModal = document.querySelector(".galleryModal button");
    const arrowleft = document.querySelector(".addWorksModal .fa-arrow-left");
    const markAdd = document.querySelector(".addWorksModal .fa-x");
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
        gallery.innerHTML = ""; // Clear previous content in the gallery
        const works = await getWorks();
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
            btn.id = `category-btn-${category.id}`; 
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
                const btnId = e.target.id.replace("category-btn-", ""); 
                gallery.innerHTML = "";
                const filteredImages = images.filter((work) => btnId == work.categoryId || btnId == "0");
                filteredImages.forEach((work) => createWorks(work));
            });
        });
    }
    async function init() {
        try {
            checkUserLoggedIn();
        } catch (error) {
            console.error("Error retrieving token", error);
        }
    }
    function checkUserLoggedIn() {
        const tokenLocalStorage = window.localStorage.getItem("token");
        if (tokenLocalStorage != undefined) {
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
            projectModal.style.display = "flex";     
            galleryModal.style.display = "flex";     
            modalAddWork.style.display = "none";    
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
    const labelFile = document.querySelector(".containerFileModal label");
    const iconFile = document.querySelector(".containerFileModal .fa-image");
    const pFile = document.querySelector(".containerFileModal p");
    async function displayWorkModal() {
        projectModal.innerHTML = "";
        const imageWork = await getWorks();
        imageWork.forEach(project => {
            const figure = document.createElement("figure");
            const img = document.createElement("img");
            const span = document.createElement("span");
            const square = document.createElement("i");
            const trash = document.createElement("i");
            img.src = project.imageUrl; // Set image source
            square.classList.add("fa-solid", "fa-square");
            square.id = `square-${project.id}`; // Assign unique ID for the icon
            square.addEventListener("click", () => deleteWork(project.id));
            trash.classList.add("fa-solid", "fa-trash-can");
            trash.id = `trash-${project.id}`; 
            trash.addEventListener("click", () => deleteWork(project.id));
            img.src = project.imageUrl;
            span.appendChild(square);
            span.appendChild(trash);
            figure.appendChild(img);
            figure.appendChild(square); // Add trash icon to figure
            figure.appendChild(trash); 
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
            const figureToRemoveGallery = gallery.querySelector(`figure[data-id="${id}"]`);
            if (figureToRemoveGallery) {
                gallery.removeChild(figureToRemoveGallery);
            }
            const figureToRemoveModal = projectModal.querySelector(`figure[data-id="${id}"]`);
            if (figureToRemoveModal) {
                projectModal.removeChild(figureToRemoveModal);
            }
            console.log(`Work with ID ${id} has been deleted.`);
            await displayWorkModal(); // Refresh only the modal view after deletion
            await displayWorks(); 
    } catch (error) {
        console.error("An error occurred while deleting the work:", error);
    }
}
    function resetAddWorkModal() {
        // Clear image preview
        previewImg.src = ""; // Clear preview image source
        previewImg.style.display = "none"; // Hide preview image
        // Reset file input
        inputFile.value = null;
        // Reset form fields
        titleModal.value = "";
        categoryModal.value = "";
        // Show original elements for image upload
        labelFile.style.display = "block";
        iconFile.style.display = "block";
        pFile.style.display = "block";
        // Disable submit button
        const buttonValidForm = document.querySelector(".buttonAddWorksModal button");
        buttonValidForm.classList.remove("buttonModalN2-active");
        buttonValidForm.classList.add("buttonModalN2");
        buttonValidForm.disabled = true;
}
    function displayAddWorkModal() {
        btnAddWorkModal.addEventListener("click", () => {
            containerModals.style.display = "flex";   
            modalAddWork.style.display = "flex";     
            projectModal.style.display = "none";     
            galleryModal.style.display = "none";   
            resetAddWorkModal(); // Reset Modal 2 fields  
        });
        arrowleft.addEventListener("click", () => {
            modalAddWork.style.display = "none";      
            projectModal.style.display = "flex";      
            galleryModal.style.display = "flex";    
            resetAddWorkModal();  
        });
        markAdd.addEventListener("click", () => {
            containerModals.style.display = "none"; 
            modalAddWork.style.display = "none";     
            projectModal.style.display = "none";    
            galleryModal.style.display = "none";      
            resetAddWorkModal(); 
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
    function imagePreview() {
        const file = inputFile.files[0];
        console.log(file);
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = function (e) {
                try {
                    previewImg.src = e.target.result;
                    previewImg.style.display = "flex";
                    labelFile.style.display = "none";
                    iconFile.style.display = "none";
                    pFile.style.display = "none";
                } catch (error) {
                    console.error("An error occurred while reading the file", error);
                }
            };
            reader.readAsDataURL(file);
        } else {
            console.log("Please select a valid image");
        }
    }
    function formCompleted() {
        const titleModal = document.querySelector("#titleModal");
        const categoryModal = document.querySelector("#categoryInputModal");
        const buttonValidForm = document.querySelector(".buttonAddWorksModal button");
        if (titleModal.value !== "" && inputFile.files[0] !== undefined && categoryModal.value !== "") {
            buttonValidForm.classList.remove("buttonModalN2");
            buttonValidForm.classList.add("buttonModalN2-active");
            buttonValidForm.disabled = false; 
            buttonValidForm.addEventListener("click", () => {
                containerModals.style.display = "none";
            });           
        } else {
            buttonValidForm.classList.remove("buttonModalN2-active");
            buttonValidForm.classList.add("buttonModalN2");
            buttonValidForm.disabled = true; 
        }
    }
        const form = document.querySelector("form");
        const titleModal = document.querySelector("#titleModal");
        const categoryModal = document.querySelector("#categoryInputModal");
        inputFile.addEventListener("change", imagePreview);
        titleModal.addEventListener("change", formCompleted);
        categoryModal.addEventListener("change", formCompleted);
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const playload = new FormData();
            console.log(titleModal.value);
            console.log(categoryModal.value);
            console.log(inputFile.files[0]);
            playload.append("title", titleModal.value);
            playload.append("category", categoryModal.value);
            playload.append("image", inputFile.files[0]);
            try {
                const token = window.localStorage.getItem("token");
                const response = await fetch("http://localhost:5678/api/works", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: playload,
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                console.log("New image loaded" + data);
                displayWorks();
                displayWorkModal();
            } catch (error) {
                console.log("An error occurred while sending the image:", error.message);
            }
        });
    init();
    displayWorks();
    displayButtonsCat();
});