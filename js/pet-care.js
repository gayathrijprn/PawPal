document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       PET CARE PAGE
    ====================================================== */

    const serviceCards = document.querySelectorAll(".care-service-card");
    const careSections = document.querySelectorAll(".care-detail-section");
    const backToTopButton = document.getElementById("careBackToTop");
    const toastContainer = document.getElementById("careToast");



    /* =====================================================
       SERVICE CARD NAVIGATION
    ====================================================== */

    serviceCards.forEach(function (card) {

        card.addEventListener("click", function (event) {

            /*
                Do not interfere with buttons or links
                inside the card.
            */

            if (
                event.target.closest("a") ||
                event.target.closest("button")
            ) {
                return;
            }

            const targetId = card.dataset.target;

            if (!targetId) {
                return;
            }

            const targetSection =
                document.getElementById(targetId);

            if (targetSection) {

                targetSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        });


        /* Keyboard accessibility */

        card.addEventListener("keydown", function (event) {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                const targetId =
                    card.dataset.target;

                const targetSection =
                    document.getElementById(targetId);

                if (targetSection) {

                    targetSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }

            }

        });

    });



    /* =====================================================
       ACTIVE SERVICE CARD
    ====================================================== */

    const sectionObserver =
        new IntersectionObserver(
            function (entries) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        const sectionId =
                            entry.target.id;

                        serviceCards.forEach(function (card) {

                            card.classList.remove("active");

                            if (
                                card.dataset.target ===
                                sectionId
                            ) {

                                card.classList.add("active");

                            }

                        });

                    }

                });

            },
            {
                threshold: 0.25,
                rootMargin: "-80px 0px -35% 0px"
            }
        );


    careSections.forEach(function (section) {

        sectionObserver.observe(section);

    });



    /* =====================================================
       APPOINTMENT BUTTONS
    ====================================================== */

    document.querySelectorAll(
        "[data-care-action]"
    ).forEach(function (button) {

        button.addEventListener("click", function () {

            const action =
                button.dataset.careAction;

            handleCareAction(action);

        });

    });



    function handleCareAction(action) {

        let message = "";

        switch (action) {

            case "grooming":

                message =
                    "Grooming appointments will be available soon. 🛁🐾";

                break;


            case "mating":

                message =
                    "Pet matching will help you connect with compatible pets and responsible owners. 💕";

                break;


            case "wellness":

                message =
                    "Wellness tools are coming soon to help you understand your pet's mood and wellbeing. 🧠🐾";

                break;


            case "heat":

                message =
                    "Heat-cycle tracking and care reminders are coming soon. 🌸🐾";

                break;


            default:

                message =
                    "This PawPal feature is coming soon! 🐾";

        }

        showToast(message);

    }



    /* =====================================================
       WELLNESS MOOD SELECTOR
    ====================================================== */

    const moodButtons =
        document.querySelectorAll(".mood-button");

    const moodMessage =
        document.getElementById("moodMessage");


    const moodMessages = {

        happy:
            "Your pet seems happy! Keep the good vibes going with playtime and affection. 💕",

        playful:
            "Playful energy detected! Try a short game, walk or enrichment activity. 🧸",

        calm:
            "A calm mood is wonderful. Give your pet a cosy space to relax. 🌿",

        sleepy:
            "Sleepy pets need their rest. Let them enjoy a peaceful nap. 😴",

        anxious:
            "Your pet may need some extra reassurance. Keep the environment calm and comfortable. 🤍"

    };


    moodButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            moodButtons.forEach(function (item) {

                item.classList.remove("selected");

            });

            button.classList.add("selected");

            const mood =
                button.dataset.mood;

            if (
                moodMessage &&
                moodMessages[mood]
            ) {

                moodMessage.textContent =
                    moodMessages[mood];

                moodMessage.classList.add("show");

            }

        });

    });



    /* =====================================================
       HEAT CARE CYCLE CALCULATOR
    ====================================================== */

    const cycleStart =
        document.getElementById("cycleStart");

    const cycleLength =
        document.getElementById("cycleLength");

    const calculateCycle =
        document.getElementById("calculateCycle");

    const cycleResult =
        document.getElementById("cycleResult");


    if (
        cycleStart &&
        cycleLength &&
        calculateCycle &&
        cycleResult
    ) {

        calculateCycle.addEventListener(
            "click",
            function () {

                if (!cycleStart.value) {

                    cycleResult.textContent =
                        "Please select the start date first. 🌸";

                    cycleResult.classList.add("show");

                    return;

                }


                const startDate =
                    new Date(
                        cycleStart.value + "T00:00:00"
                    );


                const days =
                    Number(cycleLength.value) || 21;


                const nextDate =
                    new Date(startDate);

                nextDate.setDate(
                    nextDate.getDate() + days
                );


                const formattedDate =
                    nextDate.toLocaleDateString(
                        undefined,
                        {
                            day: "numeric",
                            month: "long",
                            year: "numeric"
                        }
                    );


                cycleResult.textContent =
                    "Based on the cycle length you entered, your next estimated cycle date is " +
                    formattedDate +
                    ". This is only an estimate and is not a veterinary diagnosis. 🌸";


                cycleResult.classList.add("show");

            }
        );

    }



    /* =====================================================
       CARE CHECKLIST
    ====================================================== */

    const checklistItems =
        document.querySelectorAll(
            ".care-check-item input"
        );


    checklistItems.forEach(function (checkbox) {

        checkbox.addEventListener(
            "change",
            function () {

                const item =
                    checkbox.closest(
                        ".care-check-item"
                    );

                if (!item) {
                    return;
                }


                if (checkbox.checked) {

                    item.classList.add("completed");

                } else {

                    item.classList.remove("completed");

                }

            }
        );

    });



    /* =====================================================
       FAQ ACCORDION
    ====================================================== */

    const faqItems =
        document.querySelectorAll(".care-faq-item");


    faqItems.forEach(function (item) {

        const question =
            item.querySelector(".care-faq-question");


        if (!question) {
            return;
        }


        question.addEventListener(
            "click",
            function () {

                const isOpen =
                    item.classList.contains("open");


                faqItems.forEach(function (otherItem) {

                    otherItem.classList.remove("open");

                });


                if (!isOpen) {

                    item.classList.add("open");

                }

            }
        );

    });



    /* =====================================================
       SCROLL REVEAL
    ====================================================== */

    const revealElements =
        document.querySelectorAll(
            ".care-reveal"
        );


    const revealObserver =
        new IntersectionObserver(
            function (entries, observer) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "visible"
                        );

                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.12
            }
        );


    revealElements.forEach(function (element) {

        revealObserver.observe(element);

    });



    /* =====================================================
       BACK TO TOP
    ====================================================== */

    if (backToTopButton) {

        window.addEventListener(
            "scroll",
            function () {

                if (window.scrollY > 500) {

                    backToTopButton.classList.add(
                        "show"
                    );

                } else {

                    backToTopButton.classList.remove(
                        "show"
                    );

                }

            }
        );


        backToTopButton.addEventListener(
            "click",
            function () {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );

    }



    /* =====================================================
       TOAST
    ====================================================== */

    function showToast(message) {

        if (!toastContainer) {
            return;
        }


        toastContainer.textContent =
            message;

        toastContainer.classList.add("show");


        setTimeout(function () {

            toastContainer.classList.remove(
                "show"
            );

        }, 4000);

    }



    /* =====================================================
       MOBILE NAVIGATION
    ====================================================== */

    const menuButton =
        document.querySelector(
            ".mobile-menu-btn, .menu-toggle, [data-menu-toggle]"
        );

    const navigation =
        document.querySelector(
            ".navigation, .nav-links, .main-nav"
        );


    if (
        menuButton &&
        navigation
    ) {

        menuButton.addEventListener(
            "click",
            function () {

                navigation.classList.toggle(
                    "open"
                );

                navigation.classList.toggle(
                    "active"
                );

                const expanded =
                    navigation.classList.contains(
                        "open"
                    ) ||
                    navigation.classList.contains(
                        "active"
                    );

                menuButton.setAttribute(
                    "aria-expanded",
                    expanded
                );

            }
        );


        navigation
            .querySelectorAll("a")
            .forEach(function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        navigation.classList.remove(
                            "open"
                        );

                        navigation.classList.remove(
                            "active"
                        );

                        menuButton.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    }
                );

            });

    }



    /* =====================================================
       ESCAPE KEY
    ====================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key !== "Escape") {
                return;
            }


            if (navigation) {

                navigation.classList.remove(
                    "open"
                );

                navigation.classList.remove(
                    "active"
                );

            }


            if (menuButton) {

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        }
    );



    /* =====================================================
       CURRENT YEAR
    ====================================================== */

    document.querySelectorAll(
        "[data-current-year]"
    ).forEach(function (element) {

        element.textContent =
            new Date().getFullYear();

    });



    /* =====================================================
       INITIAL STATE
    ====================================================== */

    if (serviceCards.length > 0) {

        serviceCards[0].classList.add("active");

    }


    console.log(
        "PawPal Pet Care loaded successfully 🐾"
    );

});