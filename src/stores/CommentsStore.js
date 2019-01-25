import {observable, action, computed} from 'mobx';
import { firestore } from '../config/fire'

import constants from '../config/constants';

class CommentsStore {
}

// ensure single instance
const store = new CommentsStore();
export default store;