import express from 'express';
import verifyFirebaseToken from '../../middleware/verifyFirebaseToken.js';
import verifyAllowed from '../../middleware/verifyAllowed.js';
import { User } from '../../models/relations.js';
import { Sequelize } from "sequelize";
const loginRouter = express.Router();

// Login or Register
loginRouter.post("/login", verifyFirebaseToken, verifyAllowed, async (req, res) => {
    const { email, name, regNo } = req.user;

    if (!email || !name || !regNo) {
        return res.status(400).json({ message: "Email, Name and RegNo are required" });
    }

    try {
        const [user, created] = await User.findOrCreate({
            where: { email: email.toLowerCase() },
            defaults: {
                name,
                regNo
            }
        });

        return res.status(200).json({
            message: created ? "User registered successfully" : "Logged in successfully",
            user
        });
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            return res.status(409).json({ 
                message: "A user with this RegNo or Email already exists. Please contact support." 
            });
        }

        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Get User
loginRouter.get("/", verifyFirebaseToken, async (req, res) => {
    try {
        const email = req.user.email?.toLowerCase();
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "User retrieved successfully", user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
});

export default loginRouter;
