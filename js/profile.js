document.addEventListener("DOMContentLoaded", async () => {

    try {

        // Get the currently logged-in user
        const {
            data: { user },
            error: userError
        } = await supabaseClient.auth.getUser();


        if (userError) {
            console.error("Error getting user:", userError);
            return;
        }


        // No user is logged in
        if (!user) {
            console.log("No user is currently logged in.");
            return;
        }


        console.log("Logged-in user:", user);


        // Get the user's profile
        const {
            data: profile,
            error: profileError
        } = await supabaseClient
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();


        if (profileError) {
            console.error(
                "Error loading profile:",
                profileError
            );
            return;
        }


        console.log("User profile:", profile);


    } catch (error) {

        console.error(
            "Profile loading error:",
            error
        );

    }

});