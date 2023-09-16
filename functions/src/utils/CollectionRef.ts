import Middleware from '../middleware/Middleware';
import firestore from './firestore';

Middleware.initAdminSDK();

class CollectionRef {
	static apiKeys = firestore.collection('apiKeys');
}

export default CollectionRef;
