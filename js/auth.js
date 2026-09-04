document.addEventListener("DOMContentLoaded", function () {

```
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
   LOGOUT
====================================================== */

function logoutUser() {

    localStorage.removeItem(
        CURRENT_USER_KEY
    );

    window.location.href =
        "login.html";

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
====================================================== */

document
    .querySelectorAll(
        ".logout-btn, [data-logout]"
    )
    .forEach(
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
        getInitials

};


/* =====================================================
   CONSOLE MESSAGE
====================================================== */

console.log(
    "PawPal authentication loaded successfully."
);
```

});
