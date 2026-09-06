document.addEventListener("DOMContentLoaded", function () {
    /* =====================================================
       PAWPAL PET OWNER DASHBOARD
       FRONTEND ONLY
    ====================================================== */

    const currentUser =
        window.PawPalAuth &&
        typeof window.PawPalAuth.getCurrentUser === "function"
            ? window.PawPalAuth.getCurrentUser()
            : null;

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
        if (sidebar) sidebar.classList.add("open");
        if (sidebarOverlay) sidebarOverlay.classList.add("show");

        document.body.classList.add("sidebar-open");
    }

    function closeSidebar() {
        if (sidebar) sidebar.classList.remove("open");
        if (sidebarOverlay) sidebarOverlay.classList.remove("show");

        document.body.classList.remove("sidebar-open");
    }

    if (mobileMenuButton) {
        mobileMenuButton.addEventListener("click", function () {
            if (sidebar && sidebar.classList.contains("open")) {
                closeSidebar();
            } else {
                openSidebar();
            }
        });
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener("click", closeSidebar);
    }

    /* =====================================================
       TOAST
    ====================================================== */

    function showToast(message, type = "success") {
        if (!toast) {
            alert(message);
            return;
        }

        toast.textContent = message;
        toast.className =
            "dashboard-toast show " + type;

        clearTimeout(window.pawpalOwnerToast);

        window.pawpalOwnerToast =
            setTimeout(function () {
                toast.classList.remove("show");
            }, 3000);
    }

    /* =====================================================
       SECTION NAVIGATION
    ====================================================== */

    function showSection(sectionId, title) {
        sections.forEach(function (section) {
            section.style.display = "none";
        });

        const target =
            document.getElementById(sectionId);

        if (!target) {
            showToast(
                "Section not found.",
                "error"
            );
            return;
        }

        target.style.display = "block";

        if (topbarTitle && title) {
            topbarTitle.textContent = title;
        }

        sidebarLinks.forEach(function (link) {
            link.classList.remove("active");

            if (link.dataset.section === sectionId) {
                link.classList.add("active");
            }
        });

        closeSidebar();

        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    /* =====================================================
       SIDEBAR NAVIGATION
    ====================================================== */

    sidebarLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
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
        });
    });

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

        if (!document.getElementById(hash)) {
            return;
        }

        const title =
            hash
                .replace(/-/g, " ")
                .replace(/\b\w/g, function (letter) {
                    return letter.toUpperCase();
                });

        showSection(
            hash,
            title
        );
    }

    handleHash();

    /* =====================================================
       SEARCH
    ====================================================== */

    document.querySelectorAll(
        ".dashboard-search input"
    ).forEach(function (input) {
        input.addEventListener("input", function () {
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

            const rows =
                section.querySelectorAll(
                    ".dashboard-table tbody tr"
                );

            let matchFound = false;

            cards.forEach(function (card) {
                const text =
                    card.textContent.toLowerCase();

                const matches =
                    !searchTerm ||
                    text.includes(searchTerm);

                card.style.display =
                    matches ? "" : "none";

                if (matches) {
                    matchFound = true;
                }
            });

            rows.forEach(function (row) {
                const text =
                    row.textContent.toLowerCase();

                const matches =
                    !searchTerm ||
                    text.includes(searchTerm);

                row.style.display =
                    matches ? "" : "none";

                if (matches) {
                    matchFound = true;
                }
            });

            if (
                searchTerm &&
                !matchFound
            ) {
                showToast(
                    "No matching results found.",
                    "info"
                );
            }
        });
    });

    /* =====================================================
       MY PETS — EDIT & DELETE
    ====================================================== */

    document.querySelectorAll(
        ".pet-card"
    ).forEach(function (card) {
        const editButton =
            card.querySelector(
                ".btn-edit, [data-action='edit']"
            );

        const deleteButton =
            card.querySelector(
                ".btn-delete, [data-action='delete']"
            );

        if (editButton) {
            editButton.addEventListener("click", function (event) {
                event.preventDefault();
                event.stopPropagation();

                const nameElement =
                    card.querySelector(".pet-name");

                const petName =
                    card.dataset.name ||
                    (
                        nameElement
                            ? nameElement.textContent.trim()
                            : "your pet"
                    );

                const addPetSection =
                    document.getElementById("add-pet");

                if (addPetSection) {
                    addPetSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }

                showToast(
                    "Update details for " + petName + " below.",
                    "info"
                );
            });
        }

        if (deleteButton) {
            deleteButton.addEventListener("click", function (event) {
                event.preventDefault();
                event.stopPropagation();

                const nameElement =
                    card.querySelector(".pet-name");

                const petName =
                    card.dataset.name ||
                    (
                        nameElement
                            ? nameElement.textContent.trim()
                            : "this pet"
                    );

                const confirmed =
                    confirm(
                        "Are you sure you want to remove " +
                            petName +
                            "?"
                    );

                if (!confirmed) {
                    return;
                }

                card.style.opacity = "0";
                card.style.transform = "scale(.95)";

                setTimeout(function () {
                    card.remove();

                    showToast(
                        petName +
                            " has been removed.",
                        "success"
                    );
                }, 250);
            });
        }
    });

    /* =====================================================
       ADOPTION REQUEST ACTIONS
    ====================================================== */

    document.querySelectorAll(
        "[data-request-action]"
    ).forEach(function (button) {
        button.addEventListener("click", function (event) {
            event.preventDefault();

            const action =
                button.dataset.requestAction;

            const row =
                button.closest(
                    "tr, .application-item"
                );

            if (action === "approve") {
                updateRequestStatus(
                    row,
                    "Approved"
                );
            } else if (action === "reject") {
                updateRequestStatus(
                    row,
                    "Rejected"
                );
            } else if (action === "view") {
                showToast(
                    "Adoption request details opened.",
                    "info"
                );
            }
        });
    });

    function updateRequestStatus(row, status) {
        if (!row) {
            return;
        }

        const statusElement =
            row.querySelector(".status");

        if (statusElement) {
            statusElement.textContent = status;

            statusElement.className =
                status === "Approved"
                    ? "status status-approved"
                    : "status status-rejected";
        }

        row.querySelectorAll(
            "[data-request-action]"
        ).forEach(function (button) {
            button.style.display = "none";
        });

        showToast(
            "Adoption request " +
                status.toLowerCase() +
                " successfully.",
            "success"
        );
    }

    /* =====================================================
       ADD PET FORM
    ====================================================== */

    const addPetForm =
        document.getElementById("addPetForm");

    if (addPetForm) {
        addPetForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const nameInput =
                addPetForm.querySelector(
                    '[name="name"]'
                );

            if (
                !nameInput ||
                !nameInput.value.trim()
            ) {
                showToast(
                    "Please enter your pet's name.",
                    "error"
                );
                return;
            }

            const petName =
                nameInput.value.trim();

            showToast(
                petName +
                    " has been added successfully! 🐾",
                "success"
            );

            addPetForm.reset();

            setTimeout(function () {
                const petsSection =
                    document.getElementById(
                        "my-pets"
                    );

                if (petsSection) {
                    showSection(
                        "my-pets",
                        "My Pets"
                    );
                }
            }, 800);
        });
    }

    /* =====================================================
       ADD PET BUTTONS
    ====================================================== */

    document.querySelectorAll(
        "[data-add-pet], .add-pet-btn"
    ).forEach(function (button) {
        button.addEventListener("click", function (event) {
            event.preventDefault();

            const addPetSection =
                document.getElementById("add-pet");

            if (addPetSection) {
                showSection(
                    "add-pet",
                    "Add a Pet"
                );
            } else {
                showToast(
                    "Add Pet section is ready.",
                    "info"
                );
            }
        });
    });

    /* =====================================================
       MESSAGE BUTTONS
    ====================================================== */

    document.querySelectorAll(
        "[data-message-action]"
    ).forEach(function (button) {
        button.addEventListener("click", function (event) {
            event.preventDefault();

            const recipient =
                button.dataset.messageAction ||
                "the adopter";

            showToast(
                "Message window for " +
                    recipient +
                    " is ready.",
                "info"
            );
        });
    });

    /* =====================================================
       NOTIFICATIONS
    ====================================================== */

    const notificationButton =
        document.querySelector(".topbar-icon-btn");

    if (notificationButton) {
        notificationButton.addEventListener("click", function () {
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
        });
    }

    /* =====================================================
       MARK NOTIFICATIONS AS READ
    ====================================================== */

    document.querySelectorAll(
        ".notification-item, .activity-item"
    ).forEach(function (item) {
        item.addEventListener("click", function () {
            item.classList.add("read");
        });
    });

    /* =====================================================
       SETTINGS
    ====================================================== */

    document.querySelectorAll(
        ".toggle input"
    ).forEach(function (toggle) {
        toggle.addEventListener("change", function () {
            const row =
                toggle.closest(".setting-row");

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
        });
    });

    /* =====================================================
       PROFILE FORM
    ====================================================== */

    const profileForm =
        document.getElementById("profileForm");

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
                        window.PawPalAuth &&
                        typeof window.PawPalAuth.saveCurrentUser === "function"
                    ) {
                        window.PawPalAuth.saveCurrentUser(
                            currentUser
                        );
                    }

                    document.querySelectorAll(
                        "[data-user-name]"
                    ).forEach(function (element) {
                        element.textContent =
                            currentUser.name;
                    });
                }

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
        document.querySelectorAll(
            "[data-user-name]"
        ).forEach(function (element) {
            element.textContent =
                currentUser.name || "";
        });

        document.querySelectorAll(
            "[data-user-email]"
        ).forEach(function (element) {
            element.textContent =
                currentUser.email || "";
        });

        document.querySelectorAll(
            "[data-user-role]"
        ).forEach(function (element) {
            element.textContent =
                window.PawPalAuth &&
                typeof window.PawPalAuth.formatRole === "function"
                    ? window.PawPalAuth.formatRole(
                          currentUser.role
                      )
                    : "Pet Owner";
        });

        document.querySelectorAll(
            "[data-user-avatar]"
        ).forEach(function (element) {
            element.textContent =
                window.PawPalAuth &&
                typeof window.PawPalAuth.getInitials === "function"
                    ? window.PawPalAuth.getInitials(
                          currentUser.name || ""
                      )
                    : "PO";
        });
    }

    /* =====================================================
       QUICK ACTIONS
    ====================================================== */

    document.querySelectorAll(
        "[data-dashboard-action]"
    ).forEach(function (button) {
        button.addEventListener("click", function (event) {
            event.preventDefault();

            const action =
                button.dataset.dashboardAction;

            const actions = {
                "my-pets": [
                    "my-pets",
                    "My Pets"
                ],
                "requests": [
                    "adoption-requests",
                    "Adoption Requests"
                ],
                "messages": [
                    "messages",
                    "Messages"
                ],
                "add-pet": [
                    "add-pet",
                    "Add a Pet"
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
        });
    });

    /* =====================================================
       LOGOUT
    ====================================================== */

    document.querySelectorAll(
        ".logout-btn, [data-logout]"
    ).forEach(function (button) {
        button.addEventListener("click", function (event) {
            event.preventDefault();

            const confirmed =
                confirm(
                    "Are you sure you want to log out?"
                );

            if (!confirmed) {
                return;
            }

            if (
                window.PawPalAuth &&
                typeof window.PawPalAuth.logout === "function"
            ) {
                window.PawPalAuth.logout();
            } else {
                window.location.href =
                    "login.html";
            }
        });
    });

    /* =====================================================
       BACK TO PAWPAL
    ====================================================== */

    document.querySelectorAll(
        ".back-to-pawpal, [data-back-home]"
    ).forEach(function (button) {
        button.addEventListener("click", function (event) {
            const href =
                button.getAttribute("href");

            if (href) {
                return;
            }

            event.preventDefault();

            window.location.href =
                "../index.html";
        });
    });

    console.log(
        "PawPal Pet Owner Dashboard loaded successfully."
    );
});