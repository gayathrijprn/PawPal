document.addEventListener("DOMContentLoaded", function () {
    /* =====================================================
       PAWPAL ADMIN DASHBOARD
       FRONTEND ONLY
    ====================================================== */

    /* =====================================================
       AUTH
    ====================================================== */

    const currentUser =
        window.PawPalAuth && typeof window.PawPalAuth.getCurrentUser === "function"
            ? window.PawPalAuth.getCurrentUser()
            : null;

    /* =====================================================
       ELEMENTS
    ====================================================== */

    const sidebar = document.querySelector(".dashboard-sidebar");
    const sidebarOverlay = document.querySelector(".sidebar-overlay");
    const mobileMenuButton = document.querySelector(".mobile-menu-btn");
    const sidebarLinks = document.querySelectorAll(".sidebar-link");
    const sections = document.querySelectorAll(".dashboard-section");
    const topbarTitle = document.querySelector(".topbar-title");
    const toast = document.getElementById("dashboardToast");
    const searchInputs = document.querySelectorAll(".dashboard-search input");

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
        toast.className = "dashboard-toast show " + type;

        clearTimeout(window.pawpalAdminToastTimer);

        window.pawpalAdminToastTimer = setTimeout(function () {
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

        const target = document.getElementById(sectionId);

        if (!target) {
            showToast("Section not found.", "error");
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
            const section = link.dataset.section;

            if (!section) {
                return;
            }

            event.preventDefault();

            const titleElement =
                link.querySelector(".sidebar-link-text");

            const title = titleElement
                ? titleElement.textContent.trim()
                : "Dashboard";

            showSection(section, title);
        });
    });

    /* =====================================================
       HASH NAVIGATION
    ====================================================== */

    function handleHash() {
        const hash = window.location.hash
            .replace("#", "")
            .trim();

        if (!hash) {
            return;
        }

        const target = document.getElementById(hash);

        if (!target) {
            return;
        }

        const title = hash
            .replace(/-/g, " ")
            .replace(/\b\w/g, function (letter) {
                return letter.toUpperCase();
            });

        showSection(hash, title);
    }

    handleHash();

    /* =====================================================
       SEARCH
    ====================================================== */

    searchInputs.forEach(function (input) {
        input.addEventListener("input", function () {
            const searchTerm = input.value
                .trim()
                .toLowerCase();

            const currentSection =
                input.closest(".dashboard-section");

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

            let matchFound = false;

            rows.forEach(function (row) {
                const text = row.textContent.toLowerCase();

                const match =
                    !searchTerm ||
                    text.includes(searchTerm);

                row.style.display = match ? "" : "none";

                if (match) {
                    matchFound = true;
                }
            });

            cards.forEach(function (card) {
                const text = card.textContent.toLowerCase();

                const match =
                    !searchTerm ||
                    text.includes(searchTerm);

                card.style.display = match ? "" : "none";

                if (match) {
                    matchFound = true;
                }
            });

            if (searchTerm && !matchFound) {
                showToast(
                    "No matching results found.",
                    "info"
                );
            }
        });
    });

    /* =====================================================
       PET MANAGEMENT
    ====================================================== */

    document.querySelectorAll(".pet-card").forEach(function (card) {
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
                    (nameElement
                        ? nameElement.textContent.trim()
                        : "this pet");

                const addPetSection =
                    document.getElementById("add-pet");

                if (addPetSection) {
                    showSection(
                        "add-pet",
                        "Edit " + petName
                    );
                }
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
                    (nameElement
                        ? nameElement.textContent.trim()
                        : "this pet");

                const confirmed = confirm(
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
                            " has been removed from the list.",
                        "success"
                    );
                }, 250);
            });
        }
    });

    /* =====================================================
       APPLICATION ACTIONS
    ====================================================== */

    document.querySelectorAll(
        "[data-application-action]"
    ).forEach(function (button) {
        button.addEventListener("click", function (event) {
            event.preventDefault();

            const action =
                button.dataset.applicationAction;

            const row =
                button.closest(
                    "tr, .application-item"
                );

            if (action === "approve") {
                updateApplicationStatus(
                    row,
                    "Approved"
                );
            } else if (action === "reject") {
                updateApplicationStatus(
                    row,
                    "Rejected"
                );
            } else if (action === "view") {
                showToast(
                    "Application details opened.",
                    "info"
                );
            }
        });
    });

    function updateApplicationStatus(row, status) {
        if (!row) {
            return;
        }

        const statusElement =
            row.querySelector(".status");

        if (statusElement) {
            statusElement.textContent = status;

            statusElement.className =
                "status " +
                (
                    status === "Approved"
                        ? "status-approved"
                        : "status-rejected"
                );
        }

        row.querySelectorAll(
            "[data-application-action]"
        ).forEach(function (button) {
            button.style.display = "none";
        });

        showToast(
            "Application " +
                status.toLowerCase() +
                " successfully.",
            "success"
        );
    }

    /* =====================================================
       NOTIFICATIONS
    ====================================================== */

    const notificationButton =
        document.querySelector(".topbar-icon-btn");

    if (notificationButton) {
        notificationButton.addEventListener("click", function () {
            const notificationSection =
                document.getElementById("notifications");

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
       SETTINGS
    ====================================================== */

    document.querySelectorAll(".toggle input").forEach(function (toggle) {
        toggle.addEventListener("change", function () {
            const row =
                toggle.closest(".setting-row");

            const label = row
                ? row.querySelector(
                      "h4, h3, .setting-title"
                  )
                : null;

            const settingName = label
                ? label.textContent.trim()
                : "Setting";

            showToast(
                settingName +
                    (toggle.checked
                        ? " enabled."
                        : " disabled."),
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
        profileForm.addEventListener("submit", function (event) {
            event.preventDefault();

            if (
                currentUser &&
                window.PawPalAuth &&
                typeof window.PawPalAuth.saveCurrentUser === "function"
            ) {
                const formData =
                    new FormData(profileForm);

                const updatedName =
                    formData.get("name");

                if (
                    updatedName &&
                    String(updatedName).trim()
                ) {
                    currentUser.name =
                        String(updatedName).trim();

                    window.PawPalAuth.saveCurrentUser(
                        currentUser
                    );
                }
            }

            showToast(
                "Profile updated successfully.",
                "success"
            );
        });
    }

    /* =====================================================
       ADD PET
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
                    "The Add Pet form is ready for backend integration.",
                    "info"
                );
            }
        });
    });

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
                "manage-pets": ["pets", "Pets"],
                "applications": [
                    "applications",
                    "Applications"
                ],
                "users": ["users", "Users"],
                "reports": ["reports", "Reports"]
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
       FAVOURITES
    ====================================================== */

    document.querySelectorAll(
        ".pet-favourite"
    ).forEach(function (button) {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();

            const active =
                button.classList.toggle("active");

            button.textContent =
                active ? "♥" : "♡";
        });
    });

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
                    : "Admin";
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
                    : "PA";
        });
    }

    /* =====================================================
       LOGOUT
    ====================================================== */

    document.querySelectorAll(
        ".logout-btn, [data-logout]"
    ).forEach(function (button) {
        button.addEventListener("click", function (event) {
            event.preventDefault();

            const confirmed = confirm(
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
                window.location.href = "login.html";
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

    /* =====================================================
       INITIALIZE
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