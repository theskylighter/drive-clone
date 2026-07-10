const multer = require('multer');
const firebaseStorage = require('multer-firebase-storage');

const storage = firebaseStorage({
    credentials: {
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        projectId: process.env.FIREBASE_PROJECT_ID,
    },
    bucketName: process.env.FIREBASE_STORAGE_BUCKET,
    unique: true,
});

const isDemoMode = process.env.DEMO_MODE === 'true';
const fileSizeLimit = isDemoMode ? 100 * 1024 : 1 * 1024 * 1024; // 100 KB in demo, 1 MB in production

const upload = multer({
    storage: storage,
    limits: {
        fileSize: fileSizeLimit
    }
});

module.exports = upload;