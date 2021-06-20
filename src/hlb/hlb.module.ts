import { Module } from '@nestjs/common';
import { HlbService } from './hlb.service';

@Module({
  providers: [HlbService]
})
export class HlbModule {}
