
/* =========================================================
   PAWPAL — LOGIN
   =========================================================

   Responsibilities:
   - Validate login form
   - Authenticate using Supabase
   - Read user's role
   - Save current user
   - Redirect to the correct dashboard

   Roles:
   adopter -> dashboard-adopter.html
   owner   -> dashboard-owner.html
   shelter -> dashboard-adopter.html (temporary)
   admin   -> dashboard-admin.html

========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       GET ELEMENTS
    ===================================================== */

    const form = document.getElementById("loginForm");
    const emailInput = document.getElementById("loginEmail");
    const passwordInput = document.getElementById("loginPassword");
    const togglePassword = document.getElementById("togglePassword");
    const rememberMe = document.getElementById("rememberMe");
    const message = document.getElementById("loginMessage");
    const loginButton = document.getElementById("loginButton");


    /* =====================================================
       SAFETY CHECK
    ===================================================== */

    if (!form) {
        console.error("PawPal Login: #loginForm was not found.");
        return;
    }


    /* =====================================================
       SHOW / HIDE PASSWORD
    ===================================================== */

    if (togglePassword && passwordInput) {

        togglePassword.addEventListener("click", function () {

            const isPassword =
                passwordInput.type === "password";

            if (isPassword) {

                passwordInput.type = "text";

                togglePassword.textContent = "Hide";

                togglePassword.setAttribute(
                    "aria-label",
                    "Hide password"
                );

            } else {

                passwordInput.type = "password";

                togglePassword.textContent = "Show";

                togglePassword.setAttribute(
                    "aria-label",
                    "Show password"
                );
            }
        });
    }


    /* =====================================================
       MESSAGE
    ===================================================== */

    function showMessage(text, type) {

        if (!message) {
            return;
        }

        message.textContent = text;

        message.className = "login-message " + type;

        message.style.display = "block";
    }


    function hideMessage() {

        if (!message) {
            return;
        }

        message.textContent = "";

        message.className = "login-message";

        message.style.display = "none";
    }


    /* =====================================================
       LOADING BUTTON
    ===================================================== */

    function setLoading(isLoading) {

        if (!loginButton) {
            return;
        }

        loginButton.disabled = isLoading;

        if (isLoading) {

            loginButton.innerHTML = `
                <span>Logging in...</span>
                <span>⏳</span>
            `;

        } else {

            loginButton.innerHTML = `
                <span>Log In</span>
                <span>→</span>
            `;
        }
    }


    /* =====================================================
       NORMALIZE ROLE
    ===================================================== */

    function normalizeRole(role) {

        if (!role) {
            return "adopter";
        }

        const normalized = String(role)
            .trim()
            .toLowerCase()
            .replace(/[_-]+/g, " ");

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


    /* =====================================================
       DASHBOARD PATH
    ===================================================== */

    function getDashboardPath(role) {

        const normalizedRole = normalizeRole(role);

        /*
         * IMPORTANT:
         * There is currently no shelter dashboard.
         * Therefore shelter users temporarily go to
         * the adopter dashboard.
         *
         * We can replace this once the shelter dashboard
         * is created.
         */

        switch (normalizedRole) {

            case "admin":
                return "dashboard-admin.html";

            case "owner":
                return "dashboard-owner.html";

            case "shelter":
                return "dashboard-adopter.html";

            case "adopter":
            default:
                return "dashboard-adopter.html";
        }
    }


    /* =====================================================
       CREATE CURRENT USER OBJECT
    ===================================================== */

    function createCurrentUser(user) {

        const metadata = user.user_metadata || {};

        const role = normalizeRole(metadata.role);

        const firstName =
            metadata.first_name || "";

        const lastName =
            metadata.last_name || "";

        const metadataName =
            `${firstName} ${lastName}`.trim();

        const displayName =
            metadataName ||
            metadata.full_name ||
            metadata.name ||
            user.email?.split("@")[0] ||
            "PawPal User";

        return {

            id: user.id || "",

            name: displayName,

            email: user.email || "",

            role: role
        };
    }


    /* =====================================================
       LOGIN SUBMIT
    ===================================================== */

    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        hideMessage();


        /* =================================================
           GET VALUES
        ================================================= */

        const email =
            emailInput
                ? emailInput.value.trim().toLowerCase()
                : "";

        const password =
            passwordInput
                ? passwordInput.value
                : "";


        /* =================================================
           VALIDATION
        ================================================= */

        if (!email) {

            showMessage(
                "Please enter your email address.",
                "error"
            );

            if (emailInput) {
                emailInput.focus();
            }

            return;
        }


        if (!password) {

            showMessage(
                "Please enter your password.",
                "error"
            );

            if (passwordInput) {
                passwordInput.focus();
            }

            return;
        }


        /*
         * Correct email regex.
         */
        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailPattern.test(email)) {

            showMessage(
                "Please enter a valid email address.",
                "error"
            );

            if (emailInput) {
                emailInput.focus();
            }

            return;
        }


        /* =================================================
           CHECK SUPABASE
        ================================================= */

        if (
            typeof window.supabaseClient === "undefined" ||
            !window.supabaseClient
        ) {

            console.error(
                "PawPal Login: supabaseClient is unavailable."
            );

            showMessage(
                "Authentication service is unavailable. Please refresh the page and try again.",
                "error"
            );

            return;
        }


        /* =================================================
           LOADING
        ================================================= */

        setLoading(true);


        try {

            /* =============================================
               REMOVE STALE LOCAL USER
            ============================================= */

            if (
                window.PawPalAuth &&
                typeof window.PawPalAuth.clearCurrentUser === "function"
            ) {

                window.PawPalAuth.clearCurrentUser();

            } else {

                localStorage.removeItem(
                    "pawpal-current-user"
                );
            }


            /* =============================================
               SUPABASE LOGIN
            ============================================= */

            const {
                data,
                error
            } = await window.supabaseClient.auth.signInWithPassword({

                email: email,

                password: password
            });


            /* =============================================
               HANDLE SUPABASE ERROR
            ============================================= */

            if (error) {

                console.error(
                    "PawPal Login Error:",
                    error
                );

                const errorText =
                    String(error.message || "")
                        .toLowerCase();

                let errorMessage =
                    "Unable to log in. Please check your email and password.";


                if (
                    errorText.includes("email not confirmed")
                ) {

                    errorMessage =
                        "Please confirm your email address before logging in.";

                } else if (
                    errorText.includes("invalid login credentials")
                ) {

                    errorMessage =
                        "Incorrect email or password.";

                } else if (
                    errorText.includes("too many requests")
                ) {

                    errorMessage =
                        "Too many login attempts. Please wait a moment and try again.";

                } else if (error.message) {

                    errorMessage =
                        error.message;
                }


                showMessage(
                    errorMessage,
                    "error"
                );

                return;
            }


            /* =============================================
               USER CHECK
            ============================================= */

            const user = data?.user;


            if (!user) {

                showMessage(
                    "Login failed. No user account was returned.",
                    "error"
                );

                return;
            }


            /* =============================================
               CREATE CURRENT USER
            ============================================= */

            const currentUser =
                createCurrentUser(user);


            console.log(
                "PawPal: Logged in user:",
                currentUser
            );


            /* =============================================
               SAVE CURRENT USER
            ============================================= */

            if (
                window.PawPalAuth &&
                typeof window.PawPalAuth.saveCurrentUser === "function"
            ) {

                window.PawPalAuth.saveCurrentUser(
                    currentUser
                );

            } else {

                localStorage.setItem(
                    "pawpal-current-user",
                    JSON.stringify(currentUser)
                );
            }


            /* =============================================
               REMEMBER ME
            ============================================= */

            if (rememberMe) {

                if (rememberMe.checked) {

                    localStorage.setItem(
                        "pawpalRememberMe",
                        "true"
                    );

                } else {

                    localStorage.removeItem(
                        "pawpalRememberMe"
                    );
                }
            }


            /* =============================================
               SUCCESS MESSAGE
            ============================================= */

            showMessage(
                `Welcome back, ${currentUser.name}! 🐾`,
                "success"
            );


            /* =============================================
               DASHBOARD
            ============================================= */

            const dashboard =
                getDashboardPath(
                    currentUser.role
                );


            console.log(
                "PawPal: Redirecting to:",
                dashboard
            );


            /* =============================================
               REDIRECT
            ============================================= */

            setTimeout(function () {

                window.location.href = dashboard;

            }, 700);


        } catch (error) {

            console.error(
                "PawPal Login Exception:",
                error
            );

            showMessage(
                error?.message ||
                "Something went wrong while logging in. Please try again.",
                "error"
            );

        } finally {

            /*
             * Re-enable button after a short delay.
             */
            setTimeout(function () {

                if (document.visibilityState === "visible") {
                    setLoading(false);
                }

            }, 1000);
        }

    });


    /* =====================================================
       AUTO FOCUS
    ===================================================== */

    if (
        emailInput &&
        !emailInput.value
    ) {

        emailInput.focus();
    }


    /* =====================================================
       REGISTERED MESSAGE
    ===================================================== */

    const urlParams =
        new URLSearchParams(window.location.search);

    if (
        urlParams.get("registered") === "true"
    ) {

        showMessage(
            "Account created successfully! Please log in with your new account. 🐾",
            "success"
        );
    }

});



