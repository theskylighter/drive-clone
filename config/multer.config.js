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

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1 * 1024 * 1024 // 1 MB limit
    }
});

module.exports = upload;