/* =========================================================
   PAWPAL — SHARED AUTHENTICATION
   =========================================================
   Responsibilities:

   - Store current user's basic information
   - Update navbar authentication state
   - Show Login / Get Started when logged out
   - Show Logout when logged in
   - Handle logout
   - Protect dashboards
   - Redirect users according to role
   - Fill user information
   - Provide dashboard links

   Supabase handles the actual authentication.
========================================================= */


/* =========================================================
   STORAGE
========================================================= */

const CURRENT_USER_KEY = "pawpal-current-user";


/* =========================================================
   ROLE NORMALIZATION
========================================================= */

function normalizeRole(role) {

    if (!role) {
        return "adopter";
    }

    const normalized = String(role)
        .trim()
        .toLowerCase()
        .replace(/[\_-]+/g, " ");

    switch (normalized) {

        case "admin":
        case "administrator":
            return "admin";

        case "owner":
        case "pet owner":
            return "owner";

        case "shelter":
        case "rescue":
        case "rescue shelter":
        case "shelter rescue":
        case "shelter / rescue":
            return "shelter";

        case "adopter":
        case "pet adopter":
            return "adopter";

        default:
            return "adopter";
    }
}


/* =========================================================
   DASHBOARD ROUTING
========================================================= */

function getDashboardPath(role) {

    switch (normalizeRole(role)) {

        case "admin":
            return "dashboard-admin.html";

        case "owner":
            return "dashboard-owner.html";

        /*
         * There is currently no shelter dashboard.
         * Temporarily use adopter dashboard.
         */

        case "shelter":
            return "dashboard-adopter.html";

        case "adopter":
        default:
            return "dashboard-adopter.html";
    }
}


/* =========================================================
   PATH HELPER
========================================================= */

function getPagesPath(file) {

    const path = window.location.pathname
        .replace(/\\/g, "/")
        .toLowerCase();

    if (path.includes("/pages/")) {
        return file;
    }

    return `pages/${file}`;
}


/* =========================================================
   CURRENT USER
========================================================= */

function getCurrentUser() {

    try {

        const storedUser =
            localStorage.getItem(CURRENT_USER_KEY);

        if (!storedUser) {
            return null;
        }

        const user =
            JSON.parse(storedUser);

        if (
            !user ||
            typeof user !== "object"
        ) {
            return null;
        }

        return {

            id:
                user.id || "",

            name:
                user.name ||
                user.full_name ||
                user.email?.split("@")[0] ||
                "PawPal User",

            email:
                user.email ||
                "",

            role:
                normalizeRole(user.role)

        };

    } catch (error) {

        console.error(
            "PawPal: Unable to read current user.",
            error
        );

        return null;
    }
}


/* =========================================================
   SAVE CURRENT USER
========================================================= */

function saveCurrentUser(user) {

    if (!user) {
        return false;
    }

    const normalizedUser = {

        id:
            user.id || "",

        name:
            user.name ||
            user.full_name ||
            user.email?.split("@")[0] ||
            "PawPal User",

        email:
            user.email ||
            "",

        role:
            normalizeRole(user.role)

    };

    try {

        localStorage.setItem(
            CURRENT_USER_KEY,
            JSON.stringify(normalizedUser)
        );

        return true;

    } catch (error) {

        console.error(
            "PawPal: Unable to save current user.",
            error
        );

        return false;
    }
}


/* =========================================================
   CLEAR CURRENT USER
========================================================= */

function clearCurrentUser() {

    try {

        localStorage.removeItem(
            CURRENT_USER_KEY
        );

    } catch (error) {

        console.error(
            "PawPal: Unable to clear current user.",
            error
        );
    }
}


/* =========================================================
   FORMAT ROLE
========================================================= */

function formatRole(role) {

    switch (normalizeRole(role)) {

        case "admin":
            return "Admin";

        case "owner":
            return "Pet Owner";

        case "shelter":
            return "Shelter / Rescue";

        case "adopter":
        default:
            return "Pet Adopter";
    }
}


/* =========================================================
   INITIALS
========================================================= */

function getInitials(name) {

    if (!name) {
        return "PP";
    }

    const cleanedName =
        String(name)
            .trim()
            .replace(/\s+/g, " ");

    if (!cleanedName) {
        return "PP";
    }

    const parts =
        cleanedName.split(" ");

    if (parts.length === 1) {

        return parts[0]
            .substring(0, 2)
            .toUpperCase();
    }

    return (
        parts[0].charAt(0) +
        parts[parts.length - 1].charAt(0)
    ).toUpperCase();
}


/* =========================================================
   LOGOUT
========================================================= */

async function logoutUser() {

    /*
     * Clear local PawPal user immediately.
     */

    clearCurrentUser();


    /*
     * Also clear common authentication keys
     * if they exist.
     */

    try {

        localStorage.removeItem("pawpal-user");
        localStorage.removeItem("pawpalUser");
        localStorage.removeItem("currentUser");

    } catch (error) {

        console.warn(
            "PawPal: Could not clear additional auth storage.",
            error
        );
    }


    /*
     * Sign out from Supabase.
     */

    try {

        if (
            window.supabaseClient &&
            window.supabaseClient.auth &&
            typeof window.supabaseClient.auth.signOut === "function"
        ) {

            await window.supabaseClient.auth.signOut();
        }

    } catch (error) {

        console.warn(
            "PawPal: Supabase logout warning:",
            error
        );
    }


    /*
     * Redirect to login.
     */

    window.location.href =
        getPagesPath("login.html");
}


/* =========================================================
   CURRENT FILE
========================================================= */

function getCurrentFileName() {

    return window.location.pathname
        .replace(/\\/g, "/")
        .split("/")
        .pop()
        .toLowerCase();
}


/* =========================================================
   DASHBOARD CHECK
========================================================= */

function isDashboardPage() {

    const dashboardPages = [

        "dashboard-adopter.html",

        "dashboard-owner.html",

        "dashboard-admin.html"

    ];

    return dashboardPages.includes(
        getCurrentFileName()
    );
}


/* =========================================================
   REQUIRED DASHBOARD ROLE
========================================================= */

function getRequiredDashboardRole() {

    switch (getCurrentFileName()) {

        case "dashboard-admin.html":
            return "admin";

        case "dashboard-owner.html":
            return "owner";

        case "dashboard-adopter.html":
            return "adopter";

        default:
            return null;
    }
}


/* =========================================================
   PROTECT DASHBOARD
========================================================= */

function protectDashboard() {

    if (!isDashboardPage()) {
        return;
    }

    const currentUser =
        getCurrentUser();


    /*
     * Not logged in.
     */

    if (!currentUser) {

        window.location.replace(
            getPagesPath("login.html")
        );

        return;
    }


    const userRole =
        normalizeRole(currentUser.role);

    const requiredRole =
        getRequiredDashboardRole();


    if (!requiredRole) {
        return;
    }


    /*
     * Correct dashboard.
     */

    if (userRole === requiredRole) {
        return;
    }


    /*
     * Redirect to correct dashboard.
     */

    const correctDashboard =
        getDashboardPath(userRole);

    if (
        getCurrentFileName() !==
        correctDashboard.toLowerCase()
    ) {

        window.location.replace(
            getPagesPath(correctDashboard)
        );
    }
}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   CREATE LOGOUT BUTTON
========================================================= */

function createNavbarLogoutButton() {

    /*
     * Existing logout button?
     */

    let logoutButton =
        document.querySelector(
            "#logoutNavButton, [data-navbar-logout]"
        );


    if (logoutButton) {

        logoutButton.style.display = "";
        logoutButton.removeAttribute("aria-hidden");

        attachLogoutListener(logoutButton);

        return logoutButton;
    }


    /*
     * Find the existing signup button.
     * We place Logout where Get Started used to be.
     */

    const signupButton =
        document.getElementById(
            "signupNavButton"
        );


    if (!signupButton) {
        return null;
    }


    /*
     * Create logout button.
     */

    logoutButton =
        document.createElement("button");

    logoutButton.type = "button";

    logoutButton.id =
        "logoutNavButton";

    logoutButton.className =
        signupButton.className || "auth-signup";

    logoutButton.textContent =
        "Logout";

    logoutButton.setAttribute(
        "data-navbar-logout",
        "true"
    );


    /*
     * Copy useful styling-related attributes.
     */

    if (signupButton.getAttribute("aria-label")) {

        logoutButton.setAttribute(
            "aria-label",
            "Logout from PawPal"
        );
    }


    /*
     * Replace signup button.
     */

    signupButton.replaceWith(
        logoutButton
    );


    attachLogoutListener(
        logoutButton
    );


    return logoutButton;
}


/* =========================================================
   LOGOUT LISTENER
========================================================= */

function attachLogoutListener(button) {

    if (!button) {
        return;
    }

    if (
        button.dataset.logoutAttached === "true"
    ) {
        return;
    }

    button.dataset.logoutAttached =
        "true";

    button.addEventListener(
        "click",
        async function (event) {

            event.preventDefault();
            event.stopPropagation();

            await logoutUser();
        }
    );
}


/* =========================================================
   UPDATE EXISTING PAWPAL NAVBAR
========================================================= */

function updateStandardNavbar(currentUser) {

    /*
     * Your current PawPal navbar uses:
     *
     * #loginNavButton
     * #signupNavButton
     * #cart-button
     *
     * Keep the cart untouched.
     */


    const loginButton =
        document.getElementById(
            "loginNavButton"
        );

    let signupButton =
        document.getElementById(
            "signupNavButton"
        );


    /*
     * -----------------------------------------------------
     * LOGGED IN
     * -----------------------------------------------------
     */

    if (currentUser) {

        /*
         * Hide Login.
         */

        if (loginButton) {

            loginButton.style.display =
                "none";

            loginButton.setAttribute(
                "aria-hidden",
                "true"
            );
        }


        /*
         * Hide/replace Get Started
         * with Logout.
         */

        if (signupButton) {

            const logoutButton =
                createNavbarLogoutButton();

            if (logoutButton) {

                logoutButton.style.display =
                    "";

                logoutButton.removeAttribute(
                    "aria-hidden"
                );
            }

        } else {

            createNavbarLogoutButton();
        }


        /*
         * Make sure any old standalone
         * signup link is hidden.
         */

        document
            .querySelectorAll(
                "[data-signup-link]"
            )
            .forEach(function (element) {

                element.style.display =
                    "none";

            });


        /*
         * Hide standalone login links.
         */

        document
            .querySelectorAll(
                "[data-login-link]"
            )
            .forEach(function (element) {

                element.style.display =
                    "none";

            });

    }


    /*
     * -----------------------------------------------------
     * LOGGED OUT
     * -----------------------------------------------------
     */

    else {

        /*
         * Show Login.
         */

        if (loginButton) {

            loginButton.style.display =
                "";

            loginButton.removeAttribute(
                "aria-hidden"
            );
        }


        /*
         * If a logout button exists,
         * turn it back into Get Started.
         */

        const existingLogout =
            document.getElementById(
                "logoutNavButton"
            );


        if (existingLogout) {

            const newSignup =
                document.createElement("a");

            newSignup.id =
                "signupNavButton";

            newSignup.href =
                getPagesPath("register.html");

            newSignup.className =
                existingLogout.className ||
                "auth-signup";

            newSignup.textContent =
                "Get Started";

            existingLogout.replaceWith(
                newSignup
            );

        } else if (signupButton) {

            signupButton.style.display =
                "";

            signupButton.removeAttribute(
                "aria-hidden"
            );
        }


        /*
         * Show standalone signup links.
         */

        document
            .querySelectorAll(
                "[data-signup-link]"
            )
            .forEach(function (element) {

                element.style.display =
                    "";

            });


        /*
         * Show standalone login links.
         */

        document
            .querySelectorAll(
                "[data-login-link]"
            )
            .forEach(function (element) {

                element.style.display =
                    "";

            });
    }
}


/* =========================================================
   UPDATE AUTH NAVIGATION
========================================================= */

function updateAuthNavigation() {

    const currentUser =
        getCurrentUser();


    /* =====================================================
       CURRENT PAWPAL NAVBAR
    ===================================================== */

    updateStandardNavbar(
        currentUser
    );


    /* =====================================================
       DASHBOARD LINKS
    ===================================================== */

    document
        .querySelectorAll(
            "[data-dashboard-link]"
        )
        .forEach(function (link) {

            if (currentUser) {

                const dashboard =
                    getDashboardPath(
                        currentUser.role
                    );

                link.href =
                    getPagesPath(dashboard);

                link.style.display =
                    "";

                link.removeAttribute(
                    "aria-hidden"
                );

            } else {

                link.style.display =
                    "none";

                link.setAttribute(
                    "aria-hidden",
                    "true"
                );
            }
        });


    /* =====================================================
       MAIN AUTH CONTAINERS
    ===================================================== */

    const authContainers =
        document.querySelectorAll(
            "[data-auth-nav], .auth-nav, .nav-auth"
        );


    authContainers.forEach(function (container) {

        if (currentUser) {

            const name =
                currentUser.name ||
                currentUser.email?.split("@")[0] ||
                "User";

            const role =
                formatRole(
                    currentUser.role
                );

            const initials =
                getInitials(name);


            /*
             * Logged-in navbar.
             */

            container.innerHTML = `

                <div class="auth-user">

                    <div
                        class="auth-avatar"
                        aria-hidden="true"
                    >
                        ${escapeHtml(initials)}
                    </div>

                    <div class="auth-user-info">

                        <strong>
                            ${escapeHtml(name)}
                        </strong>

                        <small>
                            ${escapeHtml(role)}
                        </small>

                    </div>

                    <a
                        href="${getPagesPath(
                            getDashboardPath(
                                currentUser.role
                            )
                        )}"
                        class="auth-dashboard"
                    >
                        Dashboard
                    </a>

                    <button
                        type="button"
                        class="auth-logout"
                        data-auth-logout
                    >
                        Logout
                    </button>

                </div>

            `;

        } else {

            /*
             * Logged-out navbar.
             */

            container.innerHTML = `

                <div class="auth-logged-out">

                    <a
                        href="${getPagesPath(
                            "login.html"
                        )}"
                        class="auth-login"
                    >
                        Log In
                    </a>

                    <a
                        href="${getPagesPath(
                            "register.html"
                        )}"
                        class="auth-signup"
                    >
                        Get Started
                    </a>

                </div>

            `;
        }
    });


    /* =====================================================
       STANDALONE LOGIN LINKS
    ===================================================== */

    document
        .querySelectorAll(
            "[data-login-link]"
        )
        .forEach(function (link) {

            link.style.display =
                currentUser
                    ? "none"
                    : "";

        });


    /* =====================================================
       STANDALONE SIGNUP LINKS
    ===================================================== */

    document
        .querySelectorAll(
            "[data-signup-link]"
        )
        .forEach(function (link) {

            link.style.display =
                currentUser
                    ? "none"
                    : "";

        });


    /* =====================================================
       LOGGED-IN ELEMENTS
    ===================================================== */

    document
        .querySelectorAll(
            "[data-auth-user]"
        )
        .forEach(function (element) {

            element.style.display =
                currentUser
                    ? ""
                    : "none";

        });


    /* =====================================================
       LOGGED-OUT ELEMENTS
    ===================================================== */

    document
        .querySelectorAll(
            "[data-auth-guest]"
        )
        .forEach(function (element) {

            element.style.display =
                currentUser
                    ? "none"
                    : "";

        });


    /* =====================================================
       LOGOUT LISTENERS
    ===================================================== */

    document
        .querySelectorAll(
            "[data-auth-logout], .logout-btn, [data-navbar-logout]"
        )
        .forEach(function (button) {

            attachLogoutListener(
                button
            );

        });
}


/* =========================================================
   UPDATE USER INFORMATION
========================================================= */

function updateUserInformation() {

    const currentUser =
        getCurrentUser();


    if (!currentUser) {
        return;
    }


    const name =
        currentUser.name ||
        currentUser.email?.split("@")[0] ||
        "PawPal User";

    const role =
        formatRole(
            currentUser.role
        );

    const initials =
        getInitials(name);


    /* =====================================================
       NAME
    ===================================================== */

    document
        .querySelectorAll(
            "[data-user-name]"
        )
        .forEach(function (element) {

            element.textContent =
                name;
        });


    /* =====================================================
       ROLE
    ===================================================== */

    document
        .querySelectorAll(
            "[data-user-role]"
        )
        .forEach(function (element) {

            element.textContent =
                role;
        });


    /* =====================================================
       EMAIL
    ===================================================== */

    document
        .querySelectorAll(
            "[data-user-email]"
        )
        .forEach(function (element) {

            if (
                element.tagName === "INPUT" ||
                element.tagName === "TEXTAREA"
            ) {

                element.value =
                    currentUser.email || "";

            } else {

                element.textContent =
                    currentUser.email || "";
            }
        });


    /* =====================================================
       AVATAR
    ===================================================== */

    document
        .querySelectorAll(
            "[data-user-avatar]"
        )
        .forEach(function (element) {

            element.textContent =
                initials;
        });


    /* =====================================================
       PROFILE NAME
    ===================================================== */

    document
        .querySelectorAll(
            "[data-profile-name]"
        )
        .forEach(function (element) {

            if (!element.value) {

                element.value =
                    name;
            }
        });
}


/* =========================================================
   LOGOUT BUTTONS
========================================================= */

function setupLogoutButtons() {

    document
        .querySelectorAll(
            ".logout-btn, [data-auth-logout], [data-navbar-logout]"
        )
        .forEach(function (button) {

            attachLogoutListener(
                button
            );

        });
}


/* =========================================================
   INITIALIZATION
========================================================= */

function initializePawPalAuth() {

    /*
     * Protect dashboards.
     */

    protectDashboard();


    /*
     * Update user information.
     */

    updateUserInformation();


    /*
     * Update navbar authentication.
     */

    updateAuthNavigation();


    /*
     * Setup logout buttons.
     */

    setupLogoutButtons();
}


/* =========================================================
   INITIALIZATION
========================================================= */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializePawPalAuth
    );

} else {

    initializePawPalAuth();
}


/* =========================================================
   PUBLIC PAWPAL AUTH API
========================================================= */

window.PawPalAuth = {

    getCurrentUser,

    saveCurrentUser,

    clearCurrentUser,

    logout: logoutUser,

    logoutUser,

    getDashboardPath,

    getPagesPath,

    normalizeRole,

    formatRole,

    getInitials,

    updateAuthNavigation,

    updateUserInformation,

    protectDashboard

};