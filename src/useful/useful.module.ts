import { Module } from '@nestjs/common';
import { UsefulService } from './useful.service';

@Module({
  providers: [UsefulService],
})
export class UsefulModule {}
