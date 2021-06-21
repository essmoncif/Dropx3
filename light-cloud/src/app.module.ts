import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IpfsModule } from './ipfs/ipfs.module';
import { HlbModule } from './hlb/hlb.module';

@Module({
  imports: [IpfsModule, HlbModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
