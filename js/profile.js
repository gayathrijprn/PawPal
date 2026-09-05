document.addEventListener("DOMContentLoaded", async () => {

    const authNav = document.getElementById("authNav");
    const loginNavButton =
        document.getElementById("loginNavButton");
    const signupNavButton =
        document.getElementById("signupNavButton");

    if (!authNav) {
        return;
    }


    // =====================================================
    // GET CURRENT SUPABASE SESSION
    // =====================================================

    const {
        data: { session },
        error
    } = await supabaseClient.auth.getSession();


    if (error) {

        console.error(
            "Error getting Supabase session:",
            error
        );

        return;
    }


    // =====================================================
    // USER IS LOGGED IN
    // =====================================================

    if (session && session.user) {

        const user = session.user;

        const metadata = user.user_metadata || {};


        // Get the registered first name

        const firstName =
            metadata.first_name ||
            metadata.full_name ||
            metadata.name ||
            user.email?.split("@")[0] ||
            "there";


        // =================================================
        // REMOVE LOGIN / SIGN UP BUTTONS
        // =================================================

        if (loginNavButton) {
            loginNavButton.remove();
        }

        if (signupNavButton) {
            signupNavButton.remove();
        }


        // =================================================
        // WELCOME MESSAGE
        // =================================================

        const welcome =
            document.createElement("span");

        welcome.className =
            "welcome-user";

        welcome.textContent =
            `Welcome back, ${firstName} 🐾`;


        // =================================================
        // LOGOUT BUTTON
        // =================================================

        const logoutButton =
            document.createElement("button");

        logoutButton.type = "button";

        logoutButton.className =
            "nav-button";

        logoutButton.id =
            "logoutNavButton";

        logoutButton.innerHTML = `
            Log out
            <span>→</span>
        `;


        // =================================================
        // LOGOUT FUNCTION
        // =================================================

        logoutButton.addEventListener(
            "click",
            async () => {

                logoutButton.disabled = true;

                logoutButton.innerHTML =
                    "Logging out...";


                const { error } =
                    await supabaseClient.auth.signOut();


                if (error) {

                    console.error(
                        "Logout error:",
                        error
                    );

                    logoutButton.disabled = false;

                    logoutButton.innerHTML = `
                        Log out
                        <span>→</span>
                    `;

                    return;
                }


                // User is logged out.
                // Refresh the page so the navbar
                // returns to Log in / Get Started.

                window.location.reload();

            }
        );


        // =================================================
        // ADD LOGGED-IN NAVIGATION
        // =================================================

        authNav.appendChild(welcome);
        authNav.appendChild(logoutButton);

    }

});