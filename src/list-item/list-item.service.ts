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

    findAll() {
        return `This action returns all listItem`;
    }

    findOne(id: number) {
        return `This action returns a #${id} listItem`;
    }

    update(id: number, updateListItemInput: UpdateListItemInput) {
        return `This action updates a #${id} listItem`;
    }

    remove(id: number) {
        return `This action removes a #${id} listItem`;
    }
}
