import admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();

const serviceAccount = JSON.parse(
    Buffer.from(process.env.FIREBASE, "base64").toString("utf-8")
);

try {
    if (!admin.apps.length) {
        admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    }

} catch (error) {
    console.error("Error initializing Firebase:", error);
    process.exit(1);
}

export default admin;