document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       PAWPAL ADMIN DASHBOARD
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

    const searchInputs =
        document.querySelectorAll(
            ".dashboard-search input"
        );


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
            window.pawpalToastTimer
        );


        window.pawpalToastTimer =
            setTimeout(function () {

                toast.classList.remove(
                    "show"
                );

            }, 3000);

    }


    /* =====================================================
       DASHBOARD SECTION NAVIGATION
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


                const linkSection =
                    link.dataset.section;


                if (
                    linkSection ===
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


                    /*
                       Links without data-section
                       such as Back to PawPal / Logout
                       are handled normally.
                    */

                    if (!section) {
                        return;
                    }


                    event.preventDefault();


                    const title =
                        link
                            .querySelector(
                                ".sidebar-link-text"
                            );


                    showSection(
                        section,
                        title
                            ? title.textContent.trim()
                            : "Dashboard"
                    );

                }
            );

        }
    );


    /* =====================================================
       HANDLE HASH NAVIGATION
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
       SEARCH
    ====================================================== */

    searchInputs.forEach(
        function (input) {

            input.addEventListener(
                "input",
                function () {

                    const searchTerm =
                        input.value
                            .trim()
                            .toLowerCase();


                    const currentSection =
                        input.closest(
                            ".dashboard-section"
                        );


                    if (!currentSection) {
                        return;
                    }


                    const rows =
                        currentSection.querySelectorAll(
                            ".dashboard-table tbody tr"
                        );


                    const cards =
                        currentSection.querySelectorAll(
                            ".pet-card, .application-item, .activity-item"
                        );


                    let matchFound =
                        false;


                    rows.forEach(
                        function (row) {

                            const text =
                                row.textContent
                                    .toLowerCase();


                            const match =
                                !searchTerm ||
                                text.includes(
                                    searchTerm
                                );


                            row.style.display =
                                match
                                    ? ""
                                    : "none";


                            if (match) {
                                matchFound = true;
                            }

                        }
                    );


                    cards.forEach(
                        function (card) {

                            const text =
                                card.textContent
                                    .toLowerCase();


                            const match =
                                !searchTerm ||
                                text.includes(
                                    searchTerm
                                );


                            card.style.display =
                                match
                                    ? ""
                                    : "none";


                            if (match) {
                                matchFound = true;
                            }

                        }
                    );


                    if (
                        searchTerm &&
                        !matchFound
                    ) {

                        showToast(
                            "No matching results found.",
                            "info"
                        );

                    }

                }
            );

        }
    );


    /* =====================================================
       PET MANAGEMENT
    ====================================================== */

    const petCards =
        document.querySelectorAll(
            ".pet-card"
        );


    petCards.forEach(
        function (card) {

            const editButton =
                card.querySelector(
                    ".btn-edit, [data-action='edit']"
                );


            const deleteButton =
                card.querySelector(
                    ".btn-delete, [data-action='delete']"
                );


            if (editButton) {

                editButton.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();
                        event.stopPropagation();


                        const petName =
                            card.dataset.name ||
                            card.querySelector(
                                ".pet-name"
                            )?.textContent ||
                            "this pet";


                        showToast(
                            "Editing " +
                            petName.trim() +
                            " — edit mode is ready for backend integration.",
                            "info"
                        );

                    }
                );

            }


            if (deleteButton) {

                deleteButton.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();
                        event.stopPropagation();


                        const petName =
                            card.dataset.name ||
                            card.querySelector(
                                ".pet-name"
                            )?.textContent ||
                            "this pet";


                        const confirmed =
                            confirm(
                                "Are you sure you want to remove " +
                                petName.trim() +
                                "?"
                            );


                        if (!confirmed) {
                            return;
                        }


                        card.style.opacity =
                            "0";


                        card.style.transform =
                            "scale(.95)";


                        setTimeout(
                            function () {

                                card.remove();


                                showToast(
                                    petName.trim() +
                                    " has been removed from the list.",
                                    "success"
                                );

                            },
                            250
                        );

                    }
                );

            }

        }
    );


    /* =====================================================
       APPLICATION ACTIONS
    ====================================================== */

    const applicationButtons =
        document.querySelectorAll(
            "[data-application-action]"
        );


    applicationButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();


                    const action =
                        button.dataset
                            .applicationAction;


                    const row =
                        button.closest(
                            "tr, .application-item"
                        );


                    if (
                        action ===
                        "approve"
                    ) {

                        updateApplicationStatus(
                            row,
                            "Approved"
                        );

                    }


                    if (
                        action ===
                        "reject"
                    ) {

                        updateApplicationStatus(
                            row,
                            "Rejected"
                        );

                    }


                    if (
                        action ===
                        "view"
                    ) {

                        showToast(
                            "Application details opened.",
                            "info"
                        );

                    }

                }
            );

        }
    );


    function updateApplicationStatus(
        row,
        status
    ) {

        if (!row) {
            return;
        }


        const statusElement =
            row.querySelector(
                ".status"
            );


        if (statusElement) {

            statusElement.textContent =
                status;


            statusElement.className =
                "status " +
                (
                    status === "Approved"
                        ? "status-approved"
                        : "status-rejected"
                );

        }


        const actionCell =
            row.querySelector(
                ".table-actions"
            );


        if (actionCell) {

            actionCell
                .querySelectorAll(
                    "[data-application-action]"
                )
                .forEach(
                    function (button) {

                        button.style.display =
                            "none";

                    }
                );

        }


        showToast(
            "Application " +
            status.toLowerCase() +
            " successfully.",
            "success"
        );

    }


    /* =====================================================
       NOTIFICATION BUTTON
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
       SETTINGS TOGGLES
    ====================================================== */

    const toggles =
        document.querySelectorAll(
            ".toggle input"
        );


    toggles.forEach(
        function (toggle) {

            toggle.addEventListener(
                "change",
                function () {

                    const label =
                        toggle.closest(
                            ".setting-row"
                        )?.querySelector(
                            "h4, h3, .setting-title"
                        );


                    const settingName =
                        label
                            ? label.textContent.trim()
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
        document.querySelector(
            "#profileForm"
        );


    if (profileForm) {

        profileForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                if (
                    currentUser &&
                    window.PawPalAuth
                ) {

                    const formData =
                        new FormData(
                            profileForm
                        );


                    const updatedName =
                        formData.get(
                            "name"
                        );


                    if (updatedName) {

                        currentUser.name =
                            String(
                                updatedName
                            ).trim();

                    }


                    window.PawPalAuth
                        .saveCurrentUser(
                            currentUser
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
       ADD PET BUTTONS
    ====================================================== */

    const addPetButtons =
        document.querySelectorAll(
            "[data-add-pet], .add-pet-btn"
        );


    addPetButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();


                    const addPetSection =
                        document.getElementById(
                            "add-pet"
                        );


                    if (addPetSection) {

                        showSection(
                            "add-pet",
                            "Add a Pet"
                        );

                    } else {

                        showToast(
                            "The Add Pet form is ready for backend integration.",
                            "info"
                        );

                    }

                }
            );

        }
    );


    /* =====================================================
       QUICK ACTION BUTTONS
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


                    if (
                        action ===
                        "manage-pets"
                    ) {

                        showSection(
                            "pets",
                            "Pets"
                        );

                    }


                    if (
                        action ===
                        "applications"
                    ) {

                        showSection(
                            "applications",
                            "Applications"
                        );

                    }


                    if (
                        action ===
                        "users"
                    ) {

                        showSection(
                            "users",
                            "Users"
                        );

                    }


                    if (
                        action ===
                        "reports"
                    ) {

                        showSection(
                            "reports",
                            "Reports"
                        );

                    }

                }
            );

        }
    );


    /* =====================================================
       FAVOURITE BUTTONS
    ====================================================== */

    document.querySelectorAll(
        ".pet-favourite"
    ).forEach(
        function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();
                    event.stopPropagation();


                    button.classList.toggle(
                        "active"
                    );


                    if (
                        button.classList.contains(
                            "active"
                        )
                    ) {

                        button.textContent =
                            "♥";

                    } else {

                        button.textContent =
                            "♡";

                    }

                }
            );

        }
    );


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
       USER GREETING
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
                            : "Admin";

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
                            : "PA";

                }
            );

    }


    /* =====================================================
       LOGOUT
    ====================================================== */

    const logoutButtons =
        document.querySelectorAll(
            ".logout-btn, [data-logout]"
        );


    logoutButtons.forEach(
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

    const backButtons =
        document.querySelectorAll(
            ".back-to-pawpal, [data-back-home]"
        );


    backButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    /*
                       If it already has a valid href,
                       allow normal navigation.
                    */

                    if (
                        button.getAttribute(
                            "href"
                        )
                    ) {

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
       DEMO ADMIN INFO
    ====================================================== */

    console.log(
        "PawPal Admin Dashboard loaded successfully."
    );


    console.log(
        "Frontend authentication:",
        currentUser
            ? currentUser.email
            : "No user"
    );


});