import type * as express from 'express';
import fetch, { Headers } from 'node-fetch';
import ArrayOfObjects from '../helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import { isRunningLocally } from '../helpers/helpers';
import type { IMicroservices } from '../utils/Microservices';
import microservices from '../utils/Microservices';
import { resCodes } from '../utils/resCode';

export default async function gatewayRequestPost(
	req: express.Request,
	res: express.Response,
): Promise<express.Response | void> {
	//Check if the body is undefined:
	if (req.body === undefined) {
		return res
			.status(resCodes.BAD_REQUEST.code)
			.send(`${resCodes.BAD_REQUEST.prefix}: Missing Body in Request`);
	}

	//Check which microservice to send the request to:
	const serviceForLocalTesting = 'testServiceEndpoint';
	const serviceReq = isRunningLocally()
		? serviceForLocalTesting
		: (req.headers.microservice as string);
	const serviceReqObj = ArrayOfObjects.objectWithVal(
		microservices,
		serviceReq,
	) as IMicroservices;
	const serviceUrl = serviceReqObj.url;

	// Grab the APIKey from the env variables and add it to the header of the request:
	const apiKey = process.env.API_KEY as string;
	const header = new Headers();
	header.append('Api-Key', apiKey);
	header.append('Content-Type', 'application/json');

	// Send the request to the microservice:
	try {
		const response = await fetch(serviceUrl, {
			method: 'POST',
			body: JSON.stringify(req.body),
			headers: header,
		});
		if (!response.ok) {
			const errorMessage = await response.text();
			return res.status(response.status).send(errorMessage);
		}
		const jsonResponse = await response.text();
		const parsedJsonResponse = JSON.parse(jsonResponse);
		return res.status(resCodes.OK.code).send(parsedJsonResponse);
	} catch (error) {
		return res.send(error);
	}
}
