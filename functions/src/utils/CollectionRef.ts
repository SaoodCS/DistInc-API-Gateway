import Middleware from '../middleware/Middleware';
import firestore from './firestore';

Middleware.initAdminSDK();

class CollectionRef {
	static example = firestore.collection('example');
	static userDetails = firestore.collection('userDetails');
	static bankAccounts = firestore.collection('banks');
	static expenses = firestore.collection('expenses');
	static income = firestore.collection('incomes');
}

export default CollectionRef;
