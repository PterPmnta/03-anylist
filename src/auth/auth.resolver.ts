import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Query } from '@nestjs/common';

import { AuthResponse } from './dto/types/auth-response.type';
import { AuthService } from './auth.service';
import { SignUpInput } from './dto/inputs/signup.input';
import { LoginInput } from './dto/inputs/login.input';

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

    /*

    @Query('',, { name: 'revalidate' })
    async revalidateToken(): Promise<any> {
        return this.authService.revalidateToken();
    } */
}
