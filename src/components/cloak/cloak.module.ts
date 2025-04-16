import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestLog, RequestLogSchema } from '@schemas';
import { HttpModule } from '@nestjs/axios';
import { CloakController } from '@controllers';
import { CloakService } from '@providers';
import { 
  FrequencyFilterService, 
  IpFilterService, 
  ReferrerFilterService, 
  UserAgentFilterService 
} from './filters';
import { DatabaseModule } from 'src/core/database/database.module';

@Module({
  imports: [
    HttpModule,
    DatabaseModule,
    MongooseModule.forFeature([
      { name: RequestLog.name, schema: RequestLogSchema },
    ]),
  ],
  controllers: [CloakController],
  providers: [
    CloakService,
    IpFilterService,
    UserAgentFilterService,
    ReferrerFilterService,
    FrequencyFilterService,
  ],
})
export class CloakModule {} 