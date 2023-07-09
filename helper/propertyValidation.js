

const hotelValidation = ((data) => {
    // console.log(data);
    const errors = {}

    const { name, title, startingPrice, city, pincode, description, address } = data

    const alphanumericPattern = /^[A-Za-z0-9]+$/
    const titlePattern = /\b\w{3,20}\b/
    const numberPattern = /^[0-9]+$/
    const pricePattern = /^(?:50000|[5-9]\d{3}|[1-4]\d{4}|500)$/
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
    // else if (!titlePattern.test(title)) {
    //     errors.titleError = 'Title should contain min 5 and max 20 words'
    // }



    // Price Validation //
    if (!startingPrice) {
        errors.priceError = "Please enter the startingprice"
    } else if (!numberPattern.test(startingPrice)) {
        errors.priceError = 'Price should contain only numbers'
    } else if (!pricePattern.test(startingPrice)) {
        errors.priceError = 'Price should be between 500 and 50000'
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
    // else if (!descriptionPattern.test(description)) {
    //     errors.descriptionError = "The description should contain min 20 to 500 words"
    // }

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

    const alphanumericPattern = /^[A-Za-z0-9]+$/
    const numberPattern = /^[0-9]+$/
    const pricePattern = /^(?:50000|[5-9]\d{3}|[1-4]\d{4}|500)$/
    const descriptionPattern = /^(?:\b\w+\b\s*){20,1000}$/

    // Price Validation //
    if (!price) {
        errors.priceError = "Please enter the startingprice"
    } else if (!numberPattern.test(price)) {
        errors.priceError = 'Price should contain only numbers'
    }
    // else if (!pricePattern.test(price)) {
    //     errors.priceError = 'Price should be between 500 and 50000'
    // }

    // Adults Validation //
    if (!adults) {
        errors.adultsError = "Field Should not be empty"
    } else if (!numberPattern.test(adults)) {
        errors.adultsError = 'should contain only numbers'
    }
    // else if ((adults > 1) && (adults < 10)) {
    //     errors.adultsError = 'Should be between 1 to 10'
    // }

    // Childrents Validation //
    if (!childrents) {
        errors.childrentsError = "Field Should not be empty"
    } else if (!numberPattern.test(childrents)) {
        errors.childrentsError = 'should contain only numbers'
    }

    // BED Validation //
    if (bed[0] == " " || !bed) {
        errors.bedError = "Provide the bed type"
    } else if (!alphanumericPattern.test(bed)) {
        errors.bedError = 'should contain only letters and numbers'
    }

    if (description[0] == " " || !description) {
        errors.descriptionError = "Please enter the Description"
    }
    // else if (!descriptionPattern.test(description)) {
    //     errors.descriptionError = "The description should contain min 20 to 500 words"
    // }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    }
}

export default {
    hotelValidation,
    roomValidation,
}