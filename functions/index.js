// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.itemUpdateListener = functions.firestore.document('users/{userId}/items/{itemId}').onWrite(async (change, context) => {
    // console.log(change);
    // console.log(context);
    const uid = context.params.userId;
    const before = change.before.exists ? change.before.data() : null;
    const after = change.after.exists ? change.after.data() : null;
    const previousSatus = before ? before.status : null;
    const newStatus = after ? after.status : null;
    console.log(`Status change detected: ${previousSatus} => ${newStatus}`)

    const doc = await admin.firestore()
        .collection('users')
        .doc(uid)
        .get();
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
        let value_1 = counts[newStatus];
        value_1 = value_1 ? value_1 + 1 : 1;
        counts[newStatus] = value_1;
    }
    if (!previousSatus || previousSatus === 'removed') {
        let total_1 = counts['total'];
        total_1 = total_1 ? total_1 + 1 : 1;
        counts['total'] = total_1;
    } else {
        let value_2 = counts[previousSatus];
        value_2 = value_2 ? value_2 - 1 : 0;
        counts[previousSatus] = value_2;
    }
    //ensure plain JS object
    const plain = JSON.parse(JSON.stringify(counts));
    console.log('New counts object', plain);
    return await admin
        .firestore()
        .collection('users')
        .doc(uid)
        .set({
            itemCounts: plain
        }, {
            merge: true
        });
});

exports.updateItemCounts = functions.https.onCall(async (data, context) => {
    const uid = data.uid ? data.uid : context.auth.uid;
    console.log('data', data);
    console.log('uid', uid);
    let result = {
        success: false,
        uid: uid,
    }

    try {
        const snapshot = await admin
            .firestore()
            .collection('users')
            .doc(uid)
            .collection('items')
            .get();

        let total = 0;
        let removed = 0;
        let queued = 0;
        let notReleased = 0;
        let notAvailable = 0;
        let notFound = 0;
        let redownload = 0;
        let downloading = 0;
        let downloaded = 0;

        snapshot.forEach(doc => {
            const item = doc.data();

            if (item.status === 'removed') {
                removed += 1;
            }
            if (item.status === 'queued') {
                queued += 1;
                total += 1;
            }
            if (item.status === 'notReleased') {
                notReleased += 1;
                total += 1;
            }
            if (item.status === 'notAvailable') {
                notAvailable += 1;
                total += 1;
            }
            if (item.status === 'notFound') {
                notFound += 1;
                total += 1;
            }
            if (item.status === 'redownload') {
                redownload += 1;
                total += 1;
            }
            if (item.status === 'downloading') {
                downloading += 1;
                total += 1;
            }
            if (item.status === 'downloaded') {
                downloaded += 1;
                total += 1;
            }
        });

        let itemCounts = {};
        itemCounts.total = total;
        itemCounts.removed = removed;
        itemCounts.queued = queued;
        itemCounts.notReleased = notReleased;
        itemCounts.notAvailable = notAvailable;
        itemCounts.notFound = notFound;
        itemCounts.redownload = redownload;
        itemCounts.downloading = downloading;
        itemCounts.downloaded = downloaded;
        itemCounts.timestamp = new Date();

        const plain = JSON.parse(JSON.stringify(itemCounts));
        result.itemCounts = plain;
        console.log('item count complete => saving', plain);
        try {
            await admin
                .firestore()
                .collection('users')
                .doc(uid)
                .set({
                    itemCounts: plain
                }, {
                    merge: true
                });
            result.success = true;
            console.log("successfully executed update", result);
            return result;
        } catch (error) {
            console.log("error during update", error);
            result.success = false;
            result.error = error;
            result.message = error.message;
            return result;
        }
    } catch (error_1) {
        console.log("unexpected error", error_1);
        result.success = false;
        result.error = error_1;
        result.message = error_1.message;
        return result;
    }
});

exports.updateItemStatus = functions.https.onCall(async (data, context) => {
    const uid = data.uid ? data.uid : context.auth.uid;
    console.log('data', data);
    console.log('uid', uid);
    let result = {
        success: false,
        uid: uid,
    }

    try {
        const snapshot = await admin.firestore()
            .collection('users')
            .doc(uid)
            .collection('items')
            .get();
        const now = new Date();
        result.timestamp = now;
        let updates = [];

        let batch = admin.firestore().batch();

        let collection = admin.firestore()
            .collection('users')
            .doc(uid)
            .collection('items');

        snapshot.forEach(doc => {
            const item = doc.data();
            const status = item.status;
            const release = item.release ? item.release.toDate() : null;
            let newStatus = null;
            if ((status === 'queued' || status === 'redownload' || status === 'notFound' || status === 'notAvailable') && (release === null || now < release)) {
                newStatus = 'notReleased';
            } else if (status === 'notReleased' && now > release) {
                newStatus = 'queued';
            }

            if (newStatus && updates.length <= 490) {
                console.log('setting status of item', doc.id, newStatus, item.title, item.status, item.release);
                const ref = collection.doc(doc.id);
                batch.update(ref, {
                    status: newStatus
                });
                item.status = newStatus;
                updates.push(item);
            } else if (newStatus) {
                console.warn("skipping update for item (maximum number of updates reached)", doc.id, newStatus, item.title, item.status, item.release);
            }
        });

        console.log("updating timestamp");
        const ref_1 = admin.firestore()
            .collection('users')
            .doc(uid);
        batch.update(ref_1, {
            statusUpdateTimestamp: now
        });

        console.log('preparing result');
        result.updates = updates;

        console.log(`executing batch update for ${updates.length} items`);
        batch.commit().then((data_1) => {
            result.success = true;
            console.log("successfully executed batch update", result);
            result.data = data_1;
            return result;
        })
            .catch((error) => {
                console.error("error during batch update", error);
                result.success = false;
                result.error = error;
                result.message = error.message;
                return result;
            });
    } catch (error_1) {
        console.error("critical error", error_1);
        result.success = false;
        result.error = error_1;
        result.message = error_1.message;
        return result;
    }
});

exports.requeueItems = functions.https.onCall(async (data, context) => {
    const uid = data.uid ? data.uid : context.auth.uid;
    console.log('data', data);
    console.log('uid', uid);
    let result = {
        success: false,
        uid: uid,
    }

    try {
        const snapshot = await admin.firestore()
            .collection('users')
            .doc(uid)
            .collection('items')
            .get();
        const now = new Date();
        result.timestamp = now;
        let updates = [];

        let batch = admin.firestore().batch();

        let collection = admin.firestore()
            .collection('users')
            .doc(uid)
            .collection('items');

        snapshot.forEach(doc => {
            const item = doc.data();
            const status = item.status;
            let newStatus = null;
            if (status === 'notFound' || status === 'redownload' || status === 'notAvailable') {
                newStatus = 'queued';
            }

            if (newStatus && updates.length <= 490) {
                console.log('setting status of item', doc.id, newStatus, item.title, item.status);
                const ref = collection.doc(doc.id);
                batch.update(ref, {
                    status: newStatus
                });
                item.status = newStatus;
                updates.push(item);
            }  else if (newStatus) {
                console.warn("skipping update for item (maximum number of updates reached)", doc.id, newStatus, item.title, item.status);
            }
        });

        console.log("updating timestamp");
        const ref_1 = admin.firestore()
            .collection('users')
            .doc(uid);
        batch.update(ref_1, {
            requeueItemsTimestamp: now
        });

        console.log('preparing result');
        result.updates = updates;

        console.log(`executing batch update for ${updates.length} items`);
        batch.commit().then((data_1) => {
            result.success = true;
            console.log("successfully executed batch update", result);
            result.data = data_1;
            return result;
        })
            .catch((error) => {
                console.error("", error);
                result.success = false;
                result.error = error;
                result.message = error.message;
                return result;
            });
    } catch (error_1) {
        console.error("critical error", error_1);
        result.success = false;
        result.error = error_1;
        result.message = error_1.message;
        return result;
    }
});