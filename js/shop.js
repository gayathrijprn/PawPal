/* =========================================================
   PAWPAL — SHOP FUNCTIONALITY
   Cart • Filters • Search • Categories • Quick View
   Favourites • Sale Picks • LocalStorage
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";

    /* =====================================================
       STORAGE
    ===================================================== */

    const CART_STORAGE_KEY = "pawpalCart";
    const FAVOURITES_STORAGE_KEY = "pawpalShopFavourites";


    /* =====================================================
       DOM — PRODUCTS
    ===================================================== */

    const productGrid = document.getElementById("product-grid");

    const productCards = Array.from(
        document.querySelectorAll(".product-card")
    );

    const productSearch = document.getElementById("product-search");
    const categoryFilter = document.getElementById("category-filter");
    const petFilter = document.getElementById("pet-filter");
    const sortFilter = document.getElementById("sort-filter");

    const productsCount = document.getElementById("products-count");

    const activeFilterRow =
        document.getElementById("active-filter-row");

    const activeFilterText =
        document.getElementById("active-filter-text");

    const clearFilters =
        document.getElementById("clear-filters");

    const clearFiltersEmpty =
        document.getElementById("clear-filters-empty");

    const noResults =
        document.getElementById("shop-no-results");


    /* =====================================================
       DOM — CART
    ===================================================== */

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
       DOM — QUICK VIEW
    ===================================================== */

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
       DOM — SALE
    ===================================================== */

    const saleButton =
        document.getElementById("sale-button");


    /* =====================================================
       STATE
    ===================================================== */

    let cart = loadCart();

    let favourites = loadFavourites();

    let currentQuickViewProduct = null;

    let saleMode = false;

    let lastFocusedElement = null;


    /* =====================================================
       STORAGE HELPERS
    ===================================================== */

    function loadCart() {

        try {

            const saved =
                localStorage.getItem(CART_STORAGE_KEY);

            if (!saved) {
                return {};
            }

            const parsed = JSON.parse(saved);

            if (
                !parsed ||
                typeof parsed !== "object" ||
                Array.isArray(parsed)
            ) {
                return {};
            }

            const cleanedCart = {};

            Object.entries(parsed).forEach(
                ([id, item]) => {

                    if (
                        !item ||
                        typeof item !== "object"
                    ) {
                        return;
                    }

                    const quantity =
                        Math.min(
                            99,
                            Math.max(
                                1,
                                parseInt(item.quantity, 10) || 1
                            )
                        );

                    const price =
                        Number(item.price);

                    if (
                        !id ||
                        !Number.isFinite(price) ||
                        price < 0
                    ) {
                        return;
                    }

                    cleanedCart[id] = {
                        id: String(item.id || id),
                        name: String(item.name || "PawPal Product"),
                        price: price,
                        oldPrice:
                            Number.isFinite(Number(item.oldPrice))
                                ? Number(item.oldPrice)
                                : null,
                        image: String(item.image || ""),
                        categoryText:
                            String(
                                item.categoryText ||
                                "Pet Essentials"
                            ),
                        quantity
                    };

                }
            );

            return cleanedCart;

        } catch (error) {

            console.error(
                "Could not load PawPal cart:",
                error
            );

            return {};

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
                "Could not save PawPal cart:",
                error
            );

        }

    }


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

            if (!Array.isArray(parsed)) {
                return [];
            }

            return [
                ...new Set(
                    parsed
                        .map(String)
                        .filter(Boolean)
                )
            ];

        } catch (error) {

            console.error(
                "Could not load favourites:",
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
                "Could not save favourites:",
                error
            );

        }

    }


    /* =====================================================
       GENERAL HELPERS
    ===================================================== */

    function formatPrice(value) {

        const amount =
            Number(value) || 0;

        return amount.toLocaleString(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0
            }
        );

    }


    function escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    function scrollToProducts() {

        const productsSection =
            document.getElementById("products");

        if (!productsSection) {
            return;
        }

        productsSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }


    /* =====================================================
       PRODUCT DATA
    ===================================================== */

    function getProductFromCard(card) {

        if (!card) {
            return null;
        }

        const price =
            Number(card.dataset.price) || 0;

        const oldPriceValue =
            Number(card.dataset.oldPrice);

        const oldPrice =
            Number.isFinite(oldPriceValue) &&
            oldPriceValue > 0
                ? oldPriceValue
                : null;

        const rating =
            Number(card.dataset.rating) || 0;

        const image =
            card.dataset.image ||
            card.querySelector("img")?.src ||
            "";

        const category =
            card.dataset.category ||
            "all";

        const pet =
            card.dataset.pet ||
            "all";

        const name =
            card.dataset.name ||
            card.querySelector("h3")?.textContent.trim() ||
            "PawPal Product";

        const description =
            card.querySelector(".product-info p")
                ?.textContent
                .trim() ||
            "A carefully selected PawPal pet essential.";

        const categoryText =
            card.querySelector(".product-category")
                ?.textContent
                .trim() ||
            category;

        const badge =
            card.querySelector(".product-badge")
                ?.textContent
                .trim() ||
            "";

        const id =
            String(
                card.dataset.id ||
                name
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
            );

        return {
            id,
            name,
            category,
            categoryText,
            pet,
            price,
            oldPrice,
            rating,
            image,
            description,
            badge
        };

    }


    function findProduct(id) {

        const card =
            productCards.find(
                item =>
                    String(item.dataset.id) === String(id)
            );

        return getProductFromCard(card);

    }


    /* =====================================================
       CART CALCULATIONS
    ===================================================== */

    function getCartItems() {

        return Object.values(cart)
            .filter(
                item =>
                    item &&
                    Number(item.quantity) > 0
            );

    }


    function getCartQuantity() {

        return getCartItems().reduce(
            (total, item) =>
                total + Number(item.quantity || 0),
            0
        );

    }


    function getCartSubtotal() {

        return getCartItems().reduce(
            (total, item) =>
                total +
                (
                    Number(item.price) *
                    Number(item.quantity)
                ),
            0
        );

    }


    /* =====================================================
       ADD TO CART
    ===================================================== */

    function addToCart(product, quantity = 1) {

        if (
            !product ||
            !product.id
        ) {
            return;
        }

        const amount =
            Math.min(
                99,
                Math.max(
                    1,
                    parseInt(quantity, 10) || 1
                )
            );


        if (cart[product.id]) {

            cart[product.id].quantity =
                Math.min(
                    99,
                    Number(cart[product.id].quantity || 0) +
                    amount
                );

        } else {

            cart[product.id] = {

                id: product.id,

                name: product.name,

                price: Number(product.price) || 0,

                oldPrice:
                    product.oldPrice,

                image:
                    product.image,

                categoryText:
                    product.categoryText,

                quantity:
                    amount

            };

        }


        saveCart();

        renderCart();

        updateCartButton();

        showToast(
            `${product.name} added to your cart 🐾`
        );

    }


    /* =====================================================
       REMOVE FROM CART
    ===================================================== */

    function removeFromCart(productId) {

        if (
            !productId ||
            !cart[productId]
        ) {
            return;
        }

        const productName =
            cart[productId].name;

        delete cart[productId];

        saveCart();

        renderCart();

        updateCartButton();

        showToast(
            `${productName} removed from your cart`
        );

    }


    /* =====================================================
       UPDATE CART QUANTITY
    ===================================================== */

    function updateCartQuantity(
        productId,
        newQuantity
    ) {

        if (!cart[productId]) {
            return;
        }

        const quantity =
            parseInt(newQuantity, 10);


        if (
            Number.isNaN(quantity) ||
            quantity <= 0
        ) {

            removeFromCart(productId);

            return;

        }


        cart[productId].quantity =
            Math.min(
                99,
                Math.max(
                    1,
                    quantity
                )
            );


        saveCart();

        renderCart();

        updateCartButton();

    }


    /* =====================================================
       CLEAR CART
    ===================================================== */

    function clearCart() {

        cart = {};

        saveCart();

        renderCart();

        updateCartButton();

    }


    /* =====================================================
       RENDER CART
    ===================================================== */

    function renderCart() {

        if (!cartItems) {
            return;
        }

        const items =
            getCartItems();


        cartItems.innerHTML = "";


        /* EMPTY CART */

        if (items.length === 0) {

            if (cartEmpty) {
                cartEmpty.style.display = "flex";
            }

            if (cartFooter) {
                cartFooter.style.display = "none";
            }

            if (cartSubtotal) {
                cartSubtotal.textContent =
                    formatPrice(0);
            }

            return;

        }


        /* CART HAS ITEMS */

        if (cartEmpty) {
            cartEmpty.style.display = "none";
        }

        if (cartFooter) {
            cartFooter.style.display = "block";
        }


        items.forEach(item => {

            const quantity =
                Math.max(
                    1,
                    Number(item.quantity) || 1
                );

            const price =
                Number(item.price) || 0;

            const total =
                price * quantity;


            const cartItem =
                document.createElement("div");

            cartItem.className =
                "cart-item";

            cartItem.dataset.id =
                item.id;


            cartItem.innerHTML = `

                <div class="cart-item-image">
                    <img
                        src="${escapeHTML(item.image)}"
                        alt="${escapeHTML(item.name)}"
                        loading="lazy"
                    >
                </div>

                <div class="cart-item-details">

                    <span class="cart-item-category">
                        ${escapeHTML(item.categoryText)}
                    </span>

                    <h3 class="cart-item-name">
                        ${escapeHTML(item.name)}
                    </h3>

                    <strong class="cart-item-price">
                        ${formatPrice(price)}
                    </strong>

                    <div class="cart-quantity">

                        <button
                            type="button"
                            class="cart-quantity-button"
                            data-action="decrease"
                            data-id="${escapeHTML(item.id)}"
                            aria-label="Decrease quantity of ${escapeHTML(item.name)}"
                            ${quantity <= 1 ? "disabled" : ""}
                        >
                            −
                        </button>

                        <span
                            class="cart-quantity-value"
                            aria-label="Quantity"
                        >
                            ${quantity}
                        </span>

                        <button
                            type="button"
                            class="cart-quantity-button"
                            data-action="increase"
                            data-id="${escapeHTML(item.id)}"
                            aria-label="Increase quantity of ${escapeHTML(item.name)}"
                            ${quantity >= 99 ? "disabled" : ""}
                        >
                            +
                        </button>

                    </div>

                </div>

                <div class="cart-item-right">

                    <strong class="cart-item-total">
                        ${formatPrice(total)}
                    </strong>

                    <button
                        type="button"
                        class="cart-remove"
                        data-action="remove"
                        data-id="${escapeHTML(item.id)}"
                        aria-label="Remove ${escapeHTML(item.name)} from cart"
                        title="Remove item"
                    >
                        ✕
                    </button>

                </div>

            `;


            cartItems.appendChild(cartItem);

        });


        if (cartSubtotal) {

            cartSubtotal.textContent =
                formatPrice(
                    getCartSubtotal()
                );

        }

    }


    /* =====================================================
       CART COUNT
    ===================================================== */

    function updateCartButton() {

        const quantity =
            getCartQuantity();


        if (cartCount) {

            cartCount.textContent =
                quantity > 99
                    ? "99+"
                    : String(quantity);

            cartCount.setAttribute(
                "aria-label",
                `${quantity} item${quantity === 1 ? "" : "s"} in cart`
            );

        }


        if (cartButton) {

            cartButton.setAttribute(
                "aria-label",
                quantity > 0
                    ? `Open shopping cart with ${quantity} item${quantity === 1 ? "" : "s"}`
                    : "Open shopping cart"
            );

        }

    }


    /* =====================================================
       OPEN CART
    ===================================================== */

    function openCart() {

        if (!cartDrawer) {
            return;
        }

        lastFocusedElement =
            document.activeElement;

        renderCart();

        cartDrawer.classList.add("open");

        if (cartOverlay) {
            cartOverlay.classList.add("open");
            cartOverlay.setAttribute(
                "aria-hidden",
                "false"
            );
        }

        cartDrawer.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "pawpal-cart-open"
        );

        document.body.classList.add(
            "modal-open"
        );


        setTimeout(() => {

            if (cartClose) {
                cartClose.focus();
            }

        }, 50);

    }


    /* =====================================================
       CLOSE CART
    ===================================================== */

    function closeCart() {

        if (!cartDrawer) {
            return;
        }

        cartDrawer.classList.remove("open");

        if (cartOverlay) {
            cartOverlay.classList.remove("open");

            cartOverlay.setAttribute(
                "aria-hidden",
                "true"
            );
        }

        cartDrawer.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "pawpal-cart-open"
        );


        if (
            !document.body.classList.contains(
                "pawpal-quick-view-open"
            )
        ) {

            document.body.classList.remove(
                "modal-open"
            );

        }


        if (
            lastFocusedElement &&
            typeof lastFocusedElement.focus === "function"
        ) {

            lastFocusedElement.focus();

        }

    }


    /* =====================================================
       CART BUTTON EVENTS
    ===================================================== */

    if (cartButton) {

        cartButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                openCart();

            }
        );

    }


    if (cartClose) {

        cartClose.addEventListener(
            "click",
            closeCart
        );

    }


    /* IMPORTANT:
       Only clicking the dark overlay itself closes
       the cart. Clicking inside the drawer does NOT.
    */

    if (cartOverlay) {

        cartOverlay.addEventListener(
            "click",
            event => {

                if (
                    event.target === cartOverlay
                ) {

                    closeCart();

                }

            }
        );

    }


    if (continueShopping) {

        continueShopping.addEventListener(
            "click",
            closeCart
        );

    }


    /* =====================================================
       CART ITEM EVENTS
    ===================================================== */

    if (cartItems) {

        cartItems.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        "button[data-action]"
                    );


                if (!button) {
                    return;
                }


                const productId =
                    button.dataset.id;

                const action =
                    button.dataset.action;


                if (
                    !productId ||
                    !cart[productId]
                ) {
                    return;
                }


                const currentQuantity =
                    Number(
                        cart[productId].quantity
                    ) || 1;


                if (action === "increase") {

                    updateCartQuantity(
                        productId,
                        currentQuantity + 1
                    );

                }


                else if (
                    action === "decrease"
                ) {

                    updateCartQuantity(
                        productId,
                        currentQuantity - 1
                    );

                }


                else if (
                    action === "remove"
                ) {

                    removeFromCart(
                        productId
                    );

                }

            }
        );

    }


    /* =====================================================
       ADD TO CART BUTTONS
    ===================================================== */

    productCards.forEach(card => {

        const addButton =
            card.querySelector(
                ".add-cart-button"
            );


        if (!addButton) {
            return;
        }


        addButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();


                const product =
                    getProductFromCard(card);


                addToCart(product);

            }
        );

    });


    /* =====================================================
       PRODUCT CARD → QUICK VIEW
    ===================================================== */

    productCards.forEach(card => {

        card.addEventListener(
            "click",
            event => {

                if (
                    event.target.closest("button") ||
                    event.target.closest("a") ||
                    event.target.closest("select") ||
                    event.target.closest("input")
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


    /* =====================================================
       QUICK VIEW
    ===================================================== */

    function openQuickView(product) {

        if (
            !product ||
            !quickView
        ) {
            return;
        }


        currentQuickViewProduct =
            product;

        lastFocusedElement =
            document.activeElement;


        if (quickViewImage) {

            quickViewImage.src =
                product.image;

            quickViewImage.alt =
                product.name;

            quickViewImage.onerror =
                function () {

                    this.style.visibility =
                        "hidden";

                };

            quickViewImage.onload =
                function () {

                    this.style.visibility =
                        "visible";

                };

        }


        if (quickViewCategory) {

            quickViewCategory.textContent =
                product.categoryText;

        }


        if (quickViewTitle) {

            quickViewTitle.textContent =
                product.name;

        }


        if (quickViewRating) {

            const rating =
                Math.max(
                    0,
                    Math.min(
                        5,
                        Number(product.rating) || 0
                    )
                );

            const roundedRating =
                Math.round(rating);

            quickViewRating.innerHTML =
                `${"★".repeat(roundedRating)}${"☆".repeat(5 - roundedRating)}
                <span>${rating.toFixed(1)}</span>`;

        }


        if (quickViewDescription) {

            quickViewDescription.textContent =
                product.description;

        }


        if (quickViewPrice) {

            quickViewPrice.innerHTML =
                `<strong>${formatPrice(product.price)}</strong>` +
                (
                    product.oldPrice
                        ? ` <del>${formatPrice(product.oldPrice)}</del>`
                        : ""
                );

        }


        quickView.classList.add("open");

        if (quickViewBackdrop) {

            quickViewBackdrop.classList.add(
                "open"
            );

            quickViewBackdrop.setAttribute(
                "aria-hidden",
                "false"
            );

        }


        quickView.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.classList.add(
            "pawpal-quick-view-open"
        );

        document.body.classList.add(
            "modal-open"
        );


        setTimeout(() => {

            if (quickViewClose) {
                quickViewClose.focus();
            }

        }, 50);

    }


    /* =====================================================
       CLOSE QUICK VIEW
    ===================================================== */

    function closeQuickView() {

        if (!quickView) {
            return;
        }


        quickView.classList.remove(
            "open"
        );


        if (quickViewBackdrop) {

            quickViewBackdrop.classList.remove(
                "open"
            );

            quickViewBackdrop.setAttribute(
                "aria-hidden",
                "true"
            );

        }


        quickView.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.classList.remove(
            "pawpal-quick-view-open"
        );


        if (
            !document.body.classList.contains(
                "pawpal-cart-open"
            )
        ) {

            document.body.classList.remove(
                "modal-open"
            );

        }


        currentQuickViewProduct = null;


        if (
            lastFocusedElement &&
            typeof lastFocusedElement.focus === "function"
        ) {

            lastFocusedElement.focus();

        }

    }


    if (quickViewClose) {

        quickViewClose.addEventListener(
            "click",
            closeQuickView
        );

    }


    /* IMPORTANT:
       Clicking product information does NOT close
       quick view. Only the backdrop closes it.
    */

    if (quickViewBackdrop) {

        quickViewBackdrop.addEventListener(
            "click",
            event => {

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
       QUICK VIEW → ADD TO CART
    ===================================================== */

    if (quickAdd) {

        quickAdd.addEventListener(
            "click",
            event => {

                event.preventDefault();

                if (
                    !currentQuickViewProduct
                ) {
                    return;
                }


                const product =
                    currentQuickViewProduct;


                addToCart(product);

                closeQuickView();

                setTimeout(
                    openCart,
                    100
                );

            }
        );

    }


    /* =====================================================
       FAVOURITES
    ===================================================== */

    function updateFavouriteButtons() {

        productCards.forEach(card => {

            const productId =
                String(
                    card.dataset.id || ""
                );

            const button =
                card.querySelector(
                    ".product-favourite"
                );


            if (
                !button ||
                !productId
            ) {
                return;
            }


            const isFavourite =
                favourites.includes(
                    productId
                );


            button.textContent =
                isFavourite
                    ? "♥"
                    : "♡";


            button.classList.toggle(
                "active",
                isFavourite
            );


            button.setAttribute(
                "aria-pressed",
                String(isFavourite)
            );


            const product =
                getProductFromCard(card);


            button.setAttribute(
                "aria-label",
                isFavourite
                    ? `Remove ${product.name} from favourites`
                    : `Add ${product.name} to favourites`
            );

        });

    }


    productCards.forEach(card => {

        const favouriteButton =
            card.querySelector(
                ".product-favourite"
            );


        if (!favouriteButton) {
            return;
        }


        favouriteButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();


                const productId =
                    String(
                        card.dataset.id || ""
                    );


                const product =
                    getProductFromCard(card);


                if (
                    !product ||
                    !productId
                ) {
                    return;
                }


                const index =
                    favourites.indexOf(
                        productId
                    );


                if (index === -1) {

                    favourites.push(
                        productId
                    );

                    showToast(
                        `${product.name} saved to favourites ♡`
                    );

                } else {

                    favourites.splice(
                        index,
                        1
                    );

                    showToast(
                        `${product.name} removed from favourites`
                    );

                }


                saveFavourites();

                updateFavouriteButtons();

            }
        );

    });


    /* =====================================================
       FILTERING
    ===================================================== */

    function applyFilters() {

        const search =
            productSearch
                ? productSearch.value
                    .trim()
                    .toLowerCase()
                : "";


        const category =
            categoryFilter
                ? categoryFilter.value
                : "all";


        const pet =
            petFilter
                ? petFilter.value
                : "all";


        const sort =
            sortFilter
                ? sortFilter.value
                : "featured";


        let visibleProducts =
            productCards.filter(card => {

                const product =
                    getProductFromCard(card);


                if (!product) {
                    return false;
                }


                const searchableText =
                    (
                        product.name +
                        " " +
                        product.categoryText +
                        " " +
                        product.description +
                        " " +
                        product.pet
                    ).toLowerCase();


                const matchesSearch =
                    !search ||
                    searchableText.includes(search);


                const matchesCategory =
                    category === "all" ||
                    product.category === category;


                const matchesPet =
                    pet === "all" ||
                    product.pet === pet ||
                    product.pet === "all";


                const matchesSale =
                    !saleMode ||
                    Boolean(
                        product.oldPrice
                    );


                return (
                    matchesSearch &&
                    matchesCategory &&
                    matchesPet &&
                    matchesSale
                );

            });


        /* =================================================
           SORT
        ================================================= */

        visibleProducts.sort(
            (a, b) => {

                const productA =
                    getProductFromCard(a);

                const productB =
                    getProductFromCard(b);


                switch (sort) {

                    case "price-low":

                        return (
                            productA.price -
                            productB.price
                        );


                    case "price-high":

                        return (
                            productB.price -
                            productA.price
                        );


                    case "rating":

                        return (
                            productB.rating -
                            productA.rating
                        );


                    case "name":

                        return productA.name.localeCompare(
                            productB.name,
                            undefined,
                            {
                                sensitivity: "base"
                            }
                        );


                    case "featured":

                    default:

                        return (
                            Number(
                                b.dataset.featured || 0
                            ) -
                            Number(
                                a.dataset.featured || 0
                            )
                        );

                }

            }
        );


        /* =================================================
           REORDER PRODUCTS
        ================================================= */

        if (productGrid) {

            visibleProducts.forEach(card => {

                productGrid.appendChild(
                    card
                );

            });

        }


        /* =================================================
           DISPLAY
        ================================================= */

        productCards.forEach(card => {

            card.style.display =
                visibleProducts.includes(card)
                    ? ""
                    : "none";

        });


        /* =================================================
           COUNT
        ================================================= */

        if (productsCount) {

            if (saleMode) {

                productsCount.textContent =
                    `Showing ${visibleProducts.length} sale pick${visibleProducts.length === 1 ? "" : "s"}`;

            } else {

                productsCount.textContent =
                    `Showing ${visibleProducts.length} product${visibleProducts.length === 1 ? "" : "s"}`;

            }

        }


        /* =================================================
           NO RESULTS
        ================================================= */

        if (noResults) {

            noResults.classList.toggle(
                "show",
                visibleProducts.length === 0
            );

            noResults.style.display =
                visibleProducts.length === 0
                    ? "block"
                    : "none";

        }


        updateActiveFilterText(
            search,
            category,
            pet
        );

    }


    /* =====================================================
       ACTIVE FILTER TEXT
    ===================================================== */

    function updateActiveFilterText(
        search,
        category,
        pet
    ) {

        if (!activeFilterText) {
            return;
        }


        const parts = [];


        if (saleMode) {

            parts.push(
                "Sale picks"
            );

        }


        if (search) {

            parts.push(
                `Search: "${search}"`
            );

        }


        if (category !== "all") {

            const option =
                categoryFilter?.querySelector(
                    `option[value="${CSS.escape(category)}"]`
                );


            if (option) {

                parts.push(
                    option.textContent.trim()
                );

            }

        }


        if (pet !== "all") {

            const option =
                petFilter?.querySelector(
                    `option[value="${CSS.escape(pet)}"]`
                );


            if (option) {

                parts.push(
                    option.textContent.trim()
                );

            }

        }


        if (parts.length === 0) {

            activeFilterText.textContent =
                "All products";

        } else {

            activeFilterText.textContent =
                parts.join(" • ");

        }


        if (activeFilterRow) {

            activeFilterRow.classList.toggle(
                "active",
                parts.length > 0
            );

            activeFilterRow.classList.toggle(
                "has-filters",
                parts.length > 0
            );

        }

    }


    /* =====================================================
       SEARCH
    ===================================================== */

    if (productSearch) {

        productSearch.addEventListener(
            "input",
            () => {

                saleMode = false;

                applyFilters();

            }
        );

    }


    /* =====================================================
       FILTER SELECTS
    ===================================================== */

    [
        categoryFilter,
        petFilter,
        sortFilter
    ].forEach(select => {

        if (!select) {
            return;
        }


        select.addEventListener(
            "change",
            () => {

                /*
                 * Category/pet/sort changes leave sale mode
                 * only when the user explicitly changes
                 * category or pet.
                 */

                if (
                    select === categoryFilter ||
                    select === petFilter
                ) {

                    saleMode = false;

                }

                applyFilters();

            }
        );

    });


    /* =====================================================
       CLEAR FILTERS
    ===================================================== */

    function resetFilters() {

        saleMode = false;


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


    if (clearFilters) {

        clearFilters.addEventListener(
            "click",
            resetFilters
        );

    }


    if (clearFiltersEmpty) {

        clearFiltersEmpty.addEventListener(
            "click",
            resetFilters
        );

    }


    /* =====================================================
       CATEGORY CARDS
    ===================================================== */

    document
        .querySelectorAll(".category-card")
        .forEach(categoryCard => {

            categoryCard.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    const category =
                        categoryCard.dataset.category;


                    if (!category) {
                        return;
                    }


                    saleMode = false;


                    if (categoryFilter) {

                        categoryFilter.value =
                            category;

                    }


                    applyFilters();

                    scrollToProducts();

                }
            );

        });


    /* =====================================================
       FOOTER CATEGORY LINKS
    ===================================================== */

    document
        .querySelectorAll(
            "[data-footer-category]"
        )
        .forEach(link => {

            link.addEventListener(
                "click",
                event => {

                    event.preventDefault();


                    const category =
                        link.dataset.footerCategory;


                    if (!category) {
                        return;
                    }


                    saleMode = false;


                    if (categoryFilter) {

                        categoryFilter.value =
                            category;

                    }


                    applyFilters();

                    scrollToProducts();

                }
            );

        });


    /* =====================================================
       SALE PICKS
    ===================================================== */

    if (saleButton) {

        saleButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                saleMode = true;


                applyFilters();

                scrollToProducts();

            }
        );

    }


    /* =====================================================
       CHECKOUT
    ===================================================== */

    if (checkoutButton) {

        checkoutButton.addEventListener(
            "click",
            event => {

                event.preventDefault();


                const items =
                    getCartItems();


                if (items.length === 0) {

                    showToast(
                        "Your cart is empty 🐾"
                    );

                    return;

                }


                const quantity =
                    getCartQuantity();

                const subtotal =
                    getCartSubtotal();


                const confirmed =
                    window.confirm(
                        `Ready to checkout?\n\n` +
                        `Items: ${quantity}\n` +
                        `Subtotal: ${formatPrice(subtotal)}\n\n` +
                        `Place this demo order now?`
                    );


                if (confirmed) {

                    clearCart();
                    closeCart();

                    showToast(
                        "Order placed successfully! We will be in touch soon. 🐾"
                    );

                }

            }
        );

    }


    /* =====================================================
       KEYBOARD
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Escape") {
                return;
            }


            if (
                quickViewBackdrop?.classList.contains(
                    "open"
                )
            ) {

                closeQuickView();

                return;

            }


            if (
                cartOverlay?.classList.contains(
                    "open"
                )
            ) {

                closeCart();

            }

        }
    );


    /* =====================================================
       TOAST
    ===================================================== */

    let toast =
        document.getElementById(
            "pawpal-toast"
        );


    if (!toast) {

        toast =
            document.createElement("div");

        toast.id =
            "pawpal-toast";

        toast.className =
            "pawpal-toast";

        document.body.appendChild(
            toast
        );

    }


    let toastTimer = null;


    function showToast(message) {

        if (!toast) {
            return;
        }


        toast.textContent =
            message;


        toast.classList.remove(
            "show"
        );


        /*
         * Force reflow so repeated toast messages
         * animate correctly.
         */

        void toast.offsetWidth;


        toast.classList.add(
            "show"
        );


        clearTimeout(
            toastTimer
        );


        toastTimer =
            setTimeout(
                () => {

                    toast.classList.remove(
                        "show"
                    );

                },
                2600
            );

    }


    /* =====================================================
       TOAST STYLING
       Small fallback style so the toast works even if
       shop.css does not contain toast styles.
    ===================================================== */

    if (
        !document.getElementById(
            "pawpal-shop-runtime-styles"
        )
    ) {

        const runtimeStyle =
            document.createElement("style");

        runtimeStyle.id =
            "pawpal-shop-runtime-styles";

        runtimeStyle.textContent = `

            .pawpal-toast {
                position: fixed;
                left: 50%;
                bottom: 28px;
                z-index: 10000;
                max-width: min(420px, 90vw);
                padding: 13px 18px;
                background: #342a25;
                color: #ffffff;
                border-radius: 12px;
                box-shadow: 0 15px 40px rgba(52,42,37,.2);
                font-size: 13px;
                font-weight: 700;
                text-align: center;
                opacity: 0;
                visibility: hidden;
                pointer-events: none;
                transform: translate(-50%, 15px);
                transition:
                    opacity .25s ease,
                    visibility .25s ease,
                    transform .25s ease;
            }

            .pawpal-toast.show {
                opacity: 1;
                visibility: visible;
                transform: translate(-50%, 0);
            }

            .cart-quantity-button:disabled {
                opacity: .4;
                cursor: not-allowed;
            }

            .cart-remove {
                cursor: pointer;
            }

            .cart-remove:hover {
                color: #e98268;
            }

            @media (max-width: 430px) {

                .pawpal-toast {
                    bottom: 18px;
                    width: calc(100vw - 30px);
                }

            }

        `;

        document.head.appendChild(
            runtimeStyle
        );

    }


    /* =====================================================
       IMAGE FALLBACKS
    ===================================================== */

    productCards.forEach(card => {

        const image =
            card.querySelector(
                ".product-image img"
            );


        if (!image) {
            return;
        }


        image.addEventListener(
            "error",
            () => {

                image.style.visibility =
                    "hidden";

            }
        );

    });


    /* =====================================================
       INITIALISE
    ===================================================== */

    renderCart();

    updateCartButton();

    updateFavouriteButtons();

    applyFilters();

});