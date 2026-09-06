document.addEventListener("DOMContentLoaded", async function () {

    /* =====================================================
       PAWPAL ADOPTION APPLICATION STATUS
       SUPABASE VERSION
    ===================================================== */

    const toast =
        document.getElementById("statusToast");

    const updateButton =
        document.getElementById("updateButton");

    const helpButton =
        document.getElementById("helpButton");


    /* =====================================================
       SUPABASE CHECK
    ===================================================== */

    if (!window.supabase) {

        console.error(
            "Supabase library was not loaded."
        );

        showToast(
            "Unable to connect to PawPal database."
        );

        return;
    }


    /* =====================================================
       SUPABASE CLIENT
       -----------------------------------------------------
       Make sure supabase-config.js is loaded BEFORE this
       file if you are using a shared supabaseClient.
    ===================================================== */

    let supabaseClient =
        window.supabaseClient;


    /*
     * If supabaseClient does not already exist,
     * create it here.
     */

    if (!supabaseClient) {

        const SUPABASE_URL =
            "https://ejyjcmdfhzohwzbatswl.supabase.co";

        const SUPABASE_KEY =
            "sb_publishable_2knQMrwM9VhMbhlV4EiXzg_GdQGEMN5";

        supabaseClient =
            window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_KEY
            );

    }


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


        toast.classList.add("show");


        clearTimeout(
            window.pawpalStatusToast
        );


        window.pawpalStatusToast =
            setTimeout(function () {

                toast.classList.remove(
                    "show"
                );

            }, 2800);

    }


    /* =====================================================
       GET CURRENT PAWPAL USER
       -----------------------------------------------------
       Your existing auth.js stores the logged-in user in:

       pawpal-current-user
    ===================================================== */

    function getCurrentUser() {

        try {

            return JSON.parse(
                localStorage.getItem(
                    "pawpal-current-user"
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


    const currentUser =
        getCurrentUser();


    /* =====================================================
       REQUIRE LOGIN
    ===================================================== */

    if (!currentUser) {

        showToast(
            "Please log in to view your adoption applications."
        );


        setTimeout(function () {

            window.location.href =
                "login.html";

        }, 1000);


        return;

    }


    console.log(
        "Current PawPal user:",
        currentUser
    );


    /* =====================================================
       GET PET FROM URL
       -----------------------------------------------------
       Example:

       adoption-status.html?pet=123

       The value is treated as the pet ID.
    ===================================================== */

    const params =
        new URLSearchParams(
            window.location.search
        );


    const petId =
        params.get("pet");


    /* =====================================================
       LOAD APPLICATION
    ===================================================== */

    async function loadApplication() {

        try {

            let query =
                supabaseClient
                    .from("adoption_applications")
                    .select(`
                        id,
                        pet_id,
                        adopter_id,
                        status,
                        message,
                        created_at,
                        updated_at,
                        pets (
                            id,
                            name,
                            animal_type,
                            breed,
                            age,
                            gender,
                            rescue_location,
                            image_url,
                            status
                        )
                    `)
                    .eq(
                        "adopter_id",
                        currentUser.id
                    );


            /*
             * If a pet ID exists in the URL,
             * show the application for that pet.
             */

            if (petId) {

                query =
                    query.eq(
                        "pet_id",
                        petId
                    );

            }


            /*
             * Newest application first.
             */

            query =
                query.order(
                    "created_at",
                    {
                        ascending: false
                    }
                );


            const {
                data,
                error
            } = await query;


            if (error) {

                console.error(
                    "Supabase application error:",
                    error
                );

                showToast(
                    "Unable to load your adoption application."
                );

                return;

            }


            if (!data || data.length === 0) {

                showNoApplication();

                return;

            }


            /*
             * Use the first matching application.
             */

            const application =
                data[0];


            console.log(
                "Loaded adoption application:",
                application
            );


            updateApplicationDisplay(
                application
            );


            updateProgress(
                application.status
            );


            updateCurrentStatus(
                application
            );


            updateTimeline(
                application
            );


            updateApplicationDetails(
                application
            );


        } catch (error) {

            console.error(
                "Unexpected application loading error:",
                error
            );

            showToast(
                "Something went wrong while loading your application."
            );

        }

    }


    /* =====================================================
       FORMAT STATUS
    ===================================================== */

    function formatStatus(status) {

        const normalized =
            String(status || "")
                .trim()
                .toLowerCase()
                .replace(/_/g, " ");


        const statusMap = {

            pending:
                "Application Under Review",

            under_review:
                "Application Under Review",

            "under review":
                "Application Under Review",

            home_verification:
                "Home Verification",

            "home verification":
                "Home Verification",

            meet_greet:
                "Meet & Greet",

            "meet & greet":
                "Meet & Greet",

            approved:
                "Adoption Approved",

            adoption_approved:
                "Adoption Approved",

            completed:
                "Adoption Completed",

            adoption_completed:
                "Adoption Completed",

            rejected:
                "Application Rejected",

            cancelled:
                "Application Cancelled"

        };


        return (
            statusMap[normalized] ||
            (
                status
                    ? String(status)
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, function (letter) {
                            return letter.toUpperCase();
                        })
                    : "Application Under Review"
            )
        );

    }


    /* =====================================================
       STATUS KEY
    ===================================================== */

    function getStatusKey(status) {

        return String(status || "")
            .trim()
            .toLowerCase()
            .replace(/_/g, " ");

    }


    /* =====================================================
       UPDATE BASIC APPLICATION INFORMATION
    ===================================================== */

    function updateApplicationDisplay(
        application
    ) {

        const pet =
            application.pets || {};


        /*
         * Pet name
         */

        document
            .querySelectorAll(
                "[data-pet-name]"
            )
            .forEach(function (element) {

                element.textContent =
                    pet.name || "Pet";

            });


        /*
         * Application ID
         */

        document
            .querySelectorAll(
                "[data-application-id]"
            )
            .forEach(function (element) {

                element.textContent =
                    formatApplicationId(
                        application.id
                    );

            });


        /*
         * Status
         */

        document
            .querySelectorAll(
                "[data-application-status]"
            )
            .forEach(function (element) {

                element.textContent =
                    formatStatus(
                        application.status
                    );

            });


        /*
         * Pet image
         */

        const petImage =
            document.querySelector(
                ".application-pet-image img"
            );


        if (petImage) {

            if (pet.image_url) {

                petImage.src =
                    pet.image_url;

            }


            petImage.alt =
                pet.name ||
                "Adoptable pet";

        }


        /*
         * Pet heading
         */

        const petHeading =
            document.querySelector(
                ".application-pet-info h2"
            );


        if (petHeading) {

            petHeading.textContent =
                pet.name || "Pet";

        }


        /*
         * Breed / age / gender
         */

        const petDescription =
            document.querySelector(
                ".application-pet-info p"
            );


        if (petDescription) {

            const details = [];

            if (pet.breed) {
                details.push(pet.breed);
            }

            if (pet.age) {
                details.push(pet.age);
            }

            if (pet.gender) {
                details.push(pet.gender);
            }


            petDescription.textContent =
                details.join(" · ");

        }


        /*
         * Location
         */

        const locationElement =
            document.querySelector(
                ".application-location"
            );


        if (locationElement) {

            locationElement.textContent =
                pet.rescue_location
                    ? "📍 " + pet.rescue_location
                    : "";

        }


        /*
         * Current status in summary
         */

        const currentStatusText =
            document.querySelector(
                ".current-status-text"
            );


        if (currentStatusText) {

            currentStatusText.textContent =
                formatStatus(
                    application.status
                );

        }


        /*
         * Submitted date
         */

        const detailItems =
            document.querySelectorAll(
                ".application-detail"
            );


        detailItems.forEach(function (item) {

            const label =
                item.querySelector("span");

            const value =
                item.querySelector("strong");


            if (!label || !value) {
                return;
            }


            const text =
                label.textContent
                    .trim()
                    .toLowerCase();


            if (text === "application id") {

                value.textContent =
                    formatApplicationId(
                        application.id
                    );

            }


            if (text === "submitted") {

                value.textContent =
                    formatDate(
                        application.created_at
                    );

            }


            if (text === "current status") {

                value.textContent =
                    formatStatus(
                        application.status
                    );

            }

        });

    }


    /* =====================================================
       FORMAT APPLICATION ID
    ===================================================== */

    function formatApplicationId(id) {

        if (!id) {
            return "Application";
        }


        /*
         * Supabase ID is UUID.
         * Keep it readable while preserving the actual ID.
         */

        return "#" + id;

    }


    /* =====================================================
       FORMAT DATE
    ===================================================== */

    function formatDate(dateValue) {

        if (!dateValue) {
            return "—";
        }


        const date =
            new Date(dateValue);


        if (Number.isNaN(
            date.getTime()
        )) {

            return "—";

        }


        return date.toLocaleDateString(
            "en-US",
            {
                month: "long",
                day: "numeric",
                year: "numeric"
            }
        );

    }


    /* =====================================================
       FORMAT DATE + TIME
    ===================================================== */

    function formatDateTime(dateValue) {

        if (!dateValue) {
            return "";
        }


        const date =
            new Date(dateValue);


        if (Number.isNaN(
            date.getTime()
        )) {

            return "";

        }


        return date.toLocaleDateString(
            "en-US",
            {
                month: "long",
                day: "numeric",
                year: "numeric"
            }
        ) +
        " · " +
        date.toLocaleTimeString(
            "en-US",
            {
                hour: "numeric",
                minute: "2-digit"
            }
        );

    }


    /* =====================================================
       PROGRESS
    ===================================================== */

    function getProgress(status) {

        const key =
            getStatusKey(status);


        switch (key) {

            case "pending":
            case "under review":
                return 20;


            case "home verification":
                return 50;


            case "meet greet":
            case "meet & greet":
                return 67;


            case "approved":
            case "adoption approved":
                return 83;


            case "completed":
            case "adoption completed":
                return 100;


            case "rejected":
            case "cancelled":
                return 0;


            default:
                return 20;

        }

    }


    function updateProgress(status) {

        const percentage =
            getProgress(status);


        const percentageElement =
            document.querySelector(
                ".progress-percentage"
            );


        if (percentageElement) {

            percentageElement.textContent =
                percentage + "%";

        }


        const progressFill =
            document.querySelector(
                ".progress-fill"
            );


        if (progressFill) {

            progressFill.style.width =
                percentage + "%";

        }

    }


    /* =====================================================
       CURRENT STATUS CARD
    ===================================================== */

    function updateCurrentStatus(
        application
    ) {

        const status =
            formatStatus(
                application.status
            );


        const currentStatusHeading =
            document.querySelector(
                ".current-status-content h2"
            );


        if (currentStatusHeading) {

            currentStatusHeading.textContent =
                status;

        }


        const currentStatusLabel =
            document.querySelector(
                ".current-status-label"
            );


        if (currentStatusLabel) {

            currentStatusLabel.textContent =
                "CURRENT STEP";

        }


        const updateDate =
            document.querySelector(
                ".current-status-update strong"
            );


        if (updateDate) {

            updateDate.textContent =
                formatDate(
                    application.updated_at ||
                    application.created_at
                );

        }


        const indicator =
            document.querySelector(
                ".current-status-indicator"
            );


        if (indicator) {

            const key =
                getStatusKey(
                    application.status
                );


            if (
                key === "approved" ||
                key === "adoption approved"
            ) {

                indicator.innerHTML =
                    "<span></span> Approved";

            } else if (
                key === "completed" ||
                key === "adoption completed"
            ) {

                indicator.innerHTML =
                    "<span></span> Completed";

            } else if (
                key === "rejected"
            ) {

                indicator.innerHTML =
                    "<span></span> Rejected";

            } else {

                indicator.innerHTML =
                    "<span></span> In progress";

            }

        }


        /*
         * Update description.
         */

        const description =
            document.querySelector(
                ".current-status-content > p"
            );


        if (description) {

            const petName =
                application.pets &&
                application.pets.name
                    ? application.pets.name
                    : "your pet";


            const key =
                getStatusKey(
                    application.status
                );


            if (key === "pending") {

                description.textContent =
                    "Your adoption application has been submitted and is waiting for the shelter to review it.";

            } else if (
                key === "under review"
            ) {

                description.textContent =
                    "The shelter is currently reviewing your adoption application.";

            } else if (
                key === "home verification"
            ) {

                description.textContent =
                    "The shelter is reviewing your home environment to make sure " +
                    petName +
                    " will have a safe, comfortable and loving place to live.";

            } else if (
                key === "meet greet" ||
                key === "meet & greet"
            ) {

                description.textContent =
                    "Your next step is to meet " +
                    petName +
                    " and spend some time getting to know each other.";

            } else if (
                key === "approved" ||
                key === "adoption approved"
            ) {

                description.textContent =
                    "Great news! Your adoption application has been approved.";

            } else if (
                key === "completed" ||
                key === "adoption completed"
            ) {

                description.textContent =
                    petName +
                    " has officially become part of your family. ❤️";

            } else if (
                key === "rejected"
            ) {

                description.textContent =
                    "The shelter has decided not to approve this adoption application.";

            } else {

                description.textContent =
                    "Your adoption application is being processed by the shelter.";

            }

        }

    }


    /* =====================================================
       TIMELINE
    ===================================================== */

    function updateTimeline(
        application
    ) {

        const status =
            getStatusKey(
                application.status
            );


        const steps =
            document.querySelectorAll(
                ".timeline-step"
            );


        if (!steps.length) {
            return;
        }


        /*
         * Timeline order:
         *
         * 0 = submitted
         * 1 = under review
         * 2 = home verification
         * 3 = meet & greet
         * 4 = approved
         * 5 = completed
         */

        let currentIndex = 0;


        switch (status) {

            case "pending":

                currentIndex = 0;

                break;


            case "under review":

                currentIndex = 1;

                break;


            case "home verification":

                currentIndex = 2;

                break;


            case "meet greet":
            case "meet & greet":

                currentIndex = 3;

                break;


            case "approved":
            case "adoption approved":

                currentIndex = 4;

                break;


            case "completed":
            case "adoption completed":

                currentIndex = 5;

                break;


            case "rejected":

                currentIndex = 1;

                break;


            default:

                currentIndex = 0;

        }


        steps.forEach(function (
            step,
            index
        ) {

            step.classList.remove(
                "completed",
                "active",
                "upcoming"
            );


            const marker =
                step.querySelector(
                    ".timeline-marker span"
                );


            const statusLabel =
                step.querySelector(
                    ".timeline-status"
                );


            if (index < currentIndex) {

                step.classList.add(
                    "completed"
                );


                if (marker) {

                    marker.textContent =
                        "✓";

                }


                if (statusLabel) {

                    statusLabel.textContent =
                        "Completed";

                    statusLabel.className =
                        "timeline-status completed-label";

                }

            } else if (
                index === currentIndex
            ) {

                step.classList.add(
                    "active"
                );


                if (statusLabel) {

                    statusLabel.textContent =
                        "In Progress";

                    statusLabel.className =
                        "timeline-status active-label";

                }

            } else {

                step.classList.add(
                    "upcoming"
                );


                if (statusLabel) {

                    statusLabel.textContent =
                        "Upcoming";

                    statusLabel.className =
                        "timeline-status upcoming-label";

                }

            }

        });


        /*
         * Update pet name inside timeline text.
         */

        const petName =
            application.pets &&
            application.pets.name
                ? application.pets.name
                : "your pet";


        const timelineParagraphs =
            document.querySelectorAll(
                ".timeline-content p"
            );


        timelineParagraphs.forEach(function (
            paragraph
        ) {

            paragraph.textContent =
                paragraph.textContent.replace(
                    /Bruno/g,
                    petName
                );

        });


        /*
         * Update first timeline date.
         */

        if (steps[0]) {

            const dateElement =
                steps[0].querySelector(
                    ".timeline-date"
                );


            if (dateElement) {

                dateElement.textContent =
                    formatDateTime(
                        application.created_at
                    );

            }

        }


        /*
         * Update active step date.
         */

        if (
            steps[currentIndex]
        ) {

            const dateElement =
                steps[currentIndex]
                    .querySelector(
                        ".timeline-date"
                    );


            if (dateElement) {

                if (currentIndex === 0) {

                    dateElement.textContent =
                        formatDateTime(
                            application.created_at
                        );

                } else {

                    dateElement.textContent =
                        "Last updated " +
                        formatDate(
                            application.updated_at ||
                            application.created_at
                        );

                }

            }

        }

    }


    /* =====================================================
       APPLICATION DETAILS
    ===================================================== */

    function updateApplicationDetails(
        application
    ) {

        const pet =
            application.pets || {};


        const infoItems =
            document.querySelectorAll(
                ".info-item"
            );


        infoItems.forEach(function (item) {

            const label =
                item.querySelector("span");

            const value =
                item.querySelector("strong");


            if (!label || !value) {
                return;
            }


            const text =
                label.textContent
                    .trim()
                    .toLowerCase();


            switch (text) {

                case "pet":

                    value.textContent =
                        pet.name || "—";

                    break;


                case "application date":

                    value.textContent =
                        formatDate(
                            application.created_at
                        );

                    break;


                case "application status":

                    value.textContent =
                        formatStatus(
                            application.status
                        );

                    break;

            }

        });


        /*
         * Applicant information comes from the
         * logged-in PawPal user.
         */

        const applicantItems =
            document.querySelectorAll(
                ".info-item"
            );


        applicantItems.forEach(function (
            item
        ) {

            const label =
                item.querySelector("span");

            const value =
                item.querySelector("strong");


            if (!label || !value) {
                return;
            }


            const text =
                label.textContent
                    .trim()
                    .toLowerCase();


            if (text === "applicant") {

                value.textContent =
                    currentUser.name ||
                    "PawPal User";

            }


            if (text === "email") {

                value.textContent =
                    currentUser.email ||
                    "—";

            }


        });

    }


    /* =====================================================
       NO APPLICATION
    ===================================================== */

    function showNoApplication() {

        console.warn(
            "No adoption application found."
        );


        const heading =
            document.querySelector(
                ".status-heading h1"
            );


        if (heading) {

            heading.textContent =
                "No application found";

        }


        const description =
            document.querySelector(
                ".status-heading p"
            );


        if (description) {

            description.textContent =
                "We couldn't find an adoption application associated with this account.";

        }


        showToast(
            "No adoption application found."
        );

    }


    /* =====================================================
       CHECK FOR UPDATES
    ===================================================== */

    if (updateButton) {

        updateButton.addEventListener(
            "click",
            async function () {

                updateButton.disabled =
                    true;


                updateButton.textContent =
                    "Checking...";


                try {

                    /*
                     * Reload the page data from Supabase.
                     */

                    await loadApplication();


                    showToast(
                        "Your application status is up to date. 🐾"
                    );


                } catch (error) {

                    console.error(
                        "Update check failed:",
                        error
                    );


                    showToast(
                        "Unable to check for updates."
                    );

                }


                updateButton.disabled =
                    false;


                updateButton.textContent =
                    "Check for Updates";

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
        function (
            step,
            index
        ) {

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
       LOAD REAL APPLICATION
    ===================================================== */

    await loadApplication();


    /* =====================================================
       CONSOLE
    ===================================================== */

    console.log(
        "PawPal Supabase adoption status loaded."
    );

});