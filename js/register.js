
// =====================================================
// PAWPAL — REGISTER
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    // =================================================
    // GET ELEMENTS
    // =================================================

    const form = document.getElementById("registerForm");
    const message = document.getElementById("registerMessage");

    const passwordInput =
        document.getElementById("registerPassword");

    const confirmPasswordInput =
        document.getElementById("confirmPassword");

    const passwordToggle =
        document.getElementById("passwordToggle");

    const submitButton =
        form
            ? form.querySelector(".register-submit")
            : null;


    // =================================================
    // SAFETY CHECK
    // =================================================

    if (!form) {
        console.error("PawPal: registerForm was not found.");
        return;
    }

    if (!message) {
        console.error("PawPal: registerMessage was not found.");
        return;
    }


    // =================================================
    // PASSWORD SHOW / HIDE
    // =================================================

    if (
        passwordToggle &&
        passwordInput &&
        confirmPasswordInput
    ) {

        passwordToggle.addEventListener(
            "click",
            function () {

                const isPassword =
                    passwordInput.type === "password";

                passwordInput.type =
                    isPassword
                        ? "text"
                        : "password";

                confirmPasswordInput.type =
                    isPassword
                        ? "text"
                        : "password";

                passwordToggle.textContent =
                    isPassword
                        ? "🙈"
                        : "👁️";

                passwordToggle.setAttribute(
                    "aria-label",
                    isPassword
                        ? "Hide password"
                        : "Show password"
                );

            }
        );

    }


    // =================================================
    // SHOW MESSAGE
    // =================================================

    function showMessage(text, type) {

        message.textContent = text;

        message.className =
            "register-message " + type;

        message.style.display =
            "block";

    }


    // =================================================
    // HIDE MESSAGE
    // =================================================

    function hideMessage() {

        message.textContent = "";

        message.className =
            "register-message";

        message.style.display =
            "none";

    }


    // =================================================
    // FORM SUBMIT
    // =================================================

    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            hideMessage();


            // =============================================
            // GET FORM VALUES
            // =============================================

            const firstNameElement =
                document.getElementById("firstName");

            const lastNameElement =
                document.getElementById("lastName");

            const emailElement =
                document.getElementById("registerEmail");

            const phoneElement =
                document.getElementById("phone");

            const termsElement =
                document.getElementById("terms");


            if (
                !firstNameElement ||
                !lastNameElement ||
                !emailElement ||
                !phoneElement ||
                !termsElement ||
                !passwordInput ||
                !confirmPasswordInput
            ) {

                console.error(
                    "PawPal: One or more registration fields are missing."
                );

                showMessage(
                    "Registration form could not be loaded correctly. Please refresh the page.",
                    "error"
                );

                return;
            }


            const firstName =
                firstNameElement.value.trim();

            const lastName =
                lastNameElement.value.trim();

            const email =
                emailElement.value
                    .trim()
                    .toLowerCase();

            const phone =
                phoneElement.value.trim();

            const password =
                passwordInput.value;

            const confirmPassword =
                confirmPasswordInput.value;

            const terms =
                termsElement.checked;


            // =============================================
            // GET SELECTED ROLE
            // =============================================

            const selectedRole =
                document.querySelector(
                    'input[name="role"]:checked'
                );

            const role =
                selectedRole
                    ? selectedRole.value
                    : "adopter";


            // =============================================
            // REQUIRED FIELD VALIDATION
            // =============================================

            if (
                !firstName ||
                !lastName ||
                !email ||
                !password ||
                !confirmPassword
            ) {

                showMessage(
                    "Please fill in all required fields.",
                    "error"
                );

                return;
            }


            // =============================================
            // NAME VALIDATION
            // =============================================

            if (
                firstName.length < 2 ||
                lastName.length < 2
            ) {

                showMessage(
                    "Please enter your valid first and last name.",
                    "error"
                );

                return;
            }


            // =============================================
            // EMAIL VALIDATION
            // =============================================

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (
                !emailPattern.test(email)
            ) {

                showMessage(
                    "Please enter a valid email address.",
                    "error"
                );

                return;
            }


            // =============================================
            // PHONE VALIDATION
            // =============================================

            if (phone) {

                const phonePattern =
                    /^[0-9+\-\s()]{7,20}$/;

                if (!phonePattern.test(phone)) {

                    showMessage(
                        "Please enter a valid phone number.",
                        "error"
                    );

                    return;
                }

            }


            // =============================================
            // PASSWORD VALIDATION
            // =============================================

            if (password.length < 6) {

                showMessage(
                    "Password must contain at least 6 characters.",
                    "error"
                );

                return;
            }


            if (password !== confirmPassword) {

                showMessage(
                    "Passwords do not match.",
                    "error"
                );

                return;
            }


            // =============================================
            // TERMS VALIDATION
            // =============================================

            if (!terms) {

                showMessage(
                    "Please agree to the Terms of Service and Privacy Policy.",
                    "error"
                );

                return;
            }


            // =============================================
            // CHECK SUPABASE
            // =============================================

            if (
                typeof supabaseClient === "undefined" ||
                !supabaseClient
            ) {

                console.error(
                    "PawPal: supabaseClient is unavailable."
                );

                showMessage(
                    "Unable to connect to PawPal. Please check your Supabase configuration.",
                    "error"
                );

                return;
            }


            // =============================================
            // DISABLE SUBMIT BUTTON
            // =============================================

            if (submitButton) {

                submitButton.disabled =
                    true;

                submitButton.textContent =
                    "Creating account...";

            }


            try {

                // =========================================
                // SUPABASE SIGN UP
                // =========================================

                const response =
                    await supabaseClient.auth.signUp({

                        email: email,

                        password: password,

                        options: {

                            data: {

                                first_name:
                                    firstName,

                                last_name:
                                    lastName,

                                full_name:
                                    `${firstName} ${lastName}`.trim(),

                                phone:
                                    phone,

                                role:
                                    role

                            }

                        }

                    });


                const data =
                    response.data;

                const error =
                    response.error;


                // =========================================
                // SUPABASE ERROR
                // =========================================

                if (error) {

                    console.error(
                        "PawPal Supabase registration error:",
                        error
                    );


                    let errorMessage =
                        error.message ||
                        "Unable to create your account.";


                    const lowerMessage =
                        errorMessage.toLowerCase();


                    // Duplicate account

                    if (
                        lowerMessage.includes(
                            "already registered"
                        ) ||
                        lowerMessage.includes(
                            "already exists"
                        ) ||
                        lowerMessage.includes(
                            "user already registered"
                        )
                    ) {

                        errorMessage =
                            "An account with this email already exists. Please log in instead.";

                    }


                    showMessage(
                        errorMessage,
                        "error"
                    );

                    return;
                }


                // =========================================
                // SUCCESS
                // =========================================

                console.log(
                    "PawPal registration successful:",
                    data
                );


                /*
                 * IMPORTANT
                 *
                 * We DO NOT create a localStorage
                 * login here.
                 *
                 * Registration and login are separate.
                 *
                 * The user must log in through the
                 * login page before PawPal treats them
                 * as authenticated.
                 */


                // =========================================
                // CHECK WHETHER EMAIL VERIFICATION IS NEEDED
                // =========================================

                if (
                    data &&
                    data.user &&
                    !data.session
                ) {

                    showMessage(
                        "Account created successfully! 🎉 Please check your email, verify your account, and then log in.",
                        "success"
                    );

                } else {

                    showMessage(
                        "Account created successfully! 🎉 Redirecting to login...",
                        "success"
                    );

                }


                // =========================================
                // RESET FORM
                // =========================================

                form.reset();


                // Restore adopter as default role

                const adopterRole =
                    document.getElementById("adopter");

                if (adopterRole) {

                    adopterRole.checked =
                        true;

                }


                // Reset password visibility

                if (passwordInput) {

                    passwordInput.type =
                        "password";

                }

                if (confirmPasswordInput) {

                    confirmPasswordInput.type =
                        "password";

                }

                if (passwordToggle) {

                    passwordToggle.textContent =
                        "👁️";

                    passwordToggle.setAttribute(
                        "aria-label",
                        "Show password"
                    );

                }


                // =========================================
                // REDIRECT TO LOGIN
                // =========================================

                setTimeout(
                    function () {

                        window.location.href =
                            "login.html?registered=true";

                    },
                    1800
                );

            }


            // =============================================
            // CATCH UNEXPECTED ERROR
            // =============================================

            catch (error) {

                console.error(
                    "PawPal registration error:",
                    error
                );

                showMessage(
                    error &&
                    error.message
                        ? error.message
                        : "Something went wrong. Please try again.",
                    "error"
                );

            }


            // =============================================
            // RESTORE BUTTON
            // =============================================

            finally {

                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.innerHTML =
                        "Create my PawPal account &nbsp; →";

                }

            }

        }
    );

});
