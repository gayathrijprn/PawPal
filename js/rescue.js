/* =========================================================
   PAWPAL — RESCUE & ADOPTION
   Rescue case management
   Frontend-only / localStorage
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const rescueForm =
        document.getElementById("rescueForm");

    const rescuePhotos =
        document.getElementById("rescuePhotos");

    const photoPreview =
        document.getElementById("photoPreview");

    const rescueUploadArea =
        document.getElementById("rescueUploadArea");

    const saveRescueDraft =
        document.getElementById("saveRescueDraft");

    const rescueFormMessage =
        document.getElementById("rescueFormMessage");

    const rescueStatus =
        document.getElementById("rescueStatus");

    const adoptionPreference =
        document.getElementById("adoptionPreference");

    const rescueGrid =
        document.getElementById("rescueCardGrid");

    const rescueSearch =
        document.getElementById("rescueSearch");

    const rescueFilter =
        document.getElementById("rescueFilter");

    const clearRescueFilters =
        document.getElementById("clearRescueFilters");

    const rescueEmptyState =
        document.getElementById("rescueEmptyState");


    /* =====================================================
       STORAGE
       ===================================================== */

    const RESCUE_KEY =
        "pawpalRescueCases";

    const DRAFT_KEY =
        "pawpalRescueDraft";


    /* =====================================================
       PHOTO STATE
       ===================================================== */

    let selectedPhotos = [];


    /* =====================================================
       FORM FIELD IDS
       ===================================================== */

    const fieldIds = [

        "rescueName",
        "animalType",
        "animalBreed",
        "animalAge",
        "animalGender",
        "rescueDate",
        "foundLocation",
        "currentLocation",
        "foundCircumstances",
        "healthCondition",
        "vetVisit",
        "firstAid",
        "medications",
        "vaccinationStatus",
        "sterilizationStatus",
        "careType",
        "careDuration",
        "caretakerName",
        "caretakerContact",
        "specialNeeds",
        "rescueStory",
        "rescueStatus",
        "adoptionPreference",
        "adoptionRequirements",
        "rescuerName",
        "rescuerContact",
        "rescuerEmail",
        "contactPreference"

    ];


    /* =====================================================
       STORAGE HELPERS
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
                "Could not load rescue cases:",
                error
            );

            return [];

        }

    }


    function saveRescueCases(cases) {

        localStorage.setItem(
            RESCUE_KEY,
            JSON.stringify(cases)
        );

    }


    /* =====================================================
       FORM DATA
       ===================================================== */

    function getFormData() {

        const data = {};


        fieldIds.forEach(id => {

            const element =
                document.getElementById(id);


            if (element) {

                data[id] =
                    element.value.trim();

            }

        });


        return data;

    }


    /* =====================================================
       LOAD DRAFT
       ===================================================== */

    function loadDraft() {

        const saved =
            localStorage.getItem(
                DRAFT_KEY
            );


        if (!saved) {
            return;
        }


        try {

            const data =
                JSON.parse(saved);


            fieldIds.forEach(id => {

                const element =
                    document.getElementById(id);


                if (
                    element &&
                    data[id] !== undefined
                ) {

                    element.value =
                        data[id];

                }

            });


            showToast(
                "Your saved rescue draft has been restored."
            );


        } catch (error) {

            console.error(
                "Could not restore rescue draft:",
                error
            );

        }

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
            "Rescue draft saved."
        );

    }


    if (saveRescueDraft) {

        saveRescueDraft.addEventListener(
            "click",
            saveDraft
        );

    }


    /* =====================================================
       PHOTO UPLOAD
       ===================================================== */

    if (rescueUploadArea && rescuePhotos) {

        rescueUploadArea.addEventListener(
            "click",
            () => {

                rescuePhotos.click();

            }
        );

    }


    if (rescuePhotos) {

        rescuePhotos.addEventListener(
            "change",
            event => {

                const files =
                    Array.from(
                        event.target.files || []
                    );


                files.forEach(file => {

                    if (
                        file.type.startsWith(
                            "image/"
                        )
                    ) {

                        selectedPhotos.push(
                            file
                        );

                    }

                });


                renderPhotoPreview();

                rescuePhotos.value = "";

            }
        );

    }


    /* =====================================================
       PHOTO PREVIEW
       ===================================================== */

    function renderPhotoPreview() {

        if (!photoPreview) {
            return;
        }


        photoPreview.innerHTML = "";


        selectedPhotos.forEach(
            (file, index) => {

                const reader =
                    new FileReader();


                reader.onload =
                    event => {

                        const item =
                            document.createElement(
                                "div"
                            );


                        item.className =
                            "rescue-photo-item";


                        item.innerHTML = `

                            <img
                                src="${event.target.result}"
                                alt="Rescue photo ${index + 1}"
                            >

                            <button
                                type="button"
                                class="remove-rescue-photo"
                            >
                                ×
                            </button>

                        `;


                        const removeButton =
                            item.querySelector(
                                ".remove-rescue-photo"
                            );


                        removeButton.addEventListener(
                            "click",
                            () => {

                                selectedPhotos.splice(
                                    index,
                                    1
                                );


                                renderPhotoPreview();

                            }
                        );


                        photoPreview.appendChild(
                            item
                        );

                    };


                reader.readAsDataURL(
                    file
                );

            }
        );

    }


    /* =====================================================
       VALIDATION
       ===================================================== */

    function validateForm() {

        clearMessage();


        const data =
            getFormData();


        const requiredFields = [

            "animalType",
            "animalAge",
            "animalGender",
            "rescueDate",
            "foundLocation",
            "currentLocation",
            "foundCircumstances",
            "healthCondition",
            "careType",
            "careDuration",
            "caretakerName",
            "caretakerContact",
            "rescuerName",
            "rescuerContact",
            "rescuerEmail",
            "contactPreference"

        ];


        for (
            const id of requiredFields
        ) {

            const element =
                document.getElementById(id);


            if (
                !element ||
                !element.value.trim()
            ) {

                showMessage(
                    "Please complete all required rescue details.",
                    "error"
                );


                element?.focus();


                return false;

            }

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
                "Please enter a valid rescuer email address.",
                "error"
            );


            document
                .getElementById(
                    "rescuerEmail"
                )
                ?.focus();


            return false;

        }


        return true;

    }


    /* =====================================================
       SUBMIT RESCUE CASE
       ===================================================== */

    if (rescueForm) {

        rescueForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                if (!validateForm()) {
                    return;
                }


                const data =
                    getFormData();


                const rescueCase = {

                    ...data,

                    id:
                        "rescue-" +
                        Date.now(),

                    status:
                        data.rescueStatus ||
                        "Recovering",

                    createdAt:
                        new Date().toISOString(),

                    photoCount:
                        selectedPhotos.length,

                    fundraiserId:
                        null,

                    adoptionStatus:
                        "Not Listed"

                };


                const cases =
                    getRescueCases();


                cases.unshift(
                    rescueCase
                );


                saveRescueCases(
                    cases
                );


                /*
                 * Keep the latest rescue case
                 * separately for compatibility.
                 */

                localStorage.setItem(
                    "pawpalLatestRescue",
                    JSON.stringify(
                        rescueCase
                    )
                );


                localStorage.removeItem(
                    DRAFT_KEY
                );


                showMessage(
                    "Rescue case submitted successfully. Thank you for helping an animal in need! 🐾",
                    "success"
                );


                showToast(
                    "Rescue case submitted!"
                );


                /*
                 * Refresh listings if the page
                 * contains them.
                 */

                renderRescueCases();


                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );

    }


    /* =====================================================
       STATUS HELPERS
       ===================================================== */

    function normaliseStatus(
        status
    ) {

        const value =
            String(
                status || ""
            )
                .trim()
                .toLowerCase();


        if (
            value.includes("ready") ||
            value.includes("adoption")
        ) {

            return "ready";

        }


        if (
            value.includes("temporary")
        ) {

            return "temporary";

        }


        if (
            value.includes("care")
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


    /* =====================================================
       ANIMAL TYPE
       ===================================================== */

    function normaliseAnimal(
        type
    ) {

        const value =
            String(
                type || ""
            )
                .trim()
                .toLowerCase();


        if (
            value === "dog"
        ) {
            return "dog";
        }


        if (
            value === "cat"
        ) {
            return "cat";
        }


        if (
            value === "rabbit"
        ) {
            return "rabbit";
        }


        return "other";

    }


    /* =====================================================
       RENDER RESCUE CASES
       ===================================================== */

    function renderRescueCases() {

        if (!rescueGrid) {
            return;
        }


        const cases =
            getRescueCases();


        /*
         * Existing hard-coded rescue cards
         * should remain on the page.
         *
         * User-created cards are inserted
         * before them.
         */

        document
            .querySelectorAll(
                ".dynamic-rescue-card"
            )
            .forEach(
                card => card.remove()
            );


        cases.forEach(
            rescueCase => {

                const card =
                    createRescueCard(
                        rescueCase
                    );


                if (card) {

                    rescueGrid.prepend(
                        card
                    );

                }

            }
        );


        setupRescueCardButtons();

        filterRescueCases();

    }


    /* =====================================================
       CREATE RESCUE CARD
       ===================================================== */

    function createRescueCard(
        rescueCase
    ) {

        const card =
            document.createElement(
                "article"
            );


        const animal =
            normaliseAnimal(
                rescueCase.animalType
            );


        const status =
            normaliseStatus(
                rescueCase.rescueStatus
            );


        const name =
            rescueCase.rescueName ||
            "Rescued Animal";


        const breed =
            rescueCase.animalBreed ||
            "Mixed / Unknown";


        const story =
            rescueCase.rescueStory ||
            rescueCase.foundCircumstances ||
            rescueCase.healthCondition ||
            "This animal is currently receiving rescue care.";


        card.className =
            "rescue-animal-card dynamic-rescue-card";


        card.dataset.animal =
            animal;


        card.dataset.status =
            status;


        card.dataset.name =
            name.toLowerCase();


        card.dataset.id =
            rescueCase.id;


        card.innerHTML = `

            <div class="rescue-card-image">

                <div class="rescue-card-placeholder">
                    ${getAnimalEmoji(animal)}
                </div>

                <span
                    class="rescue-status-badge ${status}"
                >
                    ${getStatusLabel(status)}
                </span>

                <button
                    class="rescue-save-button"
                    type="button"
                    aria-label="Save rescue"
                >
                    ♡
                </button>

            </div>


            <div class="rescue-card-content">

                <div class="rescue-card-label">
                    RESCUE CASE
                </div>

                <h3 class="rescue-card-breed">
                    ${escapeHTML(name)}
                </h3>

                <div class="rescue-card-meta">
                    ${escapeHTML(
                        capitalise(animal)
                    )}
                    ·
                    ${escapeHTML(breed)}
                </div>

                <p class="rescue-card-story">
                    ${escapeHTML(
                        shortenText(
                            story,
                            140
                        )
                    )}
                </p>


                <div class="rescue-card-actions">

                    <a
                        href="rescue-details.html?id=${encodeURIComponent(
                            rescueCase.id
                        )}"
                        class="rescue-view-button"
                    >
                        View Story →
                    </a>

                    ${
                        status === "ready"
                            ? `
                                <a
                                    href="adoption-form.html?rescue=${encodeURIComponent(
                                        rescueCase.id
                                    )}"
                                    class="rescue-adopt-button"
                                >
                                    Adopt
                                </a>
                            `
                            : `
                                <a
                                    href="donation.html"
                                    class="rescue-support-button"
                                >
                                    Support
                                </a>
                            `
                    }

                </div>

            </div>

        `;


        return card;

    }


    /* =====================================================
       FILTER
       ===================================================== */

    function filterRescueCases() {

        if (!rescueGrid) {
            return;
        }


        const search =
            rescueSearch
                ? rescueSearch.value
                    .trim()
                    .toLowerCase()
                : "";


        const filter =
            rescueFilter
                ? rescueFilter.value
                : "all";


        const cards =
            Array.from(
                rescueGrid.querySelectorAll(
                    ".rescue-animal-card"
                )
            );


        let visible =
            0;


        cards.forEach(card => {

            const animal =
                card.dataset.animal ||
                "";


            const status =
                card.dataset.status ||
                "";


            const name =
                card.dataset.name ||
                "";


            const text =
                (
                    card.innerText ||
                    ""
                ).toLowerCase();


            const matchesSearch =
                !search ||
                name.includes(search) ||
                text.includes(search);


            const matchesFilter =
                filter === "all" ||
                filter === animal ||
                filter === status;


            const show =
                matchesSearch &&
                matchesFilter;


            card.style.display =
                show
                    ? ""
                    : "none";


            if (show) {
                visible++;
            }

        });


        if (rescueEmptyState) {

            rescueEmptyState.classList.toggle(
                "show",
                visible === 0
            );

        }

    }


    if (rescueSearch) {

        rescueSearch.addEventListener(
            "input",
            filterRescueCases
        );

    }


    if (rescueFilter) {

        rescueFilter.addEventListener(
            "change",
            filterRescueCases
        );

    }


    if (clearRescueFilters) {

        clearRescueFilters.addEventListener(
            "click",
            () => {

                if (rescueSearch) {
                    rescueSearch.value = "";
                }


                if (rescueFilter) {
                    rescueFilter.value = "all";
                }


                filterRescueCases();

            }
        );

    }


    /* =====================================================
       SAVE RESCUE CARD
       ===================================================== */

    function setupRescueCardButtons() {

        document
            .querySelectorAll(
                ".rescue-save-button"
            )
            .forEach(button => {

                if (
                    button.dataset.listenerAttached
                ) {
                    return;
                }


                button.dataset.listenerAttached =
                    "true";


                button.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();


                        button.classList.toggle(
                            "saved"
                        );


                        button.textContent =
                            button.classList.contains(
                                "saved"
                            )
                                ? "♥"
                                : "♡";


                        showToast(
                            button.classList.contains(
                                "saved"
                            )
                                ? "Rescue saved ❤️"
                                : "Rescue removed from saved"
                        );

                    }
                );

            });

    }


    /* =====================================================
       MESSAGE
       ===================================================== */

    function showMessage(
        message,
        type
    ) {

        if (!rescueFormMessage) {
            return;
        }


        rescueFormMessage.textContent =
            message;


        rescueFormMessage.className =
            "rescue-form-message " +
            type;

    }


    function clearMessage() {

        if (!rescueFormMessage) {
            return;
        }


        rescueFormMessage.textContent =
            "";


        rescueFormMessage.className =
            "rescue-form-message";

    }


    /* =====================================================
       TOAST
       ===================================================== */

    function showToast(
        message
    ) {

        let toast =
            document.querySelector(
                ".rescue-toast"
            );


        if (!toast) {

            toast =
                document.createElement(
                    "div"
                );


            toast.className =
                "rescue-toast";


            document.body.appendChild(
                toast
            );

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


    /* =====================================================
       UTILITY
       ===================================================== */

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


    function shortenText(
        text,
        length
    ) {

        const value =
            String(
                text || ""
            )
                .replace(
                    /\s+/g,
                    " "
                )
                .trim();


        if (
            value.length <= length
        ) {

            return value;

        }


        return (
            value.substring(
                0,
                length
            ).trim() +
            "..."
        );

    }


    function getAnimalEmoji(
        animal
    ) {

        const emojis = {

            dog: "🐶",
            cat: "🐱",
            rabbit: "🐰",
            other: "🐾"

        };


        return (
            emojis[animal] ||
            "🐾"
        );

    }


    function escapeHTML(
        value
    ) {

        const div =
            document.createElement(
                "div"
            );


        div.textContent =
            String(
                value ?? ""
            );


        return div.innerHTML;

    }


    /* =====================================================
       INITIALISE
       ===================================================== */

    loadDraft();

    renderRescueCases();

    setupRescueCardButtons();

});