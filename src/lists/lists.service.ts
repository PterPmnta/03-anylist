import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';
import { List } from './entities/list.entity';

import { User } from './../users/entities/user.entity';

import { PaginationArgs } from './../common/dto/args/pagination.args';
import { SearchArgs } from './../common/dto/args/search.args';

@Injectable()
export class ListsService {
    constructor(
        @InjectRepository(List)
        private readonly listsRepository: Repository<List>,
    ) {}

    async create(createListInput: CreateListInput, user: User): Promise<List> {
        try {
            const newList = this.listsRepository.create({
                ...createListInput,
                user,
            });
            return await this.listsRepository.save(newList);
        } catch (error) {
            throw new Error(`Error creating list: ${error.message}`);
        }
    }

    async findAll(
        user: User,
        paginationArgs: PaginationArgs,
        searchArgs: SearchArgs,
    ): Promise<List[]> {
        try {
            const { limit, offset } = paginationArgs;
            const { search } = searchArgs;

            const queryBuilder = this.listsRepository
                .createQueryBuilder()
                .take(limit)
                .skip(offset)
                .where(`"userId" = :userId`, { userId: user.id });

            if (search?.trim()) {
                queryBuilder.andWhere(`LOWER(name) ilike :name`, {
                    name: `%${search.toLowerCase()}%`,
                });
            }

            return queryBuilder.getMany();
        } catch (error) {
            throw new NotFoundException(`Error trying to get list of lists.`);
        }
    }

    async findOne(id: string, user: User): Promise<List> {
        try {
            const list: List = await this.listsRepository.findOneBy({
                id,
                user: {
                    id: user.id,
                },
            });

            if (!list) {
                throw new NotFoundException(`List not found with id: ${id}`);
            }

            return list;
        } catch (error) {
            throw new NotFoundException(`List not found with id: ${id}`);
        }
    }

    async update(
        id: string,
        updateListInput: UpdateListInput,
        user: User,
    ): Promise<List> {
        try {
            await this.findOne(id, user);
            const list = await this.listsRepository.preload({
                ...updateListInput,
                user,
            });

            if (!list) {
                throw new NotFoundException(`List not found with id: ${id}`);
            }

            return this.listsRepository.save(list);
        } catch (error) {
            throw new NotFoundException(`Error trying to update the list.`);
        }
    }

    async remove(id: string, user: User): Promise<List> {
        try {
            const list = await this.findOne(id, user);
            await this.listsRepository.remove(list);

            return { ...list, id };
        } catch (error) {
            throw new NotFoundException(`Error trying to delete de list.`);
        }
    }

    async listCount(user: User): Promise<number> {
        return await this.listsRepository.count({
            where: {
                user: {
                    id: user.id,
                },
            },
        });
    }
}
