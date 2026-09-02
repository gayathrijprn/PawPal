/* =========================================================
   PAWFUND — FUNDRAISER INTERACTIONS
   Frontend-only campaign connection
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const searchInput =
        document.getElementById("fundSearch");

    const animalFilter =
        document.getElementById("animalFilter");

    const causeFilter =
        document.getElementById("causeFilter");

    const sortFilter =
        document.getElementById("sortFilter");

    const grid =
        document.getElementById("fundraiserGrid");

    const emptyState =
        document.getElementById("emptyFundraisers");

    const clearFilters =
        document.getElementById("clearFilters");


    const DYNAMIC_CAMPAIGNS_KEY =
        "pawpalSubmittedFundraisers";


    /* =====================================================
       FALLBACK IMAGE
       ===================================================== */

    const fallbackImage =
        "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=900&q=85";


    /* =====================================================
       STORAGE HELPERS
       ===================================================== */

    function getSubmittedCampaigns() {

        try {

            const saved =
                localStorage.getItem(
                    DYNAMIC_CAMPAIGNS_KEY
                );

            if (!saved) {
                return [];
            }

            const campaigns =
                JSON.parse(saved);

            return Array.isArray(campaigns)
                ? campaigns
                : [];

        } catch (error) {

            console.error(
                "Could not read PawFund campaigns:",
                error
            );

            return [];
        }
    }


    function saveSubmittedCampaigns(campaigns) {

        localStorage.setItem(
            DYNAMIC_CAMPAIGNS_KEY,
            JSON.stringify(campaigns)
        );
    }


    /* =====================================================
       CONVERT FORM DATA
       ===================================================== */

    function normaliseAnimalType(type) {

        const value =
            String(type || "")
                .trim()
                .toLowerCase();

        if (value === "dog") {
            return "dog";
        }

        if (value === "cat") {
            return "cat";
        }

        if (value === "rabbit") {
            return "rabbit";
        }

        return "other";
    }


    function normaliseCause(cause) {

        const value =
            String(cause || "")
                .trim()
                .toLowerCase();

        if (
            value.includes("medical") ||
            value.includes("surgery") ||
            value.includes("medication")
        ) {
            return "medical";
        }

        if (
            value.includes("food") ||
            value.includes("nutrition")
        ) {
            return "food";
        }

        if (
            value.includes("shelter")
        ) {
            return "shelter";
        }

        return "recovery";
    }


    function getCauseLabel(cause) {

        const labels = {
            medical: "MEDICAL CARE",
            food: "FOOD & CARE",
            shelter: "SHELTER",
            recovery: "RECOVERY"
        };

        return labels[cause] || "RECOVERY";
    }


    function getAnimalEmoji(type) {

        const emojis = {
            dog: "🐶",
            cat: "🐱",
            rabbit: "🐰",
            other: "🐾"
        };

        return emojis[type] || "🐾";
    }


    /* =====================================================
       CREATE CARD FOR NEW CAMPAIGN
       ===================================================== */

    function createCampaignCard(campaign, index) {

        if (!grid) {
            return null;
        }


        const card =
            document.createElement("article");

        const animal =
            normaliseAnimalType(
                campaign.animalType
            );

        const cause =
            normaliseCause(
                campaign.fundCause
            );

        const goal =
            Number(campaign.fundraisingGoal) || 0;

        const raised =
            Number(campaign.raised) || 0;

        const donors =
            Number(campaign.donors) || 0;

        const progress =
            goal > 0
                ? Math.min(
                    100,
                    Math.round(
                        (raised / goal) * 100
                    )
                )
                : 0;


        const campaignId =
            campaign.id ||
            `campaign-${Date.now()}-${index}`;


        const animalName =
            campaign.animalName ||
            "Rescue";


        const causeLabel =
            getCauseLabel(cause);


        card.className =
            "fundraiser-card dynamic-fundraiser";


        card.dataset.id =
            campaignId;

        card.dataset.animal =
            animal;

        card.dataset.cause =
            cause;

        card.dataset.progress =
            progress;

        card.dataset.donors =
            donors;

        card.dataset.name =
            animalName.toLowerCase();

        card.dataset.created =
            campaign.createdAt ||
            new Date().toISOString();


        const title =
            `${animalName}'s Rescue Fund`;


        const story =
            campaign.rescueCircumstances ||
            `${animalName} was rescued and needs support during recovery.`;


        const image =
            campaign.image ||
            fallbackImage;


        card.innerHTML = `

            <div class="fundraiser-image">

                <img
                    src="${escapeHTML(image)}"
                    alt="${escapeHTML(
                        animalName
                    )} the rescued animal"
                >

                <span class="cause-badge">
                    ${escapeHTML(causeLabel)}
                </span>

                <button
                    class="save-fundraiser"
                    type="button"
                    aria-label="Save fundraiser"
                >
                    ♡
                </button>

            </div>


            <div class="fundraiser-body">

                <div
                    class="verified-label"
                    style="color:#71806b;"
                >
                    ◷ Pending review
                </div>

                <h3>
                    ${escapeHTML(title)}
                </h3>

                <p>
                    ${escapeHTML(
                        shortenText(story, 145)
                    )}
                </p>


                <div class="fundraiser-progress">

                    <div class="progress-track">

                        <span
                            style="width:${progress}%"
                        ></span>

                    </div>


                    <div class="fundraiser-money">

                        <strong>
                            ₹${formatNumber(raised)}
                        </strong>

                        <span>
                            of ₹${formatNumber(goal)}
                        </span>

                    </div>

                </div>


                <div class="fundraiser-meta">

                    <span>
                        ${donors} donors
                    </span>

                    <span>
                        ${progress}% funded
                    </span>

                </div>


                <a
                    href="fundraiser-details.html?id=${encodeURIComponent(
                        campaignId
                    )}"
                    class="fundraiser-btn"
                >
                    Help ${escapeHTML(animalName)} →
                </a>

            </div>

        `;


        return card;
    }


    /* =====================================================
       ADD SUBMITTED CAMPAIGNS
       ===================================================== */

    function addSubmittedCampaigns() {

        if (!grid) {
            return;
        }


        const campaigns =
            getSubmittedCampaigns();


        campaigns.forEach(
            (campaign, index) => {

                const card =
                    createCampaignCard(
                        campaign,
                        index
                    );

                if (card) {

                    /*
                     * New campaigns are inserted
                     * before the demo campaigns.
                     */

                    grid.insertBefore(
                        card,
                        grid.firstElementChild
                    );
                }

            }
        );
    }


    /* =====================================================
       FILTER FUNDRAISERS
       ===================================================== */

    function filterFundraisers() {

        if (!grid) {
            return;
        }


        const searchTerm =
            searchInput
                ? searchInput.value
                    .trim()
                    .toLowerCase()
                : "";


        const animal =
            animalFilter
                ? animalFilter.value
                : "all";


        const cause =
            causeFilter
                ? causeFilter.value
                : "all";


        const cards =
            Array.from(
                grid.querySelectorAll(
                    ".fundraiser-card"
                )
            );


        const visibleCards = [];


        cards.forEach(card => {

            const cardAnimal =
                card.dataset.animal || "";


            const cardCause =
                card.dataset.cause || "";


            const cardName =
                (
                    card.dataset.name ||
                    ""
                ).toLowerCase();


            const cardText =
                (
                    card.innerText ||
                    ""
                ).toLowerCase();


            const matchesSearch =
                !searchTerm ||
                cardName.includes(searchTerm) ||
                cardText.includes(searchTerm);


            const matchesAnimal =
                animal === "all" ||
                cardAnimal === animal;


            const matchesCause =
                cause === "all" ||
                cardCause === cause;


            const shouldShow =
                matchesSearch &&
                matchesAnimal &&
                matchesCause;


            card.style.display =
                shouldShow
                    ? ""
                    : "none";


            if (shouldShow) {
                visibleCards.push(card);
            }

        });


        sortCards(visibleCards);


        if (emptyState) {

            emptyState.classList.toggle(
                "show",
                visibleCards.length === 0
            );
        }

    }


    /* =====================================================
       SORT FUNDRAISERS
       ===================================================== */

    function sortCards(visibleCards) {

        if (!grid) {
            return;
        }


        const sortValue =
            sortFilter
                ? sortFilter.value
                : "urgent";


        visibleCards.sort(
            (a, b) => {

                if (sortValue === "progress") {

                    return (
                        Number(
                            b.dataset.progress
                        ) -
                        Number(
                            a.dataset.progress
                        )
                    );
                }


                if (sortValue === "donors") {

                    return (
                        Number(
                            b.dataset.donors
                        ) -
                        Number(
                            a.dataset.donors
                        )
                    );
                }


                if (sortValue === "recent") {

                    const dateA =
                        Date.parse(
                            a.dataset.created
                        );

                    const dateB =
                        Date.parse(
                            b.dataset.created
                        );


                    /*
                     * Dynamic campaigns use
                     * actual timestamps.
                     *
                     * Demo campaigns use
                     * their original order.
                     */

                    if (
                        !Number.isNaN(dateA) &&
                        !Number.isNaN(dateB)
                    ) {
                        return dateB - dateA;
                    }

                    return (
                        Number(
                            b.dataset.created
                        ) -
                        Number(
                            a.dataset.created
                        )
                    );
                }


                /*
                 * Default:
                 * Most urgent = lowest progress first.
                 */

                return (
                    Number(
                        a.dataset.progress
                    ) -
                    Number(
                        b.dataset.progress
                    )
                );

            }
        );


        visibleCards.forEach(
            card => {
                grid.appendChild(card);
            }
        );

    }


    /* =====================================================
       SAVE FUNDRAISER
       ===================================================== */

    function setupSaveButtons() {

        document
            .querySelectorAll(
                ".save-fundraiser"
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
                        event.stopPropagation();


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
                                ? "Fundraiser saved ❤️"
                                : "Fundraiser removed from saved"
                        );

                    }
                );

            });

    }


    /* =====================================================
       TOAST
       ===================================================== */

    function showToast(message) {

        let toast =
            document.querySelector(
                ".fund-toast"
            );


        if (!toast) {

            toast =
                document.createElement(
                    "div"
                );

            toast.className =
                "fund-toast";

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
            toast._hideTimer
        );


        toast._hideTimer =
            setTimeout(
                () => {

                    toast.classList.remove(
                        "show"
                    );

                },
                2200
            );

    }


    /* =====================================================
       CLEAR FILTERS
       ===================================================== */

    if (clearFilters) {

        clearFilters.addEventListener(
            "click",
            () => {

                if (searchInput) {
                    searchInput.value = "";
                }

                if (animalFilter) {
                    animalFilter.value = "all";
                }

                if (causeFilter) {
                    causeFilter.value = "all";
                }

                if (sortFilter) {
                    sortFilter.value = "urgent";
                }

                filterFundraisers();

            }
        );

    }


    /* =====================================================
       EVENTS
       ===================================================== */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterFundraisers
        );

    }


    if (animalFilter) {

        animalFilter.addEventListener(
            "change",
            filterFundraisers
        );

    }


    if (causeFilter) {

        causeFilter.addEventListener(
            "change",
            filterFundraisers
        );

    }


    if (sortFilter) {

        sortFilter.addEventListener(
            "change",
            filterFundraisers
        );

    }


    /* =====================================================
       UTILITY FUNCTIONS
       ===================================================== */

    function formatNumber(number) {

        return Number(
            number || 0
        ).toLocaleString(
            "en-IN"
        );

    }


    function shortenText(text, maxLength) {

        const value =
            String(text || "")
                .replace(/\s+/g, " ")
                .trim();


        if (value.length <= maxLength) {
            return value;
        }


        return (
            value.substring(
                0,
                maxLength
            ).trim() + "..."
        );

    }


    function escapeHTML(value) {

        const div =
            document.createElement(
                "div"
            );

        div.textContent =
            String(value ?? "");


        return div.innerHTML;

    }


    /* =====================================================
       STARTUP
       ===================================================== */

    addSubmittedCampaigns();

    setupSaveButtons();

    filterFundraisers();

});