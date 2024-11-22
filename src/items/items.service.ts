import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateItemInput } from './dto/inputs/create-item.input';
import { UpdateItemInput } from './dto/inputs/update-item.input';
import { Item } from './entities/item.entity';

import { User } from './../users/entities/user.entity';

@Injectable()
export class ItemsService {
    constructor(
        @InjectRepository(Item)
        private readonly itemsRepository: Repository<Item>,
    ) {}

    async create(createItemInput: CreateItemInput, user: User): Promise<Item> {
        try {
            console.log('user', user);

            const newItem = this.itemsRepository.create({
                ...createItemInput,
                user,
            });

            await this.itemsRepository.save(newItem);
            return newItem;
        } catch (error) {
            console.log(error);
        }
    }

    async findAll(user: User): Promise<Item[]> {
        //TODO: Paginar, Filtrar, Anidaciones
        return await this.itemsRepository.find({
            where: {
                user: {
                    id: user.id,
                },
            },
        });
    }

    async findOne(id: string, user: User): Promise<Item> {
        try {
            const item: Item = await this.itemsRepository.findOneBy({
                id,
                user: {
                    id: user.id,
                },
            });

            if (!item) {
                throw new NotFoundException(`Item not found with id: ${id}`);
            }

            //item.user = user;

            return item;
        } catch (error) {
            console.log(error);
        }
    }

    async update(id: string, updateItemInput: UpdateItemInput): Promise<Item> {
        try {
            const item = await this.itemsRepository.preload(updateItemInput);

            if (!item) {
                throw new NotFoundException(`Item not found with id: ${id}`);
            }

            return this.itemsRepository.save(item);
        } catch (error) {}
    }

    async remove(id: string, user: User): Promise<Item> {
        //TODO: soft delete, integridad referencial

        const item = await this.findOne(id, user);
        await this.itemsRepository.remove(item);

        return { ...item, id };
    }
}
