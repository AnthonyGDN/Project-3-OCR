document.addEventListener("DOMContentLoaded", () => {
    console.log("test");
    async function getWorks() {
        const response = await fetch("http://localhost:5678/api/works");
        const works = await response.json();
        console.log(works);
    }
    getWorks();
    const gallery = document.getElementById("gallery");
    console.log(gallery);
});
