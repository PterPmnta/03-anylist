import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver /* ApolloDriverConfig */ } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

import { join } from 'path';
import { Request } from 'express';

import { ItemsModule } from './items/items.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SeedModule } from './seed/seed.module';
import { CommonModule } from './common/common.module';
import { ListsModule } from './lists/lists.module';

@Module({
    imports: [
        ConfigModule.forRoot(),

        GraphQLModule.forRootAsync({
            driver: ApolloDriver,
            imports: [AuthModule],
            inject: [JwtService],
            useFactory: (jwtService: JwtService) => ({
                playground: false,
                autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
                plugins: [ApolloServerPluginLandingPageLocalDefault()],
                includeStacktraceInErrorResponses: false,
                context({ req }: { req: Request }) {
                    const token = req.headers.authorization?.replace(
                        'Bearer ',
                        '',
                    );
                    if (!token) throw new Error('Token needed');

                    const payload = jwtService.decode(token);
                    if (!payload) throw new Error('Invalid token');
                },
            }),
        }),

        // Configuracion basica
        /* GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            playground: false,
            autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
            plugins: [ApolloServerPluginLandingPageLocalDefault()],
            includeStacktraceInErrorResponses: false,
        }), */

        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            synchronize: true,
            autoLoadEntities: true,
        }),

        ItemsModule,
        UsersModule,
        AuthModule,
        SeedModule,
        CommonModule,
        ListsModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
