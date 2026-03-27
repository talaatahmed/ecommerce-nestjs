import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { logger } from './common';
import { UnifiedResponseInterceptor } from './common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // app.useGlobalInterceptors(new UnifiedResponseInterceptor());
  app.useGlobalInterceptors({
    intercept(context, next) {
      const ctxType = context.getType();
      if (ctxType === 'http') {
        return new UnifiedResponseInterceptor().intercept(context, next);
      } else {
        return next.handle();
      }
    },
  });

  app.use(logger);

  const port = process.env.PORT ?? 3000;
  await app.listen(port, () => {
    console.log(`Application is running on port ${port}`);
  });
}
bootstrap();
