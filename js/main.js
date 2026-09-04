document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const menuButton =
        document.getElementById("mobileMenuButton");

    const navigation =
        document.getElementById("mainNavigation");

    const featuresDropdown =
        document.getElementById("featuresDropdown");

    const featuresButton =
        document.getElementById("featuresButton");

    const rescueDropdown =
        document.getElementById("rescueDropdown");

    const rescueButton =
        document.getElementById("rescueDropdownButton");


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    if (menuButton && navigation) {

        menuButton.addEventListener("click", function (event) {

            event.preventDefault();
            event.stopPropagation();

            const isOpen =
                navigation.classList.toggle("mobile-open");

            menuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            menuButton.innerHTML =
                isOpen ? "✕" : "☰";

        });

    }


    /* =====================================================
       FEATURES DROPDOWN
    ===================================================== */

    function openFeatures() {

        if (!featuresDropdown || !featuresButton) {
            return;
        }

        featuresDropdown.classList.add("dropdown-open");

        featuresButton.setAttribute(
            "aria-expanded",
            "true"
        );

    }


    function closeFeatures() {

        if (!featuresDropdown || !featuresButton) {
            return;
        }

        featuresDropdown.classList.remove(
            "dropdown-open"
        );

        featuresButton.setAttribute(
            "aria-expanded",
            "false"
        );

        closeRescue();

    }


    function toggleFeatures() {

        if (!featuresDropdown || !featuresButton) {
            return;
        }

        const isOpen =
            featuresDropdown.classList.contains(
                "dropdown-open"
            );

        if (isOpen) {
            closeFeatures();
        } else {
            openFeatures();
        }

    }


    if (featuresButton) {

        featuresButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                toggleFeatures();

            }
        );

    }


    /* =====================================================
       RESCUE & ADOPTION NESTED DROPDOWN
    ===================================================== */

    function openRescue() {

        if (!rescueDropdown || !rescueButton) {
            return;
        }

        rescueDropdown.classList.add(
            "nested-open"
        );

        rescueButton.setAttribute(
            "aria-expanded",
            "true"
        );

    }


    function closeRescue() {

        if (!rescueDropdown || !rescueButton) {
            return;
        }

        rescueDropdown.classList.remove(
            "nested-open"
        );

        rescueButton.setAttribute(
            "aria-expanded",
            "false"
        );

    }


    function toggleRescue() {

        if (!rescueDropdown || !rescueButton) {
            return;
        }

        const isOpen =
            rescueDropdown.classList.contains(
                "nested-open"
            );

        if (isOpen) {
            closeRescue();
        } else {
            openRescue();
        }

    }


    if (rescueButton) {

        rescueButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                /*
                 * Make sure the main Features
                 * dropdown stays open.
                 */

                openFeatures();

                toggleRescue();

            }
        );

    }


    /* =====================================================
       IMPORTANT:
       ALLOW RESCUE MENU LINKS TO NAVIGATE
    ===================================================== */

    if (rescueDropdown) {

        const rescueLinks =
            rescueDropdown.querySelectorAll(
                ".nested-dropdown-menu a"
            );

        rescueLinks.forEach(function (link) {

            link.addEventListener(
                "click",
                function () {

                    /*
                     * DO NOT preventDefault()
                     * DO NOT stopPropagation()
                     *
                     * The browser must be allowed
                     * to follow the href normally.
                     */

                    closeRescue();
                    closeFeatures();

                }
            );

        });

    }


    /* =====================================================
       FEATURE DROPDOWN LINKS
    ===================================================== */

    if (featuresDropdown) {

        const featureLinks =
            featuresDropdown.querySelectorAll(
                "a"
            );

        featureLinks.forEach(function (link) {

            link.addEventListener(
                "click",
                function () {

                    /*
                     * Let the browser follow
                     * the href normally.
                     */

                    closeRescue();
                    closeFeatures();

                }
            );

        });

    }


    /* =====================================================
       CLICK OUTSIDE DROPDOWNS
    ===================================================== */

    document.addEventListener(
        "click",
        function (event) {

            /*
             * If click is outside Features dropdown,
             * close everything.
             */

            if (
                featuresDropdown &&
                !featuresDropdown.contains(event.target)
            ) {

                closeFeatures();

            }

        }
    );


    /* =====================================================
       ESCAPE KEY
    ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                closeFeatures();

            }

        }
    );


    /* =====================================================
       CLOSE MOBILE MENU AFTER NAVIGATION
    ===================================================== */

    if (navigation) {

        navigation
            .querySelectorAll("a")
            .forEach(function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        if (window.innerWidth <= 900) {

                            navigation.classList.remove(
                                "mobile-open"
                            );

                            if (menuButton) {

                                menuButton.setAttribute(
                                    "aria-expanded",
                                    "false"
                                );

                                menuButton.innerHTML =
                                    "☰";

                            }

                            closeFeatures();

                        }

                    }
                );

            });

    }


    /* =====================================================
       FAVOURITES
    ===================================================== */

    const favouriteButtons =
        document.querySelectorAll(
            ".heart-button"
        );


    let favourites = [];

    try {

        favourites =
            JSON.parse(
                localStorage.getItem(
                    "pawpal-favourites"
                )
            ) || [];

    } catch (error) {

        favourites = [];

    }


    favouriteButtons.forEach(
        function (button) {

            const petName =
                button.dataset.pet;


            if (
                favourites.includes(
                    petName
                )
            ) {

                button.classList.add(
                    "favourite-active"
                );

                button.textContent =
                    "♥";

            }


            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();
                    event.stopPropagation();


                    if (
                        favourites.includes(
                            petName
                        )
                    ) {

                        favourites =
                            favourites.filter(
                                function (pet) {

                                    return pet !==
                                        petName;

                                }
                            );

                        button.classList.remove(
                            "favourite-active"
                        );

                        button.textContent =
                            "♡";

                    } else {

                        favourites.push(
                            petName
                        );

                        button.classList.add(
                            "favourite-active"
                        );

                        button.textContent =
                            "♥";

                    }


                    localStorage.setItem(
                        "pawpal-favourites",
                        JSON.stringify(
                            favourites
                        )
                    );

                }
            );

        }
    );


    /* =====================================================
       PET CARD CLICK
    ===================================================== */

    const petCards =
        document.querySelectorAll(
            ".home-pet-card"
        );


    petCards.forEach(
        function (card) {

            card.addEventListener(
                "click",
                function (event) {

                    if (
                        event.target.closest(
                            ".heart-button"
                        )
                    ) {

                        return;

                    }


                    window.location.href =
                        "pages/pets.html";

                }
            );


            card.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key === "Enter" ||
                        event.key === " "
                    ) {

                        event.preventDefault();

                        window.location.href =
                            "pages/pets.html";

                    }

                }
            );

        }
    );


    /* =====================================================
       SAME-PAGE SMOOTH SCROLL
    ===================================================== */

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(function (link) {

            link.addEventListener(
                "click",
                function (event) {

                    const targetId =
                        link.getAttribute("href");

                    if (
                        !targetId ||
                        targetId === "#"
                    ) {

                        return;

                    }


                    const target =
                        document.querySelector(
                            targetId
                        );


                    if (target) {

                        event.preventDefault();

                        target.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });

                    }

                }
            );

        });


    /* =====================================================
       NAVBAR SCROLL EFFECT
    ===================================================== */

    const navbar =
        document.querySelector(
            ".navbar"
        );


    function updateNavbar() {

        if (!navbar) {
            return;
        }

        if (window.scrollY > 20) {

            navbar.classList.add(
                "scrolled"
            );

        } else {

            navbar.classList.remove(
                "scrolled"
            );

        }

    }


    window.addEventListener(
        "scroll",
        updateNavbar,
        { passive: true }
    );


    updateNavbar();


    /* =====================================================
       SCROLL REVEAL
    ===================================================== */

    const revealElements =
        document.querySelectorAll(
            ".feature-menu-card, " +
            ".step-card, " +
            ".home-pet-card, " +
            ".home-rescued-card, " +
            ".success-story-card"
        );


    if (
        "IntersectionObserver" in window &&
        revealElements.length
    ) {

        const revealObserver =
            new IntersectionObserver(
                function (entries, observer) {

                    entries.forEach(
                        function (entry) {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.classList.add(
                                    "visible"
                                );

                                observer.unobserve(
                                    entry.target
                                );

                            }

                        }
                    );

                },
                {
                    threshold: 0.12
                }
            );


        revealElements.forEach(
            function (element) {

                revealObserver.observe(
                    element
                );

            }
        );

    }


    /* =====================================================
       CURRENT YEAR
    ===================================================== */

    document
        .querySelectorAll(
            "[data-current-year]"
        )
        .forEach(
            function (element) {

                element.textContent =
                    new Date().getFullYear();

            }
        );


    /* =====================================================
       INITIAL STATE
    ===================================================== */

    closeFeatures();


    console.log(
        "PawPal navigation initialized successfully 🐾"
    );

});