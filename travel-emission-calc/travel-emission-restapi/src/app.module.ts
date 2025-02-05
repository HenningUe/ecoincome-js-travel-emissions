import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TravelEmissionController } from './travel-emission/travel-emission.controller';
import { AppService } from './app.service';
import { TravelEmissionService } from './travel-emission/travel-emission.service';

@Module({
  imports: [],
  controllers: [AppController, TravelEmissionController],
  providers: [AppService, TravelEmissionService],
})
export class AppModule {}
