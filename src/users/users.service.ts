import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { SignUpInput } from '../auth/dto/inputs/signup.input';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async createUser(signUpInput: SignUpInput): Promise<User> {
        try {
            const newUser = this.userRepository.create(signUpInput);

            return await this.userRepository.save(newUser);
        } catch (error) {
            throw new BadRequestException(
                `Error creating user: ${error.message}`,
            );
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
}
