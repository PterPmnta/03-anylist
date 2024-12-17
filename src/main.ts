import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: false,
        }),
    );

    await app.listen(process.env.PORT || 3000);
    console.log(`Server running on port ${process.env.PORT || 3000}`);
}
bootstrap()
    .then(() => console.log('Server started successfully'))
    .catch((error) => {
        console.error('Error starting server:', error);
        process.exit(1);
    });
