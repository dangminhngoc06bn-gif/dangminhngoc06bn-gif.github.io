/* ======================================
   MOCK API URL
====================================== */

const DRINK_API =
"https://6a278859a84f9d39e908af0c.mockapi.io/drinks";

const TABLE_API =
"https://6a278cb3a84f9d39e908b3d3.mockapi.io/tables";

const RESERVATION_API =
"https://6a278cb3a84f9d39e908b3d3.mockapi.io/reservations";

/* ======================================
   DRINK API
====================================== */

async function getDrinks() {

    try {

        const response =
            await fetch(DRINK_API);

        return await response.json();

    }
    catch(error){

        console.error(error);

        return [];

    }

}

async function getDrinkById(id){

    try{

        const response =
            await fetch(
                `${DRINK_API}/${id}`
            );

        return await response.json();

    }
    catch(error){

        console.error(error);

    }

}

async function createDrink(data){

    try{

        const response =
            await fetch(
                DRINK_API,
                {
                    method:"POST",

                    headers:{
                        "Content-Type":
                        "application/json"
                    },

                    body:
                    JSON.stringify(data)
                }
            );

        return await response.json();

    }
    catch(error){

        console.error(error);

    }

}

async function updateDrink(id,data){

    try{

        const response =
            await fetch(
                `${DRINK_API}/${id}`,
                {
                    method:"PUT",

                    headers:{
                        "Content-Type":
                        "application/json"
                    },

                    body:
                    JSON.stringify(data)
                }
            );

        return await response.json();

    }
    catch(error){

        console.error(error);

    }

}

async function deleteDrink(id){

    try{

        await fetch(
            `${DRINK_API}/${id}`,
            {
                method:"DELETE"
            }
        );

        return true;

    }
    catch(error){

        console.error(error);

        return false;

    }

}

/* ======================================
   TABLE API
====================================== */

async function getTables(){

    try{

        const response =
            await fetch(TABLE_API);

        return await response.json();

    }
    catch(error){

        console.error(error);

        return [];

    }

}

async function getTableById(id){

    try{

        const response =
            await fetch(
                `${TABLE_API}/${id}`
            );

        return await response.json();

    }
    catch(error){

        console.error(error);

    }

}

async function createTable(data){

    try{

        const response =
            await fetch(
                TABLE_API,
                {
                    method:"POST",

                    headers:{
                        "Content-Type":
                        "application/json"
                    },

                    body:
                    JSON.stringify(data)
                }
            );

        return await response.json();

    }
    catch(error){

        console.error(error);

    }

}

async function updateTable(id,data){

    try{

        const response =
            await fetch(
                `${TABLE_API}/${id}`,
                {
                    method:"PUT",

                    headers:{
                        "Content-Type":
                        "application/json"
                    },

                    body:
                    JSON.stringify(data)
                }
            );

        return await response.json();

    }
    catch(error){

        console.error(error);

    }

}

async function deleteTable(id){

    try{

        await fetch(
            `${TABLE_API}/${id}`,
            {
                method:"DELETE"
            }
        );

        return true;

    }
    catch(error){

        console.error(error);

        return false;

    }

}

/* ======================================
   RESERVATION API
====================================== */

async function getReservations(){

    try{

        const response =
            await fetch(
                RESERVATION_API
            );

        return await response.json();

    }
    catch(error){

        console.error(error);

        return [];

    }

}

async function getReservationById(id){

    try{

        const response =
            await fetch(
                `${RESERVATION_API}/${id}`
            );

        return await response.json();

    }
    catch(error){

        console.error(error);

    }

}

async function createReservation(data){

    try{

        const response =
            await fetch(
                RESERVATION_API,
                {
                    method:"POST",

                    headers:{
                        "Content-Type":
                        "application/json"
                    },

                    body:
                    JSON.stringify(data)
                }
            );

        return await response.json();

    }
    catch(error){

        console.error(error);

    }

}

async function updateReservation(id,data){

    try{

        const response =
            await fetch(
                `${RESERVATION_API}/${id}`,
                {
                    method:"PUT",

                    headers:{
                        "Content-Type":
                        "application/json"
                    },

                    body:
                    JSON.stringify(data)
                }
            );

        return await response.json();

    }
    catch(error){

        console.error(error);

    }

}

async function deleteReservation(id){

    try{

        await fetch(
            `${RESERVATION_API}/${id}`,
            {
                method:"DELETE"
            }
        );

        return true;

    }
    catch(error){

        console.error(error);

        return false;

    }

}