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
   { service: 'getSavingsAccount', url: process.env.GET_SAVINGSACCOUNT_SERVICE_ENDPOINT!, los: 1 },
   {
      service: 'deleteSavingsAccount',
      url: process.env.DELETE_SAVINGSACCOUNT_SERVICE_ENDPOINT!,
      los: 1,
   },
   { service: 'setCurrentAccount', url: process.env.SET_CURRENTACCOUNT_SERVICE_ENDPOINT!, los: 1 },
   { service: 'getCurrentAccount', url: process.env.GET_CURRENTACCOUNT_SERVICE_ENDPOINT!, los: 1 },
   {
      service: 'deleteCurrentAccount',
      url: process.env.DELETE_CURRENTACCOUNT_SERVICE_ENDPOINT!,
      los: 1,
   },
   { service: 'setIncome', url: process.env.SET_INCOME_SERVICE_ENDPOINT!, los: 1 },
   { service: 'getIncomes', url: process.env.GET_INCOME_SERVICE_ENDPOINT!, los: 1 },
   { service: 'deleteIncome', url: process.env.DELETE_INCOME_SERVICE_ENDPOINT!, los: 1 },
   { service: 'setExpense', url: process.env.SET_EXPENSE_SERVICE_ENDPOINT!, los: 1 },
   { service: 'getExpenses', url: process.env.GET_EXPENSE_SERVICE_ENDPOINT!, los: 1 },
   { service: 'deleteExpense', url: process.env.DELETE_EXPENSE_SERVICE_ENDPOINT!, los: 1 },
   { service: 'setCalculations', url: process.env.SET_CALCULATIONS_SERVICE_ENDPOINT!, los: 1 },
   { service: 'getCalculations', url: process.env.GET_CALCULATIONS_SERVICE_ENDPOINT!, los: 1 },
   {
      service: 'deleteCalculations',
      url: process.env.DELETE_CALCULATIONS_SERVICE_ENDPOINT!,
      los: 1,
   },
   {
      service: 'setFcmToken', url: process.env.SET_FCM_TOKEN_SERVICE_ENDPOINT!, los: 1,
   }
];

export default microservices;
