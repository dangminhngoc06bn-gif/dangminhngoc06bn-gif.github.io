/* =====================================
   GLOBAL
===================================== */

let tables = [];

/* =====================================
   LOAD PAGE
===================================== */

$(document).ready(function () {

    loadTheme();

    $("#darkModeBtn").click(function () {

        toggleTheme();

    });

    $("#reservationDate").attr(
        "min",
        getToday()
    );

    loadTables();

    $("#reservationForm").submit(
        submitReservation
    );

});

/* =====================================
   LOAD TABLES
===================================== */

async function loadTables() {

    try {

        tables = await getTables();

        renderTableOptions();

        renderTableCards();

    }
    catch (error) {

        console.error(error);

        showToast(
            "Không tải được dữ liệu bàn",
            "danger"
        );

    }

}

/* =====================================
   SELECT OPTION
===================================== */

function renderTableOptions() {

    const availableTables =

        tables.filter(

            table =>

            table.status === "Available"

        );

    let html = `

    <option value="">

        Chọn bàn

    </option>

    `;

    availableTables.forEach(table => {

        html += `

        <option value="${table.id}">

            ${table.tableNumber}
            - ${table.capacity} người
            - ${table.location}

        </option>

        `;

    });

    $("#tableId").html(html);

}

/* =====================================
   TABLE CARD
===================================== */

function renderTableCards() {

    const availableTables =

        tables.filter(

            table =>

            table.status === "Available"

        );

    let html = "";

    if (availableTables.length === 0) {

        html = `

        <div class="col-12">

            <div class="alert alert-warning">

                Hiện không còn bàn trống

            </div>

        </div>

        `;

    }

    availableTables.forEach(table => {

        html += `

        <div class="col-md-4 mb-4">

            <div class="table-card">

                <h5>

                    Bàn ${table.tableNumber}

                </h5>

                <p>

                    <strong>Sức chứa:</strong>

                    ${table.capacity} người

                </p>

                <p>

                    <strong>Vị trí:</strong>

                    ${table.location}

                </p>

                <p>

                    ${getStatusBadge(
                        table.status
                    )}

                </p>

            </div>

        </div>

        `;

    });

    $("#tableContainer").html(html);

}

/* =====================================
   SUBMIT FORM
===================================== */

async function submitReservation(event) {

    event.preventDefault();

    const reservation = {

        customerName:
            $("#customerName").val(),

        phone:
            $("#phone").val(),

        reservationDate:
            $("#reservationDate").val(),

        reservationTime:
            $("#reservationTime").val(),

        guests:
            $("#guests").val(),

        tableId:
            $("#tableId").val(),

        note:
            $("#note").val(),

        status:
            "Pending"

    };

    const error =

        validateReservation(
            reservation
        );

    if (error) {

        showToast(
            error,
            "danger"
        );

        return;

    }

    try {

        await createReservation(
            reservation
        );

        showToast(
            "Đặt bàn thành công!"
        );

        updateTableStatus(
            reservation.tableId
        );

        $("#reservationForm")[0]
            .reset();

        loadTables();

    }
    catch (error) {

        console.error(error);

        showToast(
            "Lỗi đặt bàn",
            "danger"
        );

    }

}

/* =====================================
   UPDATE TABLE STATUS
===================================== */

async function updateTableStatus(id) {

    try {

        await updateTable(
            id,
            {
                status:
                "Reserved"
            }
        );

    }
    catch (error) {

        console.error(error);

    }

}