import admin from '../config/firebase.js';

const verifyFirebaseToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'unauthorized', message: 'Authorization token missing or invalid' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(token, true);

        let email = decodedToken.email?.toLowerCase();
        if (!email || !email.endsWith('@vitstudent.ac.in')) {
            return res.status(401).json({ message: "Use VIT student email" });
        }

        const displayName = decodedToken.name || "";

        // safer parsing
        const regIndex = displayName.lastIndexOf(" ");
        const fullName = regIndex > 0 ? displayName.slice(0, regIndex) : displayName;
        const reg = regIndex > 0 ? displayName.slice(regIndex + 1) : null;

        req.user = {
            email,
            name: fullName,
            regNo: reg
        };

        next();
        
    } catch (error) {
        console.error('Error verifying token:', error.code, error.message);

        let message = 'Unauthorized access';
        if (error.code === 'auth/id-token-expired') {
            message = 'Token expired. Please log in again.';
        } else if (error.code === 'auth/argument-error') {
            message = 'Invalid token format.';
        }

        return res.status(401).json({ error: 'unauthorized', message });
    }
};

export default verifyFirebaseToken;
