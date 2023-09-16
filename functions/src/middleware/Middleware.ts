import * as cors from 'cors';
import type * as express from 'express';
import * as admin from 'firebase-admin';
import ArrayOfObjects from '../helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import { isRunningLocally } from '../helpers/helpers';
import { authorisedDomains } from '../utils/CorsPolicy';
import type { IMicroservices } from '../utils/Microservices';
import microservices from '../utils/Microservices';
import { resCodes } from './../utils/resCode';

class Middleware {
	static initAdminSDK(): void {
		if (!admin.apps.length) {
			admin.initializeApp();
		}
	}

	static corsSetup(
		req: express.Request,
		res: express.Response,
		next: express.NextFunction,
	): express.Response | void {
		const corsMiddleware = cors({
			origin: authorisedDomains,
			optionsSuccessStatus: 200,
		});
		return corsMiddleware(req, res, next);
	}

	static verifyHeaders(
		req: express.Request,
		res: express.Response,
		next: express.NextFunction,
	): express.Response | void {
		if (isRunningLocally()) return next();

		const contentType = req.headers['content-type'];
		if (!contentType) {
			return res
				.status(resCodes.BAD_REQUEST.code)
				.send(
					`${resCodes.BAD_REQUEST.prefix}: Missing Content-Type Header In Request`,
				);
		}
		if (contentType !== 'application/json') {
			return res
				.status(resCodes.BAD_REQUEST.code)
				.send(
					`${resCodes.BAD_REQUEST.prefix} Invalid Content-Type Header In Request`,
				);
		}

		const serviceReq = req.headers.microservice;
		if (!serviceReq) {
			return res
				.status(resCodes.BAD_REQUEST.code)
				.send(
					`${resCodes.BAD_REQUEST.prefix}: Missing Microservice In Request`,
				);
		}
		if (typeof serviceReq !== 'string') {
			return res
				.status(resCodes.BAD_REQUEST.code)
				.send(
					`${resCodes.BAD_REQUEST.prefix}: Invalid Microservice In Request`,
				);
		}

		const serviceReqObj = ArrayOfObjects.objectWithVal(
			microservices,
			serviceReq,
		);
		if (!serviceReqObj) {
			return res
				.status(resCodes.BAD_REQUEST.code)
				.send(
					`${resCodes.BAD_REQUEST.prefix}: Requested Microservice Not Found`,
				);
		}

		if ('error' in serviceReqObj) {
			return res
				.status(resCodes.INTERNAL_SERVER.code)
				.send(
					`${resCodes.INTERNAL_SERVER.prefix}: ${serviceReqObj.error} Context: Requested Microservice`,
				);
		}
		return next();
	}

	static async verifyAuthToken(
		req: express.Request,
		res: express.Response,
		next: express.NextFunction,
	): Promise<express.Response | void> {
		if (isRunningLocally()) return next();

		const serviceReq = req.headers.microservice as string;
		const serviceReqObj = ArrayOfObjects.objectWithVal(
			microservices,
			serviceReq,
		) as IMicroservices;
		const los = serviceReqObj.los;
		if (!(los > 1)) return next();

		try {
			const authHeader = req.headers.authorization;
			if (!authHeader) {
				return res
					.status(resCodes.BAD_REQUEST.code)
					.send(
						`${resCodes.BAD_REQUEST.prefix}: Missing Auth Header In Request`,
					);
			}
			const token = authHeader.split(' ')[1];
			const decodedToken = await admin.auth().verifyIdToken(token);
			return decodedToken
				? next()
				: res
					.status(resCodes.UNAUTHORIZED.code)
					.send(
						`${resCodes.UNAUTHORIZED.prefix}: Unauthorized Token`,
					);
		} catch (err) {
			return res.status(500).send(err);
		}
	}
}

export default Middleware;
