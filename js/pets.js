console.log("🔥 PAWPAL JAVASCRIPT IS LOADED 🔥");

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       ELEMENTS
    ====================================================== */

    const petsGrid =
        document.getElementById("petsGrid");

    const petCards =
        Array.from(
            document.querySelectorAll(".pet-card")
        );

    const searchInput =
        document.getElementById("petSearch");

    const searchButton =
        document.getElementById("searchButton");

    const categories =
        document.querySelectorAll(".category");

    const locationFilter =
        document.getElementById("locationFilter");

    const ageFilter =
        document.getElementById("ageFilter");

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
       SUPABASE FAVOURITES
       
       Your HTML uses:
       .pet-heart
       data-pet-id="1"
       
       Your database uses:
       favourite_pets.user_id
       favourite_pets.pet_id
    ====================================================== */

    async function setupFavouriteButtons() {

        /*
         * Make sure Supabase exists.
         */

        if (
            typeof supabaseClient === "undefined" ||
            !supabaseClient
        ) {

            console.error(
                "Supabase client was not found."
            );

            return;

        }


        /*
         * Get currently logged-in user.
         */

        const {
            data: { user },
            error: userError
        } =
            await supabaseClient.auth.getUser();


        if (userError) {

            console.error(
                "Could not get logged-in user:",
                userError
            );

            return;

        }


        /*
         * User is not logged in.
         */

        if (!user) {

            console.log(
                "No user logged in. Favourites require login."
            );

            /*
             * Still allow the buttons to exist,
             * but clicking them will show a message.
             */

            document
                .querySelectorAll(".pet-heart")
                .forEach(function (button) {

                    if (
                        button.dataset.favouriteReady === "true"
                    ) {
                        return;
                    }

                    button.dataset.favouriteReady = "true";


                    button.addEventListener(
                        "click",
                        function (event) {

                            event.preventDefault();
                            event.stopPropagation();

                            alert(
                                "Please log in to save your favourite pets."
                            );

                        }
                    );

                });

            return;

        }


        console.log(
            "Logged-in user:",
            user.id
        );


        /* =================================================
           LOAD EXISTING FAVOURITES
        ================================================== */

        const {
            data: favourites,
            error: favouritesError
        } =
            await supabaseClient
                .from("favourite_pets")
                .select("pet_id")
                .eq(
                    "user_id",
                    user.id
                );


        if (favouritesError) {

            console.error(
                "Could not load favourites:",
                favouritesError
            );

            return;

        }


        console.log(
            "Loaded favourites:",
            favourites
        );


        /*
         * Store favourite pet IDs in a Set.
         */

        const favouritePetIds =
            new Set(
                (favourites || []).map(
                    function (item) {

                        return String(
                            item.pet_id
                        );

                    }
                )
            );


        /* =================================================
           SET UP HEART BUTTONS
        ================================================== */

        document
            .querySelectorAll(".pet-heart")
            .forEach(function (button) {

                const card =
                    button.closest(".pet-card");


                if (!card) {
                    return;
                }


                /*
                 * IMPORTANT:
                 *
                 * Your HTML now has:
                 *
                 * data-pet-id="1"
                 *
                 * so we use dataset.petId.
                 */

                const petId =
                    card.dataset.petId;


                if (!petId) {

                    console.error(
                        "Pet card is missing data-pet-id:",
                        card
                    );

                    return;

                }


                /*
                 * Restore favourite state.
                 */

                if (
                    favouritePetIds.has(
                        String(petId)
                    )
                ) {

                    button.classList.add(
                        "favourite"
                    );

                    button.classList.add(
                        "active"
                    );

                    button.textContent =
                        "♥";

                    button.setAttribute(
                        "aria-label",
                        "Remove from favourites"
                    );

                }
                else {

                    button.classList.remove(
                        "favourite"
                    );

                    button.classList.remove(
                        "active"
                    );

                    button.textContent =
                        "♡";

                    button.setAttribute(
                        "aria-label",
                        "Add to favourites"
                    );

                }


                /*
                 * Prevent duplicate event listeners.
                 */

                if (
                    button.dataset.favouriteReady ===
                    "true"
                ) {

                    return;

                }


                button.dataset.favouriteReady =
                    "true";


                /* =================================================
                   HEART CLICK
                ================================================== */

                button.addEventListener(
                    "click",
                    async function (event) {

                        event.preventDefault();

                        event.stopPropagation();


                        const currentlyFavorite =
                            button.classList.contains(
                                "favourite"
                            );


                        /*
                         * ==========================================
                         * REMOVE FAVOURITE
                         * ==========================================
                         */

                        if (currentlyFavorite) {

                            button.disabled =
                                true;


                            const {
                                error
                            } =
                                await supabaseClient
                                    .from(
                                        "favourite_pets"
                                    )
                                    .delete()
                                    .eq(
                                        "user_id",
                                        user.id
                                    )
                                    .eq(
                                        "pet_id",
                                        Number(petId)
                                    );


                            button.disabled =
                                false;


                            if (error) {

                                console.error(
                                    "Error removing favourite:",
                                    error
                                );

                                alert(
                                    "Could not remove this favourite. Please try again."
                                );

                                return;

                            }


                            /*
                             * Update UI.
                             */

                            button.classList.remove(
                                "favourite"
                            );

                            button.classList.remove(
                                "active"
                            );

                            button.textContent =
                                "♡";

                            button.setAttribute(
                                "aria-label",
                                "Add to favourites"
                            );


                            /*
                             * Keep local Set in sync.
                             */

                            favouritePetIds.delete(
                                String(petId)
                            );


                            console.log(
                                "Removed favourite:",
                                petId
                            );


                            return;

                        }


                        /*
                         * ==========================================
                         * ADD FAVOURITE
                         * ==========================================
                         */

                        button.disabled =
                            true;


                        const {
                            error
                        } =
                            await supabaseClient
                                .from(
                                    "favourite_pets"
                                )
                                .insert({

                                    user_id:
                                        user.id,

                                    pet_id:
                                        Number(petId)

                                });


                        button.disabled =
                            false;


                        if (error) {

                            /*
                             * If a duplicate already exists,
                             * don't break the page.
                             */

                            console.error(
                                "Error adding favourite:",
                                error
                            );


                            alert(
                                "Could not save this favourite. Please try again."
                            );


                            return;

                        }


                        /*
                         * Update UI.
                         */

                        button.classList.add(
                            "favourite"
                        );

                        button.classList.add(
                            "active"
                        );

                        button.textContent =
                            "♥";

                        button.setAttribute(
                            "aria-label",
                            "Remove from favourites"
                        );


                        /*
                         * Keep local Set in sync.
                         */

                        favouritePetIds.add(
                            String(petId)
                        );


                        console.log(
                            "Added favourite:",
                            petId
                        );

                    }
                );

            });

    }



    /* =====================================================
       PET DETAILS NAVIGATION
       
       Your HTML uses:
       data-pet-id="1"
       
       So details will become:
       pet-details.html?pet=1
    ====================================================== */

    function setupPetNavigation() {

        document
            .querySelectorAll(".pet-card")
            .forEach(function (card) {

                card.addEventListener(
                    "click",
                    function (event) {

                        /*
                         * Don't navigate when the heart
                         * was clicked.
                         */

                        if (
                            event.target.closest(
                                ".pet-heart"
                            )
                        ) {

                            return;

                        }


                        const petId =
                            card.dataset.petId;


                        if (!petId) {

                            console.error(
                                "Pet card is missing data-pet-id:",
                                card
                            );

                            return;

                        }


                        window.location.href =
                            "pet-details.html?pet=" +
                            encodeURIComponent(
                                petId
                            );

                    }
                );


                /*
                 * Keyboard accessibility.
                 */

                card.setAttribute(
                    "tabindex",
                    "0"
                );


                card.addEventListener(
                    "keydown",
                    function (event) {

                        if (
                            event.key === "Enter" ||
                            event.key === " "
                        ) {

                            event.preventDefault();


                            const petId =
                                card.dataset.petId;


                            if (!petId) {
                                return;
                            }


                            window.location.href =
                                "pet-details.html?pet=" +
                                encodeURIComponent(
                                    petId
                                );

                        }

                    }
                );

            });

    }



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

    function matchesAge(
        age,
        selectedAge
    ) {

        /*
         * Database/HTML may contain values such as:
         *
         * "2 years"
         * "1 year"
         * "1.5 years"
         * "8 months"
         *
         * Extract the first number.
         */

        const ageText =
            String(age || "")
                .toLowerCase()
                .trim();


        if (
            selectedAge === "all"
        ) {

            return true;

        }


        const numberMatch =
            ageText.match(
                /[\d.]+/
            );


        if (!numberMatch) {

            return true;

        }


        let numericAge =
            Number(
                numberMatch[0]
            );


        /*
         * Convert months to years.
         */

        if (
            ageText.includes("month")
        ) {

            numericAge =
                numericAge / 12;

        }


        if (
            selectedAge === "baby"
        ) {

            return numericAge < 1;

        }


        if (
            selectedAge === "young"
        ) {

            return (
                numericAge >= 1 &&
                numericAge <= 3
            );

        }


        if (
            selectedAge === "adult"
        ) {

            return numericAge >= 4;

        }


        return true;

    }



    /* =====================================================
       SEARCH
    ====================================================== */

    function matchesSearch(
        card,
        searchTerm
    ) {

        if (!searchTerm) {

            return true;

        }


        const searchableText = [

            card.dataset.name,

            card.dataset.breed,

            card.dataset.location,

            card.dataset.type,

            card.dataset.gender,

            card.dataset.size

        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();


        return searchableText.includes(
            searchTerm
        );

    }



    /* =====================================================
       CATEGORY
    ====================================================== */

    function matchesCategory(card) {

        if (
            selectedCategory === "all"
        ) {

            return true;

        }


        const type =
            (
                card.dataset.type ||
                ""
            ).toLowerCase();


        if (
            selectedCategory === "dog"
        ) {

            return type === "dog";

        }


        if (
            selectedCategory === "cat"
        ) {

            return type === "cat";

        }


        if (
            selectedCategory === "puppy"
        ) {

            return (
                type === "puppy" ||
                (
                    type === "dog" &&
                    matchesAge(
                        card.dataset.age,
                        "young"
                    )
                )
            );

        }


        if (
            selectedCategory === "kitten"
        ) {

            return (
                type === "kitten" ||
                (
                    type === "cat" &&
                    matchesAge(
                        card.dataset.age,
                        "young"
                    )
                )
            );

        }


        return true;

    }



    /* =====================================================
       APPLY FILTERS
    ====================================================== */

    function applyFilters() {

        /*
         * Some elements may not exist on the newer
         * pets.html. Handle that safely.
         */

        const searchTerm =
            searchInput
                ? searchInput.value
                    .trim()
                    .toLowerCase()
                : "";


        const selectedLocation =
            locationFilter
                ? locationFilter.value
                : "all";


        const selectedAge =
            ageFilter
                ? ageFilter.value
                : "all";


        const selectedGenders =
            getCheckedValues(
                genderFilters
            );


        const selectedSizes =
            getCheckedValues(
                sizeFilters
            );


        let visibleCards = [];


        petCards.forEach(
            function (card) {

                const locationMatch =
                    selectedLocation === "all" ||
                    card.dataset.location ===
                        selectedLocation;


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

                    card.style.display =
                        "";

                    visibleCards.push(
                        card
                    );

                }
                else {

                    card.style.display =
                        "none";

                }

            }
        );


        sortVisibleCards(
            visibleCards
        );


        updateResultsCount(
            visibleCards.length
        );


        updateEmptyState(
            visibleCards.length
        );

    }



    /* =====================================================
       SORT
    ====================================================== */

    function sortVisibleCards(cards) {

        /*
         * Your pets.html may not have a sort select.
         * Don't crash if it doesn't.
         */

        if (
            !sortPets ||
            !petsGrid
        ) {

            return;

        }


        const sortValue =
            sortPets.value;


        const sortedCards =
            [...cards];


        if (
            sortValue === "name"
        ) {

            sortedCards.sort(
                function (a, b) {

                    return (
                        a.dataset.name || ""
                    ).localeCompare(
                        b.dataset.name || ""
                    );

                }
            );

        }


        if (
            sortValue === "youngest"
        ) {

            sortedCards.sort(
                function (a, b) {

                    return (
                        Number(
                            (a.dataset.age || "")
                                .match(/[\d.]+/)?.[0] ||
                            0
                        ) -
                        Number(
                            (b.dataset.age || "")
                                .match(/[\d.]+/)?.[0] ||
                            0
                        )
                    );

                }
            );

        }


        if (
            sortValue === "oldest"
        ) {

            sortedCards.sort(
                function (a, b) {

                    return (
                        Number(
                            (b.dataset.age || "")
                                .match(/[\d.]+/)?.[0] ||
                            0
                        ) -
                        Number(
                            (a.dataset.age || "")
                                .match(/[\d.]+/)?.[0] ||
                            0
                        )
                    );

                }
            );

        }


        sortedCards.forEach(
            function (card) {

                petsGrid.appendChild(
                    card
                );

            }
        );

    }



    /* =====================================================
       RESULTS COUNT
    ====================================================== */

    function updateResultsCount(
        count
    ) {

        /*
         * New pets.html uses #pets-count.
         */

        const newCount =
            document.getElementById(
                "pets-count"
            );


        if (newCount) {

            newCount.textContent =
                `Showing ${count} pet${
                    count === 1
                        ? ""
                        : "s"
                }`;

        }


        /*
         * Older pets page uses #resultsCount.
         */

        if (
            resultsCount
        ) {

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

    }



    /* =====================================================
       EMPTY STATE
    ====================================================== */

    function updateEmptyState(
        count
    ) {

        /*
         * New pets.html uses #no-results.
         */

        const noResults =
            document.getElementById(
                "no-results"
            );


        if (noResults) {

            noResults.classList.toggle(
                "show",
                count === 0
            );

        }


        /*
         * Older pets page uses #emptyState.
         */

        if (
            emptyState
        ) {

            if (
                count === 0
            ) {

                emptyState.classList.add(
                    "show"
                );

            }
            else {

                emptyState.classList.remove(
                    "show"
                );

            }

        }

    }



    /* =====================================================
       CATEGORY BUTTONS
    ====================================================== */

    categories.forEach(
        function (category) {

            category.addEventListener(
                "click",
                function () {

                    categories.forEach(
                        function (item) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    category.classList.add(
                        "active"
                    );


                    selectedCategory =
                        category.dataset.category ||
                        "all";


                    applyFilters();

                }
            );

        }
    );



    /* =====================================================
       SEARCH BUTTON
    ====================================================== */

    if (
        searchButton
    ) {

        searchButton.addEventListener(
            "click",
            function () {

                applyFilters();

            }
        );

    }



    /* =====================================================
       SEARCH WHILE TYPING
    ====================================================== */

    if (
        searchInput
    ) {

        searchInput.addEventListener(
            "input",
            function () {

                applyFilters();

            }
        );


        /* =================================================
           ENTER TO SEARCH
        ================================================= */

        searchInput.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Enter"
                ) {

                    event.preventDefault();

                    applyFilters();

                }

            }
        );

    }



    /* =====================================================
       FILTER CHANGES
    ====================================================== */

    if (
        locationFilter
    ) {

        locationFilter.addEventListener(
            "change",
            applyFilters
        );

    }


    if (
        ageFilter
    ) {

        ageFilter.addEventListener(
            "change",
            applyFilters
        );

    }


    genderFilters.forEach(
        function (checkbox) {

            checkbox.addEventListener(
                "change",
                applyFilters
            );

        }
    );


    sizeFilters.forEach(
        function (checkbox) {

            checkbox.addEventListener(
                "change",
                applyFilters
            );

        }
    );


    if (
        sortPets
    ) {

        sortPets.addEventListener(
            "change",
            applyFilters
        );

    }



    /* =====================================================
       CLEAR FILTERS
    ====================================================== */

    if (
        clearFilters
    ) {

        clearFilters.addEventListener(
            "click",
            function () {

                if (
                    searchInput
                ) {

                    searchInput.value =
                        "";

                }


                if (
                    locationFilter
                ) {

                    locationFilter.value =
                        "all";

                }


                if (
                    ageFilter
                ) {

                    ageFilter.value =
                        "all";

                }


                genderFilters.forEach(
                    function (checkbox) {

                        checkbox.checked =
                            false;

                    }
                );


                sizeFilters.forEach(
                    function (checkbox) {

                        checkbox.checked =
                            false;

                    }
                );


                selectedCategory =
                    "all";


                categories.forEach(
                    function (category) {

                        category.classList.remove(
                            "active"
                        );

                    }
                );


                const allCategory =
                    document.querySelector(
                        '[data-category="all"]'
                    );


                if (
                    allCategory
                ) {

                    allCategory.classList.add(
                        "active"
                    );

                }


                if (
                    sortPets
                ) {

                    sortPets.value =
                        "featured";

                }


                applyFilters();

            }
        );

    }



    /* =====================================================
       RESET RESULTS
    ====================================================== */

    if (
        resetResults
    ) {

        resetResults.addEventListener(
            "click",
            function () {

                if (
                    clearFilters
                ) {

                    clearFilters.click();

                }


                window.scrollTo({

                    top: 0,

                    behavior: "smooth"

                });

            }
        );

    }



    /* =====================================================
       INITIAL LOAD
    ====================================================== */

    setupPetNavigation();

    setupFavouriteButtons();

    applyFilters();


});