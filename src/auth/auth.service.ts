import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { SignUpInput } from './dto/inputs/signup.input';
import { AuthResponse } from './dto/types/auth-response.type';
import { UsersService } from './../users/users.service';
import { LoginInput } from './dto/inputs/login.input';

@Injectable()
export class AuthService {
    private readonly logger: Logger = new Logger('Auth Service');

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    private getJwtToken(userId: string) {
        return this.jwtService.sign({ id: userId });
    }

    async signUp(signupInput: SignUpInput): Promise<AuthResponse> {
        const user = await this.usersService.createUser(signupInput);

        const token = this.getJwtToken(user.id);

        return {
            token,
            user,
        };
    }

    async login(loginInput: LoginInput): Promise<AuthResponse> {
        const { email, password } = loginInput;

        const user = await this.usersService.findOneByEmail(email);

        if (!bcrypt.compareSync(password, user.password)) {
            throw new BadRequestException('Credentials are not valid');
        }

        delete user.password;

        const token = this.getJwtToken(user.id);
        return {
            token,
            user,
        };
    }

    //async revalidateToken() {}
}
