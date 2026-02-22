const admin = require('firebase-admin');

// 1. You MUST download your Service Account Key from Firebase Console:
// Project Settings -> Service Accounts -> Generate New Private Key
// Save it in this directory as 'serviceAccountKey.json'
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// The email of the user you want to make an Admin
const adminEmail = process.argv[2];

if (!adminEmail) {
    console.error("Please provide an email address.");
    console.log("Usage: node make-admin.js <email>");
    process.exit(1);
}

const grantAdminRole = async (email) => {
    try {
        const user = await admin.auth().getUserByEmail(email);

        // This is the magic line that sets { admin: true } inside their JWT
        await admin.auth().setCustomUserClaims(user.uid, {
            admin: true
        });

        console.log(` SUCCESS! 
User ${email} has been granted the 'admin' custom claim.
They need to logout and log back in to get the new token.`);

        process.exit(0);

    } catch (error) {
        console.error("Error granting admin claim:", error.message);
        process.exit(1);
    }
};

grantAdminRole(adminEmail);
