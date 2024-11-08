import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

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
            const newUser = this.userRepository.create(signUpInput);

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

    async update(id: number, updateUserInput: UpdateUserInput) {
        return `This action updates a #${id} user`;
    }

    async block(id: string): Promise<User> {
        throw new Error('Block not implemented');
    }

    private handleDBErrors(error: any): never {
        this.logger.error(error);

        if (error.code === '23505') {
            throw new BadRequestException(error.detail.replace('Key ', ''));
        }

        throw new InternalServerErrorException('Please check server logs');
    }
}
