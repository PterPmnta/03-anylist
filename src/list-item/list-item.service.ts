import { List } from './../lists/entities/list.entity';
import { SearchArgs } from './../common/dto/args/search.args';
import { PaginationArgs } from './../common/dto/args/pagination.args';
import { Injectable } from '@nestjs/common';
import { CreateListItemInput } from './dto/create-list-item.input';
import { UpdateListItemInput } from './dto/update-list-item.input';
import { InjectRepository } from '@nestjs/typeorm';
import { ListItem } from './entities/list-item.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ListItemService {
    constructor(
        @InjectRepository(ListItem)
        private readonly listItemRepository: Repository<ListItem>,
    ) {}

    async create(createListItemInput: CreateListItemInput) {
        try {
            const { listId, itemId, ...rest } = createListItemInput;

            const listItem = this.listItemRepository.create({
                ...rest,
                item: { id: itemId },
                list: { id: listId },
            });
            return await this.listItemRepository.save(listItem);
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }

    async findAll(
        list: List,
        paginationArgs: PaginationArgs,
        searchArgs: SearchArgs,
    ): Promise<ListItem[]> {
        try {
            const { limit, offset } = paginationArgs;
            const { search } = searchArgs;

            const queryBuilder = this.listItemRepository
                .createQueryBuilder('listItem')
                .innerJoinAndSelect('listItem.item', 'item')
                .take(limit)
                .skip(offset)
                .where(`"listId" = :listId`, { listId: list.id });

            if (search) {
                queryBuilder.andWhere('LOWER(item.name) ilike :name', {
                    name: `%${search.toLowerCase()}%`,
                });
            }

            return await queryBuilder.getMany();
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }

    async findOne(id: string) {
        try {
            return await this.listItemRepository.findOneBy({ id });
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }

    update(id: number, updateListItemInput: UpdateListItemInput) {
        return `This action updates a #${id} listItem`;
    }

    remove(id: number) {
        return `This action removes a #${id} listItem`;
    }

    countListItems(list: List): Promise<number> {
        return this.listItemRepository.count({
            where: {
                list: {
                    id: list.id,
                },
            },
        });
    }
}
