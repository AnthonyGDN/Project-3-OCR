document.addEventListener("DOMContentLoaded", () => {
    const gallery = document.querySelector(".gallery");
    const CatFilters = document.querySelector(".ButtonsCatFilters");
    async function getWorks() {
        try {
            const response = await fetch("http://localhost:5678/api/works");

            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des œuvres depuis la connexion vers API.');
            }

            return await response.json();
        } catch (error) {

            console.error(error.message);
            return [];
        }
    }
    async function displayWorks() {
        const works = await getWorks();
        gallery.innerHTML = "";
        works.forEach((work) => {
            createWorks(work);
        });
    }
    displayWorks();

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
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des catégories depuis la connexion vers API.');
            }
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
    }
    displayButtonsCat();
    async function filterCategorie() {
        const images = await getWorks();
        const AllButtons = document.querySelectorAll(".ButtonsCatFilters button");
        AllButtons.forEach((button) => {
            button.addEventListener("click", (e) => {
                AllButtons.forEach((btn) => {
                    btn.classList.remove("active");
                });
                button.classList.add("active");
                const btnId = e.target.id;
                gallery.innerHTML = "";
                const filteredImages = images.filter((work) => {
                    return btnId == work.categoryId || btnId == "0";
                });
                filteredImages.forEach((work) => {
                    createWorks(work);
                });
            });
        });
    }
    filterCategorie();
})