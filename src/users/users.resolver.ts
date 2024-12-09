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

import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ValidRoles } from './../auth/enums/valid-roles.enum';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
    constructor(
        private readonly usersService: UsersService,
        private readonly itemsService: ItemsService,
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

    //TODO: getListByUser
}
