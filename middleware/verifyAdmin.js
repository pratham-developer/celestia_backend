import { Admin } from '../models/relations.js';

const verifyAdmin = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Please log in." });
        }

        const email = req.user.email?.toLowerCase();
        if (!email) {
            return res.status(403).json({ message: "Login using your VIT email." });
        }

        const admin = await Admin.findByPk(email);

        if (!admin) {
            return res.status(403).json({ message: "Access denied. Not an admin." });
        }

        next();
    } catch (error) {
        console.error("verifyAdmin error:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

export default verifyAdmin;
