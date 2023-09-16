import * as express from 'express';
import * as functions from 'firebase-functions';
import gatewayRequestGet from './endpoints/getEndpoint';
import gatewayRequestPost from './endpoints/postEndpoint';
import Middleware from './middleware/Middleware';

const app = express();
Middleware.initAdminSDK();
app.use(Middleware.corsSetup);
app.use(Middleware.verifyHeaders);
app.use(Middleware.verifyAuthToken);

// API Endpoints:
app.post('/gatewayRequestPost', gatewayRequestPost);
app.get('/gatewayRequestGet', gatewayRequestGet);

// Export the API to Firebase Cloud Functions:
const apiGateway = functions.https.onRequest(app);
export { apiGateway };
