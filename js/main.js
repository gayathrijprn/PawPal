document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       PAWPAL MAIN WEBSITE JAVASCRIPT
       FRONTEND ONLY
    ====================================================== */


    /* =====================================================
       MOBILE NAVIGATION
    ====================================================== */

    const menuButton =
        document.querySelector(
            ".mobile-menu-btn, .menu-toggle, [data-menu-toggle]"
        );


    const navigation =
        document.querySelector(
            ".nav-links, .navbar-links, .main-nav, .navigation"
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


                menuButton.classList.toggle(
                    "active"
                );

            }
        );


        navigation
            .querySelectorAll("a")
            .forEach(
                function (link) {

                    link.addEventListener(
                        "click",
                        function () {

                            navigation.classList.remove(
                                "open"
                            );

                            menuButton.classList.remove(
                                "active"
                            );

                        }
                    );

                }
            );

    }


    /* =====================================================
       SMOOTH SCROLLING
    ====================================================== */

    document.querySelectorAll(
        'a[href^="#"]'
    ).forEach(
        function (link) {

            link.addEventListener(
                "click",
                function (event) {

                    const targetId =
                        link.getAttribute(
                            "href"
                        );


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


                    if (!target) {
                        return;
                    }


                    event.preventDefault();


                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }
            );

        }
    );


    /* =====================================================
       NAVBAR SCROLL EFFECT
    ====================================================== */

    const navbar =
        document.querySelector(
            ".navbar, .site-header, header"
        );


    function updateNavbar() {

        if (!navbar) {
            return;
        }


        if (
            window.scrollY > 30
        ) {

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
        updateNavbar
    );


    updateNavbar();


    /* =====================================================
       FEATURED PET CARDS
       -----------------------------------------------------
       Makes homepage featured pets open their
       corresponding detail pages.
    ====================================================== */

    const featuredPets =
        document.querySelectorAll(
            ".home-pet-card"
        );


    const featuredPetIds = [
        "milo",
        "luna",
        "bruno"
    ];


    featuredPets.forEach(
        function (card, index) {

            const petId =
                card.dataset.pet ||
                card.dataset.details ||
                featuredPetIds[index];


            if (!petId) {
                return;
            }


            card.style.cursor =
                "pointer";


            card.setAttribute(
                "tabindex",
                "0"
            );


            card.setAttribute(
                "role",
                "link"
            );


            card.addEventListener(
                "click",
                function (event) {

                    /*
                       Do not navigate when the
                       favourite/like button is clicked.
                    */

                    if (
                        event.target.closest(
                            ".pet-like, .pet-favourite, .favorite-button"
                        )
                    ) {

                        return;

                    }


                    window.location.href =
                        "../pages/pet-details.html?pet=" +
                        encodeURIComponent(
                            petId
                        );

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
                            "../pages/pet-details.html?pet=" +
                            encodeURIComponent(
                                petId
                            );

                    }

                }
            );

        }
    );


    /* =====================================================
       HOMEPAGE PET FAVOURITES
    ====================================================== */

    document.querySelectorAll(
        ".pet-like, .home-pet-card .favorite-button"
    ).forEach(
        function (button, index) {

            const card =
                button.closest(
                    ".home-pet-card"
                );


            if (!card) {
                return;
            }


            const petId =
                card.dataset.pet ||
                card.dataset.details ||
                featuredPetIds[index] ||
                card.querySelector(
                    ".pet-name"
                )?.textContent
                    .trim()
                    .toLowerCase()
                    .replace(/\s+/g, "-");


            const storageKey =
                "pawpal-favorite-" +
                petId;


            if (
                localStorage.getItem(
                    storageKey
                ) === "true"
            ) {

                button.classList.add(
                    "active"
                );


                if (
                    button.textContent.trim() ===
                    "♡"
                ) {

                    button.textContent =
                        "♥";

                }

            }


            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();
                    event.stopPropagation();


                    const active =
                        button.classList.toggle(
                            "active"
                        );


                    button.textContent =
                        active
                            ? "♥"
                            : "♡";


                    localStorage.setItem(
                        storageKey,
                        active
                    );

                }
            );

        }
    );


    /* =====================================================
       CTA BUTTONS
    ====================================================== */

    document.querySelectorAll(
        "[data-action]"
    ).forEach(
        function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    const action =
                        button.dataset.action;


                    if (
                        action ===
                        "browse-pets"
                    ) {

                        event.preventDefault();

                        window.location.href =
                            "../pages/pets.html";

                    }


                    if (
                        action ===
                        "login"
                    ) {

                        event.preventDefault();

                        window.location.href =
                            "../pages/login.html";

                    }


                    if (
                        action ===
                        "register"
                    ) {

                        event.preventDefault();

                        window.location.href =
                            "../pages/register.html";

                    }


                    if (
                        action ===
                        "adopt"
                    ) {

                        event.preventDefault();

                        window.location.href =
                            "../pages/adoption-form.html";

                    }

                }
            );

        }
    );


    /* =====================================================
       GENERIC BROWSE PETS BUTTONS
    ====================================================== */

    document.querySelectorAll(
        ".browse-pets-btn, .find-pet-btn"
    ).forEach(
        function (button) {

            const href =
                button.getAttribute(
                    "href"
                );


            if (href) {
                return;
            }


            button.addEventListener(
                "click",
                function () {

                    window.location.href =
                        "../pages/pets.html";

                }
            );

        }
    );


    /* =====================================================
       NEWSLETTER FORM
    ====================================================== */

    const newsletterForm =
        document.querySelector(
            "#newsletterForm, .newsletter-form"
        );


    if (newsletterForm) {

        newsletterForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const emailInput =
                    newsletterForm.querySelector(
                        'input[type="email"]'
                    );


                if (
                    !emailInput ||
                    !emailInput.value.trim()
                ) {

                    showMainToast(
                        "Please enter your email address.",
                        "error"
                    );

                    return;

                }


                const email =
                    emailInput.value
                        .trim();


                const emailPattern =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


                if (
                    !emailPattern.test(
                        email
                    )
                ) {

                    showMainToast(
                        "Please enter a valid email address.",
                        "error"
                    );

                    return;

                }


                localStorage.setItem(
                    "pawpal-newsletter-email",
                    email
                );


                emailInput.value =
                    "";


                showMainToast(
                    "You're on the PawPal list! 🐾💌",
                    "success"
                );

            }
        );

    }


    /* =====================================================
       MAIN TOAST
    ====================================================== */

    function showMainToast(
        message,
        type = "success"
    ) {

        let toast =
            document.getElementById(
                "pawpalMainToast"
            );


        if (!toast) {

            toast =
                document.createElement(
                    "div"
                );


            toast.id =
                "pawpalMainToast";


            toast.style.position =
                "fixed";


            toast.style.left =
                "50%";


            toast.style.bottom =
                "28px";


            toast.style.transform =
                "translateX(-50%) translateY(20px)";


            toast.style.padding =
                "13px 20px";


            toast.style.borderRadius =
                "14px";


            toast.style.fontFamily =
                "DM Sans, sans-serif";


            toast.style.fontSize =
                "14px";


            toast.style.fontWeight =
                "700";


            toast.style.zIndex =
                "9999";


            toast.style.opacity =
                "0";


            toast.style.pointerEvents =
                "none";


            toast.style.transition =
                "all .25s ease";


            document.body.appendChild(
                toast
            );

        }


        if (
            type === "error"
        ) {

            toast.style.background =
                "#fcefeb";

            toast.style.color =
                "#b95742";

            toast.style.border =
                "1px solid #f1c8bd";

        } else {

            toast.style.background =
                "#e7eee3";

            toast.style.color =
                "#60745a";

            toast.style.border =
                "1px solid #cbdcc6";

        }


        toast.textContent =
            message;


        toast.style.opacity =
            "1";


        toast.style.transform =
            "translateX(-50%) translateY(0)";


        clearTimeout(
            window.pawpalMainToastTimer
        );


        window.pawpalMainToastTimer =
            setTimeout(
                function () {

                    toast.style.opacity =
                        "0";


                    toast.style.transform =
                        "translateX(-50%) translateY(20px)";

                },
                3000
            );

    }


    /* =====================================================
       SCROLL REVEAL
    ====================================================== */

    const revealElements =
        document.querySelectorAll(
            ".feature-card, " +
            ".home-pet-card, " +
            ".why-card, " +
            ".story-card, " +
            ".section-heading"
        );


    if (
        "IntersectionObserver"
        in window
    ) {

        const observer =
            new IntersectionObserver(
                function (entries) {

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

                observer.observe(
                    element
                );

            }
        );

    } else {

        revealElements.forEach(
            function (element) {

                element.classList.add(
                    "visible"
                );

            }
        );

    }


    /* =====================================================
       BACK TO TOP
    ====================================================== */

    const backToTop =
        document.querySelector(
            ".back-to-top, [data-back-to-top]"
        );


    if (backToTop) {

        backToTop.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                window.scrollTo({

                    top: 0,

                    behavior: "smooth"

                });

            }
        );

    }


    /* =====================================================
       ESCAPE KEY
       -----------------------------------------------------
       Closes mobile menus.
    ====================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key ===
                "Escape"
            ) {

                if (navigation) {

                    navigation.classList.remove(
                        "open"
                    );

                }


                if (menuButton) {

                    menuButton.classList.remove(
                        "active"
                    );

                }

            }

        }
    );


    /* =====================================================
       CURRENT YEAR
    ====================================================== */

    document.querySelectorAll(
        "[data-current-year]"
    ).forEach(
        function (element) {

            element.textContent =
                new Date().getFullYear();

        }
    );


    /* =====================================================
       INITIALIZE
    ====================================================== */

    console.log(
        "PawPal main website loaded successfully 🐾"
    );


});