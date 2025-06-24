import { Controller, Get } from '@nestjs/common';
import { LocationsService } from './locations.service';


@Controller('locations')
export class LocationsController {
    constructor(private readonly locationsService: LocationsService) {}

    @Get()
    async getActive() {
        return this.locationsService.findAllActive();
    }
}
