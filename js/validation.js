/* ======================================
   PHONE VALIDATION
====================================== */

function validatePhone(phone){

    const regex =
        /^0\d{9}$/;

    return regex.test(phone);

}

/* ======================================
   DRINK VALIDATION
====================================== */

function validateDrink(drink){

    if(

        !drink.name ||
        drink.name.trim() === ""

    ){

        return "Tên đồ uống không được để trống";

    }

    if(

        drink.name.length < 2

    ){

        return "Tên đồ uống quá ngắn";

    }

    if(

        isNaN(drink.price)

    ){

        return "Giá không hợp lệ";

    }

    if(

        Number(drink.price) <= 0

    ){

        return "Giá phải lớn hơn 0";

    }

    if(

        !drink.category ||
        drink.category.trim() === ""

    ){

        return "Danh mục không được để trống";

    }

    if(

        isNaN(drink.stock)

    ){

        return "Tồn kho không hợp lệ";

    }

    if(

        Number(drink.stock) < 0

    ){

        return "Tồn kho không được âm";

    }

    return "";

}

/* ======================================
   TABLE VALIDATION
====================================== */

function validateTable(table){

    if(

        !table.tableNumber ||
        table.tableNumber.trim() === ""

    ){

        return "Mã bàn không được để trống";

    }

    if(

        Number(table.capacity) <= 0

    ){

        return "Sức chứa phải lớn hơn 0";

    }

    if(

        !table.location ||
        table.location.trim() === ""

    ){

        return "Vị trí không được để trống";

    }

    if(

        !table.status

    ){

        return "Trạng thái bàn không hợp lệ";

    }

    return "";

}

/* ======================================
   RESERVATION VALIDATION
====================================== */

function validateReservation(data){

    if(

        !data.customerName ||
        data.customerName.trim() === ""

    ){

        return "Vui lòng nhập họ tên";

    }

    if(

        data.customerName.length < 2

    ){

        return "Tên khách hàng quá ngắn";

    }

    if(

        !validatePhone(
            data.phone
        )

    ){

        return "Số điện thoại không hợp lệ";

    }

    if(

        !data.reservationDate

    ){

        return "Chưa chọn ngày đặt";

    }

    if(

        data.reservationDate <
        getToday()

    ){

        return "Không thể đặt ngày trong quá khứ";

    }

    if(

        !data.reservationTime

    ){

        return "Chưa chọn giờ đặt";

    }

    if(

        Number(data.guests) <= 0

    ){

        return "Số khách phải lớn hơn 0";

    }

    if(

        !data.tableId

    ){

        return "Vui lòng chọn bàn";

    }

    return "";

}

/* ======================================
   IMAGE URL VALIDATION
====================================== */

function validateImageUrl(url){

    if(

        !url ||
        url.trim() === ""

    ){

        return false;

    }

    return (

        url.startsWith("http://")
        ||
        url.startsWith("https://")

    );

}

/* ======================================
   REQUIRED FIELD
====================================== */

function validateRequired(value){

    return (

        value &&
        value.trim() !== ""

    );

}

/* ======================================
   NUMBER VALIDATION
====================================== */

function validatePositiveNumber(value){

    return (

        !isNaN(value)
        &&
        Number(value) > 0

    );

}

/* ======================================
   DATE VALIDATION
====================================== */

function validateFutureDate(date){

    return date >= getToday();

}