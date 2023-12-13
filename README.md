# API Gateway Template:

## Express Microservice Terminology:

- A _route prefix_ is a microservice
- A _subroute_ is a service / cloud function within the microservice that can be accessed via an endpoint
- Example URL: `https://www.example.com/api/[routePrefix]/[subRoute]`
- Example Microservice / Route Prefix = _"Users"_:
  - Example Subroutes / Services / Cloud Functions = _"getUserData"_, _"updateUserData"_, _"deleteUserData"_, etc.

---

## Initial Setup: Folders & Files:

- **Pre-requisites:** Setup the front-end repo based on the [react-typescript-vite-template](https://github.com/SaoodCS/react-typescript-vite-template)\_

1. Run `npm run install` in the root directory
2. Open the project settings for the `dev` Firebase project and copy the `Project ID`
3. Open VSCode and search for `[dev-project-id]` and replace all instances of `[dev-project-id]` with the dev Firebase project ID (except in the README file)
4. Repeat steps 2 and 3 for the `[prod-project-id]` Firebase project, replacing all instances of `[prod-project-id]` with the prod Firebase project ID (except in the README file)
5. Go to _root/functions/src/utils/CollectionsRefs.ts_ -> update this class with the names of the collections you'll be using in Firestore
6. Go to _root/functions/src/utils/CorsPolicy.ts_ -> add the following to the array of allowed URLs:
   1. Add the `deployed dev web app url` _without a `/` AT THE END_ (should be in Google Bookmarks)
   2. Add the `deployed prod web app url` _without a `/` AT THE END_ (should be in Google Bookmarks)
7. Go to _root/firestore/LevelOfSecurity.ts_ -> update this array with the level of security rules you want to set for the dev and prod Firestore projects
8. Push any changes in the current branch -> then create a new branch from `prod` called `dev` -> then push the new branch to the remote repo

---

## Initial Setup: Environment Variables:

1. Generate an API Key (search online for an api key generator) -> copy the generated API Key
2. Go to _root/functions_ and create the following env files with the following key / values (The api-key value should be the same across all env files)
   - .env.deploydev -> `NODE_ENV=deploydev`, `API_KEY=[api-key]`
   - .env.deployprod -> `NODE_ENV=deployprod`, `API_KEY=[api-key]`
   - .env.localdev -> `NODE_ENV=localdev`, `API_KEY=[api-key]`
   - .env.localprod -> `NODE_ENV=localprod`, `API_KEY=[api-key]`
3. Go to _GitHub Project Settings -> Secrets_ for this repo and do the following:
   1. Add a new secret called `DEV_ENV_VARIABLES` and copy the contents of the _.env.deploydev_ file into the value field
   2. Add a new secret called `PROD_ENV_VARIABLES` and copy the contents of the _.env.deployprod_ file into the value field

---

## Initial Setup: Firebase SA Keys & GitHub Actions:

**_NOTE: Service Account Key should already be generated (in the `Firebase Service Account Key Setup:` section of the [react-typescript-vite-template](https://github.com/SaoodCS/react-typescript-vite-template#firebase-service-account-key-setup) project)._**

### Updating the Naming Conventions in the GitHub Actions Workflow File:

1. Go to _root/.gitub/workflows/ci-cd.yml_
2. Update the `name` field at the top of the file to `[App-Name] API Gateway CI/CD`
3. Update `api-gateway-ci-cd` below `jobs` to `[app-name]-api-gateway-ci-cd`

### For each Firebase Project (dev and prod), do the following:

1. Open the Firebase Console for the project and go to _Project Settings -> Service Accounts_
2. Click on the _"Manage service accounts permissions"_ link
3. Click on the GitHub Actions service account listed
4. Go to the _Keys_ tab and click _Add Key_ -> Create New Key -> JSON
5. Copy the JSON file to _root/functions/env_ in this project (create the env folder here if it doesn't already exist)
6. Go to _GitHub Project Settings -> Secrets_ for this repo
7. Add a new secret called `[PROD/DEV]_SA_KEY` and paste the contents of the JSON file into the value field (including the curly braces)

---

## Initial Setup: Integration:

**_Note: If deploy scripts fail first time, then may have to run the script again as they initialize the first time then run properly on the second_**

1. Push any changes in the current branch -> merge the `dev` and `prod` branches
2. Run `npm run deploy-dev` in terminal -> copy the "_Function URL_" outputted in the terminal -> then:
   1. Paste it in the browser URL bar and add `/gatewayRequestPost` to the end of it -> press enter
   2. Add the webpage to Google bookmarks as the following:
      1. Name: "_apiGateway/gatewayRequestPost_"
      2. Folder: _[App Name]/microservices/dev/deployed_
   3. Paste the URL in the browser URL bar again and add `/gatewayRequestGet` to the end of it -> press enter
   4. Add the webpage to Google bookmarks as the following:
      1. Name: "_apiGateway/gatewayRequestGet_"
      2. Folder: _[App Name]/microservices/dev/deployed_
3. Run `npm run deploy-prod` in terminal -> copy the "_Function URL_" outputted in the terminal -> then:
   1. Paste it in the browser URL bar and add `/gatewayRequestPost` to the end of it -> press enter
   2. Add the webpage to Google bookmarks as the following:
      1. Name: "_apiGateway/gatewayRequestPost_"
      2. Folder: _[App Name]/microservices/prod/deployed_
   3. Paste the URL in the browser URL bar again and add `/gatewayRequestGet` to the end of it -> press enter
   4. Add the webpage to Google bookmarks as the following:
      1. Name: "_apiGateway/gatewayRequestGet_"
      2. Folder: _[App Name]/microservices/prod/deployed_
4. Run `npm run serve-dev` in terminal -> copy the URL outputted in the terminal -> then:
   1. Paste it in the browser URL bar and add `/gatewayRequestPost` to the end of it -> press enter -> then:
   2. Add the webpage to Google bookmarks as the following:
      1. Name: "_apiGateway/gatewayRequestPost_"
      2. Folder: _[App Name]/microservices/dev/localhost_
   3. Paste the URL in the browser URL bar again and add `/gatewayRequestGet` to the end of it -> press enter -> then:
   4. Add the webpage to Google bookmarks as the following:
      1. Name: "_apiGateway/gatewayRequestGet_"
      2. Folder: _[App Name]/microservices/dev/localhost_
5. Run `npm run serve-prod` in terminal -> copy the URL outputted in the terminal -> then:

   1. Paste it in the browser URL bar and add `/gatewayRequestPost` to the end of it -> press enter -> then:
   2. Add the webpage to Google bookmarks as the following:
      1. Name: "_apiGateway/gatewayRequestPost_"
      2. Folder: _[App Name]/microservices/prod/localhost_
   3. Paste the URL in the browser URL bar again and add `/gatewayRequestGet` to the end of it -> press enter -> then:
   4. Add the webpage to Google bookmarks as the following:
      1. Name: "_apiGateway/gatewayRequestGet_"
      2. Folder: _[App Name]/microservices/prod/localhost_

6. Open the **_Front-End_** repository for this proj -> open each of the `.env...` files in the root directory and update the following (_Replace the square brackets with the correct URLs_):
   1. In _.env.devdeployed_: `VITE_ENDPOINT_GATEWAY_POST=[the URL of the Google bookmark named apiGateway/gatewayRequestPost in the folder [App Name]/microservices/dev/deployed]`
   2. In _.env.devdeployed_: `VITE_ENDPOINT_GATEWAY_GET=[the URL of the Google bookmark named apiGateway/gatewayRequestGet in the folder [App Name]/microservices/dev/deployed]`
   3. In _.env.proddeployed_: `VITE_ENDPOINT_GATEWAY_POST=[the URL of the Google bookmark named apiGateway/gatewayRequestPost in the folder [App Name]/microservices/prod/deployed]`
   4. In _.env.proddeployed_: `VITE_ENDPOINT_GATEWAY_GET=[the URL of the Google bookmark named apiGateway/gatewayRequestGet in the folder [App Name]/microservices/prod/deployed]`
   5. In _.env.devlocal_:`VITE_ENDPOINT_GATEWAY_POST=[the URL of the Google bookmark named apiGateway/gatewayRequestPost in the folder [App Name]/microservices/dev/localhost]`
   6. In _.env.devlocal_:`VITE_ENDPOINT_GATEWAY_GET=[the URL of the Google bookmark named apiGateway/gatewayRequestGet in the folder [App Name]/microservices/dev/localhost]`
   7. In _.env.prodlocal_:`VITE_ENDPOINT_GATEWAY_POST=[the URL of the Google bookmark named apiGateway/gatewayRequestPost in the folder [App Name]/microservices/prod/localhost]`
   8. In _.env.prodlocal_:`VITE_ENDPOINT_GATEWAY_GET=[the URL of the Google bookmark named apiGateway/gatewayRequestGet in the folder [App Name]/microservices/prod/localhost]`
7. Go to _GitHub Project Settings -> Secrets_ for the **_React PWA Front-End_** repository:
   1. Copy the contents of the `.env.devdeployed` file into the `ENV_DEVDEPLOYED` secret
   2. Copy the contents of the `.env.proddeployed` file into the `ENV_PRODDEPLOYED` secret
8. Run `lint-ts` in terminal and fix any errors
9. Merge the `dev` and `prod` branches again

---

### --- INITIAL SETUP DONE (Next Step = Microservice(s) Setup using Microservice Template) ---
