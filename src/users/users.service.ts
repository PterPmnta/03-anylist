import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { SignUpInput } from '../auth/dto/inputs/signup.input';

@Injectable()
export class UsersService {
    private readonly logger: Logger = new Logger('UsersService');

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async createUser(signUpInput: SignUpInput): Promise<User> {
        try {
            const newUser = this.userRepository.create({
                ...signUpInput,
                password: bcrypt.hashSync(signUpInput.password, 10),
            });

            return await this.userRepository.save(newUser);
        } catch (error) {
            this.handleDBErrors(error);
        }
    }

    async findAll(): Promise<User[]> {
        return [];
    }

    async findOne(id: string): Promise<User> {
        throw new Error('Find One not implemented');
    }

    async findOneByEmail(email: string): Promise<User> {
        try {
            return await this.userRepository.findOneByOrFail({ email });
        } catch (error) {
            this.handleDBErrors({
                code: 'error-0001',
                detail: `${email} not found`,
            });
        }
    }

    async update(id: number, updateUserInput: UpdateUserInput) {
        return `This action updates a #${id} user`;
    }

    async block(id: string): Promise<User> {
        throw new Error('Block not implemented');
    }

    private handleDBErrors(error: any): never {
        if (error.code === '23505') {
            throw new BadRequestException(error.detail.replace('Key ', ''));
        }

        if (error.code === 'error-0001') {
            throw new BadRequestException(error.detail.replace('Key ', ''));
        }

        this.logger.error(error);

        throw new InternalServerErrorException('Please check server logs');
    }
}
