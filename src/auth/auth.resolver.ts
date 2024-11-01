import { AuthResponse } from './dto/types/auth-response.type';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Query } from '@nestjs/common';
import { SignUpInput } from './dto/inputs/signup.imput';

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @Mutation(() => AuthResponse, { name: 'signup' })
    async signUp(
        @Args('signupInput') signupInput: SignUpInput,
    ): Promise<AuthResponse> {
        return this.authService.signUp(signupInput);
    }

    /* @Mutation()
    async login(@Args('login') { name: 'login' }): Promise<any> {
        return this.authService.login();
    }

    @Query('',, { name: 'revalidate' })
    async revalidateToken(): Promise<any> {
        return this.authService.revalidateToken();
    } */
}
