import { Module } from '@nestjs/common';
import { DatabaseModule } from './core/database/database.module';
import { RedisModule } from './core/cache/redis.module';
import { CloakModule } from '@modules';

@Module({
  imports: [
    DatabaseModule,
    RedisModule,
    CloakModule,
  ],
})
export class AppModule {}
