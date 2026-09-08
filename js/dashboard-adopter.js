document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       PAWPAL ADOPTER DASHBOARD
       FRONTEND + AUTH + SUPABASE FAVOURITES
    ====================================================== */

    const currentUser =
        window.PawPalAuth &&
        typeof window.PawPalAuth.getCurrentUser === "function"
            ? window.PawPalAuth.getCurrentUser()
            : null;


    /* =====================================================
       ELEMENTS
    ====================================================== */

    const sidebar =
        document.querySelector(".dashboard-sidebar");

    const sidebarOverlay =
        document.querySelector(".sidebar-overlay");

    const mobileMenuButton =
        document.querySelector(".mobile-menu-btn");

    const sidebarLinks =
        document.querySelectorAll(".sidebar-link");

    const sections =
        document.querySelectorAll(".dashboard-section");

    const topbarTitle =
        document.querySelector(".topbar-title");

    const toast =
        document.getElementById("dashboardToast");


    /* =====================================================
       MOBILE SIDEBAR
    ====================================================== */

    function openSidebar() {

        if (sidebar) {
            sidebar.classList.add("open");
        }

        if (sidebarOverlay) {
            sidebarOverlay.classList.add("show");
        }

        document.body.classList.add("sidebar-open");
    }


    function closeSidebar() {

        if (sidebar) {
            sidebar.classList.remove("open");
        }

        if (sidebarOverlay) {
            sidebarOverlay.classList.remove("show");
        }

        document.body.classList.remove("sidebar-open");
    }


    if (mobileMenuButton) {

        mobileMenuButton.addEventListener(
            "click",
            function () {

                if (
                    sidebar &&
                    sidebar.classList.contains("open")
                ) {
                    closeSidebar();
                } else {
                    openSidebar();
                }
            }
        );
    }


    if (sidebarOverlay) {

        sidebarOverlay.addEventListener(
            "click",
            closeSidebar
        );
    }


    /* =====================================================
       TOAST
    ====================================================== */

    function showToast(
        message,
        type = "success"
    ) {

        if (!toast) {

            console.log(message);

            return;
        }

        toast.textContent = message;

        toast.className =
            "dashboard-toast show " + type;

        clearTimeout(
            window.pawpalAdopterToast
        );

        window.pawpalAdopterToast =
            setTimeout(
                function () {

                    toast.classList.remove(
                        "show"
                    );

                },
                3000
            );
    }


    /* =====================================================
       SECTION NAVIGATION
    ====================================================== */

    function showSection(
        sectionId,
        title
    ) {

        const target =
            document.getElementById(
                sectionId
            );

        if (!target) {

            showToast(
                "Section not found.",
                "error"
            );

            return;
        }

        sections.forEach(
            function (section) {

                section.style.display =
                    "none";
            }
        );

        target.style.display =
            "block";

        if (
            topbarTitle &&
            title
        ) {

            topbarTitle.textContent =
                title;
        }

        sidebarLinks.forEach(
            function (link) {

                link.classList.remove(
                    "active"
                );

                if (
                    link.dataset.section ===
                    sectionId
                ) {

                    link.classList.add(
                        "active"
                    );
                }
            }
        );

        closeSidebar();

        window.history.replaceState(
            null,
            "",
            "#" + sectionId
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }


    /* =====================================================
       SIDEBAR NAVIGATION
    ====================================================== */

    sidebarLinks.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function (event) {

                    const section =
                        link.dataset.section;

                    if (!section) {
                        return;
                    }

                    event.preventDefault();

                    const titleElement =
                        link.querySelector(
                            ".sidebar-link-text"
                        );

                    const title =
                        titleElement
                            ? titleElement.textContent.trim()
                            : "Dashboard";

                    showSection(
                        section,
                        title
                    );
                }
            );
        }
    );


    /* =====================================================
       HASH NAVIGATION
    ====================================================== */

    function handleHash() {

        const hash =
            window.location.hash
                .replace("#", "")
                .trim();

        if (!hash) {
            return;
        }

        const target =
            document.getElementById(hash);

        if (!target) {
            return;
        }

        const matchingLink =
            document.querySelector(
                '.sidebar-link[data-section="' +
                hash +
                '"]'
            );

        let title =
            "Dashboard";

        if (matchingLink) {

            const titleElement =
                matchingLink.querySelector(
                    ".sidebar-link-text"
                );

            if (titleElement) {

                title =
                    titleElement.textContent.trim();
            }

        } else {

            title =
                hash
                    .replace(/-/g, " ")
                    .replace(
                        /\b\w/g,
                        function (letter) {
                            return letter.toUpperCase();
                        }
                    );
        }

        showSection(
            hash,
            title
        );
    }


    handleHash();


    /* =====================================================
       PET SEARCH
    ====================================================== */

    const petSearchInputs =
        document.querySelectorAll(
            "#explore-pets .dashboard-search input, " +
            "#saved-pets .dashboard-search input"
        );


    petSearchInputs.forEach(
        function (input) {

            input.addEventListener(
                "input",
                function () {

                    const searchTerm =
                        input.value
                            .trim()
                            .toLowerCase();

                    const section =
                        input.closest(
                            ".dashboard-section"
                        );

                    if (!section) {
                        return;
                    }

                    const cards =
                        section.querySelectorAll(
                            ".pet-card"
                        );

                    let visibleCount = 0;

                    cards.forEach(
                        function (card) {

                            const text =
                                card.textContent
                                    .toLowerCase();

                            const matches =
                                !searchTerm ||
                                text.includes(
                                    searchTerm
                                );

                            card.style.display =
                                matches
                                    ? ""
                                    : "none";

                            if (matches) {
                                visibleCount++;
                            }
                        }
                    );


                    if (
                        searchTerm &&
                        visibleCount === 0
                    ) {

                        showToast(
                            "No pets matched your search.",
                            "info"
                        );
                    }
                }
            );
        }
    );


    /* =====================================================
       PET CARD NAVIGATION
    ====================================================== */

    document
        .querySelectorAll(".pet-card")
        .forEach(
            function (card) {

                const detailsLink =
                    card.querySelector(
                        "a[href*='pet-details']"
                    );

                if (detailsLink) {
                    return;
                }

                const petId =
                    card.dataset.petId ||
                    card.dataset.details ||
                    card.dataset.pet;

                if (!petId) {
                    return;
                }

                card.style.cursor =
                    "pointer";

                card.addEventListener(
                    "click",
                    function (event) {

                        if (
                            event.target.closest(
                                ".pet-favourite, .pet-heart, button, a, input"
                            )
                        ) {
                            return;
                        }

                        window.location.href =
                            "pet-details.html?pet=" +
                            encodeURIComponent(
                                petId
                            );
                    }
                );
            }
        );


    /* =====================================================
       FAVOURITES — SUPABASE
    ====================================================== */

    function getPetId(card) {

        /*
         * IMPORTANT:
         *
         * Your pets page uses:
         *
         * data-pet-id="1"
         *
         * So data-pet-id MUST be checked first.
         *
         * The other two are kept as fallbacks
         * for older dashboard cards.
         */

        return (
            card.dataset.petId ||
            card.dataset.details ||
            card.dataset.pet ||
            ""
        );
    }


    /* =====================================================
       GET USER FAVOURITE PET IDS
    ====================================================== */

    async function getFavouritePetIds() {

        if (
            !currentUser ||
            !currentUser.id
        ) {

            return [];
        }

        if (
            !window.supabaseClient
        ) {

            console.error(
                "PawPal: Supabase client unavailable."
            );

            return [];
        }

        const {
            data,
            error
        } =
            await window.supabaseClient
                .from("favourite_pets")
                .select("pet_id")
                .eq(
                    "user_id",
                    currentUser.id
                );


        if (error) {

            console.error(
                "PawPal: Could not load favourites:",
                error
            );

            return [];
        }

        return (
            data || []
        ).map(
            function (row) {

                return String(
                    row.pet_id
                );
            }
        );
    }


    /* =====================================================
       UPDATE HEART BUTTON
    ====================================================== */

    function updateFavouriteButton(
        button,
        saved
    ) {

        if (!button) {
            return;
        }

        button.classList.toggle(
            "active",
            saved
        );

        button.classList.toggle(
            "favourite",
            saved
        );

        button.textContent =
            saved
                ? "♥"
                : "♡";

        button.setAttribute(
            "aria-pressed",
            String(saved)
        );

        button.setAttribute(
            "aria-label",
            saved
                ? "Remove from favourites"
                : "Add to favourites"
        );
    }


    /* =====================================================
       LOAD FAVOURITES
    ====================================================== */

    async function loadFavourites() {

        if (!currentUser) {

            console.log(
                "PawPal: No logged-in user. Favourites not loaded."
            );

            return;
        }

        const favouriteIds =
            await getFavouritePetIds();


        console.log(
            "PawPal: Loaded favourite pet IDs:",
            favouriteIds
        );


        document
            .querySelectorAll(
                ".pet-favourite, .pet-heart"
            )
            .forEach(
                function (button) {

                    const card =
                        button.closest(
                            ".pet-card"
                        );

                    if (!card) {
                        return;
                    }

                    const petId =
                        getPetId(card);

                    if (!petId) {

                        console.warn(
                            "PawPal: Favourite button card has no pet ID.",
                            card
                        );

                        return;
                    }

                    const saved =
                        favouriteIds.includes(
                            String(petId)
                        );

                    updateFavouriteButton(
                        button,
                        saved
                    );
                }
            );


        updateSavedPets(
            favouriteIds
        );
    }


    /* =====================================================
       TOGGLE FAVOURITE
    ====================================================== */

    async function toggleFavourite(
        button,
        card
    ) {

        if (!currentUser) {

            showToast(
                "Please log in to save your favourite pets.",
                "error"
            );

            return;
        }


        if (!window.supabaseClient) {

            showToast(
                "Supabase is unavailable. Please refresh the page.",
                "error"
            );

            return;
        }


        const petId =
            getPetId(card);


        if (!petId) {

            showToast(
                "Unable to identify this pet.",
                "error"
            );

            return;
        }


        const numericPetId =
            Number(petId);


        if (
            !Number.isFinite(
                numericPetId
            )
        ) {

            console.error(
                "PawPal: Invalid pet ID:",
                petId
            );

            showToast(
                "Invalid pet ID.",
                "error"
            );

            return;
        }


        /* =================================================
           CHECK EXISTING FAVOURITE
        ================================================== */

        const {
            data: existing,
            error: checkError
        } =
            await window.supabaseClient
                .from("favourite_pets")
                .select("id")
                .eq(
                    "user_id",
                    currentUser.id
                )
                .eq(
                    "pet_id",
                    numericPetId
                )
                .maybeSingle();


        if (checkError) {

            console.error(
                "PawPal: Favourite check failed:",
                checkError
            );

            showToast(
                "Could not update favourite. Please try again.",
                "error"
            );

            return;
        }


        /* =================================================
           REMOVE FAVOURITE
        ================================================== */

        if (existing) {

            const {
                error
            } =
                await window.supabaseClient
                    .from("favourite_pets")
                    .delete()
                    .eq(
                        "id",
                        existing.id
                    )
                    .eq(
                        "user_id",
                        currentUser.id
                    );


            if (error) {

                console.error(
                    "PawPal: Remove favourite failed:",
                    error
                );

                showToast(
                    "Could not remove favourite.",
                    "error"
                );

                return;
            }


            updateFavouriteButton(
                button,
                false
            );


            showToast(
                "Pet removed from your favourites.",
                "success"
            );

        }


        /* =================================================
           ADD FAVOURITE
        ================================================== */

        else {

            const {
                error
            } =
                await window.supabaseClient
                    .from("favourite_pets")
                    .insert({
                        user_id:
                            currentUser.id,

                        pet_id:
                            numericPetId
                    });


            if (error) {

                console.error(
                    "PawPal: Save favourite failed:",
                    error
                );

                showToast(
                    "Could not save favourite.",
                    "error"
                );

                return;
            }


            updateFavouriteButton(
                button,
                true
            );


            showToast(
                "Pet saved to your favourites 💗",
                "success"
            );
        }


        /*
         * Refresh the saved-pets state
         * from Supabase.
         */

        await updateSavedPetsFromSupabase();
    }


    /* =====================================================
       FAVOURITE BUTTON LISTENERS
    ====================================================== */

    document
        .querySelectorAll(
            ".pet-favourite, .pet-heart"
        )
        .forEach(
            function (button) {

                /*
                 * Prevent duplicate listeners
                 * if another PawPal script has already
                 * initialized this button.
                 */

                if (
                    button.dataset.dashboardFavouriteReady ===
                    "true"
                ) {
                    return;
                }


                const card =
                    button.closest(
                        ".pet-card"
                    );

                if (!card) {
                    return;
                }


                button.dataset.dashboardFavouriteReady =
                    "true";


                button.addEventListener(
                    "click",
                    async function (event) {

                        event.preventDefault();
                        event.stopPropagation();


                        if (
                            button.disabled
                        ) {
                            return;
                        }


                        button.disabled =
                            true;


                        try {

                            await toggleFavourite(
                                button,
                                card
                            );

                        } catch (error) {

                            console.error(
                                "PawPal: Favourite error:",
                                error
                            );

                            showToast(
                                "Something went wrong. Please try again.",
                                "error"
                            );

                        } finally {

                            button.disabled =
                                false;
                        }
                    }
                );
            }
        );


    /* =====================================================
       UPDATE SAVED PET CARDS
    ====================================================== */

    function updateSavedPets(
        favouriteIds = []
    ) {

        document
            .querySelectorAll(
                "#saved-pets .pet-card"
            )
            .forEach(
                function (card) {

                    const petId =
                        getPetId(card);

                    const saved =
                        favouriteIds.includes(
                            String(petId)
                        );

                    card.classList.toggle(
                        "saved",
                        saved
                    );


                    /*
                     * Also update the heart inside
                     * saved pet cards if present.
                     */

                    const button =
                        card.querySelector(
                            ".pet-favourite, .pet-heart"
                        );

                    if (button) {

                        updateFavouriteButton(
                            button,
                            saved
                        );
                    }
                }
            );
    }


    /* =====================================================
       UPDATE SAVED PETS FROM SUPABASE
    ====================================================== */

    async function updateSavedPetsFromSupabase() {

        if (!currentUser) {
            return;
        }

        const favouriteIds =
            await getFavouritePetIds();

        updateSavedPets(
            favouriteIds
        );
    }


    /* =====================================================
       INITIAL FAVOURITE LOAD
    ====================================================== */

    loadFavourites();


    /* =====================================================
       ADOPTION BUTTONS
    ====================================================== */

    document
        .querySelectorAll(
            "[data-adopt-pet]"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();
                        event.stopPropagation();

                        const pet =
                            button.dataset.adoptPet;

                        if (pet) {

                            window.location.href =
                                "adoption-form.html?pet=" +
                                encodeURIComponent(
                                    pet
                                );

                        } else {

                            window.location.href =
                                "adoption-form.html";
                        }
                    }
                );
            }
        );


    /* =====================================================
       APPLICATION STATUS
    ====================================================== */

    document
        .querySelectorAll(
            "[data-application-action]"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();

                        const action =
                            button.dataset.applicationAction;


                        if (action === "view") {

                            window.location.href =
                                "adoption-status.html";

                            return;
                        }


                        if (
                            action !== "cancel"
                        ) {
                            return;
                        }


                        const confirmed =
                            confirm(
                                "Are you sure you want to cancel this adoption application?"
                            );


                        if (!confirmed) {
                            return;
                        }


                        const row =
                            button.closest(
                                "tr, .application-item"
                            );


                        if (row) {

                            const status =
                                row.querySelector(
                                    ".status"
                                );

                            if (status) {

                                status.textContent =
                                    "Cancelled";

                                status.className =
                                    "status status-rejected";
                            }

                            button.style.display =
                                "none";
                        }


                        showToast(
                            "Application cancelled.",
                            "success"
                        );
                    }
                );
            }
        );


    /* =====================================================
       ADOPTION JOURNEY
    ====================================================== */

    document
        .querySelectorAll(
            "[data-journey-action]"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();

                        const action =
                            button.dataset.journeyAction;


                        if (
                            action === "meet"
                        ) {

                            showToast(
                                "Meet & greet request sent! 🐾",
                                "success"
                            );

                            button.textContent =
                                "Request Sent";

                            button.disabled =
                                true;

                            button.classList.add(
                                "disabled"
                            );
                        }


                        if (
                            action === "continue"
                        ) {

                            showToast(
                                "Your adoption journey continues! 💗",
                                "success"
                            );
                        }
                    }
                );
            }
        );


    /* =====================================================
       NOTIFICATIONS
    ====================================================== */

    const notificationButton =
        document.querySelector(
            ".topbar-icon-btn"
        );


    if (notificationButton) {

        notificationButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                const notificationSection =
                    document.getElementById(
                        "notifications"
                    );


                if (notificationSection) {

                    showSection(
                        "notifications",
                        "Notifications"
                    );

                } else {

                    showToast(
                        "You have new PawPal notifications 🐾",
                        "info"
                    );
                }
            }
        );
    }


    /* =====================================================
       MARK NOTIFICATIONS AS READ
    ====================================================== */

    document
        .querySelectorAll(
            ".notification-item, .activity-item"
        )
        .forEach(
            function (item) {

                item.addEventListener(
                    "click",
                    function () {

                        item.classList.add(
                            "read"
                        );
                    }
                );
            }
        );


    /* =====================================================
       SETTINGS
    ====================================================== */

    document
        .querySelectorAll(
            ".toggle input"
        )
        .forEach(
            function (toggle) {

                toggle.addEventListener(
                    "change",
                    function () {

                        const row =
                            toggle.closest(
                                ".setting-row"
                            );

                        const title =
                            row
                                ? row.querySelector(
                                    "h4, h3, .setting-title"
                                )
                                : null;

                        const settingName =
                            title
                                ? title.textContent.trim()
                                : "Setting";


                        showToast(
                            settingName +
                            (
                                toggle.checked
                                    ? " enabled."
                                    : " disabled."
                            ),
                            "success"
                        );
                    }
                );
            }
        );


    /* =====================================================
       PROFILE
    ====================================================== */

    const profileForm =
        document.getElementById(
            "profileForm"
        );


    if (profileForm) {

        const nameInput =
            profileForm.querySelector(
                '[name="name"]'
            );


        if (
            nameInput &&
            currentUser
        ) {

            nameInput.value =
                currentUser.name || "";
        }


        profileForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();

                const newName =
                    nameInput
                        ? nameInput.value.trim()
                        : "";


                if (!newName) {

                    showToast(
                        "Please enter your name.",
                        "error"
                    );

                    return;
                }


                /* Update local auth */

                if (
                    currentUser &&
                    window.PawPalAuth &&
                    typeof window.PawPalAuth.saveCurrentUser ===
                        "function"
                ) {

                    currentUser.name =
                        newName;

                    window.PawPalAuth.saveCurrentUser(
                        currentUser
                    );
                }


                /* Update Supabase metadata */

                if (
                    window.supabaseClient &&
                    window.supabaseClient.auth &&
                    typeof window.supabaseClient.auth
                        .updateUser ===
                        "function"
                ) {

                    try {

                        await window.supabaseClient.auth.updateUser(
                            {
                                data: {
                                    full_name:
                                        newName,

                                    first_name:
                                        newName.split(
                                            " "
                                        )[0]
                                }
                            }
                        );

                    } catch (error) {

                        console.warn(
                            "Supabase profile update warning:",
                            error
                        );
                    }
                }


                /* Update visible name */

                document
                    .querySelectorAll(
                        "[data-user-name]"
                    )
                    .forEach(
                        function (element) {

                            element.textContent =
                                newName;
                        }
                    );


                document
                    .querySelectorAll(
                        "[data-profile-name]"
                    )
                    .forEach(
                        function (element) {

                            element.value =
                                newName;
                        }
                    );


                /* Update avatar */

                document
                    .querySelectorAll(
                        "[data-user-avatar]"
                    )
                    .forEach(
                        function (element) {

                            if (
                                window.PawPalAuth &&
                                typeof window.PawPalAuth.getInitials ===
                                    "function"
                            ) {

                                element.textContent =
                                    window.PawPalAuth.getInitials(
                                        newName
                                    );
                            }
                        }
                    );


                showToast(
                    "Profile updated successfully.",
                    "success"
                );
            }
        );
    }


    /* =====================================================
       USER INFORMATION
    ====================================================== */

    if (currentUser) {

        document
            .querySelectorAll(
                "[data-user-name]"
            )
            .forEach(
                function (element) {

                    element.textContent =
                        currentUser.name || "";
                }
            );


        document
            .querySelectorAll(
                "[data-user-email]"
            )
            .forEach(
                function (element) {

                    element.textContent =
                        currentUser.email || "";
                }
            );


        document
            .querySelectorAll(
                "[data-user-role]"
            )
            .forEach(
                function (element) {

                    element.textContent =
                        window.PawPalAuth &&
                        typeof window.PawPalAuth.formatRole ===
                            "function"
                            ? window.PawPalAuth.formatRole(
                                currentUser.role
                            )
                            : "Adopter";
                }
            );


        document
            .querySelectorAll(
                "[data-user-avatar]"
            )
            .forEach(
                function (element) {

                    element.textContent =
                        window.PawPalAuth &&
                        typeof window.PawPalAuth.getInitials ===
                            "function"
                            ? window.PawPalAuth.getInitials(
                                currentUser.name || ""
                            )
                            : "AD";
                }
            );
    }


    /* =====================================================
       QUICK ACTIONS
    ====================================================== */

    document
        .querySelectorAll(
            "[data-dashboard-action]"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();

                        const action =
                            button.dataset.dashboardAction;


                        const actions = {

                            "explore-pets": [
                                "explore-pets",
                                "Explore Pets"
                            ],

                            "saved-pets": [
                                "saved-pets",
                                "Saved Pets"
                            ],

                            "applications": [
                                "applications",
                                "My Applications"
                            ],

                            "journey": [
                                "adoption-journey",
                                "Adoption Journey"
                            ],

                            "notifications": [
                                "notifications",
                                "Notifications"
                            ]
                        };


                        if (actions[action]) {

                            showSection(
                                actions[action][0],
                                actions[action][1]
                            );
                        }
                    }
                );
            }
        );


    /* =====================================================
       LOGOUT
    ====================================================== */

    document
        .querySelectorAll(
            ".logout-btn, [data-logout]"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    async function (event) {

                        event.preventDefault();
                        event.stopPropagation();


                        const confirmed =
                            confirm(
                                "Are you sure you want to log out?"
                            );


                        if (!confirmed) {
                            return;
                        }


                        if (
                            window.PawPalAuth &&
                            typeof window.PawPalAuth.logoutUser ===
                                "function"
                        ) {

                            await window.PawPalAuth.logoutUser();

                            return;
                        }


                        localStorage.removeItem(
                            "pawpal-current-user"
                        );

                        window.location.href =
                            "login.html";
                    }
                );
            }
        );


    /* =====================================================
       BACK TO PAWPAL
    ====================================================== */

    document
        .querySelectorAll(
            ".back-to-pawpal, [data-back-home]"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function (event) {

                        const href =
                            button.getAttribute(
                                "href"
                            );

                        if (href) {
                            return;
                        }

                        event.preventDefault();

                        window.location.href =
                            "../index.html";
                    }
                );
            }
        );


    /* =====================================================
       INITIAL DASHBOARD STATE
    ====================================================== */

    if (!window.location.hash) {

        const exploreSection =
            document.getElementById(
                "explore-pets"
            );


        if (exploreSection) {

            sections.forEach(
                function (section) {

                    section.style.display =
                        "none";
                }
            );

            exploreSection.style.display =
                "block";
        }


        const exploreLink =
            document.querySelector(
                '.sidebar-link[data-section="explore-pets"]'
            );


        if (exploreLink) {

            exploreLink.classList.add(
                "active"
            );
        }
    }


    console.log(
        "🐾 PawPal Adopter Dashboard loaded successfully."
    );

});