/* =========================================================
   PAWFUND — START A FUNDRAISER
   Rescue ↔ PawFund integration
   Frontend-only
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const form =
        document.getElementById("fundraiserForm");

    const formMessage =
        document.getElementById("formMessage");

    const saveDraftButton =
        document.getElementById("saveDraft");

    const successSection =
        document.getElementById("successSection");

    const backToForm =
        document.getElementById("backToForm");

    const rescueIdInput =
        document.getElementById("rescueId");

    const rescueConnection =
        document.getElementById("rescueConnection");

    const linkedRescueName =
        document.getElementById("linkedRescueName");


    /* =====================================================
       STORAGE KEYS
       ===================================================== */

    const DRAFT_KEY =
        "pawpalFundraiserDraft";

    const CAMPAIGN_KEY =
        "pawpalSubmittedFundraisers";

    const RESCUE_KEY =
        "pawpalRescueCases";


    /* =====================================================
       RESCUE ID FROM URL
       ===================================================== */

    const params =
        new URLSearchParams(
            window.location.search
        );


    const rescueIdFromURL =
        params.get("rescue");


    if (
        rescueIdFromURL &&
        rescueIdInput
    ) {

        rescueIdInput.value =
            rescueIdFromURL;

    }


    /* =====================================================
       GET RESCUE CASE
       ===================================================== */

    function getRescueCases() {

        try {

            const stored =
                localStorage.getItem(
                    RESCUE_KEY
                );


            if (!stored) {
                return [];
            }


            const cases =
                JSON.parse(stored);


            return Array.isArray(cases)
                ? cases
                : [];

        } catch (error) {

            console.error(
                "Could not load rescue cases:",
                error
            );

            return [];

        }

    }


    function getLinkedRescue() {

        const rescueId =
            rescueIdInput
                ? rescueIdInput.value
                : "";


        if (!rescueId) {
            return null;
        }


        const cases =
            getRescueCases();


        return (
            cases.find(
                item =>
                    item.id === rescueId
            ) || null
        );

    }


    /* =====================================================
       SHOW LINKED RESCUE
       ===================================================== */

    function showLinkedRescue() {

        const rescue =
            getLinkedRescue();


        if (
            !rescue ||
            !rescueConnection
        ) {

            return;

        }


        rescueConnection.style.display =
            "flex";


        if (linkedRescueName) {

            linkedRescueName.textContent =
                rescue.rescueName ||
                "Rescue Case";

        }

    }


    showLinkedRescue();


    /* =====================================================
       FORM FIELDS
       ===================================================== */

    const fieldIds = [

        "animalName",
        "animalType",
        "animalBreed",
        "animalAge",
        "animalGender",
        "rescueDate",
        "rescueLocation",
        "rescueCircumstances",
        "healthCondition",
        "treatmentDetails",
        "currentCare",
        "careDuration",
        "fundraisingGoal",
        "fundraisingDeadline",
        "fundCause",
        "fundUsage",
        "vetVisit",
        "receiptsAvailable",
        "identityVerified",
        "rescuerName",
        "rescuerEmail",
        "rescuerPhone",
        "contactPreference",
        "fundraiserConsent"

    ];


    /* =====================================================
       GET FORM DATA
       ===================================================== */

    function getFormData() {

        const data = {};


        fieldIds.forEach(
            id => {

                const element =
                    document.getElementById(id);


                if (!element) {
                    return;
                }


                if (
                    element.type ===
                    "checkbox"
                ) {

                    data[id] =
                        element.checked;

                } else {

                    data[id] =
                        element.value.trim();

                }

            }
        );


        data.rescueId =
            rescueIdInput
                ? rescueIdInput.value
                : "";


        return data;

    }


    /* =====================================================
       SAVE DRAFT
       ===================================================== */

    function saveDraft() {

        const data =
            getFormData();


        localStorage.setItem(
            DRAFT_KEY,
            JSON.stringify(data)
        );


        showToast(
            "Your fundraiser draft has been saved."
        );

    }


    if (saveDraftButton) {

        saveDraftButton.addEventListener(
            "click",
            saveDraft
        );

    }


    /* =====================================================
       RESTORE DRAFT
       ===================================================== */

    function restoreDraft() {

        try {

            const stored =
                localStorage.getItem(
                    DRAFT_KEY
                );


            if (!stored) {
                return;
            }


            const data =
                JSON.parse(stored);


            fieldIds.forEach(
                id => {

                    const element =
                        document.getElementById(id);


                    if (
                        !element ||
                        data[id] === undefined
                    ) {

                        return;

                    }


                    if (
                        element.type ===
                        "checkbox"
                    ) {

                        element.checked =
                            Boolean(
                                data[id]
                            );

                    } else {

                        element.value =
                            data[id];

                    }

                }
            );


            if (
                rescueIdInput &&
                data.rescueId
            ) {

                rescueIdInput.value =
                    data.rescueId;

            }


            showLinkedRescue();


        } catch (error) {

            console.error(
                "Could not restore fundraiser draft:",
                error
            );

        }

    }


    restoreDraft();


    /* =====================================================
       VALIDATION
       ===================================================== */

    function validateForm() {

        clearMessage();


        const data =
            getFormData();


        const requiredFields = [

            "animalName",
            "animalType",
            "rescueDate",
            "rescueLocation",
            "rescueCircumstances",
            "healthCondition",
            "currentCare",
            "fundraisingGoal",
            "fundCause",
            "fundUsage",
            "rescuerName",
            "rescuerEmail",
            "rescuerPhone"

        ];


        for (
            const id of requiredFields
        ) {

            const element =
                document.getElementById(id);


            if (
                !element ||
                !String(
                    element.value
                ).trim()
            ) {

                showMessage(
                    "Please complete all required fields.",
                    "error"
                );


                element?.focus();


                return false;

            }

        }


        /* Goal */

        const goal =
            Number(
                data.fundraisingGoal
            );


        if (
            !goal ||
            goal < 100
        ) {

            showMessage(
                "The fundraising goal must be at least ₹100.",
                "error"
            );


            document
                .getElementById(
                    "fundraisingGoal"
                )
                ?.focus();


            return false;

        }


        /* Email */

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (
            !emailPattern.test(
                data.rescuerEmail
            )
        ) {

            showMessage(
                "Please enter a valid email address.",
                "error"
            );


            return false;

        }


        /* Deadline */

        if (
            data.fundraisingDeadline
        ) {

            const deadline =
                new Date(
                    data.fundraisingDeadline +
                    "T23:59:59"
                );


            if (
                deadline <
                new Date()
            ) {

                showMessage(
                    "The fundraising deadline cannot be in the past.",
                    "error"
                );


                return false;

            }

        }


        /* Consent */

        const consent =
            document.getElementById(
                "fundraiserConsent"
            );


        if (
            !consent ||
            !consent.checked
        ) {

            showMessage(
                "Please confirm that the information provided is accurate.",
                "error"
            );


            return false;

        }


        return true;

    }


    /* =====================================================
       SUBMIT
       ===================================================== */

    if (form) {

        form.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                if (
                    !validateForm()
                ) {

                    return;

                }


                const data =
                    getFormData();


                const campaignId =
                    "campaign-" +
                    Date.now();


                const campaign = {

                    ...data,

                    id:
                        campaignId,

                    status:
                        "Pending Review",

                    createdAt:
                        new Date()
                            .toISOString(),

                    raised:
                        0,

                    donors:
                        0,

                    goal:
                        Number(
                            data.fundraisingGoal
                        ),

                    photoCount:
                        getPhotoCount(),

                    documentCount:
                        getDocumentCount()

                };


                /* =========================================
                   SAVE CAMPAIGN
                   ========================================= */

                let campaigns = [];


                try {

                    const existing =
                        localStorage.getItem(
                            CAMPAIGN_KEY
                        );


                    if (existing) {

                        const parsed =
                            JSON.parse(
                                existing
                            );


                        if (
                            Array.isArray(
                                parsed
                            )
                        ) {

                            campaigns =
                                parsed;

                        }

                    }

                } catch (error) {

                    console.error(
                        "Could not read campaigns:",
                        error
                    );

                }


                campaigns.unshift(
                    campaign
                );


                localStorage.setItem(
                    CAMPAIGN_KEY,
                    JSON.stringify(
                        campaigns
                    )
                );


                /*
                 * Compatibility with the older
                 * single-campaign storage.
                 */

                localStorage.setItem(
                    "pawpalSubmittedFundraiser",
                    JSON.stringify(
                        campaign
                    )
                );


                /* =========================================
                   CONNECT CAMPAIGN TO RESCUE
                   ========================================= */

                connectFundraiserToRescue(
                    campaign
                );


                /* =========================================
                   CLEAR DRAFT
                   ========================================= */

                localStorage.removeItem(
                    DRAFT_KEY
                );


                showSuccess();

            }
        );

    }


    /* =====================================================
       CONNECT FUNDRAISER → RESCUE
       ===================================================== */

    function connectFundraiserToRescue(
        campaign
    ) {

        const rescueId =
            campaign.rescueId;


        if (!rescueId) {

            console.log(
                "Fundraiser submitted without a linked rescue."
            );

            return;

        }


        const cases =
            getRescueCases();


        const index =
            cases.findIndex(
                rescueCase =>
                    rescueCase.id ===
                    rescueId
            );


        if (
            index === -1
        ) {

            console.warn(
                "Linked rescue case was not found:",
                rescueId
            );

            return;

        }


        /*
         * Update rescue case.
         */

        cases[index].fundraiserId =
            campaign.id;


        cases[index].fundraiserStatus =
            "Pending Review";


        cases[index].fundraiserGoal =
            Number(
                campaign.fundraisingGoal
            );


        cases[index].fundCause =
            campaign.fundCause;


        cases[index].fundraiserCreatedAt =
            campaign.createdAt;


        localStorage.setItem(
            RESCUE_KEY,
            JSON.stringify(
                cases
            )
        );


        console.log(
            "Rescue successfully linked to fundraiser:",
            rescueId,
            campaign.id
        );

    }


    /* =====================================================
       PHOTO / DOCUMENT COUNTS
       ===================================================== */

    function getPhotoCount() {

        const input =
            document.getElementById(
                "rescuePhotos"
            );


        if (
            !input ||
            !input.files
        ) {

            return 0;

        }


        return input.files.length;

    }


    function getDocumentCount() {

        const input =
            document.getElementById(
                "supportingDocuments"
            );


        if (
            !input ||
            !input.files
        ) {

            return 0;

        }


        return input.files.length;

    }


    /* =====================================================
       SUCCESS
       ===================================================== */

    function showSuccess() {

        if (successSection) {

            successSection.classList.add(
                "show"
            );

        }


        if (form) {

            form.style.display =
                "none";

        }


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    if (backToForm) {

        backToForm.addEventListener(
            "click",
            () => {

                if (successSection) {

                    successSection.classList.remove(
                        "show"
                    );

                }


                if (form) {

                    form.style.display =
                        "";

                }

            }
        );

    }


    /* =====================================================
       MESSAGE
       ===================================================== */

    function showMessage(
        message,
        type
    ) {

        if (!formMessage) {
            return;
        }


        formMessage.textContent =
            message;


        formMessage.className =
            "form-message " +
            type;

    }


    function clearMessage() {

        if (!formMessage) {
            return;
        }


        formMessage.textContent =
            "";


        formMessage.className =
            "form-message";

    }


    /* =====================================================
       TOAST
       ===================================================== */

    function showToast(
        message
    ) {

        const toast =
            document.getElementById(
                "fundraiserToast"
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
                2500
            );

    }

});