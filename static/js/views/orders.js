
function initializeOrder() {
    const allButton = document.getElementById("allButton");
    if (allButton) {
        allButton.classList.add("border-b-[5px]", "border-[#EB6B72]");
    }

    const allTable = document.querySelector(".allTable");
    if (allTable) {
        allTable.classList.remove("hidden");
    }
}



function handleTabClick(tabId) {
    const buttons = document.querySelectorAll(".tab-button");
    buttons.forEach(button => {
        button.classList.remove("border-b-[5px]", "border-[#EB6B72]");
    });

    document.getElementById(tabId).classList.add("border-b-[5px]", "border-[#EB6B72]");

    const tables = document.querySelectorAll(".allTable, .pndTable, .opTable, .compTable, .cnclTable");
    tables.forEach(table => {
        table.classList.add("hidden");
    });

    switch (tabId) {
        case "allButton":
            document.querySelector(".allTable").classList.remove("hidden");
            break;
        case "pendingButton":
            document.querySelector(".pndTable").classList.remove("hidden");
            break;
        case "processButton":
            document.querySelector(".opTable").classList.remove("hidden");
            break;
        case "completedButton":
            document.querySelector(".compTable").classList.remove("hidden");
            break;
        case "cancelledButton":
            document.querySelector(".cnclTable").classList.remove("hidden");
            break;
    }
}

// Function to get a cookie by name and decode its value

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) {
            const cookieValue = c.substring(nameEQ.length, c.length);
            return decodeCookie(cookieValue);  // Decode before returning the cookie value
        }
    }
    return null;
}

// Example of checking if the user is logged in when the page loads
function user() {
    const username = getCookie("username");
    const email = getCookie("email");
    if (username) {
        const usernameC = document.getElementById("usernameAcc");
        const emailC = document.getElementById("emailAcc");
        usernameC.textContent = username;
        emailC.textContent = email;
        //console.log("User is logged in as " + username);
    } else {
        // User is not logged in, so you can redirect them to login page
        console.log("User is not logged in");
    }
}

user();

initializeOrder();
