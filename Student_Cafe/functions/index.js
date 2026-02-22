const functions = require('firebase-functions');
const admin = require('firebase-admin');

// IMPORTANT: Do NOT call admin.initializeApp() here if you are deploying to Firebase.
// Firebase Cloud Functions initialize themselves automatically.
// Only uncomment for local emulator testing:
// admin.initializeApp();

exports.createOrder = functions.https.onCall(async (data, context) => {
    // 1. Authentication Check (Backend validation)
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'unauthenticated',
            'You must be logged in to place an order.'
        );
    }

    const { items } = data; // Only trust the product IDs and quantities from the client!

    if (!items || !Array.isArray(items) || items.length === 0) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Order must contain valid items.'
        );
    }

    let calculatedTotal = 0;
    const verifiedItems = [];

    // 2. Fetch Prices from the Database (Source of Truth)
    for (const item of items) {
        const productRef = admin.firestore().collection('products').doc(item.id);
        const productSnap = await productRef.get();

        if (!productSnap.exists) {
            throw new functions.https.HttpsError(
                'not-found',
                `Product ${item.id} no longer exists on the menu.`
            );
        }

        const productData = productSnap.data();
        const verifiedPrice = Number(productData.price);
        const quantity = Math.max(1, Number(item.quantity)); // Prevent negative quantities!

        calculatedTotal += (verifiedPrice * quantity);

        verifiedItems.push({
            id: item.id,
            name: productData.name,
            price: verifiedPrice,
            quantity: quantity
        });
    }

    // Add Tax
    const tax = calculatedTotal * 0.08;
    const finalTotal = Number((calculatedTotal + tax).toFixed(2));

    // 3. Process Payment securely here using Stripe/PayPal Server SDKs
    // (mocking successful payment for now)
    console.log(`Processing payment of $${finalTotal} for user ${context.auth.uid}`);

    // Random Token for Pickup (e.g., 4821)
    const tokenNumber = Math.floor(1000 + Math.random() * 9000).toString();

    const orderPayload = {
        userId: context.auth.uid,
        userEmail: context.auth.token.email || "unknown",
        items: verifiedItems, // Verified, completely safe list
        total: finalTotal,    // Calculated solely on backend
        status: "pending",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        tokenNumber: tokenNumber
    };

    // 4. BE writes to DB (Bypassing Firestore client rules which block writes)
    const orderRef = await admin.firestore().collection("orders").add(orderPayload);

    // Return safe data to the frontend for the confirmation page
    return {
        success: true,
        orderId: orderRef.id,
        tokenNumber: tokenNumber,
        verifiedTotal: finalTotal,
        verifiedItems: verifiedItems
    };
});
