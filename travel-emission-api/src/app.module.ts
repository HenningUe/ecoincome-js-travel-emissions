import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { DataSource } from 'typeorm';
import { EmissionsModule } from './modules/emissions/emissions.module';


@Module({
  imports: [
    EmissionsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
