document.addEventListener("DOMContentLoaded", async function () {

    /* =====================================================
       PAWPAL ADOPTION APPLICATION STATUS
       -----------------------------------------------------
       Loads the logged-in adopter's application from Supabase.
    ===================================================== */


    /* =====================================================
       SUPABASE CHECK
    ===================================================== */

    if (!window.supabase) {

        console.error(
            "Supabase library is not loaded."
        );

        showToast(
            "Unable to connect to PawPal."
        );

        return;

    }


    /* =====================================================
       SUPABASE CLIENT
       -----------------------------------------------------
       IMPORTANT:
       This assumes supabaseClient is created globally
       before adoption-status.js is loaded.
    ===================================================== */

    if (!window.supabaseClient) {

        console.error(
            "supabaseClient is not available."
        );

        showToast(
            "Supabase connection is not configured."
        );

        return;

    }


    const supabaseClient =
        window.supabaseClient;


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
       GET CURRENT PAWPAL USER
       -----------------------------------------------------
       Your auth.js stores the logged-in user here.
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
       CHECK LOGIN
    ===================================================== */

    if (!currentUser) {

        showToast(
            "Please log in to view your adoption application."
        );


        setTimeout(function () {

            window.location.href =
                "login.html";

        }, 1000);


        return;

    }


    /* =====================================================
       ONLY ADOPTERS SHOULD SEE THIS PAGE
    ===================================================== */

    const userRole =
        String(
            currentUser.role || ""
        )
        .trim()
        .toLowerCase()
        .replace(
            /_/g,
            " "
        );


    if (
        userRole !== "adopter"
    ) {

        console.warn(
            "Current user is not an adopter."
        );

    }


    /* =====================================================
       GET OPTIONAL PET FROM URL
       -----------------------------------------------------
       Example:
       adoption-status.html?pet=12
    ===================================================== */

    const params =
        new URLSearchParams(
            window.location.search
        );


    const petIdFromUrl =
        params.get("pet");


    /* =====================================================
       APPLICATION VARIABLE
    ===================================================== */

    let application = null;


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
                        ),
                        profiles (
                            id,
                            full_name,
                            email,
                            phone,
                            role
                        )
                    `)
                    .eq(
                        "adopter_id",
                        currentUser.id
                    )
                    .order(
                        "created_at",
                        {
                            ascending: false
                        }
                    );


            /* ---------------------------------------------
               IF PET ID EXISTS IN URL
            --------------------------------------------- */

            if (petIdFromUrl) {

                const numericPetId =
                    Number(
                        petIdFromUrl
                    );


                if (
                    Number.isInteger(
                        numericPetId
                    )
                ) {

                    query =
                        query.eq(
                            "pet_id",
                            numericPetId
                        );

                }

            }


            const {
                data,
                error
            } =
                await query;


            if (error) {

                console.error(
                    "Supabase application error:",
                    error
                );

                showToast(
                    "Unable to load your application."
                );

                return;

            }


            if (
                !data ||
                data.length === 0
            ) {

                console.warn(
                    "No adoption application found."
                );


                showToast(
                    "No adoption application found for your account."
                );


                updateEmptyApplicationState();


                return;

            }


            /*
             * Use the newest application.
             */
            application =
                data[0];


            console.log(
                "PawPal application loaded:",
                application
            );


            updateApplicationDisplay();


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
       STATUS HELPERS
    ===================================================== */

    function normalizeStatus(status) {

        return String(
            status || "pending"
        )
        .trim()
        .toLowerCase()
        .replace(
            /[_-]/g,
            " "
        );

    }


    function getStatusInformation(status) {

        const normalized =
            normalizeStatus(
                status
            );


        const statusMap = {

            pending: {

                title:
                    "Application Submitted",

                icon:
                    "📩",

                description:
                    "Your adoption application has been submitted and is waiting for the shelter to review it."

            },


            submitted: {

                title:
                    "Application Submitted",

                icon:
                    "📩",

                description:
                    "Your adoption application has been successfully submitted to the shelter."

            },


            under_review: {

                title:
                    "Application Under Review",

                icon:
                    "🔍",

                description:
                    "The shelter is currently reviewing your adoption application."

            },


            "under review": {

                title:
                    "Application Under Review",

                icon:
                    "🔍",

                description:
                    "The shelter is currently reviewing your adoption application."

            },


            home_verification: {

                title:
                    "Home Verification",

                icon:
                    "🏠",

                description:
                    "The shelter is checking your living environment and adoption suitability."

            },


            "home verification": {

                title:
                    "Home Verification",

                icon:
                    "🏠",

                description:
                    "The shelter is checking your living environment and adoption suitability."

            },


            meet_greet: {

                title:
                    "Meet & Greet",

                icon:
                    "🐾",

                description:
                    "The next step is to meet the pet and spend some time getting to know each other."

            },


            "meet & greet": {

                title:
                    "Meet & Greet",

                icon:
                    "🐾",

                description:
                    "The next step is to meet the pet and spend some time getting to know each other."

            },


            approved: {

                title:
                    "Adoption Approved",

                icon:
                    "❤️",

                description:
                    "Congratulations! Your adoption application has been approved."

            },


            completed: {

                title:
                    "Adoption Completed",

                icon:
                    "🎉",

                description:
                    "Congratulations! The adoption has been completed."

            },


            rejected: {

                title:
                    "Application Not Approved",

                icon:
                    "ℹ️",

                description:
                    "Unfortunately, the shelter has not approved this adoption application."

            },


            cancelled: {

                title:
                    "Application Cancelled",

                icon:
                    "ℹ️",

                description:
                    "This adoption application has been cancelled."

            }

        };


        return (
            statusMap[normalized] ||
            {

                title:
                    formatStatus(status),

                icon:
                    "🐾",

                description:
                    "Your application status has been updated by the shelter."

            }
        );

    }


    function formatStatus(status) {

        return String(
            status || "Pending"
        )
        .replace(
            /[_-]/g,
            " "
        )
        .replace(
            /\b\w/g,
            function (letter) {
                return letter.toUpperCase();
            }
        );

    }


    /* =====================================================
       PROGRESS
    ===================================================== */

    function getProgress(status) {

        const normalized =
            normalizeStatus(
                status
            );


        const progressMap = {

            pending:
                17,

            submitted:
                17,

            under_review:
                33,

            "under review":
                33,

            home_verification:
                50,

            "home verification":
                50,

            meet_greet:
                67,

            "meet & greet":
                67,

            approved:
                83,

            completed:
                100,

            rejected:
                0,

            cancelled:
                0

        };


        return (
            progressMap[normalized] ??
            17
        );

    }


    /* =====================================================
       UPDATE APPLICATION DISPLAY
    ===================================================== */

    function updateApplicationDisplay() {

        if (!application) {
            return;
        }


        const pet =
            application.pets || {};


        const profile =
            application.profiles || {};


        const statusInfo =
            getStatusInformation(
                application.status
            );


        const progress =
            getProgress(
                application.status
            );


        const petName =
            pet.name ||
            "Pet";


        const breed =
            pet.breed ||
            "Breed not specified";


        const age =
            pet.age ||
            "Age not specified";


        const gender =
            pet.gender ||
            "Gender not specified";


        const location =
            pet.rescue_location ||
            "Location not specified";


        const applicantName =
            profile.full_name ||
            currentUser.name ||
            "PawPal User";


        const applicantEmail =
            profile.email ||
            currentUser.email ||
            "";


        const applicationDate =
            formatDate(
                application.created_at
            );


        const updatedDate =
            formatDate(
                application.updated_at ||
                application.created_at
            );


        /* ---------------------------------------------
           PET NAME
        --------------------------------------------- */

        document
            .querySelectorAll(
                "[data-pet-name]"
            )
            .forEach(function (element) {

                element.textContent =
                    petName;

            });


        /* ---------------------------------------------
           APPLICATION ID
        --------------------------------------------- */

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


        /* ---------------------------------------------
           STATUS
        --------------------------------------------- */

        document
            .querySelectorAll(
                "[data-application-status]"
            )
            .forEach(function (element) {

                element.textContent =
                    statusInfo.title;

            });


        /* ---------------------------------------------
           PET IMAGE
        --------------------------------------------- */

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
                petName;

        }


        /* ---------------------------------------------
           PET INFORMATION
        --------------------------------------------- */

        const petInfo =
            document.querySelector(
                ".application-pet-info"
            );


        if (petInfo) {

            const heading =
                petInfo.querySelector(
                    "h2"
                );


            const description =
                petInfo.querySelector(
                    "p"
                );


            const locationElement =
                petInfo.querySelector(
                    ".application-location"
                );


            if (heading) {

                heading.textContent =
                    petName;

            }


            if (description) {

                description.textContent =
                    breed +
                    " · " +
                    age +
                    " · " +
                    gender;

            }


            if (locationElement) {

                locationElement.textContent =
                    "📍 " +
                    location;

            }

        }


        /* ---------------------------------------------
           APPLICATION DETAILS
        --------------------------------------------- */

        const detailItems =
            document.querySelectorAll(
                ".application-detail"
            );


        detailItems.forEach(function (item) {

            const label =
                item.querySelector(
                    "span"
                );


            const value =
                item.querySelector(
                    "strong"
                );


            if (!label || !value) {
                return;
            }


            const labelText =
                label.textContent
                    .trim()
                    .toLowerCase();


            if (
                labelText ===
                "application id"
            ) {

                value.textContent =
                    formatApplicationId(
                        application.id
                    );

            }


            if (
                labelText ===
                "submitted"
            ) {

                value.textContent =
                    applicationDate;

            }


            if (
                labelText ===
                "shelter"
            ) {

                /*
                 * There is currently no shelter_id column
                 * in adoption_applications.
                 *
                 * Keep the existing text unless you later
                 * add a shelter/owner relationship.
                 */

            }


            if (
                labelText ===
                "current status"
            ) {

                value.textContent =
                    statusInfo.title;

            }

        });


        /* ---------------------------------------------
           PROGRESS
        --------------------------------------------- */

        const progressPercentage =
            document.querySelector(
                ".progress-percentage"
            );


        if (progressPercentage) {

            progressPercentage.textContent =
                progress + "%";

        }


        const progressFill =
            document.querySelector(
                ".progress-fill"
            );


        if (progressFill) {

            progressFill.style.width =
                progress + "%";

        }


        /* ---------------------------------------------
           CURRENT STATUS CARD
        --------------------------------------------- */

        const currentStatusTitle =
            document.querySelector(
                ".current-status-content h2"
            );


        if (currentStatusTitle) {

            currentStatusTitle.textContent =
                statusInfo.title;

        }


        const currentStatusDescription =
            document.querySelector(
                ".current-status-content p"
            );


        if (currentStatusDescription) {

            currentStatusDescription.textContent =
                statusInfo.description
                    .replace(
                        "the pet",
                        petName
                    );

        }


        const currentStatusIcon =
            document.querySelector(
                ".current-status-icon"
            );


        if (currentStatusIcon) {

            currentStatusIcon.textContent =
                statusInfo.icon;

        }


        const currentStatusIndicator =
            document.querySelector(
                ".current-status-indicator"
            );


        if (currentStatusIndicator) {

            currentStatusIndicator.innerHTML =
                "<span></span>" +
                getStatusIndicatorText(
                    application.status
                );

        }


        /* ---------------------------------------------
           LAST UPDATED
        --------------------------------------------- */

        const lastUpdated =
            document.querySelector(
                ".current-status-update strong"
            );


        if (lastUpdated) {

            lastUpdated.textContent =
                updatedDate;

        }


        /* ---------------------------------------------
           APPLICANT INFORMATION
        --------------------------------------------- */

        const infoItems =
            document.querySelectorAll(
                ".info-item"
            );


        infoItems.forEach(function (item) {

            const label =
                item.querySelector(
                    "span"
                );


            const value =
                item.querySelector(
                    "strong"
                );


            if (!label || !value) {
                return;
            }


            const labelText =
                label.textContent
                    .trim()
                    .toLowerCase();


            switch (labelText) {

                case "applicant":

                    value.textContent =
                        applicantName;

                    break;


                case "email":

                    value.textContent =
                        applicantEmail;

                    break;


                case "pet":

                    value.textContent =
                        petName;

                    break;


                case "application date":

                    value.textContent =
                        applicationDate;

                    break;


                case "application status":

                    value.textContent =
                        statusInfo.title;

                    break;

            }

        });


        /* ---------------------------------------------
           TIMELINE
        --------------------------------------------- */

        updateTimeline(
            application.status,
            petName,
            application.created_at,
            application.updated_at
        );


        /* ---------------------------------------------
           NEXT STEP CARD
        --------------------------------------------- */

        updateNextStep(
            application.status,
            petName
        );


        /* ---------------------------------------------
           PAGE BADGE
        --------------------------------------------- */

        const headingBadge =
            document.querySelector(
                ".status-heading-badge"
            );


        if (headingBadge) {

            headingBadge.innerHTML =
                '<span class="status-badge-dot"></span>' +
                getStatusIndicatorText(
                    application.status
                );

        }

    }


    /* =====================================================
       APPLICATION ID
    ===================================================== */

    function formatApplicationId(id) {

        if (!id) {
            return "Not available";
        }


        /*
         * Supabase id is UUID.
         *
         * Display a short readable version.
         */
        const idString =
            String(id);


        if (
            idString.startsWith(
                "PP-"
            )
        ) {

            return "#" + idString;

        }


        return "#" +
            idString
                .substring(
                    0,
                    8
                )
                .toUpperCase();

    }


    /* =====================================================
       FORMAT DATE
    ===================================================== */

    function formatDate(dateValue) {

        if (!dateValue) {

            return "Not available";

        }


        const date =
            new Date(
                dateValue
            );


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return "Not available";

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
       STATUS INDICATOR TEXT
    ===================================================== */

    function getStatusIndicatorText(status) {

        const normalized =
            normalizeStatus(
                status
            );


        if (
            normalized ===
            "completed"
        ) {

            return "Completed";

        }


        if (
            normalized ===
            "approved"
        ) {

            return "Approved";

        }


        if (
            normalized ===
            "rejected" ||
            normalized ===
            "cancelled"
        ) {

            return formatStatus(
                status
            );

        }


        return "In progress";

    }


    /* =====================================================
       UPDATE NEXT STEP
    ===================================================== */

    function updateNextStep(
        status,
        petName
    ) {

        const nextStepCard =
            document.querySelector(
                ".next-step-card"
            );


        if (!nextStepCard) {
            return;
        }


        const normalized =
            normalizeStatus(
                status
            );


        const icon =
            nextStepCard.querySelector(
                ".next-step-icon"
            );


        const title =
            nextStepCard.querySelector(
                "h2"
            );


        const description =
            nextStepCard.querySelector(
                "p"
            );


        if (
            normalized ===
            "pending" ||
            normalized ===
            "submitted"
        ) {

            if (icon) {
                icon.textContent = "📩";
            }


            if (title) {
                title.textContent =
                    "Application Review";
            }


            if (description) {
                description.textContent =
                    "The shelter will review your application. Keep your contact information available in case they need to reach you.";
            }

            return;

        }


        if (
            normalized ===
            "under review" ||
            normalized ===
            "under_review"
        ) {

            if (icon) {
                icon.textContent = "🔍";
            }


            if (title) {
                title.textContent =
                    "Application Review";
            }


            if (description) {
                description.textContent =
                    "Your application is currently being reviewed by the shelter.";
            }

            return;

        }


        if (
            normalized ===
            "home verification" ||
            normalized ===
            "home_verification"
        ) {

            if (icon) {
                icon.textContent = "🏠";
            }


            if (title) {
                title.textContent =
                    "Home Verification";
            }


            if (description) {
                description.textContent =
                    "Make sure your home is ready and keep your phone available in case the shelter contacts you.";
            }

            return;

        }


        if (
            normalized ===
            "meet & greet" ||
            normalized ===
            "meet_greet"
        ) {

            if (icon) {
                icon.textContent = "🐾";
            }


            if (title) {
                title.textContent =
                    "Meet & Greet";
            }


            if (description) {
                description.textContent =
                    "Get ready to meet " +
                    petName +
                    " and spend some time together.";
            }

            return;

        }


        if (
            normalized ===
            "approved"
        ) {

            if (icon) {
                icon.textContent = "❤️";
            }


            if (title) {
                title.textContent =
                    "Adoption Approved";
            }


            if (description) {
                description.textContent =
                    "Congratulations! Your adoption application has been approved. Please follow the shelter's instructions for completing the adoption.";
            }

            return;

        }


        if (
            normalized ===
            "completed"
        ) {

            if (icon) {
                icon.textContent = "🎉";
            }


            if (title) {
                title.textContent =
                    "Adoption Completed";
            }


            if (description) {
                description.textContent =
                    petName +
                    " is officially part of your family. ❤️";
            }

            return;

        }


        if (title) {

            title.textContent =
                formatStatus(
                    status
                );

        }

    }


    /* =====================================================
       TIMELINE
    ===================================================== */

    function updateTimeline(
        status,
        petName,
        createdAt,
        updatedAt
    ) {

        const steps =
            document.querySelectorAll(
                ".timeline-step"
            );


        if (!steps.length) {
            return;
        }


        const normalized =
            normalizeStatus(
                status
            );


        let currentIndex =
            0;


        switch (normalized) {

            case "pending":
            case "submitted":

                currentIndex =
                    0;

                break;


            case "under review":
            case "under_review":

                currentIndex =
                    1;

                break;


            case "home verification":
            case "home_verification":

                currentIndex =
                    2;

                break;


            case "meet & greet":
            case "meet_greet":

                currentIndex =
                    3;

                break;


            case "approved":

                currentIndex =
                    4;

                break;


            case "completed":

                currentIndex =
                    5;

                break;


            case "rejected":
            case "cancelled":

                currentIndex =
                    0;

                break;


            default:

                currentIndex =
                    0;

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


            if (
                index <
                currentIndex
            ) {

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

            }


            else if (
                index ===
                currentIndex
            ) {

                /*
                 * Completed adoption:
                 * every step becomes completed.
                 */

                if (
                    normalized ===
                    "completed"
                ) {

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

                }

                else {

                    step.classList.add(
                        "active"
                    );


                    if (statusLabel) {

                        statusLabel.textContent =
                            "In Progress";

                        statusLabel.className =
                            "timeline-status active-label";

                    }

                }

            }


            else {

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
         * Replace Bruno with actual pet name
         * inside timeline descriptions.
         */

        document
            .querySelectorAll(
                ".timeline-content p"
            )
            .forEach(function (paragraph) {

                paragraph.textContent =
                    paragraph.textContent.replace(
                        /Bruno/g,
                        petName
                    );

            });


        /*
         * First timeline date.
         */

        const firstDate =
            steps[0]
                ? steps[0].querySelector(
                    ".timeline-date"
                )
                : null;


        if (
            firstDate &&
            createdAt
        ) {

            firstDate.textContent =
                formatDateTime(
                    createdAt
                );

        }


        /*
         * Current step date.
         */

        const activeStep =
            document.querySelector(
                ".timeline-step.active"
            );


        if (activeStep) {

            const activeDate =
                activeStep.querySelector(
                    ".timeline-date"
                );


            if (
                activeDate &&
                updatedAt
            ) {

                activeDate.textContent =
                    "Last updated " +
                    formatDate(
                        updatedAt
                    );

            }

        }

    }


    /* =====================================================
       DATE + TIME
    ===================================================== */

    function formatDateTime(
        dateValue
    ) {

        if (!dateValue) {
            return "";
        }


        const date =
            new Date(
                dateValue
            );


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

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
       EMPTY APPLICATION STATE
    ===================================================== */

    function updateEmptyApplicationState() {

        document
            .querySelectorAll(
                "[data-pet-name]"
            )
            .forEach(function (element) {

                element.textContent =
                    "No application";

            });


        const currentStatusTitle =
            document.querySelector(
                ".current-status-content h2"
            );


        if (currentStatusTitle) {

            currentStatusTitle.textContent =
                "No application found";

        }


        const currentStatusDescription =
            document.querySelector(
                ".current-status-content p"
            );


        if (currentStatusDescription) {

            currentStatusDescription.textContent =
                "We couldn't find an adoption application linked to your account.";

        }


        if (updateButton) {

            updateButton.disabled =
                true;

        }

    }


    /* =====================================================
       CHECK FOR UPDATES
    ===================================================== */

    if (updateButton) {

        updateButton.addEventListener(
            "click",
            async function () {

                if (!application) {

                    showToast(
                        "No application to check."
                    );

                    return;

                }


                updateButton.disabled =
                    true;


                updateButton.textContent =
                    "Checking...";


                try {

                    const {
                        data,
                        error
                    } =
                        await supabaseClient
                            .from(
                                "adoption_applications"
                            )
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
                                ),
                                profiles (
                                    id,
                                    full_name,
                                    email,
                                    phone,
                                    role
                                )
                            `)
                            .eq(
                                "id",
                                application.id
                            )
                            .single();


                    if (error) {

                        console.error(
                            "Update check error:",
                            error
                        );


                        showToast(
                            "Unable to check for updates."
                        );


                        return;

                    }


                    application =
                        data;


                    updateApplicationDisplay();


                    showToast(
                        application.pets?.name +
                        "'s application is up to date. 🐾"
                    );


                } catch (error) {

                    console.error(
                        error
                    );


                    showToast(
                        "Unable to check for updates."
                    );

                } finally {

                    updateButton.disabled =
                        false;


                    updateButton.textContent =
                        "Check for Updates";

                }

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
                100 +
                (
                    index *
                    100
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
        "PawPal adoption status loaded."
    );

});