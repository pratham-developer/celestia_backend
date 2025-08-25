import express from 'express';
import verifyFirebaseToken from '../../middleware/verifyFirebaseToken.js';
import verifyAdmin from '../../middleware/verifyAdmin.js';
import { AllowedEmail, Admin } from '../../models/relations.js';

const allowOthersRouter = express.Router();

// Add to allowed emails
allowOthersRouter.get("/login",verifyFirebaseToken,verifyAdmin,async (req,res)=>{
    try{
        res.status(200).json({
            message : "Admin Logged In Successfully",
            user: req.user
        });
    }catch(error){
        console.error("Error in /login route:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});


allowOthersRouter.post("/allow", verifyFirebaseToken, verifyAdmin, async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const normalizedEmail = email.trim().toLowerCase();
        if (!normalizedEmail.endsWith('@vitstudent.ac.in')) {
            return res.status(401).json({ message: "Use VIT student email" });
        }

        const [allowed, created] = await AllowedEmail.findOrCreate({
            where: { email: normalizedEmail },
        });

        return res.status(200).json({
            message: created ? "Email allowed successfully" : "Email already allowed",
            data: allowed,
        });
    } catch (error) {
        console.error("Error in /allow route:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Make others admin
allowOthersRouter.post("/makeAdmin", verifyFirebaseToken, verifyAdmin, async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const normalizedEmail = email.trim().toLowerCase();
        if (!normalizedEmail.endsWith('@vitstudent.ac.in')) {
            return res.status(401).json({ message: "Use VIT student email" });
        }

        const [admin, created] = await Admin.findOrCreate({
            where: { email: normalizedEmail },
        });

        return res.status(200).json({
            message: created ? "Admin made successfully" : "Already admin",
            data: admin,
        });
    } catch (error) {
        console.error("Error in /makeAdmin route:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default allowOthersRouter;
