import Coopen from "../../model/coupon.js";
import propertyValidation from "../../helper/propertyValidation.js";



// To render the coupen table
const coupons = async (req, res) => {
    try {
        const coupon = await Coopen.find()
        res.render("coupon", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.status(404).render("404");
                } else {
                    return res.status(500).render("500");
                }
            }
            res.render("coupon", { coupon })
        })

    } catch (error) {
        console.log(error);
    }
}


// For validate and add new coupon
const addCoupon = async (req, res) => {
    try {
        const { couponCode, discount, minVal, maxVal, expireAt } = req.body
        const coopenExist = await Coopen.find({ couponCode })
        const validate = propertyValidation.coupenValidate(req.body)

        if (!validate.isValid) {
            return res.status(400).json({ error: validate.error })
        }
        else if (coopenExist.length != 0) {
            console.log(34);
            return res.status(400).json({ error: { coupenError: "The coupen already Existes" } })
        }
        else {
            console.log(37);
            const coopen = new Coopen({
                couponCode,
                discount,
                minVal,
                maxVal,
                expireAt,
            })

            await coopen.save()
            return res.status(200).end()
        }
    } catch (error) {
        console.log(error);
    }
}


// For blocking and unblocking the coupen
const blockCoupon = async (req, res) => {
    try {
        const coupen = await Coopen.findById(req.query.id)
        coupen.isBlock = !coupen.isBlock
        await coupen.save()
        return res.status(200).end()
    } catch (error) {
        console.log(error);
        return res.status(500).end()
    }
}

// For editing the coupen
const getCoupon = async (req, res) => {
    try {
        const coupen = await Coopen.findById(req.query.id)
        res.json(coupen);

    } catch (error) {
        return res.status(400).end()
    }
}

// To update the coupen
const updateCoupon = async (req, res) => {
    try {

        const { couponCode, discount, minVal, maxVal, expireAt } = req.body
        const validate = propertyValidation.coupenValidate(req.body)

        if (!validate.isValid) {
            return res.status(400).json({ error: validate.error })
        }
        else {

            await Coopen.findByIdAndUpdate(
                req.body.coupenId,
                { couponCode, discount, minVal, maxVal, expireAt },
                { new: true }
            )

            return res.status(200).end()
        }
    } catch (error) {
        return res.status(400).end()
    }
}

export default {
    coupons,
    addCoupon,
    blockCoupon,
    getCoupon,
    updateCoupon,
}