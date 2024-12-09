import { List } from './../lists/entities/list.entity';
import { ListsService } from './../lists/lists.service';
import { SearchArgs } from './../common/dto/args/search.args';
import { ItemsService } from './../items/items.service';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import {
    Resolver,
    Query,
    Mutation,
    Args,
    ID,
    ResolveField,
    Int,
    Parent,
} from '@nestjs/graphql';

import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { ValidRolesArgs } from './dto/args/role.arg';
import { UpdateUserInput } from './dto/update-user.input';

import { Item } from './../items/entities/item.entity';

import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ValidRoles } from './../auth/enums/valid-roles.enum';

import { PaginationArgs } from './../common/dto/args/pagination.args';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
    constructor(
        private readonly usersService: UsersService,
        private readonly itemsService: ItemsService,
        private readonly listsService: ListsService,
    ) {}

    @Query(() => [User], { name: 'users' })
    async findAll(
        @Args() validRoles: ValidRolesArgs,
        @CurrentUser([ValidRoles.admin]) user: User,
    ): Promise<User[]> {
        return this.usersService.findAll(validRoles.roles);
    }

    @Query(() => User, { name: 'user' })
    findOne(
        @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
        @CurrentUser([ValidRoles.admin]) user: User,
    ) {
        return this.usersService.findOneById(id);
    }

    @Mutation(() => User, { name: 'updateUser' })
    async updateUser(
        @Args('updateUserInput') updateUserInput: UpdateUserInput,
        @CurrentUser([ValidRoles.admin]) user: User,
    ): Promise<User> {
        return this.usersService.update(
            updateUserInput.id,
            updateUserInput,
            user,
        );
    }

    @Mutation(() => User, { name: 'blockUser' })
    blockUser(
        @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
        @CurrentUser([ValidRoles.admin]) user: User,
    ): Promise<User> {
        return this.usersService.block(id, user);
    }

    @ResolveField(() => Int, { name: 'itemCount' })
    async itemCount(@Parent() user: User): Promise<number> {
        return this.itemsService.itemCount(user);
    }

    @ResolveField(() => [Item], { name: 'items' })
    async getItemsByUser(
        @CurrentUser([ValidRoles.admin]) adminUser: User,
        @Parent() user: User,
        @Args() paginationArgs: PaginationArgs,
        @Args() searchArgs: SearchArgs,
    ): Promise<Item[]> {
        return this.itemsService.findAll(user, paginationArgs, searchArgs);
    }

    @ResolveField(() => Int, { name: 'listCount' })
    async listCount(@Parent() user: User): Promise<number> {
        return this.listsService.listCount(user);
    }

    @ResolveField(() => [List], { name: 'lists' })
    async getListByUser(
        @CurrentUser([ValidRoles.admin]) adminUser: User,
        @Parent() user: User,
        @Args() paginationArgs: PaginationArgs,
        @Args() searchArgs: SearchArgs,
    ): Promise<List[]> {
        return this.listsService.findAll(user, paginationArgs, searchArgs);
    }
}
