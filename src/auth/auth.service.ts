import { Injectable, Logger } from '@nestjs/common';
import { SignUpInput } from './dto/inputs/signup.input';
import { AuthResponse } from './dto/types/auth-response.type';
import { UsersService } from './../users/users.service';
import { LoginInput } from './dto/inputs/login.input';

@Injectable()
export class AuthService {
    private readonly logger: Logger = new Logger('Auth Service');

    constructor(private readonly usersService: UsersService) {}

    async signUp(signupInput: SignUpInput): Promise<AuthResponse> {
        const user = await this.usersService.createUser(signupInput);

        const token = 'ABC123';

        return {
            token,
            user,
        };
    }

    async login(loginInput: LoginInput): Promise<AuthResponse> {
        try {
            const { email, password } = loginInput;

            const user = await this.usersService.findOneByEmail(email);

            const token = 'ABC123';
            return {
                token,
                user,
            };
        } catch (error) {
            this.logger.error(error);
        }
    }

    /* 

    async revalidateToken() {} */
}
