import { Injectable } from '@nestjs/common';
import { SignUpInput } from './dto/inputs/signup.input';
import { AuthResponse } from './dto/types/auth-response.type';
import { UsersService } from './../users/users.service';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService) {}

    async signUp(signupInput: SignUpInput): Promise<AuthResponse> {
        console.log({ signupInput });

        const user = await this.usersService.createUser(signupInput);

        const token = 'ABC123';

        return {
            token,
            user,
        };
    }

    /* async login() {}

    async revalidateToken() {} */
}
