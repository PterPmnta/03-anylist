import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { ArrayContains, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { SignUpInput } from '../auth/dto/inputs/signup.input';
import { ValidRoles } from './../auth/enums/valid-roles.enum';

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

    async findAll(roles: ValidRoles[]): Promise<User[]> {
        if (roles.length === 0)
            return await this.userRepository.find({
                /* No es necesario usando el eager o el lazy 
            relations: {
                last_updated_by: true,
            }, */
            });

        const usersList = await this.userRepository.find({
            where: {
                roles: ArrayContains(roles),
            },
            relations: {
                last_updated_by: true,
            },
        });

        return usersList;
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

    async findOneById(id: string): Promise<User> {
        try {
            return await this.userRepository.findOneByOrFail({ id });
        } catch (error) {
            throw new NotFoundException(`${id} not found`);
        }
    }

    async update(id: number, updateUserInput: UpdateUserInput) {
        return `This action updates a #${id} user`;
    }

    async block(id: string, adminUser: User): Promise<User> {
        try {
            const user: User = await this.findOneById(id);

            user.is_active = false;
            user.last_updated_by = adminUser;

            await this.userRepository.save(user);

            return user;
        } catch (error) {
            this.handleDBErrors(error);
        }
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
