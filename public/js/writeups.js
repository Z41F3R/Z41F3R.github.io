document.addEventListener("DOMContentLoaded", () => {

    const toggle = document.getElementById("writeups-filter-toggle");
    const filters = document.getElementById("writeups-filters");

    const searchInput = document.getElementById("writeups-search");

    const filterButtons = document.querySelectorAll(
        ".writeups-filter-option"
    );

    const writeupCards = Array.from(
        document.querySelectorAll(".writeup-card")
    );

    const writeupsCount = document.getElementById(
        "writeups-count"
    );

    const pagination = document.getElementById(
        "writeups-pagination"
    );


    /* =====================================================
       PAGINATION
       ===================================================== */

    const ITEMS_PER_PAGE = 7;

    let currentPage = 1;

    let filteredCards = [...writeupCards];


    /* =====================================================
       OPEN / CLOSE FILTERS
       ===================================================== */

    if (toggle && filters) {

        toggle.addEventListener("click", () => {

            filters.classList.toggle("is-open");

        });

    }


    /* =====================================================
       ACTIVE FILTERS
       ===================================================== */

    const activeFilters = {
        platform: "all",
        os: "all",
        difficulty: "all",
        tag: "all"
    };


    /* =====================================================
       FILTER BUTTONS
       ===================================================== */

    filterButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const type = button.dataset.filterType;
            const value = button.dataset.filterValue;

            activeFilters[type] = value;


            const group = button.closest(
                ".writeups-filter-options"
            );

            group
                .querySelectorAll(".writeups-filter-option")
                .forEach((option) => {
                    option.classList.remove("active");
                });

            button.classList.add("active");

            currentPage = 1;

            filterWriteups();

        });

    });


    /* =====================================================
       SEARCH
       ===================================================== */

    if (searchInput) {

        searchInput.addEventListener("input", () => {

            currentPage = 1;

            filterWriteups();

        });

    }


    /* =====================================================
       APPLY SEARCH + FILTERS
       ===================================================== */

    function filterWriteups() {

        const searchTerm = searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";


        filteredCards = [];


        writeupCards.forEach((card) => {

            const searchData = [
                card.querySelector(".project-card-header h2")?.textContent || "",
                card.dataset.platform || "",
                card.dataset.os || "",
                card.dataset.difficulty || "",
                card.dataset.tags || ""
            ]
                .join(" ")
                .toLowerCase();


            const matchesSearch =
                !searchTerm ||
                searchData.includes(searchTerm);


            const matchesPlatform =
                activeFilters.platform === "all" ||
                card.dataset.platform === activeFilters.platform;


            const matchesOS =
                activeFilters.os === "all" ||
                card.dataset.os === activeFilters.os;


            const matchesDifficulty =
                activeFilters.difficulty === "all" ||
                card.dataset.difficulty === activeFilters.difficulty;


            const matchesTag =
                activeFilters.tag === "all" ||
                card.dataset.tags
                    .split(",")
                    .includes(activeFilters.tag);


            const visible =
                matchesSearch &&
                matchesPlatform &&
                matchesOS &&
                matchesDifficulty &&
                matchesTag;


            if (visible) {
                filteredCards.push(card);
            }

        });


        updatePagination();

    }


    /* =====================================================
       UPDATE PAGINATION
       ===================================================== */

    function updatePagination() {

        const totalResults = filteredCards.length;

        const totalPages = Math.ceil(
            totalResults / ITEMS_PER_PAGE
        );


        if (currentPage > totalPages && totalPages > 0) {
            currentPage = totalPages;
        }


        /* ================================================
           COUNTER
           ================================================ */

        if (writeupsCount) {

            writeupsCount.textContent =
                `Showing ${totalResults} of ${writeupCards.length} writeups`;

        }


        /* ================================================
           HIDE ALL CARDS
           ================================================ */

        writeupCards.forEach((card) => {

            card.style.display = "none";

        });


        /* ================================================
           SHOW CURRENT PAGE
           ================================================ */

        const start =
            (currentPage - 1) * ITEMS_PER_PAGE;

        const end =
            start + ITEMS_PER_PAGE;


        filteredCards
            .slice(start, end)
            .forEach((card) => {

                card.style.display = "";

            });


        renderPagination(totalPages);

    }


    /* =====================================================
       RENDER PAGINATION
       ===================================================== */

    function renderPagination(totalPages) {

        if (!pagination) {
            return;
        }


        pagination.innerHTML = "";


        if (totalPages <= 1) {
            return;
        }


        /* ================================================
           PREVIOUS
           ================================================ */

        const previous = document.createElement("button");

        previous.type = "button";
        previous.textContent = "‹";
        previous.className = "writeups-page-button";

        previous.disabled = currentPage === 1;


        previous.addEventListener("click", () => {

            if (currentPage > 1) {

                currentPage--;

                updatePagination();

                scrollToWriteups();

            }

        });


        pagination.appendChild(previous);


        /* ================================================
           PAGE NUMBERS
           ================================================ */

        for (let page = 1; page <= totalPages; page++) {

            const button = document.createElement("button");

            button.type = "button";
            button.textContent = page;

            button.className =
                "writeups-page-button";


            if (page === currentPage) {

                button.classList.add("active");

            }


            button.addEventListener("click", () => {

                currentPage = page;

                updatePagination();

                scrollToWriteups();

            });


            pagination.appendChild(button);

        }


        /* ================================================
           NEXT
           ================================================ */

        const next = document.createElement("button");

        next.type = "button";
        next.textContent = "›";
        next.className = "writeups-page-button";

        next.disabled =
            currentPage === totalPages;


        next.addEventListener("click", () => {

            if (currentPage < totalPages) {

                currentPage++;

                updatePagination();

                scrollToWriteups();

            }

        });


        pagination.appendChild(next);

    }


    /* =====================================================
       SCROLL TO WRITEUPS
       ===================================================== */

    function scrollToWriteups() {

        const toolbar =
            document.querySelector(".writeups-toolbar");

        if (!toolbar) {
            return;
        }


        toolbar.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }


    /* =====================================================
       INITIAL LOAD
       ===================================================== */

    filterWriteups();

});


