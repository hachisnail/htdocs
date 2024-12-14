// Function to get a cookie by name and decode its value
user();

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
      const emailC =  document.getElementById("emailAcc");
        usernameC.textContent = username;
        emailC.textContent = email;
        //console.log("User is logged in as " + username);
    } else {
        // User is not logged in, so you can redirect them to login page
        console.log("User is not logged in");
    }
}