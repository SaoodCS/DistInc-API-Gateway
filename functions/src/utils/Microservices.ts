export interface IMicroservices {
	service: string;
	url: string;
	los: number;
}

const microservices: IMicroservices[] = [
	{ service: 'testServiceEndpoint', url: process.env.TEST_SERVICE_ENDPOINT!, los: 0 },
];

export default microservices;
