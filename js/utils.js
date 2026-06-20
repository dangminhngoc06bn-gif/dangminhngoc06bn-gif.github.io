/* ======================================
   FORMAT CURRENCY
====================================== */

function formatCurrency(price) {

    return Number(price)
        .toLocaleString("vi-VN") + " VNĐ";

}

/* ======================================
   GET TODAY
====================================== */

function getToday() {

    return new Date()
        .toISOString()
        .split("T")[0];

}

/* ======================================
   TOAST BOOTSTRAP
====================================== */

function showToast(
    message,
    type = "success"
) {

    let bgClass = "";

    switch(type){

        case "success":
            bgClass =
            "bg-success text-white";
            break;

        case "danger":
            bgClass =
            "bg-danger text-white";
            break;

        case "warning":
            bgClass =
            "bg-warning";
            break;

        default:
            bgClass =
            "bg-primary text-white";

    }

    const html = `

    <div
        class="toast align-items-center ${bgClass}"
        role="alert">

        <div class="d-flex">

            <div class="toast-body">

                ${message}

            </div>

            <button
                type="button"
                class="btn-close btn-close-white me-2 m-auto"
                data-bs-dismiss="toast">

            </button>

        </div>

    </div>

    `;

    $("#toastContainer")
        .append(html);

    const toastElement =

        $(".toast")
        .last()[0];

    const toast =

        new bootstrap.Toast(
            toastElement,
            {
                delay:3000
            }
        );

    toast.show();

    toastElement
        .addEventListener(
            "hidden.bs.toast",
            function(){

                $(this).remove();

            }
        );

}

/* ======================================
   IMAGE FALLBACK
====================================== */

function imageFallback(img){

    img.onerror = null;

    img.src =
        "img/no-image.jpg";

}

/* ======================================
   DARK MODE
====================================== */

function loadTheme(){

    const theme =

        localStorage.getItem(
            "theme"
        );

    if(theme === "dark"){

        $("body")
        .addClass(
            "dark-mode"
        );

    }

}

function toggleTheme(){

    $("body")
    .toggleClass(
        "dark-mode"
    );

    if(

        $("body")
        .hasClass(
            "dark-mode"
        )

    ){

        localStorage.setItem(
            "theme",
            "dark"
        );

    }
    else{

        localStorage.setItem(
            "theme",
            "light"
        );

    }

}

/* ======================================
   FAVORITES
====================================== */

function getFavorites(){

    return JSON.parse(

        localStorage.getItem(
            "favorites"
        )

    ) || [];

}

function saveFavorites(data){

    localStorage.setItem(

        "favorites",

        JSON.stringify(data)

    );

}

function toggleFavorite(id){

    let favorites =
        getFavorites();

    if(
        favorites.includes(id)
    ){

        favorites =
        favorites.filter(
            item =>
            item !== id
        );

    }
    else{

        favorites.push(id);

    }

    saveFavorites(
        favorites
    );

}

function isFavorite(id){

    return getFavorites()
        .includes(id);

}

/* ======================================
   PAGINATION
====================================== */

function paginate(

    data,
    currentPage,
    itemsPerPage

){

    const start =

        (currentPage - 1)
        * itemsPerPage;

    const end =

        start
        + itemsPerPage;

    return data.slice(
        start,
        end
    );

}

/* ======================================
   RENDER PAGINATION
====================================== */

function renderPagination(

    totalItems,
    currentPage,
    itemsPerPage

){

    let html = "";

    const totalPages =

        Math.ceil(
            totalItems
            / itemsPerPage
        );

    for(

        let i = 1;
        i <= totalPages;
        i++

    ){

        html += `

        <li
            class="page-item
            ${currentPage===i?"active":""}
        ">

            <a

                href="#"

                class="page-link"

                data-page="${i}"

            >

                ${i}

            </a>

        </li>

        `;

    }

    return html;

}

/* ======================================
   SKELETON LOADING
====================================== */

function renderSkeleton(
    count = 6
){

    let html = "";

    for(

        let i=0;
        i<count;
        i++

    ){

        html += `

        <div
            class="col-md-4 mb-4">

            <div
                class="skeleton-card">

            </div>

        </div>

        `;

    }

    return html;

}

/* ======================================
   EXPORT CSV
====================================== */

function exportCSV(
    data,
    filename
){

    let csv = "";

    const headers =

        Object.keys(
            data[0]
        );

    csv +=

        headers.join(",")
        + "\n";

    data.forEach(row => {

        csv +=

            headers
            .map(
                h => row[h]
            )
            .join(",")

            + "\n";

    });

    const blob =

        new Blob(
            [csv],
            {
                type:
                "text/csv"
            }
        );

    const url =

        URL.createObjectURL(
            blob
        );

    const a =

        document.createElement(
            "a"
        );

    a.href = url;

    a.download =
        filename;

    a.click();

}

/* ======================================
   STATUS BADGE
====================================== */

function getStatusBadge(
    status
){

    switch(status){

        case "Available":

            return `
            <span
            class="badge bg-success">
            Available
            </span>
            `;

        case "Reserved":

            return `
            <span
            class="badge bg-warning text-dark">
            Reserved
            </span>
            `;

        case "Occupied":

            return `
            <span
            class="badge bg-danger">
            Occupied
            </span>
            `;

        case "Confirmed":

            return `
            <span
            class="badge bg-success">
            Confirmed
            </span>
            `;

        case "Pending":

            return `
            <span
            class="badge bg-warning text-dark">
            Pending
            </span>
            `;

        case "Cancelled":

            return `
            <span
            class="badge bg-danger">
            Cancelled
            </span>
            `;

        default:

            return `
            <span
            class="badge bg-secondary">
            ${status}
            </span>
            `;

    }

}