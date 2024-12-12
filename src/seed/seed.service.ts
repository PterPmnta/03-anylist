import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './../users/entities/user.entity';
import { Item } from './../items/entities/item.entity';
import { List } from './../lists/entities/list.entity';
import { ListItem } from './../list-item/entities/list-item.entity';

import { UsersService } from './../users/users.service';
import { ItemsService } from './../items/items.service';
import { ListsService } from './../lists/lists.service';
import { ListItemService } from './../list-item/list-item.service';

import { SEED_ITEMS, SEED_LISTS, SEED_USERS } from './data/seed-data';

@Injectable()
export class SeedService {
    private readonly isProd: boolean;

    constructor(
        private readonly configService: ConfigService,

        @InjectRepository(Item)
        private readonly itemsRepository: Repository<Item>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(ListItem)
        private readonly listItemsRepository: Repository<ListItem>,

        @InjectRepository(List)
        private readonly listsRepository: Repository<List>,

        private readonly usersService: UsersService,
        private readonly itemsService: ItemsService,
        private readonly listsService: ListsService,
        private readonly listItemsService: ListItemService,
    ) {
        this.isProd = this.configService.get('STATE') === 'prod';
    }

    async seedExecute() {
        try {
            if (this.isProd) {
                throw new UnauthorizedException('Is not able this function');
            }

            await this.deleteDatabase();

            const user = await this.loadUsers();

            await this.loadItems(user);

            const list = await this.loadLists(user);

            const items = await this.itemsService.findAll(
                user,
                { limit: 15, offset: 0 },
                {},
            );

            await this.loadListItems(list, items);

            return true;
        } catch (error) {
            throw new Error(`Error al ejecutar la seed: ${error.message}`);
        }
    }

    async deleteDatabase() {
        await this.listItemsRepository
            .createQueryBuilder()
            .delete()
            .where({})
            .execute();

        await this.listsRepository
            .createQueryBuilder()
            .delete()
            .where({})
            .execute();

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

    async loadUsers(): Promise<User> {
        const users = [];

        for (const user of Object.values(SEED_USERS)) {
            users.push(await this.usersService.createUser(user));
        }

        await this.userRepository.save(users);
        return users[0];
    }

    async loadItems(user: User): Promise<void> {
        const itemsPromises = [];

        for (const item of Object.values(SEED_ITEMS)) {
            itemsPromises.push(this.itemsService.create(item, user));
        }

        await Promise.all(itemsPromises);

        //await this.itemsRepository.save(items);
        //return await this.itemsRepository.save(items);
    }

    async loadLists(user: User): Promise<List> {
        const lists = [];

        for (const list of Object.values(SEED_LISTS)) {
            lists.push(await this.listsService.create(list, user));
        }

        await this.listsRepository.save(lists);
        return lists[0];
    }

    async loadListItems(list: List, items: Item[]): Promise<void> {
        const listItemsPromises = [];

        for (const item of items) {
            const listItem = await this.listItemsService.create({
                quantity: Math.round(Math.random() * 10),
                completed: Math.round(Math.random() * 1) !== 0,
                listId: list.id,
                itemId: item.id,
            });

            listItemsPromises.push(listItem);
        }

        await Promise.all(listItemsPromises);
    }
}
