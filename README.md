# Microservices Template:

## Express Microservice Terminology:\_

- A _route prefix_ is a microservice
- A _subroute_ is a service / cloud function within the microservice that can be accessed via an endpoint
- Example URL: `https://www.example.com/api/[routePrefix]/[subRoute]`
- Example Microservice / Route Prefix = _"Users"_:
  - Example Subroutes / Services / Cloud Functions = _"getUserData"_, _"updateUserData"_, _"deleteUserData"_, etc.

---

## Initial Setup:

_**Pre-requisites:** Setup the front-end repo based on the [react-typescript-vite-template](https://github.com/SaoodCS/react-typescript-vite-template)_

1. Run `npm run install` in the root directory
2. Open the project settings for the `dev` Firebase project and copy the `Project ID`
3. Open VSCode and search for `dev` and replace all instances of `[dev-project-id]` with the dev Firebase project ID
4. Repeat steps 2 and 3 for the `prod` Firebase project, replacing all instances of `[prod-project-id]` with the prod Firebase project ID
5. Go to _root/functions/src/utils/CollectionsRefs.ts_ -> update this class with the names of the collections you'll be using in Firestore
6. Go to _root/functions/src/utils/CorsPolicy.ts_ -> update this array with the URLs of the deployed dev and prod web apps
7. Go to _root/firestore/LevelOfSecurity.ts_ -> update this array with the level of security rules you want to set for the dev and prod Firestore projects
8. Go to _root/functions/src/utils/Microservices.ts_ -> update this array with information about each subroute (cloud function) that'll be created
9. Push any changes in the current branch -> then create a new branch from `prod` called `dev` -> then push the new branch to the remote repo

---

## Environment Variables Setup Initial Setup:

1. Go to _root/functions_ and create the following env files with the following key / values (The api-key value should be the same across all env files)
   - .env.deploydev -> `NODE_ENV=deploydev`, `API_KEY=[api-key]`
   - .env.deployprod -> `NODE_ENV=deployprod`, `API_KEY=[api-key]`
   - .env.localdev -> `NODE_ENV=localdev`, `API_KEY=[api-key]`
   - .env.localprod -> `NODE_ENV=localprod`, `API_KEY=[api-key]`
2. Go to _GitHub Project Settings -> Secrets_ for this repo and do the following:
   1. Add a new secret called `DEV_ENV_VARIABLES` and copy the contents of the _.env.deploydev_ file into the value field
   2. Add a new secret called `PROD_ENV_VARIABLES` and copy the contents of the _.env.deployprod_ file into the value field

---

## Firebase Service Account Keys With GitHub Actions Setup

### If Firebase Service Account Keys have already been generated for the front-end React TypeScript Vite Project:

#### For each Firebase Project (dev and prod), do the following:

1. Open the Firebase Console for the project and go to _Project Settings -> Service Accounts_
2. Click on the _"Manage service accounts permissions"_ link
3. Click on the GitHub Actions service account listed
4. Go to the _Keys_ tab and click _Add Key_ -> Create New Key -> JSON
5. Copy the JSON file to _root/functions/env_ in this project (create the env folder here if it doesn't already exist)
6. Go to _GitHub Project Settings -> Secrets_ for this repo
7. Add a new secret called `[PROD/DEV]_SA_KEY` and paste the contents of the JSON file into the value field

### If Firebase Service Account Keys have NOT already been generated for the front-end React TypeScript Vite Project:

1.  Copy the `.firebaserc` and `firebase.json` files in this project to somewhere locally on your machine
2.  Follow the instructions listead under the `Firebase Service Account Key Setup:` section of the `README.md` in the `react-typescript-vite-template` project
    - This will generate Firebase Service Account Keys for both the dev and prod projects that will work with the Hosting and Functions services and it will be saved in GitHub Secrets
3.  Paste and replace the `.firebaserc` and `firebase.json` files in this project with the ones you copied in step 1

---

## Updating the API Gateway With a New Service / SubRoute:

1. Add the following to each of the `.env...` files in this repo:
   - `.env.deploydev` -> `[NAME_OF_SUBROUTE]_SERVICE_ENDPOINT=[URL_OF_ENDPOINT_DEPLOYED_TO_DEV_FIREBASE_PROJECT]`
   - `.env.deployprod` -> `[NAME_OF_SUBROUTE]_SERVICE_ENDPOINT=[URL_OF_ENDPOINT_DEPLOYED_TO_PROD_FIREBASE_PROJECT]`
   - `.env.localdev` -> `[NAME_OF_SUBROUTE]_SERVICE_ENDPOINT=[URL_OF_ENDPOINT_SERVED_LOCALLY_TO_DEV_FIREBASE_PROJECT]`
   - `.env.localprod` -> `[NAME_OF_SUBROUTE]_SERVICE_ENDPOINT=[URL_OF_ENDPOINT_SERVED_LOCALLY_TO_PROD_FIREBASE_PROJECT]`
2. Go to _GitHub Project Settings -> Secrets_ for this repo
3. Update the `DEV_ENV_VARIABLES` secret with the contents from the `.env.deploydev` file
4. Update the `PROD_ENV_VARIABLES` secret with the contents from the `.env.deployprod` file
5. Go to _root/funtions/src/utils/Microservices.ts_ and add a new object to the `microservices` array with the following properties:
   - `service`: `[NAME_OF_SUBROUTE]`
   - `url`: `process.env.[NAME_OF_SUBROUTE]_SERVICE_ENDPOINT`
   - `los`: `[leve-of-security-number]` (info about the different levels of security can be found in _root/functions/src/utils/LevelOfSecurity.ts_)
6. Go to _root/functions/src/endpoints/endpoints/ts_ and update the variable `serviceForLocalTesting` with the name of the new subroute (the same name as Microservice.ts)
7. Merge the dev branch and the prod branch

---

## Scripts Help:

| Script Name                      | Script Description                                                                                        |
| -------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `npm run install`                | Installs all dependencies in the functions directory                                                      |
| `npm run install [package-name]` | Installs the specified package in the functions directory                                                 |
| `npm run serve-dev-to-local`     | Serves the api gateway locally to the locally served microservice for the dev Firebase project            |
| `npm run serve-prod-to-local`    | Serves the api gateway locally to the locally served microservice for the prod Firebase project           |
| `npm run serve-dev-to-deployed`  | Serves the api gateway locally to the deployed version of the microservices for the dev Firebase project  |
| `npm run serve-prod-to-deployed` | Serves the api gateway locally to the deployed version of the microservices for the prod Firebase project |
| `npm run deploy-dev`             | Deploys the api gateway to the dev Firebase project                                                       |
| `npm run deploy-prod`            | Deploys the api gateway to the prod Firebase project                                                      |
| `npm run test`                   | Runs all tests in the functions directory                                                                 |
| `npm run test-watch`             | Runs all tests in the functions directory with hot reloading enabled                                      |
| `npm run lint`                   | Runs the linter on all files in the functions directory                                                   |
| `npm run lint-fix`               | Runs the linter on all files in the functions directory and fixes issues                                  |
| `npm run prettify`               | Runs prettier on all files in the functions directory                                                     |
