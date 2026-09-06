/* =========================================================
   PAWPAL — RESCUE DETAILS
   Loads individual rescue cases from localStorage
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const RESCUE_KEY =
        "pawpalRescueCases";


    /* =====================================================
       URL
       ===================================================== */

    const params =
        new URLSearchParams(
            window.location.search
        );


    const rescueId =
        params.get("id");


    /* =====================================================
       ELEMENTS
       ===================================================== */

    const breadcrumbName =
        document.getElementById(
            "breadcrumbName"
        );

    const animalName =
        document.getElementById(
            "animalName"
        );

    const animalSubtitle =
        document.getElementById(
            "animalSubtitle"
        );

    const animalType =
        document.getElementById(
            "animalType"
        );

    const animalBreed =
        document.getElementById(
            "animalBreed"
        );

    const animalAge =
        document.getElementById(
            "animalAge"
        );

    const animalGender =
        document.getElementById(
            "animalGender"
        );

    const animalVisual =
        document.getElementById(
            "animalVisual"
        );

    const statusBadge =
        document.getElementById(
            "statusBadge"
        );

    const rescueStory =
        document.getElementById(
            "rescueStory"
        );

    const healthCondition =
        document.getElementById(
            "healthCondition"
        );

    const vetVisit =
        document.getElementById(
            "vetVisit"
        );

    const firstAid =
        document.getElementById(
            "firstAid"
        );

    const medications =
        document.getElementById(
            "medications"
        );

    const vaccinationStatus =
        document.getElementById(
            "vaccinationStatus"
        );

    const sterilizationStatus =
        document.getElementById(
            "sterilizationStatus"
        );

    const careType =
        document.getElementById(
            "careType"
        );

    const careDuration =
        document.getElementById(
            "careDuration"
        );

    const currentLocation =
        document.getElementById(
            "currentLocation"
        );

    const specialNeeds =
        document.getElementById(
            "specialNeeds"
        );

    const rescueDate =
        document.getElementById(
            "rescueDate"
        );

    const foundLocation =
        document.getElementById(
            "foundLocation"
        );

    const rescuerName =
        document.getElementById(
            "rescuerName"
        );

    const rescuerContact =
        document.getElementById(
            "rescuerContact"
        );

    const contactPreference =
        document.getElementById(
            "contactPreference"
        );

    const supportButton =
        document.getElementById(
            "supportButton"
        );

    const adoptButton =
        document.getElementById(
            "adoptButton"
        );

    const sidebarAdoptButton =
        document.getElementById(
            "sidebarAdoptButton"
        );

    const adoptionCard =
        document.getElementById(
            "adoptionCard"
        );


    /* =====================================================
       LOAD DATA
       ===================================================== */

    function getRescueCases() {

        try {

            const saved =
                localStorage.getItem(
                    RESCUE_KEY
                );


            if (!saved) {
                return [];
            }


            const cases =
                JSON.parse(saved);


            return Array.isArray(cases)
                ? cases
                : [];

        } catch (error) {

            console.error(
                "Unable to load rescue cases:",
                error
            );

            return [];

        }

    }


    const rescueCases =
        getRescueCases();


    let rescueCase =
        rescueCases.find(
            item =>
                item.id === rescueId
        );


    /*
     * If no ID was supplied, use the
     * latest submitted rescue.
     */

    if (!rescueCase) {

        rescueCase =
            rescueCases[0];

    }


    /* =====================================================
       DEMO RESCUE
       ===================================================== */

    if (!rescueCase) {

        rescueCase = {

            id: "demo-rescue",

            rescueName: "Hope",

            animalType: "Dog",

            animalBreed: "Indie",

            animalAge: "2 years",

            animalGender: "Female",

            rescueDate: "2026-08-20",

            foundLocation: "Kollam",

            currentLocation: "Temporary foster home",

            foundCircumstances:
                "Hope was found alone and frightened near a roadside.",

            healthCondition:
                "Under observation and recovering well.",

            vetVisit:
                "Yes",

            firstAid:
                "Basic first aid provided.",

            medications:
                "As prescribed by veterinarian.",

            vaccinationStatus:
                "Pending",

            sterilizationStatus:
                "Pending",

            careType:
                "Temporary Foster",

            careDuration:
                "Until adoption",

            caretakerName:
                "PawPal Volunteer",

            caretakerContact:
                "Available through PawPal",

            specialNeeds:
                "Needs a calm and loving environment.",

            rescueStory:
                "Hope was found alone and frightened. A kind rescuer stopped to help, gave her immediate care and arranged a safe temporary place for her to recover. She is now slowly gaining confidence and waiting for the next chapter of her life.",

            rescueStatus:
                "Recovering",

            adoptionPreference:
                "After recovery",

            rescuerName:
                "PawPal Volunteer",

            rescuerContact:
                "Contact through PawPal",

            contactPreference:
                "PawPal",

            adoptionStatus:
                "Not Listed"

        };

    }


    /* =====================================================
       HELPERS
       ===================================================== */

    function valueOrDash(
        value
    ) {

        if (
            value === undefined ||
            value === null ||
            String(value).trim() === ""
        ) {

            return "Not provided";

        }


        return String(value);

    }


    function capitalise(
        value
    ) {

        const text =
            String(
                value || ""
            );


        return (
            text.charAt(0).toUpperCase() +
            text.slice(1).toLowerCase()
        );

    }


    function normaliseStatus(
        value
    ) {

        const status =
            String(
                value || ""
            )
                .toLowerCase()
                .trim();


        if (
            status.includes("ready") ||
            status.includes("adoption")
        ) {

            return "ready";

        }


        if (
            status.includes("temporary")
        ) {

            return "temporary";

        }


        if (
            status.includes("care")
        ) {

            return "needs-care";

        }


        return "recovering";

    }


    function getStatusLabel(
        status
    ) {

        const labels = {

            ready:
                "READY FOR ADOPTION",

            recovering:
                "RECOVERING",

            temporary:
                "TEMPORARY CARE",

            "needs-care":
                "NEEDS CARE"

        };


        return (
            labels[
                normaliseStatus(status)
            ] ||
            "RECOVERING"
        );

    }


    function getAnimalEmoji(
        type
    ) {

        const animal =
            String(
                type || ""
            )
                .toLowerCase();


        if (
            animal === "dog"
        ) {
            return "🐶";
        }


        if (
            animal === "cat"
        ) {
            return "🐱";
        }


        if (
            animal === "rabbit"
        ) {
            return "🐰";
        }


        return "🐾";

    }


    /* =====================================================
       POPULATE
       ===================================================== */

    function populatePage() {

        const name =
            valueOrDash(
                rescueCase.rescueName
            );


        const type =
            capitalise(
                rescueCase.animalType
            );


        const status =
            normaliseStatus(
                rescueCase.rescueStatus
            );


        if (breadcrumbName) {
            breadcrumbName.textContent =
                name;
        }


        if (animalName) {
            animalName.textContent =
                name;
        }


        if (animalSubtitle) {

            animalSubtitle.textContent =
                getSubtitle(
                    name,
                    status
                );

        }


        if (animalType) {
            animalType.textContent =
                type;
        }


        if (animalBreed) {
            animalBreed.textContent =
                valueOrDash(
                    rescueCase.animalBreed
                );
        }


        if (animalAge) {
            animalAge.textContent =
                valueOrDash(
                    rescueCase.animalAge
                );
        }


        if (animalGender) {
            animalGender.textContent =
                valueOrDash(
                    rescueCase.animalGender
                );
        }


        if (animalVisual) {
            animalVisual.textContent =
                getAnimalEmoji(
                    rescueCase.animalType
                );
        }


        if (statusBadge) {

            statusBadge.className =
                `rescue-details-status ${status}`;

            statusBadge.textContent =
                getStatusLabel(
                    status
                );

        }


        if (rescueStory) {

            rescueStory.textContent =
                valueOrDash(
                    rescueCase.rescueStory ||
                    rescueCase.foundCircumstances
                );

        }


        setText(
            healthCondition,
            rescueCase.healthCondition
        );

        setText(
            vetVisit,
            rescueCase.vetVisit
        );

        setText(
            firstAid,
            rescueCase.firstAid
        );

        setText(
            medications,
            rescueCase.medications
        );

        setText(
            vaccinationStatus,
            rescueCase.vaccinationStatus
        );

        setText(
            sterilizationStatus,
            rescueCase.sterilizationStatus
        );

        setText(
            careType,
            rescueCase.careType
        );

        setText(
            careDuration,
            rescueCase.careDuration
        );

        setText(
            currentLocation,
            rescueCase.currentLocation
        );

        setText(
            specialNeeds,
            rescueCase.specialNeeds
        );

        setText(
            rescueDate,
            formatDate(
                rescueCase.rescueDate
            )
        );

        setText(
            foundLocation,
            rescueCase.foundLocation
        );

        setText(
            rescuerName,
            rescueCase.rescuerName
        );

        setText(
            rescuerContact,
            rescueCase.rescuerContact
        );

        setText(
            contactPreference,
            rescueCase.contactPreference
        );


        setupJourney(
            status
        );


        setupActions(
            status
        );

    }


    function setText(
        element,
        value
    ) {

        if (!element) {
            return;
        }


        element.textContent =
            valueOrDash(value);

    }


    /* =====================================================
       SUBTITLE
       ===================================================== */

    function getSubtitle(
        name,
        status
    ) {

        if (
            status === "ready"
        ) {

            return (
                `${name} is ready to meet a loving forever family.`
            );

        }


        if (
            status === "temporary"
        ) {

            return (
                `${name} is safe in temporary care while waiting for a forever home.`
            );

        }


        if (
            status === "needs-care"
        ) {

            return (
                `${name} still needs care, support and someone willing to help.`
            );

        }


        return (
            `${name} is recovering safely and deserves every chance at a better life.`
        );

    }


    /* =====================================================
       JOURNEY
       ===================================================== */

    function setupJourney(
        currentStatus
    ) {

        const steps =
            document.querySelectorAll(
                ".journey-step"
            );


        const order = [
            "rescued",
            "recovering",
            "temporary",
            "ready"
        ];


        let currentIndex =
            1;


        if (
            currentStatus ===
            "temporary"
        ) {

            currentIndex = 2;

        }


        if (
            currentStatus ===
            "ready"
        ) {

            currentIndex = 3;

        }


        if (
            currentStatus ===
            "needs-care"
        ) {

            currentIndex = 1;

        }


        steps.forEach(
            (step, index) => {

                step.classList.remove(
                    "completed",
                    "active"
                );


                if (
                    index <= currentIndex
                ) {

                    step.classList.add(
                        "completed"
                    );

                }


                if (
                    index === currentIndex
                ) {

                    step.classList.add(
                        "active"
                    );

                }

            }
        );

    }


    /* =====================================================
       ACTIONS
       ===================================================== */

    function setupActions(
        status
    ) {

        const ready =
            status === "ready";


        if (ready) {

            const adoptionURL =
                `adoption-form.html?rescue=${encodeURIComponent(
                    rescueCase.id
                )}`;


            if (adoptButton) {
                adoptButton.href =
                    adoptionURL;
            }


            if (sidebarAdoptButton) {

                sidebarAdoptButton.href =
                    adoptionURL;

            }


            if (adoptionCard) {

                adoptionCard.style.display =
                    "";

            }


        } else {

            if (adoptButton) {

                adoptButton.href =
                    "rescue-adoption.html";


                adoptButton.textContent =
                    "Adoption After Recovery";


                adoptButton.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();

                        showToast(
                            "Adoption will open once this rescue is ready. 💚"
                        );

                    }
                );

            }


            if (sidebarAdoptButton) {

                sidebarAdoptButton.href =
                    "rescue-adoption.html";


                sidebarAdoptButton.textContent =
                    "Wait Until Ready";


                sidebarAdoptButton.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();

                        showToast(
                            "This rescue needs a little more time and care first. 🐾"
                        );

                    }
                );

            }

        }


        /*
         * Connect support button to PawFund.
         *
         * If this rescue later receives a fundraiserId,
         * it will automatically open that campaign.
         */

        if (
            supportButton &&
            rescueCase.fundraiserId
        ) {

            supportButton.href =
                `fundraiser-details.html?id=${encodeURIComponent(
                    rescueCase.fundraiserId
                )}`;

            supportButton.textContent =
                "Support Their Fund";

        }

    }


    /* =====================================================
       DATE
       ===================================================== */

    function formatDate(
        date
    ) {

        if (!date) {
            return "Not provided";
        }


        const parsed =
            new Date(date);


        if (
            Number.isNaN(
                parsed.getTime()
            )
        ) {

            return date;

        }


        return parsed.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );

    }


    /* =====================================================
       TOAST
       ===================================================== */

    function showToast(
        message
    ) {

        const toast =
            document.getElementById(
                "rescueDetailsToast"
            );


        if (!toast) {
            return;
        }


        toast.textContent =
            message;


        toast.classList.add(
            "show"
        );


        clearTimeout(
            toast._timer
        );


        toast._timer =
            setTimeout(
                () => {

                    toast.classList.remove(
                        "show"
                    );

                },
                2800
            );

    }


    /* =====================================================
       START
       ===================================================== */

    populatePage();

});