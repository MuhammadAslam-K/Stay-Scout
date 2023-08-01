

// To validate the form of hotel while adding and editing the hotel
const hotelValidation = ((data) => {
    const errors = {}

    const { name, title, startingPrice, city, pincode, description, address } = data

    const titlePattern = /^(?:\w+\s+){2,9}\w+$/
    const alphanumericPattern = /^[A-Za-z0-9]+$/
    const numberPattern = /^[0-9]+$/
    const cityPattern = /^(?:\b\w+\b\s*){0,3}$/
    const pincodePattern = /^\d{6}$/
    const pricePattern = /^(?:100|[2-9]\d{2,3}|1\d{4}|20000)$/
    const descriptionPattern = /^\s*(\S+\s+){19,499}\S+$/;
    const addressPattern = /^[\w\s,]+$/;

    //  Name Validation //
    if (!name) {
        errors.nameError = "Please Enter Your Name"
    } else if (name.length < 3 || name[0] == " ") {
        errors.nameError = "Enter a Valid Name"
    } else if (name.length > 30) {
        errors.nameError = "Invalid name"
    }

    // Title Validation //
    if (title[0] == " " || !title) {
        errors.titleError = "Please enter the title"
    }
    else if (!titlePattern.test(title)) {
        errors.titleError = "words (3-10)"
    }


    // Price Validation //
    if (!startingPrice) {
        errors.priceError = "Please enter the startingprice"
    } else if (!numberPattern.test(startingPrice)) {
        errors.priceError = 'Price should contain only numbers'
    } else if (!pricePattern.test(startingPrice)) {
        errors.priceError = "Price range (100-20000)"
    }


    // City Validation //

    if (city[0] == " " || !city) {
        errors.cityError = "Please enter the City"
    } else if (!alphanumericPattern.test(city)) {
        errors.cityError = 'City should contain only letters and numbers'
    } else if (!cityPattern.test(city)) {
        errors.cityError = 'word (max 3)'
    }

    // pincode Validation //

    if (pincode[0] == " " || !pincode) {
        errors.pincodeError = "Please enter the Pincode"
    } else if (!pincodePattern.test(pincode)) {
        errors.pincodeError = "The pincode must contain 6 digits"
    } else if (!alphanumericPattern.test(pincode)) {
        errors.pincodeError = "The pincode can only contain digits"
    }

    // Discription //
    if (description[0] == " " || !description) {
        errors.descriptionError = "Please enter the Description"
    } else if (!descriptionPattern.test(description)) {
        errors.descriptionError = "words (20-500)"
    }


    // Address Validation //
    if (address[0] == " " || !address) {
        errors.addressError = "Please enter the address"
    } else if (!addressPattern.test(address)) {
        errors.addressError = "word (2-10)"
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    }
})


// To validate the form of room while adding and editing the room
function roomValidation(data) {
    const errors = {}
    const { price, adults, childrents, bed, description } = data

    const numberPattern = /^[0-9]+$/


    // Price Validation //
    if (!price) {
        errors.priceError = "Please enter the startingprice"
    } else if (!numberPattern.test(price)) {
        errors.priceError = 'Price should contain only numbers'
    }


    // Adults Validation //
    if (!adults) {
        errors.adultsError = "Field Should not be empty"
    } else if (!numberPattern.test(adults)) {
        errors.adultsError = 'should contain only numbers'
    }


    // Childrents Validation //
    if (!childrents) {
        errors.childrentsError = "Field Should not be empty"
    } else if (!numberPattern.test(childrents)) {
        errors.childrentsError = 'should contain only numbers'
    }

    // BED Validation //
    if (!bed) {
        errors.bedError = "Provide the bed type"
    }

    if (!description) {
        errors.descriptionError = "Please enter the Description"
    }


    return {
        isValid: Object.keys(errors).length === 0,
        errors
    }
}

// To validate the checkIn and checkOut form of room
const bookingValidation = (data) => {

    const { checkIn, checkOut, adults } = data;

    const numberPattern = /^[0-9]+$/;
    const errors = {};

    if (!numberPattern.test(adults)) {
        errors.adultsError = "Invalid input for adults";
    }


    const currentDate = new Date();
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate < currentDate) {
        errors.checkInError = "Check-in date cannot be in the past";
    }

    if (checkOutDate <= checkInDate) {
        errors.checkOutError = "Check-out date must be greater than the check-in date";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    }
};


// To validate the hotel checkin and checkout form
const hotelHomeForm = (data) => {
    const errors = {}
    const { checkIn, checkOut } = data

    const currentDate = new Date();
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate < currentDate) {
        errors.checkInError = "Check-in date cannot be in the past";
    }

    if (checkOutDate <= checkInDate) {
        errors.checkOutError = "Check-out date must be greater than the check-in date";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    }
}


// For validating the banner information
const bannerValidate = (data) => {
    const { title, subtitle } = data
    const errors = {}

    // valdate the title
    if (!title) {
        errors.titleError = "Please enter the title"
    }
    else if (title.length < 3 || title[0] == " ") {
        errors.titleError = "Enter a Valid title"
    }
    // else if (title.length > 20) {
    //     console.log(title.length);
    //     errors.titleError = "Invalid title"
    // }

    // valdate the title
    if (!subtitle) {
        errors.subtitleError = "Please enter the sub title"
    }
    else if (subtitle.length < 3 || subtitle[0] == " ") {
        errors.subtitleError = "Enter a Valid sub title"
    }
    // else if (subtitle.length > 20) {
    //     console.log(subtitle.length);
    //     errors.subtitleError = "Invalid sub title"
    // }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    }
}

// To validate the coupen
const coupenValidate = (data) => {
    const { couponCode, discount, minVal, maxVal, expireAt } = data

    const discountRegex = /^(100|[1-9][0-9]?)$/;
    const minValRegex = /^[5-9]\d{2,}$/
    const maxValRegex = /^[1-5][0-9]{3,5}$/;
    const currentDate = new Date()
    const error = {}

    const parsedDiscount = parseInt(discount);
    const parsedMinVal = parseInt(minVal);
    const parsedMaxVal = parseInt(maxVal);
    const parsedExpireAt = new Date(expireAt);


    if (!couponCode || couponCode.trim() === '') {
        error.coupenError = "Coupon code is required."
    }

    if (isNaN(parsedDiscount) || parsedDiscount < 1 || parsedDiscount > 90) {
        error.discountError = "Discount should be between 1 and 90."
    }

    if (isNaN(parsedMinVal) || parsedMinVal <= 500 || parsedMinVal >= 6000) {
        error.minValError = "Min value should be a number between 501 and 5999."
    }

    if (isNaN(parsedMaxVal) || parsedMaxVal <= 500 || parsedMaxVal >= 6000) {
        error.maxValError = "Max value should be a number between 501 and 5999.."
    }

    if (parsedExpireAt <= currentDate) {
        error.expireAtError = "Expire date should be at least one day more than the current date."
    }
    return {
        isValid: Object.keys(error).length === 0,
        error
    }
}



export default {
    hotelValidation,
    roomValidation,
    bookingValidation,
    hotelHomeForm,
    bannerValidate,
    coupenValidate,
}