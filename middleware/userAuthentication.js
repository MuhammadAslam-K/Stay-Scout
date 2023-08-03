import dotenv from "dotenv"
import jwt from "jsonwebtoken"

dotenv.config({ path: "config.env" })

const isLogged = (req, res, next) => {
    const token = req.headers.authorization;

    try {
        if (token && token.startsWith('Bearer ')) {
            // Remove the 'Bearer ' prefix from the token
            const tokenWithoutPrefix = token.replace('Bearer ', '');
            console.log(`beaer ${tokenWithoutPrefix}`)
            jwt.verify(tokenWithoutPrefix, process.env.SECRET_TOKEN, (err, decodedToken) => {
                if (err) {
                    console.log(err);
                    return res.status(401).end();
                } else {
                    req.decodedToken = decodedToken;
                    next();
                }
            });
        } else {
            return res.status(401).end();
        }
    } catch (error) {
        console.log(error);
    }
};


const isValid = (req, res) => {
    const { token } = req.body;

    try {
        if (token) {
            console.log(38);
            // Verify the token
            jwt.verify(token, process.env.SECRET_TOKEN, (err, decodedToken) => {
                console.log(decodedToken);
                if (err) {
                    console.log(err);
                    return res.status(401).end();
                } else {
                    return res.status(200).end()
                }
            });
        } else {
            return res.status(401).end();
        }
    } catch (error) {
        console.log(error);
    }
}

const islogout = ((req, res, next) => {

    try {
        if (!req.session.usertoken) {
            next()
        } else {
            res.redirect("/")
        }
    } catch (error) {
        console.log(error)
    }

})



const isBlocked = (async (req, res, next) => {
    next();
    // const id = req.session.user._id
    // try {
    //     const user = await User.findById(id)
    //     if (user.is_block) {
    //         delete req.session.user
    //         delete req.session.usertoken

    //         res.redirect("/login")
    //     }
    //     else {
    //         next()
    //     }

    // } catch (error) {
    //     console.log(error);
    // }
})

export default {
    islogout,
    isLogged,
    isBlocked,
    isValid,
}
