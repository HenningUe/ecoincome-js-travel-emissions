import { TravelEmissionService } from './travel-emission.service';
import { getCO2EmissionDto } from './travel-emission.dto';
export declare class TravelEmissionController {
    private travelEmissionService;
    constructor(travelEmissionService: TravelEmissionService);
    getCO2EmissionKgTotalPerPerson(paramDto: getCO2EmissionDto): Promise<number>;
}
//# sourceMappingURL=travel-emission.controller.d.ts.map