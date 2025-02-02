const multer = require('multer');
const firebaseStorage = require('multer-firebase-storage');
const serviceAccount = require('../drive-2708-firebase-adminsdk-fbsvc-fda003590b.json');

const storage = firebaseStorage({
    credentials: {
        clientEmail: serviceAccount.client_email,
        privateKey: serviceAccount.private_key,
        projectId: serviceAccount.project_id,
    },
    bucketName: 'drive-2708.firebasestorage.app',
    unique: true,
});

const upload = multer({
    storage: storage
});

module.exports = upload;