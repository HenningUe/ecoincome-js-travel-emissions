# ecoincome-js-travel-emissions
Example implementation of a REST API interface for recording and evaluating CO2 emissions caused by (business) travel.

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

Functions implemented:
- `getCO2EmissionKgTotalPerPerson`
Calculates CO2 emissions for trips from the starting point to the destination. The distance is determined automatically. Depending on the method of transportation, different CO2/km emissions are assumed

- `addTravelRecord`
Add travel record. An entry includes company name, starting point, destination, means of transportation and travel date

- `getCO2EmissionKgPerDateRange`
Calculates CO2 emissions for trips from the origin to the destination for a given date range, company and transportation mode. The distance is determined automatically. Depending on the means of transportation, different CO2/km emissions are assumed.