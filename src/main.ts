import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { Logger } from '@nestjs/common';
import { LoggingInterceptor } from './util/logger.interceptor';
import { TransformInterceptor } from './util/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.use(cookieParser());
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('ENTREE API DOCS')
    .setDescription(
      `
    ENTREE API SWAGGER 문서입니다. 
    Try out 기능을 활용해 실제 API를 사용할 수 있으며 token을 넣으면 인증/인가 기능도 활용 가능합니다. 
    실패 케이스에 대한 응답 예시는 추후 추가 예정입니다. 
    
    `
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'Token',
        name: 'JWT',
        in: 'header',
      },
      'token'
    )
    .addTag('ImMall')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor()
  );
  await app.listen(3070);

  Logger.log('listening 3070', 'Connection Successed');
}

bootstrap();
