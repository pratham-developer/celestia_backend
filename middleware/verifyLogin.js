import User from "../models/userModel.js";

const verifyLogin = async (req, res, next) => {
    const email = req.user.email;

    try{
        const userData = await User.findOne({where : {email}});
        console.log(email);
        console.log(userData);
        if(!userData) return res.status(400).json({message: "You are not signed up"});

        req.userData = userData;
        next();
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: "Server Error"});
    }
    
}

export default verifyLogin;