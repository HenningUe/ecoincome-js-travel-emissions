# ecoincome-js-travel-emissions
Example implementation of a REST API interface for recording and evaluating CO2 emissions caused by (business) travel.

Used technology:
- typescript
- nestjs
- typeorm
- postgres
- github-codespace

The example is executable in the codespace of this repo.

The server runs locally on port 3000. Requests can be sent via a corresponding client (e.g. browser).

Functions implemented:
- getCO2EmissionKgTotalPerPerson
  Calculates CO2 emissions for trips from the starting point to the destination. The distance is determined automatically. Depending on the method of transportation, different CO2/km emissions are assumed
- addTravelRecord
  Add travel record. An entry includes company name, starting point, destination, means of transportation and travel date
- getCO2EmissionKgPerDateRange
  Calculates CO2 emissions for trips from the origin to the destination for a given date range, company and transportation mode.
  The distance is determined automatically. Depending on the means of transportation, different CO2/km emissions are assumed. 
