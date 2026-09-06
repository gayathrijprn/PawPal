document.addEventListener("DOMContentLoaded", () => {
    const dropdown = document.querySelector(".nav-dropdown");
    const button = document.querySelector(".nav-dropdown-toggle");

    if (!dropdown || !button) return;

    button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        dropdown.classList.toggle("open");
    });

    document.addEventListener("click", (event) => {
        if (!dropdown.contains(event.target)) {
            dropdown.classList.remove("open");
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            dropdown.classList.remove("open");
        }
    });
});