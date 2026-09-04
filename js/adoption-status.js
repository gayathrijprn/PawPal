document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       PAWPAL ADOPTION APPLICATION STATUS
       FRONTEND ONLY
    ====================================================== */


    /* =====================================================
       DEMO APPLICATION DATA
       
       This is temporary frontend data.
       Your friend can replace this with Supabase data later.
       ===================================================== */

    const applications = {

        bruno: {

            applicationId: "PP-2026-00124",

            petName: "Bruno",

            breed: "Golden Retriever",

            age: "2 years",

            gender: "Male",

            location: "Kochi",

            submitted: "August 30, 2026",

            shelter: "Happy Tails Shelter",

            status: "Home Verification",

            progress: 50

        },


        luna: {

            applicationId: "PP-2026-00118",

            petName: "Luna",

            breed: "Labrador",

            age: "1 year",

            gender: "Female",

            location: "Trivandrum",

            submitted: "August 25, 2026",

            shelter: "Paws & Care Foundation",

            status: "Approved",

            progress: 83

        }

    };


    /* =====================================================
       GET SELECTED PET
       ===================================================== */

    const params =
        new URLSearchParams(
            window.location.search
        );


    const selectedPet =
        (
            params.get("pet") ||
            "bruno"
        ).toLowerCase();


    const application =
        applications[selectedPet] ||
        applications.bruno;


    /* =====================================================
       ELEMENTS
       ===================================================== */

    const updateButton =
        document.getElementById(
            "updateButton"
        );


    const helpButton =
        document.getElementById(
            "helpButton"
        );


    const toast =
        document.getElementById(
            "statusToast"
        );


    /* =====================================================
       UPDATE BASIC APPLICATION INFORMATION
       ===================================================== */

    function updateApplicationDisplay() {

        const petNameElements =
            document.querySelectorAll(
                "[data-pet-name]"
            );


        petNameElements.forEach(
            function (element) {

                element.textContent =
                    application.petName;

            }
        );


        const applicationIdElements =
            document.querySelectorAll(
                "[data-application-id]"
            );


        applicationIdElements.forEach(
            function (element) {

                element.textContent =
                    application.applicationId;

            }
        );


        const statusElements =
            document.querySelectorAll(
                "[data-application-status]"
            );


        statusElements.forEach(
            function (element) {

                element.textContent =
                    application.status;

            }
        );

    }


    updateApplicationDisplay();


    /* =====================================================
       TOAST
       ===================================================== */

    function showToast(message) {

        if (!toast) {

            alert(message);

            return;

        }


        toast.textContent =
            message;


        toast.classList.add(
            "show"
        );


        clearTimeout(
            window.pawpalStatusToast
        );


        window.pawpalStatusToast =
            setTimeout(
                function () {

                    toast.classList.remove(
                        "show"
                    );

                },
                2800
            );

    }


    /* =====================================================
       CHECK FOR UPDATES
       ===================================================== */

    if (updateButton) {

        updateButton.addEventListener(
            "click",
            function () {

                updateButton.disabled =
                    true;


                updateButton.textContent =
                    "Checking...";


                setTimeout(
                    function () {

                        updateButton.disabled =
                            false;


                        updateButton.textContent =
                            "Check for Updates";


                        showToast(
                            application.petName +
                            "'s application is up to date. 🐾"
                        );

                    },
                    900
                );

            }
        );

    }


    /* =====================================================
       HELP BUTTON
       ===================================================== */

    if (helpButton) {

        helpButton.addEventListener(
            "click",
            function () {

                showToast(
                    "PawPal support will be connected here later. 💬"
                );

            }
        );

    }


    /* =====================================================
       TIMELINE ANIMATION
       ===================================================== */

    const timelineSteps =
        document.querySelectorAll(
            ".timeline-step"
        );


    timelineSteps.forEach(
        function (step, index) {

            step.style.opacity =
                "0";


            step.style.transform =
                "translateY(12px)";


            setTimeout(
                function () {

                    step.style.transition =
                        "opacity 0.4s ease, transform 0.4s ease";


                    step.style.opacity =
                        "1";


                    step.style.transform =
                        "translateY(0)";

                },
                100 + (
                    index * 100
                )
            );

        }
    );


    /* =====================================================
       APPLICATION DATA
       ===================================================== */

    console.log(
        "PawPal adoption status loaded:",
        application
    );

});