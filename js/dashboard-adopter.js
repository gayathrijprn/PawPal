document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       PAWPAL ADOPTER DASHBOARD
       FRONTEND ONLY
    ====================================================== */


    /* =====================================================
       AUTH
    ====================================================== */

    const currentUser =
        window.PawPalAuth
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

        document.body.classList.add(
            "sidebar-open"
        );

    }


    function closeSidebar() {

        if (sidebar) {
            sidebar.classList.remove("open");
        }

        if (sidebarOverlay) {
            sidebarOverlay.classList.remove("show");
        }

        document.body.classList.remove(
            "sidebar-open"
        );

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

            alert(message);

            return;

        }


        toast.textContent =
            message;


        toast.className =
            "dashboard-toast show " +
            type;


        clearTimeout(
            window.pawpalAdopterToast
        );


        window.pawpalAdopterToast =
            setTimeout(function () {

                toast.classList.remove(
                    "show"
                );

            }, 3000);

    }


    /* =====================================================
       SECTION NAVIGATION
    ====================================================== */

    function showSection(
        sectionId,
        title
    ) {

        sections.forEach(
            function (section) {

                section.style.display =
                    "none";

            }
        );


        const target =
            document.getElementById(
                sectionId
            );


        if (target) {

            target.style.display =
                "block";

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }


        if (topbarTitle && title) {

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
            document.getElementById(
                hash
            );


        if (target) {

            showSection(
                hash,
                hash
                    .replace(/-/g, " ")
                    .replace(/\b\w/g, function (letter) {
                        return letter.toUpperCase();
                    })
            );

        }

    }


    handleHash();


    /* =====================================================
       PET SEARCH
    ====================================================== */

    const petSearchInputs =
        document.querySelectorAll(
            "#explore-pets .dashboard-search input," +
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


                    let visibleCount =
                        0;


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

    document.querySelectorAll(
        ".pet-card"
    ).forEach(
        function (card) {

            const detailsLink =
                card.querySelector(
                    "a[href*='pet-details']"
                );


            if (detailsLink) {
                return;
            }


            const petId =
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
                            ".pet-favourite"
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
       FAVOURITES
    ====================================================== */

    function setupFavouriteButtons() {

        document.querySelectorAll(
            ".pet-favourite"
        ).forEach(
            function (button) {

                const card =
                    button.closest(
                        ".pet-card"
                    );


                if (!card) {
                    return;
                }


                const petId =
                    card.dataset.details ||
                    card.dataset.pet ||
                    card.dataset.name ||
                    "pet";


                const storageKey =
                    "pawpal-favorite-" +
                    petId
                        .toString()
                        .toLowerCase();


                const saved =
                    localStorage.getItem(
                        storageKey
                    ) === "true";


                if (saved) {

                    button.classList.add(
                        "active"
                    );

                    button.textContent =
                        "♥";

                }


                button.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();
                        event.stopPropagation();


                        const isFavorite =
                            button.classList.toggle(
                                "active"
                            );


                        button.textContent =
                            isFavorite
                                ? "♥"
                                : "♡";


                        localStorage.setItem(
                            storageKey,
                            isFavorite
                        );


                        showToast(
                            isFavorite
                                ? "Pet saved to your favourites 💗"
                                : "Pet removed from your favourites.",
                            "success"
                        );

                    }
                );

            }
        );

    }


    setupFavouriteButtons();


    /* =====================================================
       SAVED PETS
    ====================================================== */

    function updateSavedPets() {

        const savedCards =
            document.querySelectorAll(
                "#saved-pets .pet-card"
            );


        savedCards.forEach(
            function (card) {

                const petId =
                    card.dataset.details ||
                    card.dataset.pet ||
                    card.dataset.name ||
                    "";


                const storageKey =
                    "pawpal-favorite-" +
                    petId
                        .toString()
                        .toLowerCase();


                const isSaved =
                    localStorage.getItem(
                        storageKey
                    ) === "true";


                /*
                   Do not remove cards automatically
                   from the static demo dashboard.
                   They remain available for the UI.
                */

                if (isSaved) {

                    card.classList.add(
                        "saved"
                    );

                } else {

                    card.classList.remove(
                        "saved"
                    );

                }

            }
        );

    }


    updateSavedPets();


    /* =====================================================
       ADOPTION BUTTONS
    ====================================================== */

    document.querySelectorAll(
        "[data-adopt-pet]"
    ).forEach(
        function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();


                    const pet =
                        button.dataset
                            .adoptPet;


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

    document.querySelectorAll(
        "[data-application-action]"
    ).forEach(
        function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();


                    const action =
                        button.dataset
                            .applicationAction;


                    if (
                        action ===
                        "view"
                    ) {

                        showToast(
                            "Application details opened.",
                            "info"
                        );

                    }


                    if (
                        action ===
                        "cancel"
                    ) {

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

                }
            );

        }
    );


    /* =====================================================
       ADOPTION JOURNEY
    ====================================================== */

    document.querySelectorAll(
        "[data-journey-action]"
    ).forEach(
        function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();


                    const action =
                        button.dataset
                            .journeyAction;


                    if (
                        action ===
                        "meet"
                    ) {

                        showToast(
                            "Meet & greet request sent! 🐾",
                            "success"
                        );


                        button.textContent =
                            "Request Sent";


                        button.disabled =
                            true;

                    }


                    if (
                        action ===
                        "continue"
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
            function () {

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

    document.querySelectorAll(
        ".notification-item, .activity-item"
    ).forEach(
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
       SETTINGS TOGGLES
    ====================================================== */

    document.querySelectorAll(
        ".toggle input"
    ).forEach(
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
       PROFILE FORM
    ====================================================== */

    const profileForm =
        document.getElementById(
            "profileForm"
        );


    if (profileForm) {

        profileForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const nameInput =
                    profileForm.querySelector(
                        '[name="name"]'
                    );


                if (
                    currentUser &&
                    nameInput &&
                    nameInput.value.trim()
                ) {

                    currentUser.name =
                        nameInput.value.trim();


                    if (
                        window.PawPalAuth
                    ) {

                        window.PawPalAuth
                            .saveCurrentUser(
                                currentUser
                            );

                    }


                    document
                        .querySelectorAll(
                            "[data-user-name]"
                        )
                        .forEach(
                            function (element) {

                                element.textContent =
                                    currentUser.name;

                            }
                        );

                }


                showToast(
                    "Profile updated successfully.",
                    "success"
                );

            }
        );

    }


    /* =====================================================
       PROFILE DATA
    ====================================================== */

    if (currentUser) {

        document
            .querySelectorAll(
                "[data-user-name]"
            )
            .forEach(
                function (element) {

                    element.textContent =
                        currentUser.name;

                }
            );


        document
            .querySelectorAll(
                "[data-user-email]"
            )
            .forEach(
                function (element) {

                    element.textContent =
                        currentUser.email;

                }
            );


        document
            .querySelectorAll(
                "[data-user-role]"
            )
            .forEach(
                function (element) {

                    element.textContent =
                        window.PawPalAuth
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
                        window.PawPalAuth
                            ? window.PawPalAuth.getInitials(
                                currentUser.name
                            )
                            : "AD";

                }
            );

    }


    /* =====================================================
       QUICK ACTIONS
    ====================================================== */

    document.querySelectorAll(
        "[data-dashboard-action]"
    ).forEach(
        function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();


                    const action =
                        button.dataset
                            .dashboardAction;


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


                    if (
                        actions[action]
                    ) {

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

    document.querySelectorAll(
        ".logout-btn, [data-logout]"
    ).forEach(
        function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();


                    const confirmed =
                        confirm(
                            "Are you sure you want to log out?"
                        );


                    if (!confirmed) {
                        return;
                    }


                    if (
                        window.PawPalAuth
                    ) {

                        window.PawPalAuth
                            .logout();

                    } else {

                        window.location.href =
                            "login.html";

                    }

                }
            );

        }
    );


    /* =====================================================
       BACK TO PAWPAL
    ====================================================== */

    document.querySelectorAll(
        ".back-to-pawpal, [data-back-home]"
    ).forEach(
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
       INITIALIZE
    ====================================================== */

    console.log(
        "PawPal Adopter Dashboard loaded successfully."
    );


});