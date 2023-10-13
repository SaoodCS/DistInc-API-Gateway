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
   const serviceForLocalTesting = 'registerUser';
   const serviceReq = isRunningLocally()
      ? serviceForLocalTesting
      : (req.headers.microservice as string);
   const serviceReqObj = ArrayOfObjects.objectWithVal(microservices, serviceReq) as IMicroservices;
   const serviceUrl = serviceReqObj.url;

   // Grab the APIKey from the env variables and add it to the header of the request:
   const apiKey = process.env.API_KEY as string;
   const header = new Headers();
   header.append('api-key', apiKey);
   header.append('Content-Type', 'application/json');

   // Send the auth header to the microservice in order to access the user's uid and thus their data in firestore:
   const authHeader = req.headers.authorization;
   if (serviceReqObj.los > 0) {
      if (!authHeader) {
         return res
            .status(resCodes.BAD_REQUEST.code)
            .send({error: `${resCodes.BAD_REQUEST.prefix}: Missing Authorization Header`});
      }
      header.append('Authorization', authHeader);
   }

   // Send the request to the microservice:
   try {
      const response = await fetch(serviceUrl, {
         method: 'POST',
         body: JSON.stringify(req.body),
         headers: header,
      });
      const data = await response.json();
      if (!response.ok) {
         return res.status(response.status).send(data);
      }
      return res.status(resCodes.OK.code).send(data);
   } catch (error: unknown) {
      return res.status(resCodes.INTERNAL_SERVER.code).send(error);
   }
}
