require('firebase/app');
require('firebase/firestore');
require('firebase/storage');
require('firebase/auth');

const db = firebase.firestore();
const storage = firebase.storage();
const auth = firebase.auth();

const settings = { timestampsInSnapshots: true };
db.settings(settings);

export {db, storage, auth};
