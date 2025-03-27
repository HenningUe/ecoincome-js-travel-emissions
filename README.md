# Table of Content
[1. Introduction](#Introduction)<br>
[1.1. General](#General)<br>
[1.2. Used Technologies](#UsedTechnologies)<br>
[1.3. NestJS Basics](#NestJSBasics)<br>
<br>
[2. Usage](#Usage)<br>
[2.1. Usage via direct invocation of node.js](#UsageViaDirectInvocationOfNode)<br>
[2.2. Usage via Docker](#UsageViaDocker)<br>
<br>
[3. More Technical Details](#MoreTechnicalDetails)<br>
[3.1. REST API design considerations](#RESTAPIDesign)<br>
[3.2. Database](#Database)<br>
[3.3. API-data-validation and tranformation](#APIDataValidation)<br>
[3.4. Error Handling/ Logging](#ErrorHandling)<br>
[3.5. CI/CD workflow](#CICDWorkflow)<br>
<br>

<a name="Introduction"></a>
# 1. Introduction

<a name="General"></a>
## 1.1. General

This is an example implementation of a REST API interface for recording and evaluating CO2 emissions caused by business travel.

This app **serves as a demonstrator**, so many features are still missing compared to a production environment.  

A live demonstration if the API is hosted are:<br>http://209.38.187.116:3000/api/docs 

Beyond the pure implementation a simple CI/CD-workflow is created. For more details see section.

The main entry point of this App is "./travel-emission-api/src/main.ts".

<a name="UsedTechnologies"></a>
## 1.2. Used Technologies
The This app is built on the API framework **NestJS**, which, in turn, is based on **node.js**.

**NestJS** was chosen for several reasons:
- It is a mature, feature-rich framework with well-maintained documentation.
-  **NestJS** guides you through the process of creating new projects, modules, and libraries. The basic structure - i.e., folders and files - are provided, making it much easier for colleagues to get started.
- Extensive testing features are included out of the box. Templates for unit tests, module tests, and end-to-end tests are created right away.
- A wide range of plug-ins are available, such as those that facilitate the inclusion of OpenAPI documentation.
- Built-in ORM tooling.
- Strong community support.  

Other technologies/tools used:
- typescript (node.js programming language)
- typeorm (integrated in NestJs)
- postgres
- docker
- sentry
- github
- github-actions
- github-codespace

<a name="NestJSBasics"></a>
## 1.3. NestJS Basics

- In general, check out [NestJS documentation](https://docs.nestjs.com/) to gain a better insight.
-  **NestJS** provides a clean structure for "where to put what":
    - URI endpoints are defined in files ending with `.controller.ts`.
    - Business logic is placed in files ending with `.service.ts`.
- tests are placed in files ending with `.spec.ts`, and end-to-end tests are in files ending with `.e2e-spec.ts`.
- Code packages to be shared among different services, or code that needs to be separated from services to provide a cleaner abstraction level (which, in turn, facilitates testing), are placed under the "libs" folder.
- Note: The best practice in **NestJS** is to use the provided set of commands to create new services, controllers, etc.
-  **NestJS** provides a set of preconfigured commands. Check out the "scripts" section of `package.json`. Examples:
    - To execute all tests, run `npm run test`
    - To evaluate the test-coverage run `npm run test:cov`
-  **NestJS** includes TypeORM as the ORM tool. TypeORM handles creating and updating database schemas. It offers a convenient way to interact with relational databases using an OOP-style approach, as well as direct SQL queries when needed.

<a name="Usage"></a>
# 2. Usage
There are to ways, how the App can be executed.
- directly, via calling **node.js**
- inside a docker container

<a name="UsageViaDirectInvocationOfNode"></a>
## 2.1. Usage via direct invocation of **node.js**

How to use the App locally (playground):
- ensure that **node.js** is installed locally
- clone the repository locally
- navigate to folder `/ecoincome-js-travel-emissions/travel-emission-api`
- execute `npm install`
- (Optional) Retrieve your google-maps-api-key, see https://developers.google.com/maps/third-party-platforms/wordpress/generate-api-key<br>
- (Optional) Retrieve your sentry-dns. Go to https://www.sentry.io, create project and follow the instructions<br>

**Notes:** 
- The API-key for google-maps is not essential. Only the function addTravelRecordByOriginAndDestination won't be usable.
- The Sentry-DNS os not essential. Only the unhandled exception tracking won't work.

- create a ".env" file with these variables:
	> `GOOGLE_MAPS_API_KEY=<your google maps api key, if you have one>`<br>
	> `SENTRY_DNS=<your sentry dns provided for your project, if you have one>`<br>
	> `POSTGRES_HOST=127.0.0.1`<br>
	> `POSTGRES_PORT=5432`<br>
	> `POSTGRES_USER=postgres`<br>
	> `POSTGRES_PASSWORD=mysecretpassword`<br>
	> `POSTGRES_DATABASE=emissions_db`<br>
	> `PORT=3000`<br>
	> `MODE=DEV`<br>
	> `RUN_MIGRATIONS=true`<br>
- start local postgres-server by calling `npm run start:dev:db`
- start nestjs-app by calling `npm run start`
- Note: The rest-API uses port 3000. Requests can be sent via a corresponding client (e.g. browser).
- localhost URI for OpenAPI (swagger) docs is: https://127.0.0.1:3000/api/docs

<a name="UsageViaDocker"></a>
## 2.2. Usage via Docker
The app can be easily started by spinning up the Docker containers:
- ensure that Docker is installed locally
- navigate to folder `/ecoincome-js-travel-emissions/travel-emission-api/scripts`
- execute script `start-all.sh`
  

<a name="MoreTechnicalDetails"></a>
# 3. More Technical Details

<a name="RESTAPIDesign"></a>
# 3.1. REST API design considerations

- REST API design patterns are applied, as described in this guide https://duttavishek.medium.com/ultimate-guide-to-rest-api-design-best-practices-and-patterns-3414933302f4
- Since this API primarily focuses on CO2 emissions while remaining open for extensions, the first and only level of the URI is named "emissions". This results in the following address: `"\<address\>/api/v1/emissions/.."`.
- The same approach is applied to the next URI level. Currently, emissions tracking is limited to emissions caused by travel: `"\<address\>/api/v1/emissions/travel-records/.."`
 Accordingly, adding records and retrieving emissions is done as follows:
    - Adding travel records: Use the POST method on  `"\<address\>/api/v1/emissions/travel-records"`
    - Retrieving CO2 emissions: Use the GET method on `"\<address\>/api/v1/emissions"`
- For both methods, an API Swagger documentation is provided. This documentation contains all the necessary details for properly using the methods.

<a name="Database"></a>
# 3.2. Database

The database currently supported is postgres.
The used database scheme is simple. Two tables are used: one for created companies and another for created travel-records. One company is related to many travel-records.

<a name="APIDataValidation"></a>
# 3.3. API-data-validation and tranformation

**NestJS** encourages the usage of DTO (data transfer objects) for API-parameters.

Benfits of using DTOs:
- validation of input/output data (e.g., using class-validator in NestJS)
- automatic transformation of input/output data
- testing becomes cleaner and easier to maintain. Mock data can be easily created

<a name="ErrorHandling"></a>
# 3.4. Error Handling/ Logging

In order to be able to react to errors as quickly as possible, a global error interception mechanism has been implemented (filters in NestJs). Error information (including stack trace) is sent to Sentry. Alerts to developers can be activated they way that they receive email notifications on any error.

Currently for logging the built-in NestJs logging feature is used.
This could be easily exchanged by are more sofisticated logger, such as winston, to enable automatic rotating log files or sending logs to remote handlers.

<a name="CICDWorkflow"></a>
# 3.5. CI/CD workflow

A simple CI/CD workflow has been created with Github-actions.

The currently implemented workflow is triggered upon the creation of a new release tag (like v1.x.x). The workflow starts with the execution of the whole test-suite. After successful completion of all tests a docker container is created and pushed to docker-hub registry (see https://hub.docker.com/repository/docker/guonga/ecoincome-travel-emission-api/general).

On the server-side watchtower constantly monitors the docker-hub-registry and pulls and deploys the latest docker file, if there is any new.