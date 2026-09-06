document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("loginForm");
    const emailInput = document.getElementById("loginEmail");
    const passwordInput = document.getElementById("loginPassword");
    const rememberMe = document.getElementById("rememberMe");
    const loginButton = document.getElementById("loginButton");
    const loginMessage = document.getElementById("loginMessage");
    const togglePassword = document.getElementById("togglePassword");


    // ==========================================
    // SHOW / HIDE PASSWORD
    // ==========================================

    if (togglePassword) {

        togglePassword.addEventListener("click", () => {

            if (passwordInput.type === "password") {

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


    // ==========================================
    // MESSAGE FUNCTION
    // ==========================================

    function showMessage(message, type) {

        if (!loginMessage) return;

        loginMessage.textContent = message;

        loginMessage.className = "login-message";

        if (type === "error") {
            loginMessage.classList.add("error");
        }

        if (type === "success") {
            loginMessage.classList.add("success");
        }

    }


    // ==========================================
    // LOGIN
    // ==========================================

    if (loginForm) {

        loginForm.addEventListener("submit", async (event) => {

            event.preventDefault();


            const email = emailInput.value.trim();
            const password = passwordInput.value;


            // Clear previous message

            showMessage("", "");


            // ======================================
            // BASIC VALIDATION
            // ======================================

            if (!email) {

                showMessage(
                    "Please enter your email address.",
                    "error"
                );

                emailInput.focus();

                return;

            }


            if (!password) {

                showMessage(
                    "Please enter your password.",
                    "error"
                );

                passwordInput.focus();

                return;

            }


            // ======================================
            // DISABLE BUTTON
            // ======================================

            loginButton.disabled = true;

            loginButton.innerHTML = `
                <span>Logging in...</span>
                <span>•</span>
            `;


            try {

                // ==================================
                // SUPABASE LOGIN
                // ==================================

                const { data, error } =
                    await supabaseClient.auth.signInWithPassword({

                        email: email,
                        password: password

                    });


                // ==================================
                // LOGIN ERROR
                // ==================================

                if (error) {

                    console.error("Login error:", error);

                    showMessage(
                        getLoginErrorMessage(error),
                        "error"
                    );

                    loginButton.disabled = false;

                    loginButton.innerHTML = `
                        <span>Log In</span>
                        <span>→</span>
                    `;

                    return;

                }


                // ==================================
                // SUCCESS
                // ==================================

                console.log("Login successful:", data);

                const profile = data.user?.user_metadata || {};
                const displayName = [profile.first_name, profile.last_name]
                    .filter(Boolean)
                    .join(" ") || email.split("@")[0];

                localStorage.setItem("pawpal-current-user", JSON.stringify({
                    id: data.user.id,
                    name: displayName,
                    email: data.user.email,
                    role: profile.role || "adopter"
                }));

                showMessage(
                    "Login successful! Welcome back 🐾",
                    "success"
                );


                // ==================================
                // REMEMBER ME
                // ==================================

                if (rememberMe && rememberMe.checked) {

                    localStorage.setItem(
                        "pawpalRememberMe",
                        "true"
                    );

                } else {

                    localStorage.removeItem(
                        "pawpalRememberMe"
                    );

                }


                // ==================================
                // REDIRECT
                // ==================================

                setTimeout(() => {

                    window.location.href = "../index.html";

                }, 1000);


            } catch (error) {

                console.error(
                    "Unexpected login error:",
                    error
                );

                showMessage(
                    "Something went wrong. Please try again.",
                    "error"
                );

                loginButton.disabled = false;

                loginButton.innerHTML = `
                    <span>Log In</span>
                    <span>→</span>
                `;

            }

        });

    }


    // ==========================================
    // SUPABASE ERROR MESSAGES
    // ==========================================

    function getLoginErrorMessage(error) {

        const message =
            error?.message?.toLowerCase() || "";


        if (
            message.includes("invalid login credentials")
        ) {

            return "Incorrect email or password.";

        }


        if (
            message.includes("email not confirmed")
        ) {

            return "Please confirm your email before logging in.";

        }


        if (
            message.includes("too many requests")
        ) {

            return "Too many login attempts. Please wait a moment and try again.";

        }


        if (
            message.includes("network")
        ) {

            return "Network error. Please check your internet connection.";

        }


        return error?.message ||
            "Unable to log in. Please try again.";

    }

});