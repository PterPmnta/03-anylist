import { ListItemService } from './../list-item/list-item.service';
import { ListItem } from './../list-item/entities/list-item.entity';
import {
    Resolver,
    Query,
    Mutation,
    Args,
    ResolveField,
    Parent,
} from '@nestjs/graphql';

import { ListsService } from './lists.service';
import { List } from './entities/list.entity';
import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';

import { User } from './../users/entities/user.entity';

import { PaginationArgs } from './../common/dto/args/pagination.args';
import { SearchArgs } from './../common/dto/args/search.args';

import { CurrentUser } from './../auth/decorators/current-user.decorator';
import { UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';

@Resolver(() => List)
@UseGuards(JwtAuthGuard)
export class ListsResolver {
    constructor(
        private readonly listsService: ListsService,
        private readonly listItemService: ListItemService,
    ) {}

    @Mutation(() => List, { name: 'createListInput' })
    createList(
        @Args('createListInput') createListInput: CreateListInput,
        @CurrentUser() user: User,
    ) {
        return this.listsService.create(createListInput, user);
    }

    @Query(() => [List], { name: 'lists' })
    findAll(
        @CurrentUser() user: User,
        @Args() paginationArgs: PaginationArgs,
        @Args() searchArgs: SearchArgs,
    ) {
        return this.listsService.findAll(user, paginationArgs, searchArgs);
    }

    @Query(() => List, { name: 'list' })
    findOne(
        @Args('id', { type: () => String }) id: string,
        @CurrentUser() user: User,
    ) {
        return this.listsService.findOne(id, user);
    }

    @Mutation(() => List)
    updateList(
        @Args('updateListInput') updateListInput: UpdateListInput,
        @CurrentUser() user: User,
    ) {
        return this.listsService.update(
            updateListInput.id,
            updateListInput,
            user,
        );
    }

    @Mutation(() => List)
    removeList(
        @Args('id', { type: () => String }) id: string,
        @CurrentUser() user: User,
    ) {
        return this.listsService.remove(id, user);
    }

    @ResolveField(() => [ListItem], { name: 'items' })
    getListItems(
        @Parent() list: List,
        @Args() paginationArgs: PaginationArgs,
        @Args() searchArgs: SearchArgs,
    ): Promise<ListItem[]> {
        return this.listItemService.findAll(list, paginationArgs, searchArgs);
    }

    @ResolveField(() => Number, { name: 'totalItems' })
    countListItems(@Parent() list: List): Promise<number> {
        return this.listItemService.countListItems(list);
    }
}
