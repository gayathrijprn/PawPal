const form = document.getElementById("registerForm");
const message = document.getElementById("registerMessage");

const passwordInput =
    document.getElementById("registerPassword");

const confirmPasswordInput =
    document.getElementById("confirmPassword");

const passwordToggle =
    document.getElementById("passwordToggle");


// =====================================================
// PASSWORD SHOW / HIDE
// =====================================================

passwordToggle.addEventListener("click", () => {

    const isPassword =
        passwordInput.type === "password";

    passwordInput.type =
        isPassword ? "text" : "password";

    confirmPasswordInput.type =
        isPassword ? "text" : "password";

    passwordToggle.textContent =
        isPassword ? "🙈" : "👁️";

});


// =====================================================
// MESSAGE
// =====================================================

function showMessage(text, type) {

    message.textContent = text;

    message.className =
        "register-message " + type;

    message.style.display = "block";

}


// =====================================================
// REGISTER
// =====================================================

form.addEventListener("submit", async (event) => {

    event.preventDefault();

    message.style.display = "none";


    // -----------------------------------------------
    // GET VALUES
    // -----------------------------------------------

    const firstName =
        document.getElementById("firstName").value.trim();

    const lastName =
        document.getElementById("lastName").value.trim();

    const email =
        document.getElementById("registerEmail").value.trim();

    const phone =
        document.getElementById("phone").value.trim();

    const password =
        passwordInput.value;

    const confirmPassword =
        confirmPasswordInput.value;

    const terms =
        document.getElementById("terms").checked;


    const selectedRole =
        document.querySelector(
            'input[name="role"]:checked'
        );

    const role =
        selectedRole ? selectedRole.value : "adopter";


    // -----------------------------------------------
    // VALIDATION
    // -----------------------------------------------

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


    if (!terms) {

        showMessage(
            "Please agree to the Terms of Service and Privacy Policy.",
            "error"
        );

        return;
    }


    // -----------------------------------------------
    // DISABLE BUTTON
    // -----------------------------------------------

    const submitButton =
        form.querySelector(".register-submit");

    submitButton.disabled = true;

    submitButton.textContent =
        "Creating account...";


    try {

        // -------------------------------------------
        // SUPABASE SIGN UP
        // -------------------------------------------

        const { data, error } =
            await supabaseClient.auth.signUp({

                email: email,

                password: password,

                options: {

                    data: {

                        first_name: firstName,

                        last_name: lastName,

                        phone: phone,

                        role: role

                    }

                }

            });


        // -------------------------------------------
        // ERROR
        // -------------------------------------------

        if (error) {

            console.error(
                "Supabase registration error:",
                error
            );

            showMessage(
                error.message,
                "error"
            );

            return;
        }


        // -------------------------------------------
        // SUCCESS
        // -------------------------------------------

        console.log(
            "Registration successful:",
            data
        );

        if (data.user) {
            localStorage.setItem("pawpal-current-user", JSON.stringify({
                id: data.user.id,
                name: `${firstName} ${lastName}`.trim(),
                email: data.user.email,
                role: role
            }));
        }


        showMessage(
            "Account created successfully! 🎉 You can now log in.",
            "success"
        );


        form.reset();


        // Restore default role

        document.getElementById("adopter").checked = true;


    } catch (error) {

        console.error(
            "Registration error:",
            error
        );

        showMessage(
            "Something went wrong. Please try again.",
            "error"
        );

    } finally {

        submitButton.disabled = false;

        submitButton.innerHTML =
            "Create my PawPal account &nbsp; →";

    }

});