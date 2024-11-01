import { Injectable } from '@nestjs/common';
import { SignUpInput } from './dto/inputs/signup.imput';
import { AuthResponse } from './dto/types/auth-response.type';

@Injectable()
export class AuthService {
    constructor() {}

    async signUp(signupInput: SignUpInput): Promise<AuthResponse> {
        console.log({ signupInput });

        /* return {
            token: 'ABC123',
            user: {
                email: 'XXXXXXXXXXXXXXX',
                full_name: 'Pablo',
                password: 'ib4ib4h4',
            },
        }; */

        throw new Error('Method not implemented.');
    }

    async login() {}

    async revalidateToken() {}
}
