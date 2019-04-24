import {observable, action, computed, runInAction} from 'mobx';
import { firestore } from '../config/fire'
import * as Moment from 'moment';

import AuthenticationStore from './AuthenticationStore';
import ErrorHandlingStore from './ErrorHandlingStore';
import MetadataService from '../service/MetadataService';

class CommentsStore {
    loading = false;
    lastItem = null;
    @observable comments = new Map();
    @observable itemComments = new Map();
    @observable sortField = 'timestamp';
    @observable sortAscending = false;
    pageSize = 100;

    @action resetComments() {
        this.comments = new Map();
        this.lastItem = null;
    }

    @action loadComments() {
        console.debug('CommentsStore.loadComments()', this.dataUid);
        this.loading = true;
        let query = firestore
            .collection('users')
            .doc(this.dataUid)
            .collection('comments')
            .orderBy(this.sortField, this.sortAscending ? 'asc' : 'desc')

        if (this.lastItem) {
            // console.debug('DownloadHistoryStore.loadHistory() : loading', this.lastItem);
            query = query.startAfter(this.lastItem.timestamp.toDate());
        }

        query
            .limit(this.pageSize)
            .onSnapshot((snapshot) => {
                runInAction(() => {
                    snapshot.forEach(doc => {
                        this.lastItem = doc.data();
                        this.comments.set(doc.id, this.lastItem);
                    });
                    this.loading = false;
                    console.debug('CommentsStore.loadComments() : loaded', this.comments);
                });
            }, (error) => {
                ErrorHandlingStore.handleError('firebase.comments.load', error);
            });
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
        console.debug('CommentsStore.loadCommentsByKey()', this.dataUid, key);
        this.loading = true;
        firestore
            .collection('users')
            .doc(this.dataUid)
            .collection('comments')
            .orderBy(this.sortField, this.sortAscending ? 'asc' : 'desc')
            .where('key', '==', key)
            .onSnapshot((snapshot) => {
                runInAction(() => {
                    snapshot.forEach(doc => {
                        this.itemComments.set(doc.id, doc.data());
                    });
                    this.loading = false;
                    console.debug('CommentsStore.loadCommentsByKey() : loaded', this.itemComments);
                });
            }, (error) => {
                ErrorHandlingStore.handleError('firebase.comments.item.load', error);
            });
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

    @computed get isAdminAction(){
        return this.isAdmin && this.dataUid !== this.uid;
    }
}

// ensure single instance
const store = new CommentsStore();
export default store;