import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from './../users/users.module';

@Module({
    providers: [AuthResolver, AuthService],
    imports: [
        UsersModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        ConfigModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                console.log(configService.get('JWT_SECRET'));
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
