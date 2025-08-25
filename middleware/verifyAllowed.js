import { AllowedEmail } from '../models/relations.js';

const verifyAllowed = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Login not done." });
        }

        const email = req.user.email;
        if (!email) {
            return res.status(403).json({ message: "Login using your VIT email." });
        }

        const allowedEmail = await AllowedEmail.findByPk(email);

        if (!allowedEmail) {
            return res.status(403).json({ message: "You are not registered for the hackathon." });
        }

        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

export default verifyAllowed;
