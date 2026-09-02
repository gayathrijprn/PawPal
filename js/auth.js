document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       PAWPAL FRONTEND AUTHENTICATION
       -----------------------------------------------------
       This version uses localStorage only.
       No Supabase / backend required yet.
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

            return null;

        }

    }


    /* =====================================================
       SAVE CURRENT USER
    ====================================================== */

    function saveCurrentUser(user) {

        localStorage.setItem(
            CURRENT_USER_KEY,
            JSON.stringify(user)
        );

    }


    /* =====================================================
       REMOVE CURRENT USER
    ====================================================== */

    function logoutUser() {

        localStorage.removeItem(
            CURRENT_USER_KEY
        );

        window.location.href =
            "login.html";

    }


    /* =====================================================
       DASHBOARD PATHS
    ====================================================== */

    function getDashboardPath(role) {

        switch (
            String(role).toLowerCase()
        ) {

            case "admin":

                return "admin-dashboard.html";


            case "owner":

            case "pet owner":

            case "pet_owner":

            case "shelter":

                return "owner-dashboard.html";


            case "adopter":

            default:

                return "adopter-dashboard.html";

        }

    }


    /* =====================================================
       SHOW MESSAGE
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


        setTimeout(function () {

            if (messageBox) {

                messageBox.style.display =
                    "none";

            }

        }, 4500);

    }


    /* =====================================================
       NORMALIZE EMAIL
    ====================================================== */

    function normalizeEmail(email) {

        return String(email)
            .trim()
            .toLowerCase();

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
                   FIND FORM FIELDS
                ------------------------------------------ */

                const nameInput =
                    document.querySelector(
                        '#registerForm input[name="name"],' +
                        '#registerForm input[name="fullName"],' +
                        '#registerForm input[id="name"],' +
                        '#registerForm input[id="fullName"]'
                    );


                const emailInput =
                    document.querySelector(
                        '#registerForm input[name="email"],' +
                        '#registerForm input[type="email"],' +
                        '#registerForm input[id="email"]'
                    );


                const passwordInput =
                    document.querySelector(
                        '#registerForm input[name="password"],' +
                        '#registerForm input[type="password"][id="password"]'
                    );


                const confirmPasswordInput =
                    document.querySelector(
                        '#registerForm input[name="confirmPassword"],' +
                        '#registerForm input[name="confirm-password"],' +
                        '#registerForm input[id="confirmPassword"],' +
                        '#registerForm input[id="confirm-password"]'
                    );


                const roleInput =
                    document.querySelector(
                        '#registerForm select[name="role"],' +
                        '#registerForm select[id="role"],' +
                        '#registerForm input[name="role"]:checked'
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
                    String(role)
                        .trim()
                        .toLowerCase();


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

                        return normalizeEmail(
                            user.email
                        ) === email;

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
                   AUTOMATIC LOGIN
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
                   FIND LOGIN FIELDS
                ------------------------------------------ */

                const emailInput =
                    document.querySelector(
                        '#loginForm input[name="email"],' +
                        '#loginForm input[type="email"],' +
                        '#loginForm input[id="email"]'
                    );


                const passwordInput =
                    document.querySelector(
                        '#loginForm input[name="password"],' +
                        '#loginForm input[type="password"][id="password"]'
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
                            account.password ===
                                password
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
                   REDIRECT TO ROLE DASHBOARD
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
       EMAIL VALIDATION
    ====================================================== */

    function isValidEmail(email) {

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return emailPattern.test(
            email
        );

    }


    /* =====================================================
       LOGOUT BUTTONS
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

                    logoutUser();

                }
            );

        }
    );


    /* =====================================================
       PROTECT DASHBOARD PAGES
    ====================================================== */

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();


    const dashboardPages = [

        "admin-dashboard.html",

        "adopter-dashboard.html",

        "owner-dashboard.html"

    ];


    if (
        dashboardPages.includes(
            currentPage
        )
    ) {

        const currentUser =
            getCurrentUser();


        if (!currentUser) {

            window.location.href =
                "login.html";

            return;

        }


        /* -----------------------------------------
           ROLE PROTECTION
        ------------------------------------------ */

        const requiredRole =
            currentPage ===
            "admin-dashboard.html"

                ? "admin"

                : currentPage ===
                  "owner-dashboard.html"

                    ? "owner"

                    : "adopter";


        const userRole =
            String(
                currentUser.role
            )
            .toLowerCase()
            .replace(
                "_",
                " "
            );


        const allowedRole =
            requiredRole === "owner"

                ? (
                    userRole === "owner" ||
                    userRole === "pet owner" ||
                    userRole === "shelter"
                )

                : userRole ===
                  requiredRole;


        if (!allowedRole) {

            window.location.href =
                getDashboardPath(
                    currentUser.role
                );

            return;

        }

    }


    /* =====================================================
       DISPLAY CURRENT USER INFORMATION
    ====================================================== */

    const currentUser =
        getCurrentUser();


    if (currentUser) {

        const userNameElements =
            document.querySelectorAll(
                "[data-user-name]"
            );


        userNameElements.forEach(
            function (element) {

                element.textContent =
                    currentUser.name;

            }
        );


        const userEmailElements =
            document.querySelectorAll(
                "[data-user-email]"
            );


        userEmailElements.forEach(
            function (element) {

                element.textContent =
                    currentUser.email;

            }
        );


        const userRoleElements =
            document.querySelectorAll(
                "[data-user-role]"
            );


        userRoleElements.forEach(
            function (element) {

                element.textContent =
                    formatRole(
                        currentUser.role
                    );

            }
        );


        const avatarElements =
            document.querySelectorAll(
                "[data-user-avatar]"
            );


        avatarElements.forEach(
            function (element) {

                element.textContent =
                    getInitials(
                        currentUser.name
                    );

            }
        );

    }


    /* =====================================================
       FORMAT ROLE
    ====================================================== */

    function formatRole(role) {

        const normalizedRole =
            String(role)
                .toLowerCase()
                .replace(
                    "_",
                    " "
                );


        if (
            normalizedRole ===
            "pet owner"
        ) {

            return "Pet Owner";

        }


        if (
            normalizedRole ===
            "admin"
        ) {

            return "Admin";

        }


        if (
            normalizedRole ===
            "owner"
        ) {

            return "Pet Owner";

        }


        if (
            normalizedRole ===
            "shelter"
        ) {

            return "Shelter";

        }


        return "Adopter";

    }


    /* =====================================================
       GET USER INITIALS
    ====================================================== */

    function getInitials(name) {

        if (!name) {
            return "PP";
        }


        const parts =
            name
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
       DEMO ADMIN ACCOUNT
       -----------------------------------------------------
       Creates a demo admin account only if no users
       exist yet. This makes frontend testing easier.
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
       EXPOSE AUTH FUNCTIONS
       -----------------------------------------------------
       These can also be used by other frontend scripts.
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
            getInitials

    };


});