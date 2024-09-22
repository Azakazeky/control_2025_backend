import { Module } from '@nestjs/common';
import { AppGateway } from './gateway';
import { GatewayMap } from './gateway.session';

@Module({
  imports: [],
  providers: [AppGateway, GatewayMap],
  exports: [AppGateway],
  controllers: [],
})
export class GatewayModule {}
