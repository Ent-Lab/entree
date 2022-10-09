import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { DatabaseModule } from 'src/database/database.module';
import { UsefulModule } from 'src/useful/useful.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { MasterDatabaseService } from 'src/database/master.database.service';
import { UsefulService } from 'src/useful/useful.service';
import { PostRepository } from './post.repository';
import { PassportModule } from '@nestjs/passport';
import { UserRepository } from 'src/user/user.repository';
import { DatabaseService } from 'src/database/database.service';

@Module({
  imports: [
    DatabaseModule,
    UsefulModule,
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    BullModule.forRoot({
      redis: {
        host: '54.180.96.37',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'message-queue',
    }),
  ],
  controllers: [PostController],
  providers: [
    PostService,
    MasterDatabaseService,
    DatabaseService,
    UsefulService,
    PostRepository,
    UserRepository,
  ],
})
export class PostModule {}
