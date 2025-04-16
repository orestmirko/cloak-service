import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from '@config';
import { RequestLog, RequestLogSchema } from './schemas/request-log.schema';
import { RequestLogRepository } from './repositories/request-log.repository';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb://${config.DATABASE.HOST}:${config.DATABASE.PORT}/${config.DATABASE.NAME}`,
    ),
    MongooseModule.forFeature([
      { name: RequestLog.name, schema: RequestLogSchema },
    ]),
  ],
  providers: [RequestLogRepository],
  exports: [RequestLogRepository],
})
export class DatabaseModule {}
