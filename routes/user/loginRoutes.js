import express from 'express';
import verifyFirebaseToken from '../../middleware/verifyFirebaseToken.js';
import verifyAllowed from '../../middleware/verifyAllowed.js';
import { User } from '../../models/relations.js';

const loginRouter = express.Router();

// Login or Register
loginRouter.post("/login", verifyFirebaseToken, verifyAllowed, async (req, res) => {
    const { uid, email, name, regNo } = req.user;

    if (!uid || !email || !name || !regNo) {
        return res.status(400).json({ message: "Email, Name and RegNo are required" });
    }

    try {
        let user = await User.findOne({ where: { firebaseId: uid } });

        if (!user) {
            // also check email uniqueness
            const existingEmailUser = await User.findOne({ where: { email: email.toLowerCase() } });
            if (existingEmailUser) {
                return res.status(400).json({ message: "Email already registered with another account" });
            }

            user = await User.create({
                firebaseId: uid,
                name,
                email: email.toLowerCase(),
                regNo
            });
        }

        return res.status(200).json({
            message: "Logged in successfully",
            user
        });
    } catch (error) {
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
