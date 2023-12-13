import type * as express from 'express';
import fetch, { Headers } from 'node-fetch';
import ArrayOfObjects from '../helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import type { IMicroservices } from '../utils/Microservices';
import microservices from '../utils/Microservices';
import { resCodes } from './../utils/resCode';

export default async function gatewayRequestGet(
   req: express.Request,
   res: express.Response,
): Promise<express.Response> {
   //Check which microservice to send the request to:

   const serviceReq = req.headers.microservice as string;
   const serviceReqObj = ArrayOfObjects.objectWithVal(microservices, serviceReq) as IMicroservices;
   if (!serviceReqObj) {
      return res
         .status(resCodes.BAD_REQUEST.code)
         .send(
            `${resCodes.INTERNAL_SERVER.code}: Microservice requested does not match the microservices in the gateway. Either the microservice requested is not added correctly in the gateway or the client has not sent the microservice correctly`,
         );
   }
   const serviceUrl = serviceReqObj.url;
   if (!serviceUrl) {
      return res
         .status(resCodes.INTERNAL_SERVER.code)
         .send(
            `${resCodes.INTERNAL_SERVER.prefix}: Requested Microservice does not have a valid URL in the gateway. This likely is due to the env variable not added correctly to the microservice array in the gateway`,
         );
   }

   // Grab the APIKey from the env variables and add it to the header of the request:
   const apiKey = process.env.API_KEY as string;
   const header = new Headers();
   header.append('Api-Key', apiKey);
   header.append('Content-Type', 'application/json');

   // Send the auth header to the microservice in order to access the user's uid and thus their data in firestore:
   const authHeader = req.headers.authorization;
   if (serviceReqObj.los > 0) {
      if (!authHeader) {
         return res
            .status(resCodes.BAD_REQUEST.code)
            .send({ error: `${resCodes.BAD_REQUEST.prefix}: Missing Authorization Header` });
      }
      header.append('Authorization', authHeader);
   }

   // Send the request to the microservice:
   try {
      const response = await fetch(serviceUrl, {
         method: 'GET',
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

// -- Prior way of setting up const serviceReq -- //: //: (NO LONGER NEEDED AS WORKS CORRECTLY LOCALLY WITHOUT IT)
// const serviceForLocalTesting = 'deleteSavingsAccount';
// const serviceReq = isRunningLocally()
//    ? serviceForLocalTesting
//    : (req.headers.microservice as string);
