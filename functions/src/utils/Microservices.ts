export interface IMicroservices {
   service: string;
   url: string;
   los: number;
}

const microservices: IMicroservices[] = [
   { service: 'testServiceEndpoint', url: process.env.TEST_SERVICE_ENDPOINT!, los: 0 },
   { service: 'registerUser', url: process.env.REGISTER_USER_SERVICE_ENDPOINT!, los: 0 },
   { service: 'deleteUser', url: process.env.DELETE_USER_SERVICE_ENDPOINT!, los: 1 },
   { service: 'resetUser', url: process.env.RESET_USER_SERVICE_ENDPOINT!, los: 1 },
   { service: 'setSavingsAccount', url: process.env.SET_SAVINGSACCOUNT_SERVICE_ENDPOINT!, los: 1 },
];

export default microservices;
