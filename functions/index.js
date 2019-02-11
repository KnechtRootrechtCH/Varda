// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send('Hello from Firebase!');
});

exports.itemUpdateListener = functions.firestore.document('users/{userId}/items/{itemId}').onWrite((change, context) => {
    // console.log(change);
    // console.log(context);
    const uid = context.params.userId;
    const before = change.before.exists ? change.before.data() : null;
    const after = change.after.exists ? change.after.data() : null;
    const previousSatus = before ? before.status : null;
    const newStatus = after ? after.status : null;
    console.log(`Status change detected: ${previousSatus} => ${newStatus}`)

    return admin.firestore()
            .collection('users')
            .doc(uid)
            .get()
            .then((doc) => {
                const data = doc.data();
                let counts = data.itemCounts;
                console.log('Previous counts object', counts);
                if (!counts) {
                    counts = new Object();
                }
                if (!newStatus || newStatus === 'removed') {
                    let total = counts['total'];
                    total = total ? total - 1 : 0;
                    counts['total'] = total;
                } else {
                    let value = counts[newStatus];
                    value = value ? value + 1 : 1;
                    counts[newStatus] = value;
                }

                if (!previousSatus || previousSatus === 'removed') {
                    let total = counts['total'];
                    total = total ? total + 1 : 1;
                    counts['total'] = total;
                } else {
                    let value = counts[previousSatus];
                    value = value ? value - 1 : 0;
                    counts[previousSatus] = value;
                }

                //ensure plain JS object
                const plain = JSON.parse(JSON.stringify(counts));
                console.log('New counts object', plain);

                return admin.firestore()
                    .collection('users')
                    .doc(uid)
                    .set({
                        itemCounts: plain,
                    }, {
                        merge: true
                    });
            })
});