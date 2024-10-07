document.addEventListener("DOMContentLoaded", () => {
    const gallery = document.querySelector(".gallery");
    const buttonsFilter = document.querySelector(".buttonsFilter");

    async function getWorks() {
        try {
            const response = await fetch("http://localhost:5678/api/works");
            if (!response.ok) {
                throw new Error('Error while retrieving works');
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
                throw new Error('Error while retrieving categories');
            }
            return await response.json();
        } catch (error) {
            console.error(error.message);
            return [];
        }
    }
    
    async function displayButtonsFilter() {
        const categories = await getCategories();
        categories.forEach((category) => {
            createButtonFilter(category);
        });
    }
    
    function createButtonFilter(category) {
        const button = document.createElement("button");
        button.innerText = category.name
        buttonsFilter.appendChild(button);
    }
    displayButtonsFilter();
});



