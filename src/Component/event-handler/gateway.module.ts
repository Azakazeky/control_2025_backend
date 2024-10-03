import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/Common/Db/prisma.module';
import { AppGateway } from './gateway';
import { GatewayMap } from './gateway.session';

@Module({
  imports: [],
  providers: [AppGateway, GatewayMap, PrismaModule],
  exports: [AppGateway],
  controllers: [],
})
export class GatewayModule {}
