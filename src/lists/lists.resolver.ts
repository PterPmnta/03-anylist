import { SearchArgs } from './../common/dto/args/search.args';
import { PaginationArgs } from './../common/dto/args/pagination.args';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

import { ListsService } from './lists.service';
import { List } from './entities/list.entity';
import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';

import { User } from './../users/entities/user.entity';

import { CurrentUser } from './../auth/decorators/current-user.decorator';

@Resolver(() => List)
export class ListsResolver {
    constructor(private readonly listsService: ListsService) {}

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
}
