import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from './../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
    providers: [AuthResolver, AuthService, JwtStrategy],
    exports: [JwtStrategy, PassportModule, JwtModule],
    imports: [
        UsersModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        ConfigModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return {
                    secret: process.env.JWT_SECRET,
                    signOptions: {
                        expiresIn: '6h',
                    },
                };
            },
        }),
    ],
})
export class AuthModule {}
