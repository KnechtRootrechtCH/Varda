// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

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

                return admin
                    .firestore()
                    .collection('users')
                    .doc(uid)
                    .set({
                        itemCounts: plain,
                    }, {
                        merge: true
                    });
            })
});

exports.updateItemCounts = functions.https.onCall((data, context) => {
    const uid = data.uid ? data.uid : context.auth.uid;
    console.log('data', data);
    console.log('context', context);
    console.log('uid', uid);
    let result = {
        success: false,
        uid: uid,
    }

    return admin
        .firestore()
        .collection('users')
        .doc(uid)
        .collection('items')
        .get()
        .then((snapshot) => {
            console.log('items loaded', snapshot);
            let itemCounts = new Object();
            snapshot.forEach(doc => {
                const item = doc.data();
                if (item.status && item.status !== 'removed') {
                    let total = itemCounts['total'];
                    total = total ? total + 1 : 1;
                    itemCounts['total'] = total;

                    let value = itemCounts[item.status];
                    value = value ? value + 1 : 1;
                    itemCounts[item.status] = value;
                }
            });

            itemCounts['timestamp'] = new Date();
            const plain = JSON.parse(JSON.stringify(itemCounts));
            result.itemCounts = plain;
            console.log('item count complete => saving', plain)
            return admin
                .firestore()
                .collection('users')
                .doc(uid)
                .set({
                    itemCounts: plain,
                }, {
                    merge: true
                })
                .then(() => {
                    result.success = true;
                    return result;
                })
                .catch((error) => {
                    result.success = false;
                    result.error = error;
                    result.message = error.message;
                    return result;
                });
        })
        .catch((error) => {
            result.success = false;
            result.error = error;
            result.message = error.message;
            return result;
        });
});

exports.updateItemStatus = functions.https.onCall((data, context) => {
    const uid = data.uid ? data.uid : context.auth.uid;
    console.log('data', data);
    console.log('context', context);
    console.log('uid', uid);
    let result = {
        success: false,
        uid: uid,
    }

    return admin.firestore()
        .collection('users')
        .doc(uid)
        .collection('items')
        .get()
        .then((snapshot) => {
            console.log('items loaded', snapshot);
            const now = new Date();
            result.timestamp = now;
            let updates = [];

            let batch = admin.firestore().batch();

            let collection = admin.firestore()
                                .collection('users')
                                .doc(uid)
                                .collection('items')

            snapshot.forEach(doc => {
                const item = doc.data();
                const status = item.status;
                const release = item.release.toDate();
                let newStatus = null;
                if (status === 'queued' && now < release) {
                    newStatus = 'notReleased';
                } else if (status === 'notReleased' && now > release) {
                    newStatus = 'queued';
                }

                if (newStatus) {
                    const ref = collection.doc(doc.id);
                    batch.update(ref, {
                        status: newStatus
                    });
                    item.status = newStatus;
                    updates.push(item);
                }
            });

            const ref = admin.firestore()
                            .collection('users')
                            .doc(uid);
            batch.update(ref, {
                statusUpdateTimestamp: now,
            })

            result.updates = updates;

            batch.commit().then((data) => {
                result.success = true;
                result.data = data;
                return result;
            })
            .catch((error) => {
                result.success = false;
                result.error = error;
                result.message = error.message;
                return result;
            });
        })
        .catch((error) => {
            result.success = false;
            result.error = error;
            result.message = error.message;
            return result;
        });
});