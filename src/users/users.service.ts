import { Injectable } from '@nestjs/common';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
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
