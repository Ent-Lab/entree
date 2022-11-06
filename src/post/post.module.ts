import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { DatabaseModule } from 'src/database/database.module';
import { UsefulModule } from 'src/useful/useful.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { UsefulService } from 'src/useful/useful.service';
import { PostRepository } from './post.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { UserRepository } from 'src/user/user.repository';
import { DatabaseService } from 'src/database/database.service';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    DatabaseModule,
    UsefulModule,
    UserModule,
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    BullModule.registerQueue({
      name: 'message-queue',
    }),
  ],
  controllers: [PostController],
  providers: [
    PostService,
    DatabaseService,
    UsefulService,
    PostRepository,
    UserRepository,
  ],
})
export class PostModule {}
