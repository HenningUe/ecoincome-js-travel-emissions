import { Controller, Get, Param } from '@nestjs/common';

@Controller('travel-emission')
export class TravelEmissionController {
    @Get(':id')
    findOne(@Param('id') id: string): string {
        return `Returns #${id}`;
    }
}
