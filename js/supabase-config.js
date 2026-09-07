
/* =========================================================
   PAWPAL — SUPABASE CONFIGURATION
========================================================= */

const SUPABASE_URL =
    "https://ejyjcmdfhzohwzbatswl.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_2knQMrwM9VhMbhlV4EiXzg_GdQGEMN5";


/* =========================================================
   CREATE SUPABASE CLIENT
========================================================= */

if (
    typeof window.supabase === "undefined"
) {

    console.error(
        "PawPal: Supabase library was not loaded."
    );

} else {

    window.supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );

    console.log(
        "PawPal: Supabase client initialized successfully."
    );
}
