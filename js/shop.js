document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ====================================================== */

    const productGrid =
        document.getElementById("product-grid");

    const productCards = Array.from(
        document.querySelectorAll(".product-card")
    );

    const productSearch =
        document.getElementById("product-search");

    const categoryFilter =
        document.getElementById("category-filter");

    const petFilter =
        document.getElementById("pet-filter");

    const sortFilter =
        document.getElementById("sort-filter");

    const productsCount =
        document.getElementById("products-count");

    const activeFilterRow =
        document.getElementById("active-filter-row");

    const activeFilterText =
        document.getElementById("active-filter-text");

    const clearFiltersButton =
        document.getElementById("clear-filters");

    const clearFiltersEmpty =
        document.getElementById("clear-filters-empty");

    const noResults =
        document.getElementById("shop-no-results");

    /* =====================================================
       CART
    ====================================================== */

    const cartButton =
        document.getElementById("cart-button");

    const cartCount =
        document.getElementById("cart-count");

    const cartOverlay =
        document.getElementById("cart-overlay");

    const cartDrawer =
        document.getElementById("cart-drawer");

    const cartClose =
        document.getElementById("cart-close");

    const cartItems =
        document.getElementById("cart-items");

    const cartEmpty =
        document.getElementById("cart-empty");

    const cartFooter =
        document.getElementById("cart-footer");

    const cartSubtotal =
        document.getElementById("cart-subtotal");

    const continueShopping =
        document.getElementById("continue-shopping");

    const checkoutButton =
        document.getElementById("checkout-button");

    /* =====================================================
       QUICK VIEW
    ====================================================== */

    const quickViewBackdrop =
        document.getElementById("quick-view-backdrop");

    const quickView =
        document.getElementById("quick-view");

    const quickViewClose =
        document.getElementById("quick-view-close");

    const quickViewImage =
        document.getElementById("quick-view-image");

    const quickViewCategory =
        document.getElementById("quick-view-category");

    const quickViewTitle =
        document.getElementById("quick-view-title");

    const quickViewRating =
        document.getElementById("quick-view-rating");

    const quickViewDescription =
        document.getElementById("quick-view-description");

    const quickViewPrice =
        document.getElementById("quick-view-price");

    const quickAdd =
        document.getElementById("quick-add");

    /* =====================================================
       OTHER
    ====================================================== */

    const saleButton =
        document.getElementById("sale-button");

    const categoryButtons =
        document.querySelectorAll(
            ".category-card[data-category]"
        );

    const footerCategoryLinks =
        document.querySelectorAll(
            "[data-footer-category]"
        );

    const currentYear =
        document.getElementById("current-year");

    /* =====================================================
       STORAGE
    ====================================================== */

    const CART_STORAGE_KEY =
        "pawpalCart";

    const FAVOURITES_STORAGE_KEY =
        "pawpalFavourites";

    let cart =
        loadCart();

    let favourites =
        loadFavourites();

    let currentQuickViewProduct =
        null;

    /* =====================================================
       INITIALISE
    ====================================================== */

    if (currentYear) {
        currentYear.textContent =
            new Date().getFullYear();
    }

    initialiseProducts();
    updateFavouriteButtons();
    applyFilters();
    renderCart();

    /* =====================================================
       STORAGE — CART
    ====================================================== */

    function loadCart() {

        try {

            const saved =
                localStorage.getItem(
                    CART_STORAGE_KEY
                );

            if (!saved) {
                return [];
            }

            const parsed =
                JSON.parse(saved);

            return Array.isArray(parsed)
                ? parsed
                : [];

        } catch (error) {

            console.error(
                "PawPal cart loading error:",
                error
            );

            return [];
        }
    }

    function saveCart() {

        try {

            localStorage.setItem(
                CART_STORAGE_KEY,
                JSON.stringify(cart)
            );

        } catch (error) {

            console.error(
                "PawPal cart saving error:",
                error
            );
        }
    }

    /* =====================================================
       STORAGE — FAVOURITES
    ====================================================== */

    function loadFavourites() {

        try {

            const saved =
                localStorage.getItem(
                    FAVOURITES_STORAGE_KEY
                );

            if (!saved) {
                return [];
            }

            const parsed =
                JSON.parse(saved);

            return Array.isArray(parsed)
                ? parsed.map(String)
                : [];

        } catch (error) {

            console.error(
                "PawPal favourites loading error:",
                error
            );

            return [];
        }
    }

    function saveFavourites() {

        try {

            localStorage.setItem(
                FAVOURITES_STORAGE_KEY,
                JSON.stringify(favourites)
            );

        } catch (error) {

            console.error(
                "PawPal favourites saving error:",
                error
            );
        }
    }

    /* =====================================================
       PRODUCT INITIALISATION
    ====================================================== */

    function initialiseProducts() {

        productCards.forEach((card) => {

            const addButton =
                card.querySelector(
                    ".add-cart-button"
                );

            const favouriteButton =
                card.querySelector(
                    ".product-favourite"
                );

            if (addButton) {

                addButton.addEventListener(
                    "click",
                    (event) => {

                        event.preventDefault();
                        event.stopPropagation();

                        const product =
                            getProductFromCard(card);

                        if (product) {
                            addToCart(product);
                        }

                    }
                );
            }

            if (favouriteButton) {

                favouriteButton.addEventListener(
                    "click",
                    (event) => {

                        event.preventDefault();
                        event.stopPropagation();

                        const id =
                            String(
                                card.dataset.id || ""
                            );

                        toggleFavourite(id);

                    }
                );
            }

            card.addEventListener(
                "click",
                (event) => {

                    if (
                        event.target.closest(
                            "button, a"
                        )
                    ) {
                        return;
                    }

                    const product =
                        getProductFromCard(card);

                    if (product) {
                        openQuickView(product);
                    }

                }
            );

        });
    }

    /* =====================================================
       PRODUCT DATA
    ====================================================== */

    function getProductFromCard(card) {

        if (!card) {
            return null;
        }

        const id =
            String(
                card.dataset.id || ""
            );

        if (!id) {
            return null;
        }

        const name =
            card.dataset.name ||
            card.querySelector("h3")?.textContent.trim() ||
            "Pet Product";

        const category =
            card.dataset.category ||
            "all";

        const pet =
            card.dataset.pet ||
            "all";

        const price =
            parseFloat(
                card.dataset.price
            ) || 0;

        const oldPriceValue =
            parseFloat(
                card.dataset.oldPrice
            );

        const oldPrice =
            Number.isNaN(oldPriceValue)
                ? null
                : oldPriceValue;

        const rating =
            parseFloat(
                card.dataset.rating
            ) || 0;

        const featured =
            parseFloat(
                card.dataset.featured
            ) || 0;

        const image =
            card.dataset.image ||
            card.querySelector("img")?.src ||
            "";

        const description =
            card.querySelector(
                ".product-description"
            )?.textContent.trim() ||
            card.querySelector(
                ".product-info p"
            )?.textContent.trim() ||
            "";

        return {
            id,
            name,
            category,
            pet,
            price,
            oldPrice,
            rating,
            featured,
            image,
            description
        };
    }

    /* =====================================================
       FILTERS
    ====================================================== */

    function applyFilters() {

        const searchTerm =
            (
                productSearch?.value ||
                ""
            )
                .trim()
                .toLowerCase();

        const category =
            categoryFilter?.value ||
            "all";

        const pet =
            petFilter?.value ||
            "all";

        const sort =
            sortFilter?.value ||
            "featured";

        const visibleCards = [];

        productCards.forEach((card) => {

            const product =
                getProductFromCard(card);

            if (!product) {
                return;
            }

            const searchable =
                [
                    product.name,
                    product.category,
                    product.pet,
                    product.description
                ]
                    .join(" ")
                    .toLowerCase();

            const matchesSearch =
                !searchTerm ||
                searchable.includes(searchTerm);

            const matchesCategory =
                category === "all" ||
                product.category === category;

            const matchesPet =
                pet === "all" ||
                product.pet === "all" ||
                product.pet === pet;

            const show =
                matchesSearch &&
                matchesCategory &&
                matchesPet;

            if (show) {

                visibleCards.push(card);

            } else {

                card.style.display =
                    "none";
            }

        });

        sortCards(
            visibleCards,
            sort
        );

        visibleCards.forEach((card) => {

            card.style.display = "";

        });

        updateProductCount(
            visibleCards.length
        );

        updateActiveFilters(
            searchTerm,
            category,
            pet
        );

        if (noResults) {

            noResults.classList.toggle(
                "show",
                visibleCards.length === 0
            );
        }
    }

    /* =====================================================
       SORT
    ====================================================== */

    function sortCards(cards, sortType) {

        if (!productGrid) {
            return;
        }

        const sorted =
            [...cards];

        sorted.sort((a, b) => {

            const productA =
                getProductFromCard(a);

            const productB =
                getProductFromCard(b);

            if (!productA || !productB) {
                return 0;
            }

            switch (sortType) {

                case "price-low":
                case "price-asc":
                case "low-high":

                    return (
                        productA.price -
                        productB.price
                    );

                case "price-high":
                case "price-desc":
                case "high-low":

                    return (
                        productB.price -
                        productA.price
                    );

                case "rating":
                case "rating-high":

                    return (
                        productB.rating -
                        productA.rating
                    );

                case "name":
                case "name-az":

                    return productA.name.localeCompare(
                        productB.name
                    );

                case "featured":
                default:

                    return (
                        productB.featured -
                        productA.featured
                    );
            }

        });

        sorted.forEach((card) => {

            productGrid.appendChild(card);

        });
    }

    /* =====================================================
       COUNT
    ====================================================== */

    function updateProductCount(count) {

        if (!productsCount) {
            return;
        }

        productsCount.textContent =
            count === 1
                ? "Showing 1 product"
                : `Showing ${count} products`;
    }

    /* =====================================================
       ACTIVE FILTER
    ====================================================== */

    function updateActiveFilters(
        search,
        category,
        pet
    ) {

        if (
            !activeFilterRow ||
            !activeFilterText
        ) {
            return;
        }

        const filters = [];

        if (search) {

            filters.push(
                `Search: "${search}"`
            );
        }

        if (category !== "all") {

            filters.push(
                `Category: ${formatLabel(category)}`
            );
        }

        if (pet !== "all") {

            filters.push(
                `Pet: ${formatLabel(pet)}`
            );
        }

        if (filters.length) {

            activeFilterRow.style.display =
                "flex";

            activeFilterText.textContent =
                filters.join(" • ");

        } else {

            activeFilterRow.style.display =
                "none";

            activeFilterText.textContent =
                "";
        }
    }

    function formatLabel(value) {

        return value
            .replace(/[-_]/g, " ")
            .replace(/\b\w/g, (letter) =>
                letter.toUpperCase()
            );
    }

    /* =====================================================
       FILTER EVENTS
    ====================================================== */

    if (productSearch) {

        productSearch.addEventListener(
            "input",
            applyFilters
        );
    }

    if (categoryFilter) {

        categoryFilter.addEventListener(
            "change",
            applyFilters
        );
    }

    if (petFilter) {

        petFilter.addEventListener(
            "change",
            applyFilters
        );
    }

    if (sortFilter) {

        sortFilter.addEventListener(
            "change",
            applyFilters
        );
    }

    /* =====================================================
       CLEAR FILTERS
    ====================================================== */

    function clearFilters() {

        if (productSearch) {
            productSearch.value = "";
        }

        if (categoryFilter) {
            categoryFilter.value = "all";
        }

        if (petFilter) {
            petFilter.value = "all";
        }

        if (sortFilter) {
            sortFilter.value = "featured";
        }

        applyFilters();
    }

    if (clearFiltersButton) {

        clearFiltersButton.addEventListener(
            "click",
            clearFilters
        );
    }

    if (clearFiltersEmpty) {

        clearFiltersEmpty.addEventListener(
            "click",
            clearFilters
        );
    }

    /* =====================================================
       CATEGORY BUTTONS
    ====================================================== */

    categoryButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const category =
                    button.dataset.category;

                if (!category) {
                    return;
                }

                if (categoryFilter) {

                    categoryFilter.value =
                        category;
                }

                applyFilters();

                document
                    .getElementById("products")
                    ?.scrollIntoView({
                        behavior: "smooth"
                    });
            }
        );
    });

    /* =====================================================
       FOOTER CATEGORIES
    ====================================================== */

    footerCategoryLinks.forEach((link) => {

        link.addEventListener(
            "click",
            (event) => {

                const category =
                    link.dataset.footerCategory;

                if (!category) {
                    return;
                }

                event.preventDefault();

                if (categoryFilter) {

                    categoryFilter.value =
                        category;
                }

                applyFilters();

                document
                    .getElementById("products")
                    ?.scrollIntoView({
                        behavior: "smooth"
                    });
            }
        );
    });

    /* =====================================================
       SALE
    ====================================================== */

    if (saleButton) {

        saleButton.addEventListener(
            "click",
            showSaleProducts
        );
    }

    function showSaleProducts() {

        if (!productGrid) {
            return;
        }

        if (productSearch) {
            productSearch.value = "";
        }

        if (categoryFilter) {
            categoryFilter.value = "all";
        }

        if (petFilter) {
            petFilter.value = "all";
        }

        if (sortFilter) {
            sortFilter.value = "featured";
        }

        const saleCards =
            productCards.filter(
                (card) => {

                    const oldPrice =
                        parseFloat(
                            card.dataset.oldPrice
                        );

                    const price =
                        parseFloat(
                            card.dataset.price
                        );

                    return (
                        !Number.isNaN(oldPrice) &&
                        !Number.isNaN(price) &&
                        oldPrice > price
                    );
                }
            );

        productCards.forEach(
            (card) => {
                card.style.display = "none";
            }
        );

        saleCards.forEach(
            (card) => {
                card.style.display = "";
                productGrid.appendChild(card);
            }
        );

        updateProductCount(
            saleCards.length
        );

        if (activeFilterRow) {
            activeFilterRow.style.display =
                "flex";
        }

        if (activeFilterText) {
            activeFilterText.textContent =
                "Showing sale products";
        }

        if (noResults) {
            noResults.classList.toggle(
                "show",
                saleCards.length === 0
            );
        }

        document
            .getElementById("products")
            ?.scrollIntoView({
                behavior: "smooth"
            });
    }

    /* =====================================================
       CART — ADD
    ====================================================== */

    function addToCart(product) {

        if (!product) {
            return;
        }

        const existing =
            cart.find(
                (item) =>
                    String(item.id) ===
                    String(product.id)
            );

        if (existing) {

            existing.quantity += 1;

        } else {

            cart.push({
                id: product.id,
                name: product.name,
                category: product.category,
                pet: product.pet,
                price: product.price,
                oldPrice: product.oldPrice,
                image: product.image,
                quantity: 1
            });
        }

        saveCart();
        renderCart();

        markProductAdded(
            product.id
        );

        showNotification(
            `${product.name} added to your cart 🐾`
        );
    }

    /* =====================================================
       PRODUCT BUTTON FEEDBACK
    ====================================================== */

    function markProductAdded(productId) {

        const card =
            productCards.find(
                (item) =>
                    String(item.dataset.id) ===
                    String(productId)
            );

        if (!card) {
            return;
        }

        const button =
            card.querySelector(
                ".add-cart-button"
            );

        if (!button) {
            return;
        }

        const originalText =
            button.dataset.originalText ||
            button.textContent.trim();

        button.dataset.originalText =
            originalText;

        button.textContent =
            "Added ✓";

        button.classList.add(
            "added"
        );

        clearTimeout(
            button._resetTimer
        );

        button._resetTimer =
            setTimeout(() => {

                button.textContent =
                    originalText;

                button.classList.remove(
                    "added"
                );

            }, 1200);
    }

    /* =====================================================
       CART — REMOVE
    ====================================================== */

    function removeFromCart(productId) {

        cart =
            cart.filter(
                (item) =>
                    String(item.id) !==
                    String(productId)
            );

        saveCart();
        renderCart();
    }

    /* =====================================================
       CART — QUANTITY
    ====================================================== */

    function changeCartQuantity(
        productId,
        change
    ) {

        const item =
            cart.find(
                (cartItem) =>
                    String(cartItem.id) ===
                    String(productId)
            );

        if (!item) {
            return;
        }

        item.quantity += change;

        if (item.quantity <= 0) {

            removeFromCart(
                productId
            );

            return;
        }

        saveCart();
        renderCart();
    }

    /* =====================================================
       CART — RENDER
    ====================================================== */

    function renderCart() {

        updateCartCount();

        if (!cartItems) {
            return;
        }

        cartItems.innerHTML = "";

        if (cart.length === 0) {

            if (cartEmpty) {
                cartEmpty.classList.add(
                    "show"
                );
            }

            if (cartFooter) {
                cartFooter.classList.add(
                    "hidden"
                );
            }

            if (cartSubtotal) {
                cartSubtotal.textContent =
                    formatPrice(0);
            }

            return;
        }

        if (cartEmpty) {

            cartEmpty.classList.remove(
                "show"
            );
        }

        if (cartFooter) {

            cartFooter.classList.remove(
                "hidden"
            );
        }

        cart.forEach((item) => {

            cartItems.appendChild(
                createCartItem(item)
            );

        });

        updateCartSubtotal();
    }

    /* =====================================================
       CART ITEM
    ====================================================== */

    function createCartItem(item) {

        const wrapper =
            document.createElement("div");

        wrapper.className =
            "cart-item";

        const image =
            document.createElement("img");

        image.className =
            "cart-item-image";

        image.src =
            item.image || "";

        image.alt =
            item.name;

        const content =
            document.createElement("div");

        content.className =
            "cart-item-content";

        const name =
            document.createElement("h4");

        name.className =
            "cart-item-name";

        name.textContent =
            item.name;

        const price =
            document.createElement("p");

        price.className =
            "cart-item-price";

        price.textContent =
            formatPrice(item.price);

        const controls =
            document.createElement("div");

        controls.className =
            "cart-item-controls";

        const decrease =
            document.createElement("button");

        decrease.type =
            "button";

        decrease.className =
            "cart-quantity-button";

        decrease.textContent =
            "−";

        decrease.setAttribute(
            "aria-label",
            `Decrease quantity of ${item.name}`
        );

        decrease.addEventListener(
            "click",
            () => {
                changeCartQuantity(
                    item.id,
                    -1
                );
            }
        );

        const quantity =
            document.createElement("span");

        quantity.className =
            "cart-item-quantity";

        quantity.textContent =
            item.quantity;

        const increase =
            document.createElement("button");

        increase.type =
            "button";

        increase.className =
            "cart-quantity-button";

        increase.textContent =
            "+";

        increase.setAttribute(
            "aria-label",
            `Increase quantity of ${item.name}`
        );

        increase.addEventListener(
            "click",
            () => {
                changeCartQuantity(
                    item.id,
                    1
                );
            }
        );

        controls.appendChild(
            decrease
        );

        controls.appendChild(
            quantity
        );

        controls.appendChild(
            increase
        );

        const remove =
            document.createElement("button");

        remove.type =
            "button";

        remove.className =
            "cart-remove-button";

        remove.textContent =
            "Remove";

        remove.addEventListener(
            "click",
            () => {
                removeFromCart(
                    item.id
                );
            }
        );

        content.appendChild(
            name
        );

        content.appendChild(
            price
        );

        content.appendChild(
            controls
        );

        content.appendChild(
            remove
        );

        wrapper.appendChild(
            image
        );

        wrapper.appendChild(
            content
        );

        return wrapper;
    }

    /* =====================================================
       CART COUNT
    ====================================================== */

    function updateCartCount() {

        if (!cartCount) {
            return;
        }

        const count =
            cart.reduce(
                (total, item) =>
                    total +
                    Number(
                        item.quantity || 0
                    ),
                0
            );

        cartCount.textContent =
            count;

        cartCount.style.display =
            count > 0
                ? "grid"
                : "none";
    }

    /* =====================================================
       SUBTOTAL
    ====================================================== */

    function updateCartSubtotal() {

        if (!cartSubtotal) {
            return;
        }

        const subtotal =
            cart.reduce(
                (total, item) =>
                    total +
                    (
                        Number(
                            item.price
                        ) *
                        Number(
                            item.quantity
                        )
                    ),
                0
            );

        cartSubtotal.textContent =
            formatPrice(subtotal);
    }

    function formatPrice(amount) {

        return `₹${(
            Number(amount) || 0
        ).toLocaleString("en-IN")}`;
    }

    /* =====================================================
       OPEN CART
    ====================================================== */

    function openCart() {

        if (cartOverlay) {

            cartOverlay.classList.add(
                "open"
            );

            cartOverlay.setAttribute(
                "aria-hidden",
                "false"
            );
        }

        if (cartDrawer) {

            cartDrawer.classList.add(
                "open"
            );

            cartDrawer.setAttribute(
                "aria-hidden",
                "false"
            );
        }

        document.body.classList.add(
            "pawpal-cart-open"
        );
    }

    /* =====================================================
       CLOSE CART
    ====================================================== */

    function closeCart() {

        if (cartOverlay) {

            cartOverlay.classList.remove(
                "open"
            );

            cartOverlay.setAttribute(
                "aria-hidden",
                "true"
            );
        }

        if (cartDrawer) {

            cartDrawer.classList.remove(
                "open"
            );

            cartDrawer.setAttribute(
                "aria-hidden",
                "true"
            );
        }

        document.body.classList.remove(
            "pawpal-cart-open"
        );
    }

    if (cartButton) {

        cartButton.addEventListener(
            "click",
            openCart
        );
    }

    if (cartClose) {

        cartClose.addEventListener(
            "click",
            closeCart
        );
    }

    if (cartOverlay) {

        cartOverlay.addEventListener(
            "click",
            closeCart
        );
    }

    if (continueShopping) {

        continueShopping.addEventListener(
            "click",
            closeCart
        );
    }

    /* =====================================================
       CHECKOUT
    ====================================================== */

    if (checkoutButton) {

        checkoutButton.addEventListener(
            "click",
            () => {

                if (cart.length === 0) {

                    showNotification(
                        "Your cart is empty."
                    );

                    return;
                }

                showNotification(
                    "Checkout is ready to connect to your payment system."
                );
            }
        );
    }

    /* =====================================================
       NOTIFICATION
    ====================================================== */

    function showNotification(message) {

        let notification =
            document.getElementById(
                "pawpal-shop-notification"
            );

        if (!notification) {

            notification =
                document.createElement("div");

            notification.id =
                "pawpal-shop-notification";

            notification.style.position =
                "fixed";

            notification.style.right =
                "24px";

            notification.style.bottom =
                "24px";

            notification.style.zIndex =
                "1000";

            notification.style.padding =
                "13px 18px";

            notification.style.borderRadius =
                "13px";

            notification.style.background =
                "#342a25";

            notification.style.color =
                "#ffffff";

            notification.style.fontSize =
                "13px";

            notification.style.fontWeight =
                "700";

            notification.style.boxShadow =
                "0 12px 35px rgba(52,42,37,.2)";

            notification.style.opacity =
                "0";

            notification.style.transform =
                "translateY(10px)";

            notification.style.transition =
                ".25s ease";

            document.body.appendChild(
                notification
            );
        }

        notification.textContent =
            message;

        requestAnimationFrame(() => {

            notification.style.opacity =
                "1";

            notification.style.transform =
                "translateY(0)";
        });

        clearTimeout(
            notification._timer
        );

        notification._timer =
            setTimeout(() => {

                notification.style.opacity =
                    "0";

                notification.style.transform =
                    "translateY(10px)";

            }, 2300);
    }

    /* =====================================================
       FAVOURITES
    ====================================================== */

    function toggleFavourite(productId) {

        if (!productId) {
            return;
        }

        const index =
            favourites.indexOf(
                String(productId)
            );

        if (index === -1) {

            favourites.push(
                String(productId)
            );

        } else {

            favourites.splice(
                index,
                1
            );
        }

        saveFavourites();
        updateFavouriteButtons();
    }

    function updateFavouriteButtons() {

        productCards.forEach((card) => {

            const button =
                card.querySelector(
                    ".product-favourite"
                );

            if (!button) {
                return;
            }

            const id =
                String(
                    card.dataset.id || ""
                );

            const active =
                favourites.includes(id);

            button.classList.toggle(
                "active",
                active
            );

            button.classList.toggle(
                "is-favourite",
                active
            );

            button.setAttribute(
                "aria-pressed",
                String(active)
            );

            button.setAttribute(
                "aria-label",
                active
                    ? "Remove from favourites"
                    : "Add to favourites"
            );

            const icon =
                button.textContent.trim();

            if (
                icon === "♡" ||
                icon === "♥"
            ) {

                button.textContent =
                    active
                        ? "♥"
                        : "♡";
            }
        });
    }

    /* =====================================================
       QUICK VIEW
    ====================================================== */

    function openQuickView(product) {

        if (!product) {
            return;
        }

        currentQuickViewProduct =
            product;

        if (quickViewImage) {

            quickViewImage.src =
                product.image;

            quickViewImage.alt =
                product.name;
        }

        if (quickViewCategory) {

            quickViewCategory.textContent =
                formatLabel(
                    product.category
                );
        }

        if (quickViewTitle) {

            quickViewTitle.textContent =
                product.name;
        }

        if (quickViewRating) {

            quickViewRating.textContent =
                `★ ${product.rating.toFixed(1)}`;
        }

        if (quickViewDescription) {

            quickViewDescription.textContent =
                product.description;
        }

        if (quickViewPrice) {

            quickViewPrice.innerHTML =
                createPriceHTML(product);
        }

        if (quickViewBackdrop) {

            quickViewBackdrop.classList.add(
                "open"
            );

            quickViewBackdrop.setAttribute(
                "aria-hidden",
                "false"
            );
        }

        if (quickView) {

            quickView.classList.add(
                "open"
            );

            quickView.setAttribute(
                "aria-hidden",
                "false"
            );
        }

        document.body.classList.add(
            "pawpal-quick-view-open"
        );
    }

    function createPriceHTML(product) {

        const current =
            formatPrice(
                product.price
            );

        if (
            product.oldPrice &&
            product.oldPrice >
                product.price
        ) {

            return `
                <span class="current-price">
                    ${current}
                </span>

                <span class="old-price">
                    ${formatPrice(product.oldPrice)}
                </span>
            `;
        }

        return `
            <span class="current-price">
                ${current}
            </span>
        `;
    }

    /* =====================================================
       CLOSE QUICK VIEW
    ====================================================== */

    function closeQuickView() {

        currentQuickViewProduct =
            null;

        if (quickViewBackdrop) {

            quickViewBackdrop.classList.remove(
                "open"
            );

            quickViewBackdrop.setAttribute(
                "aria-hidden",
                "true"
            );
        }

        if (quickView) {

            quickView.classList.remove(
                "open"
            );

            quickView.setAttribute(
                "aria-hidden",
                "true"
            );
        }

        document.body.classList.remove(
            "pawpal-quick-view-open"
        );
    }

    if (quickViewClose) {

        quickViewClose.addEventListener(
            "click",
            closeQuickView
        );
    }

    if (quickViewBackdrop) {

        quickViewBackdrop.addEventListener(
            "click",
            (event) => {

                if (
                    event.target ===
                    quickViewBackdrop
                ) {
                    closeQuickView();
                }
            }
        );
    }

    /* =====================================================
       QUICK VIEW ADD
    ====================================================== */

    if (quickAdd) {

        quickAdd.addEventListener(
            "click",
            () => {

                if (
                    !currentQuickViewProduct
                ) {
                    return;
                }

                addToCart(
                    currentQuickViewProduct
                );

                closeQuickView();
                openCart();
            }
        );
    }

    /* =====================================================
       ESCAPE KEY
    ====================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key !==
                "Escape"
            ) {
                return;
            }

            closeCart();
            closeQuickView();
        }
    );

});