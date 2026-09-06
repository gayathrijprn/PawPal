document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       PAWPAL FRONTEND AUTHENTICATION
       -----------------------------------------------------
       Frontend-only authentication using localStorage.
    ====================================================== */


    /* =====================================================
       STORAGE KEYS
    ====================================================== */

    const USERS_KEY = "pawpal-users";
    const CURRENT_USER_KEY = "pawpal-current-user";


    /* =====================================================
       GET USERS
    ====================================================== */

    function getUsers() {

        try {

            return JSON.parse(
                localStorage.getItem(USERS_KEY)
            ) || [];

        } catch (error) {

            console.error(
                "Unable to read PawPal users:",
                error
            );

            return [];

        }

    }


    /* =====================================================
       SAVE USERS
    ====================================================== */

    function saveUsers(users) {

        localStorage.setItem(
            USERS_KEY,
            JSON.stringify(users)
        );

    }


    /* =====================================================
       GET CURRENT USER
    ====================================================== */

    function getCurrentUser() {

        try {

            return JSON.parse(
                localStorage.getItem(
                    CURRENT_USER_KEY
                )
            );

        } catch (error) {

            console.error(
                "Unable to read current PawPal user:",
                error
            );

            return null;

        }

    }


    /* =====================================================
       SAVE CURRENT USER
    ====================================================== */

    function saveCurrentUser(user) {

        if (!user) {
            return;
        }

        localStorage.setItem(
            CURRENT_USER_KEY,
            JSON.stringify(user)
        );

    }


    /* =====================================================
       PATH HELPERS
       -----------------------------------------------------
       Root pages:
       index.html
       pages/...

       Pages inside /pages/:
       pets.html
       shop.html
       etc.
    ====================================================== */

    function isInsidePagesFolder() {

        return window.location.pathname
            .replace(/\\/g, "/")
            .includes("/pages/");

    }


    function getLoginPath() {

        return isInsidePagesFolder()
            ? "login.html"
            : "pages/login.html";

    }


    function getRegisterPath() {

        return isInsidePagesFolder()
            ? "register.html"
            : "pages/register.html";

    }


    function getHomePath() {

        return isInsidePagesFolder()
            ? "../index.html"
            : "index.html";

    }


    /* =====================================================
       LOGOUT
    ====================================================== */

    function logoutUser() {

        localStorage.removeItem(
            CURRENT_USER_KEY
        );

        window.location.href =
            getLoginPath();

    }


    /* =====================================================
       SHARED NAVIGATION BEHAVIOR
    ====================================================== */

    function initializeNavigation() {

        document.addEventListener("click", function (event) {

            const menuButton = event.target.closest("#mobileMenuButton");

            if (menuButton) {
                const navigation = document.getElementById("mainNavigation");

                if (!navigation) return;

                event.preventDefault();
                event.stopImmediatePropagation();

                const isOpen = navigation.classList.toggle("mobile-open");
                menuButton.setAttribute("aria-expanded", String(isOpen));
                menuButton.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
                menuButton.textContent = isOpen ? "✕" : "☰";
                return;
            }

            const featureButton = event.target.closest(".nav-dropdown-button, .nav-dropdown-toggle");

            if (featureButton) {
                const dropdown = featureButton.closest(".nav-dropdown");

                if (!dropdown) return;

                event.preventDefault();
                event.stopImmediatePropagation();

                const isOpen = !dropdown.classList.contains("open");
                dropdown.classList.toggle("open", isOpen);
                dropdown.classList.toggle("dropdown-open", isOpen);
                featureButton.setAttribute("aria-expanded", String(isOpen));
                return;
            }

            const rescueToggle = event.target.closest(
                ".nested-dropdown-button, .nav-submenu > a"
            );

            if (rescueToggle) {
                const dropdown = rescueToggle.closest(".nested-dropdown, .nav-submenu");

                if (!dropdown) return;

                event.preventDefault();
                event.stopImmediatePropagation();

                const isOpen = !dropdown.classList.contains("open");
                dropdown.classList.toggle("open", isOpen);
                dropdown.classList.toggle("nested-open", isOpen);
                rescueToggle.setAttribute("aria-expanded", String(isOpen));
                return;
            }

            if (!event.target.closest(".nav-dropdown, .nav-submenu, .nested-dropdown")) {
                document.querySelectorAll(
                    ".dropdown-open, .nav-dropdown.open, .nested-open, .nav-submenu.open, .nested-dropdown.open"
                ).forEach(function (element) {
                    element.classList.remove("dropdown-open", "open", "nested-open");
                });
            }

        }, true);

        document.addEventListener("keydown", function (event) {
            if (event.key !== "Escape") return;

            document.querySelectorAll(
                ".dropdown-open, .nav-dropdown.open, .nested-open, .nav-submenu.open, .nested-dropdown.open"
            ).forEach(function (element) {
                element.classList.remove("dropdown-open", "open", "nested-open");
            });
        });
    }


    function initializeLogoutButtons() {
        document.querySelectorAll("[data-logout], .logout-btn").forEach(function (button) {
            button.addEventListener("click", function (event) {
                event.preventDefault();
                if (confirm("Are you sure you want to log out?")) {
                    logoutUser();
                }
            });
        });
    }


    /* =====================================================
       NORMALIZE EMAIL
    ====================================================== */

    function normalizeEmail(email) {

        return String(email || "")
            .trim()
            .toLowerCase();

    }


    /* =====================================================
       VALIDATE EMAIL
    ====================================================== */

    function isValidEmail(email) {

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return emailPattern.test(email);

    }


    /* =====================================================
       GENERATE USER ID
    ====================================================== */

    function generateUserId() {

        return (
            "USER-" +
            Date.now() +
            "-" +
            Math.floor(
                Math.random() * 10000
            )
        );

    }


    /* =====================================================
       DASHBOARD PATHS
       -----------------------------------------------------
       Your dashboard files are:

       dashboard-admin.html
       dashboard-owner.html
       dashboard-adopter.html

       These files are inside /pages/.
    ====================================================== */

    function getDashboardPath(role) {

        const normalizedRole =
            String(role || "")
                .trim()
                .toLowerCase()
                .replace(/_/g, " ");


        switch (normalizedRole) {

            case "admin":

                return "dashboard-admin.html";


            case "owner":

            case "pet owner":

            case "shelter":

                return "dashboard-owner.html";


            case "adopter":

            default:

                return "dashboard-adopter.html";

        }

    }


    /* =====================================================
       FORMAT ROLE
    ====================================================== */

    function formatRole(role) {

        const normalizedRole =
            String(role || "")
                .trim()
                .toLowerCase()
                .replace(/_/g, " ");


        if (normalizedRole === "admin") {

            return "Admin";

        }


        if (
            normalizedRole === "owner" ||
            normalizedRole === "pet owner"
        ) {

            return "Pet Owner";

        }


        if (normalizedRole === "shelter") {

            return "Shelter";

        }


        return "Adopter";

    }


    /* =====================================================
       GET INITIALS
    ====================================================== */

    function getInitials(name) {

        if (!name) {
            return "PP";
        }


        const parts =
            String(name)
                .trim()
                .split(/\s+/);


        if (parts.length === 1) {

            return parts[0]
                .substring(0, 2)
                .toUpperCase();

        }


        return (
            parts[0][0] +
            parts[parts.length - 1][0]
        ).toUpperCase();

    }


    /* =====================================================
       SHOW AUTH MESSAGE
    ====================================================== */

    function showMessage(
        message,
        type = "error"
    ) {

        let messageBox =
            document.getElementById(
                "authMessage"
            );


        if (!messageBox) {

            messageBox =
                document.createElement(
                    "div"
                );

            messageBox.id =
                "authMessage";


            messageBox.style.marginTop =
                "15px";

            messageBox.style.padding =
                "12px 16px";

            messageBox.style.borderRadius =
                "12px";

            messageBox.style.fontSize =
                "14px";

            messageBox.style.fontWeight =
                "600";

            messageBox.style.textAlign =
                "center";


            const form =
                document.querySelector(
                    "form"
                );


            if (form) {

                form.appendChild(
                    messageBox
                );

            } else {

                document.body.appendChild(
                    messageBox
                );

            }

        }


        messageBox.textContent =
            message;


        if (type === "success") {

            messageBox.style.background =
                "#e7eee3";

            messageBox.style.color =
                "#60745a";

            messageBox.style.border =
                "1px solid #cbdcc6";

        } else if (type === "info") {

            messageBox.style.background =
                "#eef4f8";

            messageBox.style.color =
                "#527084";

            messageBox.style.border =
                "1px solid #cbdce5";

        } else {

            messageBox.style.background =
                "#fcefeb";

            messageBox.style.color =
                "#b95742";

            messageBox.style.border =
                "1px solid #f1c8bd";

        }


        messageBox.style.display =
            "block";


        clearTimeout(
            window.pawpalAuthMessageTimer
        );


        window.pawpalAuthMessageTimer =
            setTimeout(function () {

                if (messageBox) {

                    messageBox.style.display =
                        "none";

                }

            }, 4500);

    }


    /* =====================================================
       UPDATE PUBLIC NAVBAR AUTH
       -----------------------------------------------------
       Logged OUT:

       Log in | Get Started

       Logged IN:

       👤 User Name | Logout

       This function only runs when a page contains
       #authNav.

       Login page has a special header without #authNav,
       so its header remains untouched.
    ====================================================== */

    function updateAuthNavigation() {

        const authNav =
            document.getElementById(
                "authNav"
            );


        if (!authNav) {
            return;
        }


        const currentUser =
            getCurrentUser();

        const cartButton =
            authNav.querySelector("#cart-button");


        /* ---------------------------------------------
           LOGGED IN
        ---------------------------------------------- */

        if (currentUser) {

            authNav.innerHTML = "";


            const userWrapper =
                document.createElement(
                    "div"
                );

            userWrapper.className =
                "auth-user-wrapper";


            const avatar =
                document.createElement(
                    "span"
                );

            avatar.className =
                "auth-user-avatar";

            avatar.textContent =
                getInitials(
                    currentUser.name
                );

            avatar.setAttribute(
                "aria-hidden",
                "true"
            );


            const userName =
                document.createElement(
                    "span"
                );

            userName.className =
                "welcome-user";

            userName.setAttribute(
                "data-user-name",
                ""
            );

            userName.textContent =
                currentUser.name ||
                "PawPal User";


            userWrapper.appendChild(
                avatar
            );

            userWrapper.appendChild(
                userName
            );


            const logoutButton =
                document.createElement(
                    "button"
                );

            logoutButton.type =
                "button";

            logoutButton.className =
                "logout-btn";

            logoutButton.setAttribute(
                "data-logout",
                ""
            );

            logoutButton.textContent =
                "Logout";


            authNav.appendChild(
                userWrapper
            );

            if (cartButton) {
                authNav.appendChild(cartButton);
            }

            authNav.appendChild(
                logoutButton
            );


            logoutButton.addEventListener(
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


                    logoutUser();

                }
            );


        }

        /* ---------------------------------------------
           LOGGED OUT
        ---------------------------------------------- */

        else {

            authNav.innerHTML = "";


            const loginLink =
                document.createElement(
                    "a"
                );

            loginLink.href =
                getLoginPath();

            loginLink.className =
                "login";

            loginLink.id =
                "loginNavButton";

            loginLink.textContent =
                "Log in";


            const registerLink =
                document.createElement(
                    "a"
                );

            registerLink.href =
                getRegisterPath();

            registerLink.className =
                "nav-button";

            registerLink.id =
                "signupNavButton";

            registerLink.innerHTML =
                "Get Started <span>→</span>";


            authNav.appendChild(
                loginLink
            );

            if (cartButton) {
                authNav.appendChild(cartButton);
            }

            authNav.appendChild(
                registerLink
            );

        }

    }


    initializeNavigation();
    initializeLogoutButtons();
    updateAuthNavigation();


    /* =====================================================
       REGISTER USER
    ====================================================== */

    const registerForm =
        document.getElementById(
            "registerForm"
        );


    if (registerForm) {

        registerForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                /* -----------------------------------------
                   FIND FIELDS
                ------------------------------------------ */

                const nameInput =
                    registerForm.querySelector(
                        'input[name="name"],' +
                        'input[name="fullName"],' +
                        'input[id="name"],' +
                        'input[id="fullName"]'
                    );


                const emailInput =
                    registerForm.querySelector(
                        'input[name="email"],' +
                        'input[type="email"],' +
                        'input[id="email"]'
                    );


                const passwordInput =
                    registerForm.querySelector(
                        'input[name="password"],' +
                        'input[type="password"][id="password"]'
                    );


                const confirmPasswordInput =
                    registerForm.querySelector(
                        'input[name="confirmPassword"],' +
                        'input[name="confirm-password"],' +
                        'input[id="confirmPassword"],' +
                        'input[id="confirm-password"]'
                    );


                const roleInput =
                    registerForm.querySelector(
                        'select[name="role"],' +
                        'select[id="role"],' +
                        'input[name="role"]:checked'
                    );


                /* -----------------------------------------
                   READ VALUES
                ------------------------------------------ */

                const name =
                    nameInput
                        ? nameInput.value.trim()
                        : "";


                const email =
                    emailInput
                        ? normalizeEmail(
                            emailInput.value
                        )
                        : "";


                const password =
                    passwordInput
                        ? passwordInput.value
                        : "";


                const confirmPassword =
                    confirmPasswordInput
                        ? confirmPasswordInput.value
                        : "";


                let role =
                    roleInput
                        ? roleInput.value
                        : "adopter";


                role =
                    String(role || "")
                        .trim()
                        .toLowerCase()
                        .replace(
                            /_/g,
                            " "
                        );


                /* -----------------------------------------
                   VALIDATION
                ------------------------------------------ */

                if (!name) {

                    showMessage(
                        "Please enter your name."
                    );

                    if (nameInput) {
                        nameInput.focus();
                    }

                    return;

                }


                if (!email) {

                    showMessage(
                        "Please enter your email address."
                    );

                    if (emailInput) {
                        emailInput.focus();
                    }

                    return;

                }


                if (!isValidEmail(email)) {

                    showMessage(
                        "Please enter a valid email address."
                    );

                    if (emailInput) {
                        emailInput.focus();
                    }

                    return;

                }


                if (!password) {

                    showMessage(
                        "Please create a password."
                    );

                    if (passwordInput) {
                        passwordInput.focus();
                    }

                    return;

                }


                if (password.length < 6) {

                    showMessage(
                        "Password must contain at least 6 characters."
                    );

                    if (passwordInput) {
                        passwordInput.focus();
                    }

                    return;

                }


                if (
                    confirmPasswordInput &&
                    password !== confirmPassword
                ) {

                    showMessage(
                        "Passwords do not match."
                    );

                    confirmPasswordInput.focus();

                    return;

                }


                /* -----------------------------------------
                   CHECK EXISTING USER
                ------------------------------------------ */

                const users =
                    getUsers();


                const existingUser =
                    users.find(function (user) {

                        return (
                            normalizeEmail(
                                user.email
                            ) === email
                        );

                    });


                if (existingUser) {

                    showMessage(
                        "An account with this email already exists. Please log in."
                    );

                    return;

                }


                /* -----------------------------------------
                   CREATE USER
                ------------------------------------------ */

                const newUser = {

                    id:
                        generateUserId(),

                    name:
                        name,

                    email:
                        email,

                    password:
                        password,

                    role:
                        role || "adopter",

                    createdAt:
                        new Date().toISOString()

                };


                users.push(
                    newUser
                );


                saveUsers(
                    users
                );


                /* -----------------------------------------
                   CREATE SESSION
                ------------------------------------------ */

                const loggedInUser = {

                    id:
                        newUser.id,

                    name:
                        newUser.name,

                    email:
                        newUser.email,

                    role:
                        newUser.role

                };


                saveCurrentUser(
                    loggedInUser
                );


                showMessage(
                    "Account created successfully! Welcome to PawPal 🐾",
                    "success"
                );


                /* -----------------------------------------
                   REDIRECT
                ------------------------------------------ */

                setTimeout(function () {

                    window.location.href =
                        getDashboardPath(
                            newUser.role
                        );

                }, 1000);

            }
        );

    }


    /* =====================================================
       LOGIN USER
    ====================================================== */

    const loginForm =
        document.getElementById(
            "loginForm"
        );


    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                /* -----------------------------------------
                   FIND FIELDS
                ------------------------------------------ */

                const emailInput =
                    loginForm.querySelector(
                        'input[name="email"],' +
                        'input[type="email"],' +
                        'input[id="email"]'
                    );


                const passwordInput =
                    loginForm.querySelector(
                        'input[name="password"],' +
                        'input[type="password"][id="password"]'
                    );


                /* -----------------------------------------
                   READ VALUES
                ------------------------------------------ */

                const email =
                    emailInput
                        ? normalizeEmail(
                            emailInput.value
                        )
                        : "";


                const password =
                    passwordInput
                        ? passwordInput.value
                        : "";


                /* -----------------------------------------
                   VALIDATION
                ------------------------------------------ */

                if (!email) {

                    showMessage(
                        "Please enter your email address."
                    );

                    if (emailInput) {
                        emailInput.focus();
                    }

                    return;

                }


                if (!isValidEmail(email)) {

                    showMessage(
                        "Please enter a valid email address."
                    );

                    if (emailInput) {
                        emailInput.focus();
                    }

                    return;

                }


                if (!password) {

                    showMessage(
                        "Please enter your password."
                    );

                    if (passwordInput) {
                        passwordInput.focus();
                    }

                    return;

                }


                /* -----------------------------------------
                   FIND USER
                ------------------------------------------ */

                const users =
                    getUsers();


                const user =
                    users.find(function (account) {

                        return (
                            normalizeEmail(
                                account.email
                            ) === email &&
                            account.password === password
                        );

                    });


                if (!user) {

                    showMessage(
                        "Email or password is incorrect."
                    );

                    return;

                }


                /* -----------------------------------------
                   CREATE SESSION
                ------------------------------------------ */

                const loggedInUser = {

                    id:
                        user.id,

                    name:
                        user.name,

                    email:
                        user.email,

                    role:
                        user.role

                };


                saveCurrentUser(
                    loggedInUser
                );


                showMessage(
                    "Login successful! Welcome back 🐾",
                    "success"
                );


                /* -----------------------------------------
                   REDIRECT
                ------------------------------------------ */

                setTimeout(function () {

                    window.location.href =
                        getDashboardPath(
                            user.role
                        );

                }, 700);

            }
        );

    }


    /* =====================================================
       DASHBOARD PROTECTION
       -----------------------------------------------------
       Protects:

       dashboard-admin.html
       dashboard-owner.html
       dashboard-adopter.html
    ====================================================== */

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();


    const dashboardPages = [

        "dashboard-admin.html",

        "dashboard-owner.html",

        "dashboard-adopter.html"

    ];


    if (
        dashboardPages.includes(
            currentPage
        )
    ) {

        const dashboardUser =
            getCurrentUser();


        /* -----------------------------------------
           NOT LOGGED IN
        ------------------------------------------ */

        if (!dashboardUser) {

            window.location.href =
                "login.html";

            return;

        }


        /* -----------------------------------------
           REQUIRED ROLE
        ------------------------------------------ */

        let requiredRole;


        if (
            currentPage ===
            "dashboard-admin.html"
        ) {

            requiredRole =
                "admin";

        } else if (
            currentPage ===
            "dashboard-owner.html"
        ) {

            requiredRole =
                "owner";

        } else {

            requiredRole =
                "adopter";

        }


        /* -----------------------------------------
           NORMALIZE USER ROLE
        ------------------------------------------ */

        const userRole =
            String(
                dashboardUser.role || ""
            )
            .trim()
            .toLowerCase()
            .replace(
                /_/g,
                " "
            );


        /* -----------------------------------------
           CHECK ROLE
        ------------------------------------------ */

        let allowedRole = false;


        if (
            requiredRole ===
            "owner"
        ) {

            allowedRole =
                userRole === "owner" ||
                userRole === "pet owner" ||
                userRole === "shelter";

        } else {

            allowedRole =
                userRole ===
                requiredRole;

        }


        /* -----------------------------------------
           WRONG DASHBOARD
        ------------------------------------------ */

        if (!allowedRole) {

            window.location.href =
                getDashboardPath(
                    dashboardUser.role
                );

            return;

        }

    }


    /* =====================================================
       DISPLAY CURRENT USER
    ====================================================== */

    const loggedInUser =
        getCurrentUser();


    if (loggedInUser) {

        /* -----------------------------------------
           USER NAME
        ------------------------------------------ */

        document
            .querySelectorAll(
                "[data-user-name]"
            )
            .forEach(
                function (element) {

                    element.textContent =
                        loggedInUser.name || "PawPal User";

                }
            );


        /* -----------------------------------------
           USER EMAIL
        ------------------------------------------ */

        document
            .querySelectorAll(
                "[data-user-email]"
            )
            .forEach(
                function (element) {

                    element.textContent =
                        loggedInUser.email || "";

                }
            );


        /* -----------------------------------------
           USER ROLE
        ------------------------------------------ */

        document
            .querySelectorAll(
                "[data-user-role]"
            )
            .forEach(
                function (element) {

                    element.textContent =
                        formatRole(
                            loggedInUser.role
                        );

                }
            );


        /* -----------------------------------------
           USER AVATAR
        ------------------------------------------ */

        document
            .querySelectorAll(
                "[data-user-avatar]"
            )
            .forEach(
                function (element) {

                    element.textContent =
                        getInitials(
                            loggedInUser.name
                        );

                }
            );

    }


    /* =====================================================
       LOGOUT BUTTONS
       -----------------------------------------------------
       Handles logout buttons already present on pages.
    ====================================================== */

    document
        .querySelectorAll(
            ".logout-btn, [data-logout]"
        )
        .forEach(
            function (button) {

                /*
                 * Avoid attaching the same listener twice.
                 */
                if (
                    button.dataset.pawpalLogoutBound ===
                    "true"
                ) {
                    return;
                }


                button.dataset.pawpalLogoutBound =
                    "true";


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


                        logoutUser();

                    }
                );

            }
        );


    /* =====================================================
       DEMO ADMIN ACCOUNT
    ====================================================== */

    function createDemoAdmin() {

        const users =
            getUsers();


        const adminExists =
            users.some(function (user) {

                return (
                    normalizeEmail(
                        user.email
                    ) ===
                    "admin@pawpal.com"
                );

            });


        if (!adminExists) {

            users.push({

                id:
                    "ADMIN-DEMO-001",

                name:
                    "PawPal Admin",

                email:
                    "admin@pawpal.com",

                password:
                    "admin123",

                role:
                    "admin",

                createdAt:
                    new Date().toISOString(),

                demo:
                    true

            });


            saveUsers(
                users
            );

        }

    }


    createDemoAdmin();


    /* =====================================================
       DEMO OWNER ACCOUNT
    ====================================================== */

    function createDemoOwner() {

        const users =
            getUsers();


        const ownerExists =
            users.some(function (user) {

                return (
                    normalizeEmail(
                        user.email
                    ) ===
                    "owner@pawpal.com"
                );

            });


        if (!ownerExists) {

            users.push({

                id:
                    "OWNER-DEMO-001",

                name:
                    "PawPal Pet Owner",

                email:
                    "owner@pawpal.com",

                password:
                    "owner123",

                role:
                    "owner",

                createdAt:
                    new Date().toISOString(),

                demo:
                    true

            });


            saveUsers(
                users
            );

        }

    }


    createDemoOwner();


    /* =====================================================
       DEMO ADOPTER ACCOUNT
    ====================================================== */

    function createDemoAdopter() {

        const users =
            getUsers();


        const adopterExists =
            users.some(function (user) {

                return (
                    normalizeEmail(
                        user.email
                    ) ===
                    "adopter@pawpal.com"
                );

            });


        if (!adopterExists) {

            users.push({

                id:
                    "ADOPTER-DEMO-001",

                name:
                    "PawPal Adopter",

                email:
                    "adopter@pawpal.com",

                password:
                    "adopter123",

                role:
                    "adopter",

                createdAt:
                    new Date().toISOString(),

                demo:
                    true

            });


            saveUsers(
                users
            );

        }

    }


    createDemoAdopter();


    /* =====================================================
       UPDATE AUTH NAVIGATION
       -----------------------------------------------------
       Run AFTER demo accounts are created so that the
       navbar always reflects the current session.
    ====================================================== */

    updateAuthNavigation();


    /* =====================================================
       EXPOSE PAWPAL AUTH
    ====================================================== */

    window.PawPalAuth = {

        getUsers:
            getUsers,

        getCurrentUser:
            getCurrentUser,

        saveCurrentUser:
            saveCurrentUser,

        logout:
            logoutUser,

        getDashboardPath:
            getDashboardPath,

        formatRole:
            formatRole,

        getInitials:
            getInitials,

        updateAuthNavigation:
            updateAuthNavigation

    };


    /* =====================================================
       CONSOLE MESSAGE
    ====================================================== */

    console.log(
        "PawPal authentication loaded successfully."
    );

});
