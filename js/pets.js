document.addEventListener("DOMContentLoaded", function () {

const petsGrid = document.getElementById("petsGrid");
const petCards = Array.from(document.querySelectorAll(".pet-card"));

const searchInput = document.getElementById("petSearch");
const searchButton = document.getElementById("searchButton");

const categories = document.querySelectorAll(".category");

const locationFilter = document.getElementById("locationFilter");
const ageFilter = document.getElementById("ageFilter");

const genderFilters =
    document.querySelectorAll(".gender-filter");

const sizeFilters =
    document.querySelectorAll(".size-filter");

const sortPets =
    document.getElementById("sortPets");

const clearFilters =
    document.getElementById("clearFilters");

const resetResults =
    document.getElementById("resetResults");

const emptyState =
    document.getElementById("emptyState");

const resultsCount =
    document.getElementById("resultsCount");


let selectedCategory = "all";


/* =====================================================
   FAVOURITES
====================================================== */

function setupFavouriteButtons() {

    document.querySelectorAll(".favorite-button")
        .forEach(function (button) {

            const card =
                button.closest(".pet-card");

            if (!card) return;

            const petName =
                card.dataset.name.toLowerCase();

            const storageKey =
                "pawpal-favorite-" + petName;


            if (
                localStorage.getItem(storageKey)
                === "true"
            ) {

                button.classList.add("active");

                button.textContent = "♥";

            }


            button.addEventListener("click", function (event) {

                event.stopPropagation();

                const isFavorite =
                    button.classList.toggle("active");

                button.textContent =
                    isFavorite ? "♥" : "♡";

                localStorage.setItem(
                    storageKey,
                    isFavorite
                );

            });

        });

}


setupFavouriteButtons();


/* =====================================================
   PET DETAILS NAVIGATION
====================================================== */

function setupPetNavigation() {

    document.querySelectorAll(".pet-card")
        .forEach(function (card) {

            card.addEventListener("click", function (event) {

                if (
                    event.target.closest(
                        ".favorite-button"
                    )
                ) {
                    return;
                }

                const petId =
                    card.dataset.details;

                if (petId) {

                    window.location.href =
                        "pet-details.html?pet=" +
                        encodeURIComponent(petId);

                }

            });


            card.addEventListener("keydown", function (event) {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    const petId =
                        card.dataset.details;

                    if (petId) {

                        window.location.href =
                            "pet-details.html?pet=" +
                            encodeURIComponent(petId);

                    }

                }

            });

        });

}


setupPetNavigation();


/* =====================================================
   GET SELECTED CHECKBOX VALUES
====================================================== */

function getCheckedValues(elements) {

    return Array.from(elements)
        .filter(function (checkbox) {
            return checkbox.checked;
        })
        .map(function (checkbox) {
            return checkbox.value;
        });

}


/* =====================================================
   AGE FILTER
====================================================== */

function matchesAge(age, selectedAge) {

    const numericAge =
        Number(age);

    if (selectedAge === "all") {
        return true;
    }

    if (selectedAge === "baby") {
        return numericAge < 1;
    }

    if (selectedAge === "young") {
        return numericAge >= 1 &&
               numericAge <= 3;
    }

    if (selectedAge === "adult") {
        return numericAge >= 4;
    }

    return true;

}


/* =====================================================
   SEARCH
====================================================== */

function matchesSearch(card, searchTerm) {

    if (!searchTerm) {
        return true;
    }

    const searchableText = [

        card.dataset.name,
        card.dataset.breed,
        card.dataset.location,
        card.dataset.type

    ]
    .join(" ")
    .toLowerCase();


    return searchableText.includes(searchTerm);

}


/* =====================================================
   CATEGORY
====================================================== */

function matchesCategory(card) {

    if (selectedCategory === "all") {
        return true;
    }


    const type =
        card.dataset.type.toLowerCase();


    /*
       Dogs should include normal dogs,
       but puppies are kept separate so the
       Puppy filter works independently.
    */

    if (selectedCategory === "dog") {

        return type === "dog";

    }


    if (selectedCategory === "cat") {

        return type === "cat";

    }


    if (selectedCategory === "puppy") {

        return type === "puppy";

    }


    if (selectedCategory === "kitten") {

        return type === "kitten";

    }


    return true;

}


/* =====================================================
   APPLY FILTERS
====================================================== */

function applyFilters() {

    const searchTerm =
        searchInput.value
            .trim()
            .toLowerCase();


    const selectedLocation =
        locationFilter.value;


    const selectedAge =
        ageFilter.value;


    const selectedGenders =
        getCheckedValues(genderFilters);


    const selectedSizes =
        getCheckedValues(sizeFilters);


    let visibleCards = [];


    petCards.forEach(function (card) {

        const locationMatch =
            selectedLocation === "all" ||
            card.dataset.location === selectedLocation;


        const ageMatch =
            matchesAge(
                card.dataset.age,
                selectedAge
            );


        const genderMatch =
            selectedGenders.length === 0 ||
            selectedGenders.includes(
                card.dataset.gender
            );


        const sizeMatch =
            selectedSizes.length === 0 ||
            selectedSizes.includes(
                card.dataset.size
            );


        const categoryMatch =
            matchesCategory(card);


        const searchMatch =
            matchesSearch(
                card,
                searchTerm
            );


        const shouldShow =
            locationMatch &&
            ageMatch &&
            genderMatch &&
            sizeMatch &&
            categoryMatch &&
            searchMatch;


        if (shouldShow) {

            card.style.display = "";

            visibleCards.push(card);

        } else {

            card.style.display = "none";

        }

    });


    sortVisibleCards(visibleCards);

    updateResultsCount(visibleCards.length);

    updateEmptyState(visibleCards.length);

}


/* =====================================================
   SORT
====================================================== */

function sortVisibleCards(cards) {

    const sortValue =
        sortPets.value;


    const sortedCards =
        [...cards];


    if (sortValue === "name") {

        sortedCards.sort(function (a, b) {

            return a.dataset.name
                .localeCompare(
                    b.dataset.name
                );

        });

    }


    if (sortValue === "youngest") {

        sortedCards.sort(function (a, b) {

            return Number(a.dataset.age) -
                   Number(b.dataset.age);

        });

    }


    if (sortValue === "oldest") {

        sortedCards.sort(function (a, b) {

            return Number(b.dataset.age) -
                   Number(a.dataset.age);

        });

    }


    sortedCards.forEach(function (card) {

        petsGrid.appendChild(card);

    });

}


/* =====================================================
   RESULTS COUNT
====================================================== */

function updateResultsCount(count) {

    if (count === 0) {

        resultsCount.textContent =
            "No companions found";

        return;

    }


    resultsCount.textContent =
        count +
        (
            count === 1
                ? " adorable companion"
                : " adorable companions"
        );

}


/* =====================================================
   EMPTY STATE
====================================================== */

function updateEmptyState(count) {

    if (count === 0) {

        emptyState.classList.add("show");

    } else {

        emptyState.classList.remove("show");

    }

}


/* =====================================================
   CATEGORY BUTTONS
====================================================== */

categories.forEach(function (category) {

    category.addEventListener("click", function () {

        categories.forEach(function (item) {

            item.classList.remove("active");

        });


        category.classList.add("active");


        selectedCategory =
            category.dataset.category;


        applyFilters();

    });

});


/* =====================================================
   SEARCH BUTTON
====================================================== */

searchButton.addEventListener(
    "click",
    function () {

        applyFilters();

    }
);


/* =====================================================
   SEARCH WHILE TYPING
====================================================== */

searchInput.addEventListener(
    "input",
    function () {

        applyFilters();

    }
);


/* =====================================================
   ENTER TO SEARCH
====================================================== */

searchInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            event.preventDefault();

            applyFilters();

        }

    }
);


/* =====================================================
   FILTER CHANGES
====================================================== */

locationFilter.addEventListener(
    "change",
    applyFilters
);


ageFilter.addEventListener(
    "change",
    applyFilters
);


genderFilters.forEach(function (checkbox) {

    checkbox.addEventListener(
        "change",
        applyFilters
    );

});


sizeFilters.forEach(function (checkbox) {

    checkbox.addEventListener(
        "change",
        applyFilters
    );

});


sortPets.addEventListener(
    "change",
    applyFilters
);


/* =====================================================
   CLEAR FILTERS
====================================================== */

clearFilters.addEventListener(
    "click",
    function () {

        searchInput.value = "";

        locationFilter.value = "all";

        ageFilter.value = "all";


        genderFilters.forEach(function (checkbox) {

            checkbox.checked = false;

        });


        sizeFilters.forEach(function (checkbox) {

            checkbox.checked = false;

        });


        selectedCategory = "all";


        categories.forEach(function (category) {

            category.classList.remove("active");

        });


        const allCategory =
            document.querySelector(
                '[data-category="all"]'
            );


        if (allCategory) {

            allCategory.classList.add("active");

        }


        sortPets.value = "featured";


        applyFilters();

    }
);


/* =====================================================
   RESET RESULTS
====================================================== */

resetResults.addEventListener(
    "click",
    function () {

        clearFilters.click();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);


/* =====================================================
   INITIAL LOAD
====================================================== */

applyFilters();

});
