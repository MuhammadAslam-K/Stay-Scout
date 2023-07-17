

const hotelValidation = ((data) => {
    // console.log(data);
    const errors = {}

    const { name, title, startingPrice, city, pincode, description, address } = data
        ;
    const alphanumericPattern = /^[A-Za-z0-9]+$/
    const numberPattern = /^[0-9]+$/
    const cityPattern = /^(?:\b\w+\b\s*){0,10}$/
    const pincodePattern = /^\d{6}$/
    // const descriptionPattern = /^(?:\b\w+\b\s*){20,1000}$/
    const addressPattern = /^[a-zA-Z0-9\s\-\.,]+$/;




    //  Name Validation //
    if (!name) {
        errors.nameError = "Please Enter Your Name"
    } else if (name.length < 3 || name[0] == " ") {
        errors.nameError = "Enter a Valid Name"
    }

    // Title Validation //
    if (title[0] == " " || !title) {
        errors.titleError = "Please enter the title"
    }



    // Price Validation //
    if (!startingPrice) {
        errors.priceError = "Please enter the startingprice"
    } else if (!numberPattern.test(startingPrice)) {
        errors.priceError = 'Price should contain only numbers'
    }


    // City Validation //

    if (city[0] == " " || !city) {
        errors.cityError = "Please enter the City"
    } else if (!alphanumericPattern.test(city)) {
        errors.cityError = 'City should contain only letters and numbers'
    } else if (!cityPattern.test(city)) {
        errors.cityError = 'City should contain only max 10 words'
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
    }


    // Address Validation //
    if (address[0] == " " || !address) {
        errors.addressError = "Please enter the address"
    } else if (!addressPattern.test(address)) {
        errors.addressError = "The address can contain only 50 words"
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    }
})



function roomValidation(data) {
    const errors = {}
    const { price, adults, childrents, bed, description } = data
    console.log(data);
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


const bookingValidation = (date) => {
    const { checkIn, checkOut, adults, kids } = date;
    const numberPattern = /^[0-9]+$/;
    const errors = {};

    if (!numberPattern.test(adults)) {
        errors.adultsError = "Invalid input for adults";
    }

    if (!numberPattern.test(kids)) {
        errors.kidsError = "Invalid input for kids";
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




export default {
    hotelValidation,
    roomValidation,
    bookingValidation,
}