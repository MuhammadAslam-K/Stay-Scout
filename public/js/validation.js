

function nameValidation() {
    let name = document.getElementById("name").value
    let nameError = document.getElementById("nameError")
    if (name.length < 3 || name[0] == " ") {
        document.getElementById('nameError').innerHTML = "Enter a valid name"
        return false
    }
    else {
        nameError.innerHTML = ""
        return true
    }
}

function emailValidation() {

    let email = document.getElementById("userEmail").value;
    let emailError = document.getElementById("emailError");

    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email.length < 3 || email.trim() === "" || !emailPattern.test(email)) {
        emailError.innerHTML = "Enter a valid Email ID";
        return false
    } else {
        emailError.innerHTML = "";
        return true
    }
}

function phoneNumberValidation() {
    let phoneNumber = document.getElementById("phoneNumber").value;
    let phoneNumberError = document.getElementById("phoneNumberError");

    let phoneNumberPattern = /^\d{10}$/;

    if (!phoneNumberPattern.test(phoneNumber)) {
        phoneNumberError.innerHTML = "Enter a valid Phone Number (10 digits)";
        return false
    } else {
        phoneNumberError.innerHTML = "";
        return true
    }
}


function passwordValidation() {
    let password = document.getElementById("Password").value
    let passwordError = document.getElementById("passwordError")
    // let password2 = document.getElementById("Password2").value
    // let password2Error = document.getElementById("password2Error");

    let passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

    if (!passwordPattern.test(password)) {
        passwordError.innerHTML = "One Upper case,Lower case, (length 8)"
        return false
    }
    else {
        passwordError.innerHTML = ""
        // password2Error.innerHTML = ""
        return true
    }
}
// else if (password != password2) {
//     password2Error.innerHTML = "The password does't Match"
//     return false
// }

function submitValidation() {
    if (nameValidation() &&
        emailValidation() &&
        phoneNumberValidation() &&
        passwordValidation()
    ) {
        return true;
    } else {
        return false;
    }
}

function otpValidation() {
    let otp = document.getElementById("otp").value
    let otpError = document.getElementById("otpError")

    let otpPattern = /^\d{6}$/;

    if (!otpPattern.test(otp)) {
        otpError.innerHTML = "Enter a valid OTP (6 digits)";
        return false;
    } else {
        otpError.innerHTML = "";
        return true;
    }
}

function upiValidation() {
    let upi = document.getElementById("upi").value;
    let upiError = document.getElementById("upiError");

    let upiPattern = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+$/;

    if (!upiPattern.test(upi)) {
        upiError.innerHTML = "Enter a valid UPI ID";
        return false;
    } else {
        upiError.innerHTML = "";
        return true;
    }
}
