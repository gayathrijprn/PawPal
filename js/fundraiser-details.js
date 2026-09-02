/* =========================================================
   PAWFUND — FUNDRAISER DETAILS
   Supports demo + user-created campaigns
   Frontend-only
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       DEMO CAMPAIGNS
       ===================================================== */

    const demoCampaigns = {

        bruno: {
            id: "bruno",
            name: "Bruno",
            title: "Bruno's Road to Recovery",
            subtitle: "Help Bruno get the medical care he needs.",
            animal: "Dog",
            cause: "Medical Care",
            image:
                "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=1200&q=85",
            raised: 36000,
            goal: 50000,
            donors: 38,
            status: "Verified Rescue",
            story:
                "Bruno was found injured and malnourished. A kind rescuer took him in and arranged veterinary treatment. He is now recovering safely, but still needs continued medical care, medication and regular check-ups before he is ready for his forever home."
        },

        luna: {
            id: "luna",
            name: "Luna",
            title: "Luna Needs a Safe Recovery",
            subtitle: "Help Luna heal and stay safe while she waits for her forever home.",
            animal: "Cat",
            cause: "Recovery",
            image:
                "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=1200&q=85",
            raised: 18200,
            goal: 30000,
            donors: 24,
            status: "Verified Rescue",
            story:
                "Luna was found abandoned and in need of care. She is currently receiving medication, nutritious food and temporary shelter while she recovers and waits for a loving family."
        },

        rocky: {
            id: "rocky",
            name: "Rocky",
            title: "Rocky's Medical Fund",
            subtitle: "Help Rocky complete his treatment and recovery.",
            animal: "Dog",
            cause: "Medical Care",
            image:
                "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1200&q=85",
            raised: 67800,
            goal: 75000,
            donors: 52,
            status: "Verified Rescue",
            story:
                "Rocky is receiving veterinary treatment after being rescued. He is improving steadily, but needs continued medical attention before he can begin his adoption journey."
        },

        bunbun: {
            id: "bunbun",
            name: "Bunbun",
            title: "Bunbun's Safe Recovery",
            subtitle: "Help provide food and care for this rescued rabbit.",
            animal: "Rabbit",
            cause: "Food & Care",
            image:
                "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=1200&q=85",
            raised: 9600,
            goal: 20000,
            donors: 16,
            status: "Verified Rescue",
            story:
                "Bunbun was rescued and is currently staying with a temporary caretaker. Nutritious food, safe housing and regular care are helping this little rabbit recover."
        },

        mimi: {
            id: "mimi",
            name: "Mimi",
            title: "Mimi's Temporary Home",
            subtitle: "Help Mimi stay safe until she finds her forever home.",
            animal: "Cat",
            cause: "Temporary Shelter",
            image:
                "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=1200&q=85",
            raised: 7400,
            goal: 20000,
            donors: 12,
            status: "Verified Rescue",
            story:
                "Mimi was rescued from the streets and is now safe with a temporary caretaker. Donations help cover food, shelter and the everyday care she needs while she waits for adoption."
        },

        toby: {
            id: "toby",
            name: "Toby",
            title: "Toby's Second Chance",
            subtitle: "Help Toby recover and prepare for a loving forever home.",
            animal: "Dog",
            cause: "Recovery",
            image:
                "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1200&q=85",
            raised: 22000,
            goal: 40000,
            donors: 29,
            status: "Verified Rescue",
            story:
                "Toby is recovering after being rescued. He is slowly learning to trust people again and needs continued food, shelter and supportive care before finding his forever family."
        }

    };


    /* =====================================================
       FALLBACK IMAGE
       ===================================================== */

    const fallbackImage =
        "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=1200&q=85";


    /* =====================================================
       GET CAMPAIGN ID FROM URL
       ===================================================== */

    const params =
        new URLSearchParams(
            window.location.search
        );


    const campaignId =
        params.get("id") || "bruno";


    /* =====================================================
       LOAD SUBMITTED CAMPAIGNS
       ===================================================== */

    function getSubmittedCampaigns() {

        try {

            const stored =
                localStorage.getItem(
                    "pawpalSubmittedFundraisers"
                );


            if (!stored) {
                return [];
            }


            const campaigns =
                JSON.parse(stored);


            return Array.isArray(campaigns)
                ? campaigns
                : [];

        } catch (error) {

            console.error(
                "Could not load submitted campaigns:",
                error
            );

            return [];

        }

    }


    /* =====================================================
       CONVERT USER CAMPAIGN INTO DETAILS FORMAT
       ===================================================== */

    function convertSubmittedCampaign(
        campaign
    ) {

        const goal =
            Number(
                campaign.fundraisingGoal
            ) || 0;


        const raised =
            Number(
                campaign.raised
            ) || 0;


        const donors =
            Number(
                campaign.donors
            ) || 0;


        const animal =
            campaign.animalType ||
            "Animal";


        const animalName =
            campaign.animalName ||
            "Rescue";


        const cause =
            campaign.fundCause ||
            "Recovery";


        let story =
            campaign.rescueCircumstances ||
            "";


        if (
            campaign.healthCondition
        ) {

            story +=
                " " +
                campaign.healthCondition;

        }


        if (
            campaign.treatmentDetails
        ) {

            story +=
                " " +
                campaign.treatmentDetails;

        }


        if (
            campaign.currentCare
        ) {

            story +=
                " " +
                campaign.currentCare;

        }


        if (!story.trim()) {

            story =
                `${animalName} was rescued and is currently receiving temporary care. Your support can help provide the care needed during recovery.`;

        }


        return {

            id:
                campaign.id,

            name:
                animalName,

            title:
                `${animalName}'s Rescue Fund`,

            subtitle:
                `Help ${animalName} receive the care they need while recovering.`,


            animal:
                capitalise(animal),


            cause:
                cause,


            image:
                campaign.image ||
                fallbackImage,


            raised:
                raised,


            goal:
                goal,


            donors:
                donors,


            status:
                campaign.status ||
                "Pending Review",


            story:
                story.trim(),


            submitted:
                true,

            rescueLocation:
                campaign.rescueLocation ||
                "",

            rescueDate:
                campaign.rescueDate ||
                "",

            breed:
                campaign.animalBreed ||
                "",

            age:
                campaign.animalAge ||
                "",

            gender:
                campaign.animalGender ||
                "",

            careDuration:
                campaign.careDuration ||
                "",

            rescuerName:
                campaign.rescuerName ||
                "",

            causeDetails:
                campaign.fundUsage ||
                ""

        };

    }


    /* =====================================================
       FIND CAMPAIGN
       ===================================================== */

    function getCampaign() {

        /*
         * First check demo campaigns.
         */

        if (
            demoCampaigns[campaignId]
        ) {

            return demoCampaigns[
                campaignId
            ];

        }


        /*
         * Then check submitted campaigns.
         */

        const submittedCampaigns =
            getSubmittedCampaigns();


        const submitted =
            submittedCampaigns.find(
                campaign =>
                    campaign.id ===
                    campaignId
            );


        if (submitted) {

            return convertSubmittedCampaign(
                submitted
            );

        }


        /*
         * If ID doesn't exist,
         * fall back to Bruno.
         */

        return demoCampaigns.bruno;

    }


    const campaign =
        getCampaign();


    /* =====================================================
       CALCULATE PROGRESS
       ===================================================== */

    function getProgress() {

        if (
            !campaign.goal ||
            campaign.goal <= 0
        ) {

            return 0;

        }


        return Math.min(
            100,
            Math.round(
                (
                    campaign.raised /
                    campaign.goal
                ) * 100
            )
        );

    }


    let currentRaised =
        Number(
            campaign.raised
        ) || 0;


    let currentDonors =
        Number(
            campaign.donors
        ) || 0;


    /* =====================================================
       DOM ELEMENTS
       ===================================================== */

    const title =
        document.getElementById(
            "campaignTitle"
        );


    const subtitle =
        document.getElementById(
            "campaignSubtitle"
        );


    const animal =
        document.getElementById(
            "campaignAnimal"
        );


    const cause =
        document.getElementById(
            "campaignCause"
        );


    const image =
        document.getElementById(
            "campaignImage"
        );


    const story =
        document.getElementById(
            "campaignStory"
        );


    const breadcrumb =
        document.getElementById(
            "breadcrumbName"
        );


    const raisedAmount =
        document.getElementById(
            "raisedAmount"
        );


    const goalAmount =
        document.getElementById(
            "goalAmount"
        );


    const progressFill =
        document.getElementById(
            "progressFill"
        );


    const progressPercent =
        document.getElementById(
            "progressPercent"
        );


    const donorCount =
        document.getElementById(
            "donorCount"
        );


    const sidebarDonors =
        document.getElementById(
            "sidebarDonors"
        );


    const customAmount =
        document.getElementById(
            "customAmount"
        );


    const donateButton =
        document.getElementById(
            "donateButton"
        );


    const anonymousDonation =
        document.getElementById(
            "anonymousDonation"
        );


    const donationModal =
        document.getElementById(
            "donationModal"
        );


    const modalClose =
        document.getElementById(
            "modalClose"
        );


    const modalDone =
        document.getElementById(
            "modalDone"
        );


    const donationSuccessText =
        document.getElementById(
            "donationSuccessText"
        );


    const shareCampaign =
        document.getElementById(
            "shareCampaign"
        );


    const finalShareButton =
        document.getElementById(
            "finalShareButton"
        );


    const donorList =
        document.getElementById(
            "donorList"
        );


    /* =====================================================
       POPULATE CAMPAIGN
       ===================================================== */

    function populateCampaign() {

        if (title) {

            title.textContent =
                campaign.title;

        }


        if (subtitle) {

            subtitle.textContent =
                campaign.subtitle;

        }


        if (animal) {

            animal.textContent =
                campaign.animal;

        }


        if (cause) {

            cause.textContent =
                campaign.cause;

        }


        if (breadcrumb) {

            breadcrumb.textContent =
                campaign.name;

        }


        if (image) {

            image.src =
                campaign.image;

            image.alt =
                `${campaign.name} rescue`;

            image.onerror = () => {

                image.src =
                    fallbackImage;

            };

        }


        if (story) {

            story.textContent =
                campaign.story;

        }


        updateNumbers();

        populateSubmittedDetails();

    }


    /* =====================================================
       SUBMITTED CAMPAIGN EXTRA DETAILS
       ===================================================== */

    function populateSubmittedDetails() {

        if (!campaign.submitted) {
            return;
        }


        /*
         * Add useful details underneath
         * the existing story if matching
         * elements exist in the HTML.
         *
         * This makes the JS compatible with
         * the current details page without
         * requiring HTML changes.
         */

        const details = [];


        if (campaign.breed) {

            details.push(
                `Breed: ${campaign.breed}`
            );

        }


        if (campaign.age) {

            details.push(
                `Age: ${campaign.age}`
            );

        }


        if (campaign.gender) {

            details.push(
                `Gender: ${campaign.gender}`
            );

        }


        if (campaign.rescueLocation) {

            details.push(
                `Rescued from: ${campaign.rescueLocation}`
            );

        }


        if (campaign.careDuration) {

            details.push(
                `Care duration: ${campaign.careDuration}`
            );

        }


        const extraDetails =
            document.getElementById(
                "campaignExtraDetails"
            );


        if (
            extraDetails &&
            details.length
        ) {

            extraDetails.innerHTML =
                details
                    .map(
                        item =>
                            `<span>${escapeHTML(item)}</span>`
                    )
                    .join("");

        }

    }


    /* =====================================================
       UPDATE NUMBERS
       ===================================================== */

    function updateNumbers() {

        const progress =
            campaign.goal > 0
                ? Math.min(
                    100,
                    Math.round(
                        (
                            currentRaised /
                            campaign.goal
                        ) * 100
                    )
                )
                : 0;


        if (raisedAmount) {

            raisedAmount.textContent =
                formatCurrency(
                    currentRaised
                );

        }


        if (goalAmount) {

            goalAmount.textContent =
                formatCurrency(
                    campaign.goal
                );

        }


        if (progressFill) {

            progressFill.style.width =
                `${progress}%`;

        }


        if (progressPercent) {

            progressPercent.textContent =
                `${progress}%`;

        }


        if (donorCount) {

            donorCount.textContent =
                currentDonors;

        }


        if (sidebarDonors) {

            sidebarDonors.textContent =
                currentDonors;

        }

    }


    /* =====================================================
       DONATION AMOUNT BUTTONS
       ===================================================== */

    const amountButtons =
        document.querySelectorAll(
            ".amount-button[data-amount]"
        );


    amountButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    amountButtons.forEach(
                        item =>
                            item.classList.remove(
                                "selected"
                            )
                    );


                    button.classList.add(
                        "selected"
                    );


                    if (customAmount) {

                        customAmount.value =
                            button.dataset.amount;

                    }

                }
            );

        }
    );


    /* =====================================================
       CUSTOM AMOUNT
       ===================================================== */

    if (customAmount) {

        customAmount.addEventListener(
            "input",
            () => {

                amountButtons.forEach(
                    button =>
                        button.classList.remove(
                            "selected"
                        )
                );

            }
        );

    }


    /* =====================================================
       DONATE
       ===================================================== */

    if (donateButton) {

        donateButton.addEventListener(
            "click",
            () => {

                const amount =
                    Number(
                        customAmount
                            ? customAmount.value
                            : 0
                    );


                if (
                    !amount ||
                    amount <= 0
                ) {

                    showToast(
                        "Please choose a donation amount."
                    );

                    if (customAmount) {
                        customAmount.focus();
                    }

                    return;

                }


                if (
                    amount > 10000000
                ) {

                    showToast(
                        "Please enter a smaller donation amount."
                    );

                    return;

                }


                /*
                 * This is intentionally a DEMO.
                 * No real payment is processed.
                 */

                currentRaised += amount;

                currentDonors += 1;


                updateNumbers();


                addDonor(
                    amount
                );


                showDonationModal(
                    amount
                );

            }
        );

    }


    /* =====================================================
       ADD DONOR
       ===================================================== */

    function addDonor(amount) {

        if (!donorList) {
            return;
        }


        const anonymous =
            anonymousDonation
                ? anonymousDonation.checked
                : false;


        const donorName =
            anonymous
                ? "Anonymous"
                : "You";


        const row =
            document.createElement(
                "div"
            );


        row.className =
            "donor-row";


        row.innerHTML = `

            <div class="donor-avatar">
                ${anonymous ? "♡" : "🐾"}
            </div>

            <div class="donor-info">

                <strong>
                    ${escapeHTML(donorName)}
                </strong>

                <span>
                    Just now
                </span>

            </div>

            <strong class="donor-amount">
                ${formatCurrency(amount)}
            </strong>

        `;


        donorList.prepend(
            row
        );

    }


    /* =====================================================
       DONATION MODAL
       ===================================================== */

    function showDonationModal(
        amount
    ) {

        if (!donationModal) {
            return;
        }


        if (donationSuccessText) {

            donationSuccessText.textContent =
                `Thank you for your generous ${formatCurrency(amount)} donation to ${campaign.name}. Your support means so much.`;

        }


        donationModal.classList.add(
            "show"
        );


        document.body.classList.add(
            "modal-open"
        );

    }


    function closeDonationModal() {

        if (donationModal) {

            donationModal.classList.remove(
                "show"
            );

        }


        document.body.classList.remove(
            "modal-open"
        );

    }


    if (modalClose) {

        modalClose.addEventListener(
            "click",
            closeDonationModal
        );

    }


    if (modalDone) {

        modalDone.addEventListener(
            "click",
            closeDonationModal
        );

    }


    if (donationModal) {

        donationModal.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    donationModal
                ) {

                    closeDonationModal();

                }

            }
        );

    }


    /* =====================================================
       SHARE
       ===================================================== */

    function shareCampaignPage() {

        const shareData = {

            title:
                campaign.title,

            text:
                campaign.subtitle,

            url:
                window.location.href

        };


        if (
            navigator.share
        ) {

            navigator.share(
                shareData
            ).catch(
                () => {}
            );


            return;

        }


        if (
            navigator.clipboard
        ) {

            navigator.clipboard
                .writeText(
                    window.location.href
                )
                .then(
                    () => {

                        showToast(
                            "Campaign link copied!"
                        );

                    }
                )
                .catch(
                    () => {

                        showToast(
                            "Unable to copy the link."
                        );

                    }
                );

            return;

        }


        showToast(
            "Share this page using your browser's share option."
        );

    }


    if (shareCampaign) {

        shareCampaign.addEventListener(
            "click",
            shareCampaignPage
        );

    }


    if (finalShareButton) {

        finalShareButton.addEventListener(
            "click",
            shareCampaignPage
        );

    }


    /* =====================================================
       TOAST
       ===================================================== */

    function showToast(message) {

        let toast =
            document.querySelector(
                ".fund-details-toast"
            );


        if (!toast) {

            toast =
                document.createElement(
                    "div"
                );

            toast.className =
                "fund-details-toast";

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

    function formatCurrency(
        amount
    ) {

        return (
            "₹" +
            Number(
                amount || 0
            ).toLocaleString(
                "en-IN"
            )
        );

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

    populateCampaign();

});