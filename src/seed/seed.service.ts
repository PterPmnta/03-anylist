import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './../users/entities/user.entity';
import { Item } from './../items/entities/item.entity';

import { UsersService } from './../users/users.service';

import { SEED_ITEMS, SEED_USERS } from './data/seed-data';

@Injectable()
export class SeedService {
    private readonly isProd: boolean;

    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(Item)
        private readonly itemsRepository: Repository<Item>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly usersService: UsersService,
    ) {
        this.isProd = this.configService.get('STATE') === 'prod';
    }

    async seedExecute() {
        try {
            if (this.isProd) {
                throw new UnauthorizedException('Is not able this function');
            }

            await this.deleteDatabase();

            //Crear usuario

            await this.loadUsers();

            //Crear items

            return true;
        } catch (error) {
            throw new Error(`Error al ejecutar la seed: ${error.message}`);
        }
    }

    async deleteDatabase() {
        await this.itemsRepository
            .createQueryBuilder()
            .delete()
            .where({})
            .execute();

        await this.userRepository
            .createQueryBuilder()
            .delete()
            .where({})
            .execute();
    }

    async loadUsers(): Promise<User[]> {
        const users = [];

        for (const user of Object.values(SEED_USERS)) {
            users.push(await this.usersService.createUser(user));
        }

        return await this.userRepository.save(users);
    }

    async loadItems(): Promise<Item[]> {
        const items = [];

        for (const item of Object.values(SEED_ITEMS)) {
            items.push(this.itemsRepository.create(item));
        }

        return await this.itemsRepository.save(items);
    }
}
