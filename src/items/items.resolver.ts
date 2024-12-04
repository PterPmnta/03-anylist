import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ItemsService } from './items.service';
import { Item } from './entities/item.entity';

import { CreateItemInput } from './dto/inputs/create-item.input';
import { UpdateItemInput } from './dto/inputs/update-item.input';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';

import { User } from './../users/entities/user.entity';
import { CurrentUser } from './../auth/decorators/current-user.decorator';

import { PaginationArgs } from './../common/dto/args/pagination.args';
import { SearchArgs } from './../common/dto/args/search.args';

@Resolver(() => Item)
@UseGuards(JwtAuthGuard)
export class ItemsResolver {
    constructor(private readonly itemsService: ItemsService) {}

    @Mutation(() => Item, { name: 'createIteminput' })
    async createItem(
        @Args('createItemInput') createItemInput: CreateItemInput,
        @CurrentUser() user: User,
    ): Promise<Item> {
        return this.itemsService.create(createItemInput, user);
    }

    @Query(() => [Item], { name: 'items' })
    async findAll(
        @CurrentUser() user: User,
        @Args() paginationArgs: PaginationArgs,
        @Args() searchArgs: SearchArgs,
    ): Promise<Item[]> {
        console.log(searchArgs);
        return this.itemsService.findAll(user, paginationArgs);
    }

    @Query(() => Item, { name: 'item' })
    async findOne(
        @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
        @CurrentUser() user: User,
    ): Promise<Item> {
        return this.itemsService.findOne(id, user);
    }

    @Mutation(() => Item, { name: 'updateiteminput' })
    async updateItem(
        @Args('updateItemInput') updateItemInput: UpdateItemInput,
        @CurrentUser() user: User,
    ): Promise<Item> {
        return this.itemsService.update(
            updateItemInput.id,
            updateItemInput,
            user,
        );
    }

    @Mutation(() => Item, { name: 'removeitem' })
    async removeItem(
        @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
        @CurrentUser() user: User,
    ): Promise<Item> {
        return this.itemsService.remove(id, user);
    }
}
