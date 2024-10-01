const gallery = document.querySelector("gallery");
async function getWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    return await response.json();
}
async function displayWorks() {
    gallery.innerHTML = ""
    const arrayWorks = await getWorks();
    arrayWorks.forEach((work) => {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const figcaption = document.createElement("figcaption");
        img.src = work.imageUrl;
        figcaption.textContent = work.title;
        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    });
}
displayWorks();