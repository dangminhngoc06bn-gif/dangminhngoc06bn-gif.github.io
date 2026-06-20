/* =========================================
   GLOBAL VARIABLES
========================================= */

let drinks = [];
let tables = [];
let reservations = [];

let editDrinkId = null;
let editTableId = null;

/* =========================================
   PAGE LOAD
========================================= */

$(document).ready(function () {

    loadTheme();

    initialize();

    bindEvents();

});

/* =========================================
   EVENTS
========================================= */

function bindEvents() {

    $("#darkModeBtn").click(toggleTheme);

    /* SIDEBAR */

    $(".sidebar-btn").click(function () {

        $(".sidebar-btn")
            .removeClass("active");

        $(this)
            .addClass("active");

        $(".admin-section")
            .addClass("d-none");

        $("#" + $(this).data("section"))
            .removeClass("d-none");

    });

    /* DRINK */

    $("#saveDrinkBtn")
        .click(saveDrink);

    $("#searchDrink")
        .on("keyup", searchDrink);

    $("#exportDrinkBtn")
        .click(exportDrinkCSV);

    /* TABLE */

    $("#saveTableBtn")
        .click(saveTable);

    $("#searchTable")
        .on("keyup", searchTable);

    $("#exportTableBtn")
        .click(exportTableCSV);

    /* RESERVATION */

    $("#searchReservation")
        .on("keyup", searchReservation);

    $("#exportReservationBtn")
        .click(exportReservationCSV);

}

/* =========================================
   INITIALIZE
========================================= */

async function initialize() {

    await loadDrinks();

    await loadTables();

    await loadReservations();

    updateDashboard();

}

/* =========================================
   DASHBOARD
========================================= */

function updateDashboard() {

    $("#totalDrinks")
        .text(drinks.length);

    $("#totalTables")
        .text(tables.length);

    $("#totalReservations")
        .text(reservations.length);

    const today = getToday();

    const todayReservations =

        reservations.filter(item =>

            item.reservationDate === today

        );

    $("#todayReservations")
        .text(todayReservations.length);

    updateCategoryStatistic();

}

/* =========================================
   CATEGORY STATISTIC
========================================= */

function updateCategoryStatistic() {

    if (drinks.length === 0)
        return;

    const coffee =

        drinks.filter(

            d => d.category === "Coffee"

        ).length;

    const tea =

        drinks.filter(

            d => d.category === "Tea"

        ).length;

    const smoothie =

        drinks.filter(

            d => d.category === "Smoothie"

        ).length;

    const total = drinks.length;

    const coffeePercent =

        Math.round(

            coffee / total * 100

        );

    const teaPercent =

        Math.round(

            tea / total * 100

        );

    const smoothiePercent =

        Math.round(

            smoothie / total * 100

        );

    $("#coffeePercent")
        .css("width", coffeePercent + "%")
        .text(coffeePercent + "%");

    $("#teaPercent")
        .css("width", teaPercent + "%")
        .text(teaPercent + "%");

    $("#smoothiePercent")
        .css("width", smoothiePercent + "%")
        .text(smoothiePercent + "%");

}
/* =========================================
   LOAD DRINKS
========================================= */

async function loadDrinks() {

    try {

        drinks = await getDrinks();

        renderDrinks();

    }
    catch (error) {

        console.error(error);

    }

}

/* =========================================
   RENDER DRINKS
========================================= */

function renderDrinks(data = drinks) {

    let html = "";

    data.forEach(drink => {

        html += `

        <tr>

            <td>${drink.id}</td>

            <td>

                <img
                src="${drink.image}"
                width="80"
                height="80"
                style="
                object-fit:cover;
                border-radius:10px;
                "
                onerror="imageFallback(this)">

            </td>

            <td>

                ${drink.name}

            </td>

            <td>

                ${formatCurrency(drink.price)}

            </td>

            <td>

                ${drink.category}

            </td>

            <td>

                ${drink.stock}

            </td>

            <td>

                <button
                class="btn btn-warning btn-sm me-1"
                onclick="editDrink('${drink.id}')">

                <i class="fa fa-pen"></i>

                </button>

                <button
                class="btn btn-danger btn-sm"
                onclick="removeDrink('${drink.id}')">

                <i class="fa fa-trash"></i>

                </button>

            </td>

        </tr>

        `;

    });

    $("#drinkTableBody")
        .html(html);

}
/* =========================================
   SAVE DRINK
========================================= */

async function saveDrink() {

    const drink = {

        name: $("#drinkName").val().trim(),

        price: $("#drinkPrice").val(),

        image: $("#drinkImage").val().trim(),

        category: $("#drinkCategory").val(),

        description: $("#drinkDescription").val().trim(),

        stock: $("#drinkStock").val()

    };

    const error =
        validateDrink(drink);

    if (error) {

        showToast(
            error,
            "danger"
        );

        return;

    }

    try {

        if (editDrinkId) {

            await updateDrink(
                editDrinkId,
                drink
            );

            showToast(
                "Cập nhật đồ uống thành công"
            );

        } else {

            await createDrink(
                drink
            );

            showToast(
                "Thêm đồ uống thành công"
            );

        }

        editDrinkId = null;

        clearDrinkForm();

        bootstrap.Modal
            .getInstance(
                document.getElementById(
                    "drinkModal"
                )
            )
            .hide();

        await loadDrinks();

        updateDashboard();

    }
    catch (error) {

        console.error(error);

        showToast(
            "Có lỗi xảy ra",
            "danger"
        );

    }

}

/* =========================================
   EDIT DRINK
========================================= */

async function editDrink(id) {

    try {

        const drink =
            await getDrinkById(id);

        editDrinkId = id;

        $("#drinkModalTitle")
            .text("Cập Nhật Đồ Uống");

        $("#drinkName")
            .val(drink.name);

        $("#drinkPrice")
            .val(drink.price);

        $("#drinkImage")
            .val(drink.image);

        $("#drinkCategory")
            .val(drink.category);

        $("#drinkDescription")
            .val(drink.description);

        $("#drinkStock")
            .val(drink.stock);

        new bootstrap.Modal(
            document.getElementById(
                "drinkModal"
            )
        ).show();

    }
    catch (error) {

        console.error(error);

    }

}

/* =========================================
   DELETE DRINK
========================================= */

async function removeDrink(id) {

    if (
        !confirm(
            "Bạn có chắc muốn xóa đồ uống này?"
        )
    ) {
        return;
    }

    try {

        await deleteDrink(id);

        showToast(
            "Đã xóa đồ uống"
        );

        await loadDrinks();

        updateDashboard();

    }
    catch (error) {

        console.error(error);

    }

}

/* =========================================
   CLEAR DRINK FORM
========================================= */

function clearDrinkForm() {

    $("#drinkName").val("");

    $("#drinkPrice").val("");

    $("#drinkImage").val("");

    $("#drinkCategory").val("Coffee");

    $("#drinkDescription").val("");

    $("#drinkStock").val("");

}

/* =========================================
   SEARCH DRINK
========================================= */

function searchDrink() {

    const keyword =

        $("#searchDrink")
        .val()
        .toLowerCase();

    const filtered =

        drinks.filter(drink =>

            drink.name
            .toLowerCase()
            .includes(keyword)

        );

    renderDrinks(filtered);

}

/* =========================================
   EXPORT DRINK CSV
========================================= */

function exportDrinkCSV() {

    if (
        drinks.length === 0
    ) {

        showToast(
            "Không có dữ liệu",
            "warning"
        );

        return;

    }

    exportCSV(
        drinks,
        "drinks.csv"
    );

    showToast(
        "Xuất file thành công"
    );

}
/* =========================================
   LOAD TABLES
========================================= */

async function loadTables() {

    try {

        tables = await getTables();

        renderTables();

    }
    catch (error) {

        console.error(error);

    }

}

/* =========================================
   RENDER TABLES
========================================= */

function renderTables(data = tables) {

    let html = "";

    data.forEach(table => {

        html += `

        <tr>

            <td>${table.id}</td>

            <td>${table.tableNumber}</td>

            <td>${table.capacity}</td>

            <td>${table.location}</td>

            <td>

                ${getStatusBadge(
                    table.status
                )}

            </td>

            <td>

                <button
                class="btn btn-warning btn-sm me-1"
                onclick="editTable('${table.id}')">

                <i class="fa fa-pen"></i>

                </button>

                <button
                class="btn btn-danger btn-sm"
                onclick="removeTable('${table.id}')">

                <i class="fa fa-trash"></i>

                </button>

            </td>

        </tr>

        `;

    });

    $("#tableTableBody").html(html);

}

/* =========================================
   SAVE TABLE
========================================= */

async function saveTable() {

    const table = {

        tableNumber:
            $("#tableNumber").val().trim(),

        capacity:
            $("#tableCapacity").val(),

        location:
            $("#tableLocation").val().trim(),

        status:
            $("#tableStatus").val()

    };

    const error =
        validateTable(table);

    if (error) {

        showToast(
            error,
            "danger"
        );

        return;

    }

    try {

        if (editTableId) {

            await updateTable(
                editTableId,
                table
            );

            showToast(
                "Cập nhật bàn thành công"
            );

        }
        else {

            await createTable(
                table
            );

            showToast(
                "Thêm bàn thành công"
            );

        }

        editTableId = null;

        clearTableForm();

        bootstrap.Modal
            .getInstance(
                document.getElementById(
                    "tableModal"
                )
            )
            .hide();

        await loadTables();

        updateDashboard();

    }
    catch (error) {

        console.error(error);

    }

}

/* =========================================
   EDIT TABLE
========================================= */

async function editTable(id) {

    try {

        const table =
            await getTableById(id);

        editTableId = id;

        $("#tableModalTitle")
            .text("Cập Nhật Bàn");

        $("#tableNumber")
            .val(table.tableNumber);

        $("#tableCapacity")
            .val(table.capacity);

        $("#tableLocation")
            .val(table.location);

        $("#tableStatus")
            .val(table.status);

        new bootstrap.Modal(
            document.getElementById(
                "tableModal"
            )
        ).show();

    }
    catch (error) {

        console.error(error);

    }

}

/* =========================================
   DELETE TABLE
========================================= */

async function removeTable(id) {

    if (
        !confirm(
            "Bạn có chắc muốn xóa bàn này?"
        )
    ) {
        return;
    }

    try {

        await deleteTable(id);

        showToast(
            "Đã xóa bàn"
        );

        await loadTables();

        updateDashboard();

    }
    catch (error) {

        console.error(error);

    }

}

/* =========================================
   CLEAR TABLE FORM
========================================= */

function clearTableForm() {

    $("#tableNumber").val("");

    $("#tableCapacity").val("");

    $("#tableLocation").val("");

    $("#tableStatus").val("Available");

}

/* =========================================
   SEARCH TABLE
========================================= */

function searchTable() {

    const keyword =

        $("#searchTable")
        .val()
        .toLowerCase();

    const filtered =

        tables.filter(table =>

            table.tableNumber
            .toLowerCase()
            .includes(keyword)

        );

    renderTables(filtered);

}

/* =========================================
   EXPORT TABLE CSV
========================================= */

function exportTableCSV() {

    if (
        tables.length === 0
    ) {

        showToast(
            "Không có dữ liệu",
            "warning"
        );

        return;

    }

    exportCSV(
        tables,
        "tables.csv"
    );

    showToast(
        "Xuất CSV thành công"
    );

}
/* =========================================
   LOAD RESERVATIONS
========================================= */

async function loadReservations() {

    try {

        reservations =
            await getReservations();

        renderReservations();

    }
    catch (error) {

        console.error(error);

    }

}

/* =========================================
   RENDER RESERVATIONS
========================================= */

function renderReservations(data = reservations) {

    let html = "";

    data.forEach(item => {

        html += `

        <tr>

            <td>${item.customerName}</td>

            <td>${item.phone}</td>

            <td>${item.reservationDate}</td>

            <td>${item.reservationTime}</td>

            <td>${item.guests}</td>

            <td>${item.tableId}</td>

            <td>

                ${getStatusBadge(item.status)}

            </td>

            <td>

                <select
                    class="form-select form-select-sm"
                    onchange="
                    changeReservationStatus(
                        '${item.id}',
                        this.value
                    )">

                    <option value="Pending"
                    ${item.status==="Pending"?"selected":""}>
                    Pending
                    </option>

                    <option value="Confirmed"
                    ${item.status==="Confirmed"?"selected":""}>
                    Confirmed
                    </option>

                    <option value="Cancelled"
                    ${item.status==="Cancelled"?"selected":""}>
                    Cancelled
                    </option>

                    <option value="Completed"
                    ${item.status==="Completed"?"selected":""}>
                    Completed
                    </option>

                </select>

            </td>

            <td>

                <button
                class="btn btn-warning btn-sm me-1"
                onclick="
                cancelReservation(
                    '${item.id}'
                )">

                Hủy

                </button>

                <button
                class="btn btn-danger btn-sm"
                onclick="
                deleteReservationAdmin(
                    '${item.id}'
                )">

                Xóa

                </button>

            </td>

        </tr>

        `;

    });

    $("#reservationTableBody")
        .html(html);

}

/* =========================================
   UPDATE STATUS
========================================= */

async function changeReservationStatus(
    id,
    status
) {

    try {

        await updateReservation(
            id,
            {
                status
            }
        );

        showToast(
            "Đã cập nhật trạng thái"
        );

        await loadReservations();

        updateDashboard();

    }
    catch (error) {

        console.error(error);

    }

}

/* =========================================
   CANCEL RESERVATION
========================================= */

async function cancelReservation(id) {

    if (
        !confirm(
            "Bạn có muốn hủy đơn này?"
        )
    ) {
        return;
    }

    try {

        await updateReservation(
            id,
            {
                status:
                "Cancelled"
            }
        );

        showToast(
            "Đã hủy đơn"
        );

        await loadReservations();

        updateDashboard();

    }
    catch (error) {

        console.error(error);

    }

}

/* =========================================
   DELETE RESERVATION
========================================= */

async function deleteReservationAdmin(id) {

    if (
        !confirm(
            "Bạn có chắc muốn xóa đơn?"
        )
    ) {
        return;
    }

    try {

        await deleteReservation(id);

        showToast(
            "Đã xóa đơn"
        );

        await loadReservations();

        updateDashboard();

    }
    catch (error) {

        console.error(error);

    }

}

/* =========================================
   SEARCH RESERVATION
========================================= */

function searchReservation() {

    const keyword =

        $("#searchReservation")
        .val()
        .toLowerCase();

    const filtered =

        reservations.filter(item =>

            item.customerName
                .toLowerCase()
                .includes(keyword)

            ||

            item.phone
                .includes(keyword)

        );

    renderReservations(filtered);

}

/* =========================================
   EXPORT RESERVATION CSV
========================================= */

function exportReservationCSV() {

    if (
        reservations.length === 0
    ) {

        showToast(
            "Không có dữ liệu",
            "warning"
        );

        return;

    }

    exportCSV(
        reservations,
        "reservations.csv"
    );

    showToast(
        "Xuất CSV thành công"
    );

}