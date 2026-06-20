/* =====================================
   GLOBAL
===================================== */

let drinks = [];

let filteredDrinks = [];

let currentPage = 1;

const itemsPerPage = 6;

let cart = JSON.parse(

    localStorage.getItem("cart")

) || [];
/* =====================================
   PAGE LOAD
===================================== */

$(document).ready(function () {

    loadTheme();

    $("#darkModeBtn").click(function () {

        toggleTheme();

    });

    initialize();
    //  updateCart();
    renderCart();

    $("#searchInput").on(
        "keyup",
        filterDrinks
    );

    $("#categoryFilter").on(
        "change",
        filterDrinks
    );

    $("#sortSelect").on(
        "change",
        filterDrinks
    );

});

/* =====================================
   INIT
===================================== */

async function initialize() {

    $("#drinkContainer")
        .html(
            renderSkeleton(6)
        );

    try {

        drinks =
            await getDrinks();

        filteredDrinks =
            [...drinks];

        renderDrinks();
        renderCart();

    }
    catch (error) {

        console.error(error);

        showToast(
            "Không tải được menu",
            "danger"
        );

    }

}

/* =====================================
   FILTER
===================================== */

function filterDrinks() {

    const keyword =

        $("#searchInput")
        .val()
        .toLowerCase();

    const category =

        $("#categoryFilter")
        .val();

    const sort =

        $("#sortSelect")
        .val();

    filteredDrinks =

        drinks.filter(drink => {

            const matchName =

                drink.name
                .toLowerCase()
                .includes(keyword);

            const matchCategory =

                category === "All"
                ||
                drink.category === category;

            return (
                matchName
                &&
                matchCategory
            );

        });

    switch (sort) {

        case "priceAsc":

            filteredDrinks.sort(
                (a, b) =>
                a.price - b.price
            );

            break;

        case "priceDesc":

            filteredDrinks.sort(
                (a, b) =>
                b.price - a.price
            );

            break;

        case "nameAsc":

            filteredDrinks.sort(
                (a, b) =>
                a.name.localeCompare(
                    b.name
                )
            );

            break;

    }

    currentPage = 1;

    renderDrinks();

}

/* =====================================
   RENDER DRINKS
===================================== */

function renderDrinks() {

    const data = paginate(

        filteredDrinks,

        currentPage,

        itemsPerPage

    );

    let html = "";

    if (data.length === 0) {

        html = `

        <div class="col-12">

            <div class="alert alert-warning">

                Không tìm thấy đồ uống phù hợp

            </div>

        </div>

        `;

    }

    data.forEach((drink,index) => {

        // const favorite =

        //     isFavorite(
        //         drink.id
        //     );

console.log(drink);
console.log(Object.keys(drink));

        html += `

        <div class="col-lg-4 col-md-6 mb-4">

        <div class="card drink-card">

            <img
                src="${drink.image}"
                class="card-img-top"
                onerror="imageFallback(this)">

            <div class="card-body">

                <div class="d-flex justify-content-between">

                    <h5 class="drink-name">
                        ${drink.name}
                    </h5>

                </div>

                <span class="badge category-badge">
                    ${drink.category}
                </span>

                <p class="drink-price mt-2">
                    ${formatCurrency(drink.price)}
                </p>

                <button
                    class="btn btn-main w-100 mt-2"
                    onclick="addToCart('${drink.id}')">

                    <i class="fa-solid fa-cart-plus"></i>

                    Thêm Vào Giỏ

                </button>

            </div>

        </div>

    </div>

    `;
});
    $("#drinkContainer")
        .html(html);

    renderPageNumbers();

}

/* =====================================
   PAGINATION
===================================== */

function renderPageNumbers() {

    $("#pagination").html(

        renderPagination(

            filteredDrinks.length,

            currentPage,

            itemsPerPage

        )

    );

    $(".page-link").click(

        function (e) {

            e.preventDefault();

            currentPage =

                Number(
                    $(this)
                    .data("page")
                );

            renderDrinks();

        }

    );

}

/* =====================================
   FAVORITE
===================================== */

function favoriteDrink(id) {

    toggleFavorite(id);

    renderDrinks();

}

/* =====================================
   DETAIL MODAL
===================================== */

function showDrinkDetail(id) {

    const drink =

        drinks.find(

            item =>
            item.id == id

        );

    if (!drink)
        return;

    const html = `

    <div class="row">

        <div class="col-md-6">

            <img

                src="${drink.image}"

                class="img-fluid rounded"

                onerror="
                imageFallback(this)
                "

            >

        </div>

        <div class="col-md-6">

            <h3>

                ${drink.name}

            </h3>

            <p>

                <strong>
                Danh mục:
                </strong>

                ${drink.category}

            </p>

            <p>

                <strong>
                Giá:
                </strong>

                ${formatCurrency(
                    drink.price
                )}

            </p>

            <p>

                <strong>
                Tồn kho:
                </strong>

                ${drink.stock}

            </p>

            <hr>

            <p>

                ${drink.description
                ||
                "Chưa có mô tả"}

            </p>

        </div>

    </div>

    `;

    $("#modalBody")
        .html(html);

    const modal =

        new bootstrap.Modal(

            document.getElementById(
                "drinkModal"
            )

        );

    modal.show();

}
/* =========================
   CART
========================= */

function addToCart(id){

    id = String(id);

    const drink = drinks.find(
        item => String(item.id) === id
    );

    if(!drink){

        console.log("Không tìm thấy:", id);
        return;

    }

    const existing = cart.find(
        item => String(item.id) === id
    );

    if(existing){

        existing.quantity++;

    }
    else{

        cart.push({

            id: String(drink.id),

            name: drink.name,

            image: drink.image,

            price: Number(drink.price),

            quantity: 1

        });

    }

    saveCart();

    showToast(
        drink.name + " đã thêm vào giỏ hàng"
    );

}
function saveCart(){

    localStorage.setItem(

        "cart",

        JSON.stringify(cart)

    );

    renderCart();

}

function renderCart(){

    let html = "";

    let total = 0;

    cart.forEach(item=>{

        total +=

            item.price *

            item.quantity;

        html += `

        <div class="border rounded p-2 mb-3">

            <div class="d-flex">

                <img
                    src="${item.image}"
                    width="70"
                    height="70"
                    class="rounded me-2"
                    style="object-fit:cover;">

                <div>

                    <strong>

                        ${item.name}

                    </strong>

                    <p>

                        ${formatCurrency(item.price)}

                    </p>

                    <div>

                        <button
                            class="btn btn-sm btn-outline-secondary"
                            onclick="decreaseCart('${item.id}')">

                            -

                        </button>

                        <span class="mx-2">

                            ${item.quantity}

                        </span>

                        <button
                            class="btn btn-sm btn-outline-secondary"
                            onclick="increaseCart('${item.id}')">

                            +

                        </button>

                    </div>

                </div>

            </div>

        </div>

        `;

    });

    $("#cartItems").html(html);

    $("#cartTotal").text(

        formatCurrency(total)

    );

    $("#cartCount").text(

        cart.reduce(

            (sum,item)=>

            sum + item.quantity,

            0

        )

    );

}

function increaseCart(id){

    const item = cart.find(

        x=>x.id==id

    );

    if(item){

        item.quantity++;

    }

    saveCart();

}

function decreaseCart(id){

    const item = cart.find(

        x=>x.id==id

    );

    if(!item) return;

    item.quantity--;

    if(item.quantity<=0){

        cart = cart.filter(

            x=>x.id!=id

        );

    }

    saveCart();

}

function clearCart(){

    if(

        !confirm(

            "Xóa toàn bộ giỏ hàng?"

        )

    ) return;

    cart = [];

    saveCart();

}

function checkoutCart(){

    if(cart.length===0){

        showToast(

            "Giỏ hàng đang trống",

            "warning"

        );

        return;

    }

    showToast(

        "Đặt món thành công"

    );

    cart = [];

    saveCart();

}




