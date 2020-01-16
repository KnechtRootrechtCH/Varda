import {observable, action, computed, runInAction} from 'mobx';
import { firestore } from '../config/fire'
import * as Moment from 'moment';

import AuthenticationStore from './AuthenticationStore';
import ErrorHandlingStore from './ErrorHandlingStore';
import NotificationStore from './NotificationStore';
import MetadataService from '../service/MetadataService';

class CommentsStore {
    loading = false;
    lastItem = null;
    @observable comments = new Map();
    @observable itemComments = new Map();
    @observable sortField = 'timestamp';
    @observable sortAscending = false;
    @observable newCommentsCount = 0;
    pageSize = 100;
    newCountLimit = 5;
    lastQuery = null;
    lastCountQuery = null;

    @action resetComments() {
        this.comments = new Map();
        this.lastItem = null;
    }

    @action loadComments() {
        if (this.lastQuery) {
            // console.debug('CommentsStore.loadCommentsByKey() : unsubscribing from last query', this.lastQuery);
            this.lastQuery.onSnapshot(function (){
                // Unsubscribe
              });
        }

        console.debug('CommentsStore.loadComments()', this.dataUid);
        this.loading = true;
        let query = firestore
            .collection('users')
            .doc(this.dataUid)
            .collection('comments')
            .orderBy(this.sortField, this.sortAscending ? 'asc' : 'desc')

        if (this.lastItem) {
            // console.debug('CommentsStore.loadComments() : loading', this.lastItem);
            query = query.startAfter(this.lastItem.timestamp.toDate());
        }

        query = query.limit(this.pageSize);
        query.onSnapshot((snapshot) => {
            runInAction(() => {
                snapshot.forEach(doc => {
                    this.lastItem = doc.data();
                    this.lastItem.external = this.lastItem.userName !== this.displayName;
                    this.comments.set(doc.id, this.lastItem);
                });
                this.loading = false;
                console.debug('CommentsStore.loadComments() : loaded', this.comments);
            });
        }, (error) => {
            ErrorHandlingStore.handleError('firebase.comments.load', error);
        });

        this.lastQuery = query;
    }

    @action resetItemComments() {
        this.itemComments = new Map();
    }

    @action loadCommentsByItem(item) {
        const key = MetadataService.getKey(item);
        this.loadCommentsByKey(key);
    }

    @action loadCommentsById(mediaType, itemId) {
        const key = `${mediaType}:${itemId}`;
        this.loadCommentsByKey(key);
    }

    @action loadCommentsByKey(key) {
        if (this.lastQuery) {
            // console.debug('CommentsStore.loadCommentsByKey() : unsubscribing from last query', this.lastQuery);
            this.lastQuery.onSnapshot(function (){
                // Unsubscribe
            });
        }

        console.debug('CommentsStore.loadCommentsByKey()', this.dataUid, key);
        this.loading = true;

        let query = firestore
            .collection('users')
            .doc(this.dataUid)
            .collection('comments')
            .orderBy(this.sortField, this.sortAscending ? 'asc' : 'desc')
            .where('key', '==', key);

        query.onSnapshot((snapshot) => {
            runInAction(() => {
                snapshot.forEach(doc => {
                    let item = doc.data();
                    item.external = item.userName !== this.displayName;
                    this.itemComments.set(doc.id, item);
                });
                this.loading = false;
                console.debug('CommentsStore.loadCommentsByKey() : loaded', this.itemComments);
            });
        }, (error) => {
            ErrorHandlingStore.handleError('firebase.comments.item.load', error);
        });

        this.lastQuery = query;
    }

    @action loadNewCommentsCount() {
        let timestamp = this.commentsTimestamp;
        if (!timestamp) {
            console.debug('CommentsStore.loadNewCommentsCount() => no timestamp!');
        }

        if (this.lastCountQuery) {
            // console.debug('CommentsStore.loadNewCommentsCount() : unsubscribing from last query', this.lastCountQuery);
            this.lastCountQuery.onSnapshot(function (){
                // Unsubscribe
            });
        }

        let query = firestore
            .collection('users')
            .doc(this.dataUid)
            .collection('comments')
            .orderBy('timestamp', 'desc');

        if (timestamp) {
            query = query.where('timestamp', '>', timestamp);
        }

        query = query.limit(this.newCountLimit * 5);

        console.debug('CommentsStore.loadNewCommentsCount() => ', this.dataUid, this.uid, timestamp);
        query.onSnapshot((snapshot) => {
            runInAction(() => {
                let count = 0;
                snapshot.forEach(doc => {
                    let data = doc.data();
                    if (data.userName !== this.displayName) {
                        count++;
                    }
                });
                this.newCommentsCount = count;
                console.debug('CommentsStore.loadNewCommentsCount() : loaded', this.newCommentsCount, this.displayName, timestamp);
            });
        }, (error) => {
            ErrorHandlingStore.handleError('firebase.comments.count', error);
        });

        this.lastCountQuery = query;
    }

    @action addComment(item, comment, itemTitle) {
        const key = MetadataService.getKey(item);
        const userName = this.displayName;
        const isAdminComment = this.isAdmin;
        const date = new Date();
        const timestamp = Moment(date).format('YYYY-MM-DD HH-mm-ss-SSSS ZZ');

        const data = {
            key: key,
            userName: userName,
            timestamp: date,
            text: comment,
            isAdminComment: isAdminComment,
            itemTitle: itemTitle,
        };

        firestore
            .collection('users')
            .doc(this.dataUid)
            .collection('comments')
            .doc(`${timestamp} - ${key}`)
            .set(data)
            .then(() => {
                console.debug('CommentsStore.addComment() : successfull');
            })
            .catch((error) => {
                ErrorHandlingStore.handleError('firebase.comments.add', error);
            });
    }

    @action updateTimestamp() {

        const timestamp = new Date();
        firestore
            .collection('users')
            .doc(this.uid)
            .set({
                commentsTimestamp: timestamp
            }, {
                merge: true
            })
            .then(() => {
                console.debug('CommentsStore.updateTimestamp() : successfull');
            })
            .catch((error) => {
                ErrorHandlingStore.handleError('firebase.comments.updateTimestamp', error);
            });
    }

    @action setSorting(sortField, sortAscending) {
        this.resetComments();
        this.sortField = sortField;
        this.sortAscending = sortAscending;
    }

    @computed get uid () {
        return AuthenticationStore.uid;
    }

    @computed get dataUid () {
        return AuthenticationStore.dataUid;
    }

    @computed get isAdmin () {
        return AuthenticationStore.isAdmin;
    }

    @computed get displayName () {
        return AuthenticationStore.displayName;
    }

    @computed get commentsTimestamp () {
        return AuthenticationStore.commentsTimestamp ? AuthenticationStore.commentsTimestamp : null;
    }

    @computed get isAdminAction(){
        return this.isAdmin && this.dataUid !== this.uid;
    }

    @computed get notificationsEnabled () {
        return NotificationStore.commentNotifications;
    }
}

// ensure single instance
const store = new CommentsStore();
export default store;