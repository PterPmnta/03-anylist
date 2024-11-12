import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { AuthResponse } from './dto/types/auth-response.type';
import { AuthService } from './auth.service';
import { SignUpInput } from './dto/inputs/signup.input';
import { LoginInput } from './dto/inputs/login.input';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './../users/entities/user.entity';

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @Mutation(() => AuthResponse, { name: 'signup' })
    async signUp(
        @Args('signupInput') signupInput: SignUpInput,
    ): Promise<AuthResponse> {
        return this.authService.signUp(signupInput);
    }

    @Mutation(() => AuthResponse, { name: 'login' })
    async login(
        @Args('loginInput') loginInput: LoginInput,
    ): Promise<AuthResponse> {
        return this.authService.login(loginInput);
    }

    @Query(() => AuthResponse, { name: 'revalidateToken' })
    @UseGuards(JwtAuthGuard)
    revalidateToken(@CurrentUser() user: User): AuthResponse {
        throw new Error('Method not implemented.');
        //return this.authService.revalidateToken();
    }
}
