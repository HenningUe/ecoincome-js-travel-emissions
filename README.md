# ecoincome-js-travel-emissions
Example implementation of a REST API interface for recording and evaluating CO2 emissions caused by (business) travels.

Used technology:
- typescript
- nestjs
- typeorm
- postgres
- github-codespace
 
The example is executable in the codespace of this repo.

How to use?
- ask someone to provide you with a properly configured .env-file
- navigate to folder `/workspaces/ecoincome-js-travel-emissions/travel-emission-api`
- start db-server by calling `npm run start:dev:db`
- start nestjs-app by calling `npm run start`
- The server runs locally on port 3000. Requests can be sent via a corresponding client (e.g. browser).
- Once server is running, read and try API-docs on "http://<address>/api"


REST API considerations
- REST-API design patterns applied, e.g. described in https://duttavishek.medium.com/ultimate-guide-to-rest-api-design-best-practices-and-patterns-3414933302f4
- As this API shall focus be focused on CO2-emissions in the first place and be open for extensions at the same time the first and only level of the URI is called "emissions", thus the resulting address is "<address>/api/v1/emissions/.."
- Same idea for the next URI level. Emissions tracking is currently limited to emissions caused by travels. "<address>/api/v1/emissions/travel-records/.." 
- Accordingly adding records and retrieving emissions is done by:
    - travel-records are added by applying the POST-method to "<address>/api/v1/emissions/travel-records"
    - CO2-emissions are retrieved by applying the GET-method to "<address>/api/v1/emissions"
    - For both methods an API-swagger documentation is provided. This documentation provides you with all detailed needed to properly apply the methods

Functions implemented:
- `getCO2EmissionKgTotalPerPerson`
Calculates CO2 emissions for trips from the starting point to the destination. The distance is determined automatically. Depending on the method of transportation, different CO2/km emissions are assumed

- `addTravelRecord`
Add travel record. An entry includes company name, starting point, destination, means of transportation and travel date

- `getCO2EmissionKgPerDateRange`
Calculates CO2 emissions for trips from the origin to the destination for a given date range, company and transportation mode. The distance is determined automatically. Depending on the means of transportation, different CO2/km emissions are assumed.