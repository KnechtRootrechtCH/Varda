import {observable, action, computed, runInAction} from 'mobx';
import { firestore } from '../config/fire'
import * as Moment from 'moment';

import AuthenticationStore from './AuthenticationStore';
import MetadataService from '../service/MetadataService';

class CommentsStore {
    @observable comments = new Map();
    pageSize = 100;

    @action resetComment() {
        this.comments = new Map();
    }

    @action loadComments() {
        firestore
        .collection('user')
        .doc(this.dataUid)
        .collection('comments')
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) => {
            runInAction(() => {
                snapshot.forEach(doc => {
                    this.comments.set(doc.id, doc.data());
                });
                this.loading = false;
            });
        });
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
        firestore
            .collection('users')
            .doc(this.dataUid)
            .collection('comments')
            .orderBy('timestamp', 'desc')
            .where('key', '==', key)
            .limit(this.pageSize)
            .onSnapshot((snapshot) => {
                runInAction(() => {
                    snapshot.forEach(doc => {
                        this.comments.set(doc.id, doc.data());
                    });
                    this.loading = false;
                    console.debug('CommentsStore.loadCommentsByKey() : loaded', this.comments);
                });
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
            .set(data);
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